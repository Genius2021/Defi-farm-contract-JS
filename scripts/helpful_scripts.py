from brownie import accounts, config, network, Contract, MockV3Aggregator, MockWETH, MockDAI

LOCAL_BLOCKCHAIN_ENVIRONMENT = ["development", "ganache-local"]

INITIAL_PRICE_FEED_VALUE = 2000

# NON_FORKED_LOCAL_BLOCKCHAIN_ENVIRONMENTS = ["hardhat", "development", "ganache-local"]


contract_to_mock = {
    "weth_token": MockWETH,
    "fau_token": MockDAI,
    "eth_usd_price_feed": MockV3Aggregator,
    "dai_usd_price_feed": MockV3Aggregator,
}


def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        return accounts[0]
    if id:
        return accounts.load(id)
    if network.show_active() in config["networks"]:
        return accounts.add(config["wallets"]["from_key"])
    return None

def get_contract(contract_name):
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENT:
        if len(contract_type) <= 0:
            deploy_mocks()
        contract = contract_type[-1]
    else:
        try:
            contract_address = config["networks"][network.show_active()][contract_name]
            contract = Contract.from_abi(
                contract_type._name, contract_address, contract_type.abi
            )
        except KeyError:
            print(
                f"{network.show_active()} address not found, perhaps you should add it to the config or deploy mocks?"
            )
            print(
                f"brownie run scripts/deploy_mocks.py --network {network.show_active()}"
            )
    return contract


def deploy_mocks(decimals=18, initial_value=INITIAL_PRICE_FEED_VALUE):
    print(f"The active network is {network.show_active()}")
    print("Deploying Mocks...")
    account = get_account()
    print("Deploying Mock Price Feed...")
    mock_price_feed = MockV3Aggregator.deploy(
        decimals, initial_value, {"from": account}
    )
    print(f"Deployed mock price feed to {mock_price_feed.address}")
    print("Deploying Mock FAU token...")
    mock_fau_token = MockDAI.deploy({"from": account})
    print(f"Deployed mock fau token to {mock_fau_token.address}")
    print("Deploying Mock WETH token...")
    mock_weth_token = MockWETH.deploy({"from": account})
    print(f"Deployed mock fau token to {mock_weth_token.address}")
    print("Mocks have been Deployed!")


def main():
    get_account()