import { Container } from "@material-ui/core";
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import YourWallet from "./yourWallet/YourWallet";
import { Box } from "@material-ui/core";
import dai from "../images/dai.jpg"
import weth from "../images/weth.jpg"


export function Main () {
    const { chainId } = useEthers();
    const networkName = chainId ? helperConfig[String(chainId)] : "development";
    const elonTokenAddress = chainId ? networkMapping[String(chainId)]["ElonToken"][0] : constants.AddressZero;
    
    let wethTokenAddress;
    let fauTokenAddress;
    if(networkName === "ganache-local"){
        //if network name is ganache-local then use the address of the deployed contracts below
        wethTokenAddress = chainId ? networkMapping[String(chainId)]["MockWETH"][0] : constants.AddressZero;
        fauTokenAddress = chainId ? networkMapping[String(chainId)]["MockDAI"][0] : constants.AddressZero;
    }else{
        wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero;
        fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero;
    }

    console.log("weth token address is", wethTokenAddress)
    console.log("fau token address is", fauTokenAddress)
        

    console.log("Elon token address is", elonTokenAddress)
    console.log(chainId)
    console.log(networkName)

    const supportedTokens = [
        {image: '', address: elonTokenAddress, name: "ELON"},
        {image: weth, address: wethTokenAddress, name: "WETH"},
        {image: dai, address: fauTokenAddress, name: "FAU"},
    ]

    return(
        <Container maxWidth="md">
            <Box>
                <YourWallet supportedTokens={supportedTokens} />
            </Box>
        </Container>
    )
}