from brownie import ElonToken, TokenFarm, config, network
from web3 import Web3
from scripts.helpful_scripts import get_account, get_contract
import yaml
import json
import os
import shutil

KEPT_BALANCE = Web3.toWei(105, "ether")

def deploy_token_farm_and_token(front_end_update=False):
    account = get_account()
    print("Deploying Elon token...")
    elon_token = ElonToken.deploy({"from": account})
    print("Elon token deployed...")
    print("Elon token supply is", elon_token.totalSupply())
    print("Deploying Token farm contract...")
    token_farm = TokenFarm.deploy(elon_token.address, {"from": account}, publish_source=config["networks"][network.show_active()].get("verify", False))
    print("Deployed Token farm contract...")
    print("Transferring Elon token to token farm...")
    valueTransferred = elon_token.totalSupply() - KEPT_BALANCE
    print("Elon value transferred is", valueTransferred)
    tx = elon_token.transfer(token_farm.address, valueTransferred, {"from": account})
    tx.wait(1)

    #elon_token, weth_token, fau_token/dai
    fau_token = get_contract("fau_token")  #This is basically deploying a mock if it doesn't already exist
    weth_token = get_contract("weth_token")

    tokens_to_price_feed_address = {
        elon_token : get_contract("dai_usd_price_feed"), #These lines mean that the keys already has something stored in it
                                                         #i.e the contract address. And then you map that contract address to a price feed address
        fau_token : get_contract("dai_usd_price_feed"),
        weth_token : get_contract("eth_usd_price_feed"),
    }
    print("The token to price feed object mapping informaton: ",tokens_to_price_feed_address)
    add_allowed_tokens(token_farm, tokens_to_price_feed_address, account)
    if front_end_update:
        update_front_end()
    return token_farm, elon_token


def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_tx = token_farm.addAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(token.address, dict_of_allowed_tokens[token], {"from": account})
        set_tx.wait(1)
        return token_farm


def update_front_end():
    copy_folders_to_front_end("./build", "./frontend/src/chain-info")
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./frontend/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Frontend has been updated!")

def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
def main():
    deploy_token_farm_and_token(front_end_update=True)