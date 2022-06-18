import { Container } from "@material-ui/core";
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import YourWallet from "./yourWallet/YourWallet";
import { Box } from "@material-ui/core";
import dai from "../images/dai.jpg";
import weth from "../images/weth.jpg";
import { makeStyles, Typography } from "@material-ui/core";
import StakeInformation from "./stakeInfo/StakeInformation";

const useStyles = makeStyles(theme =>({
    title: {
        color: theme.palette.common.white,
        textAlign: "center",
        padding: theme.spacing(4)
    }
}))


export function Main () {
    const classes = useStyles()
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

    const supportedTokens = [
        {image: '', address: elonTokenAddress, name: "ELON"},
        {image: weth, address: wethTokenAddress, name: "MWETH"},
        {image: dai, address: fauTokenAddress, name: "MDAI"},
    ]

    return(
        <Container maxWidth="md">
            <Box>
                <Typography variant="h1" className={classes.title}>Defi Farm</Typography>
                <YourWallet supportedTokens={supportedTokens} />
                <StakeInformation supportedTokens={supportedTokens} />
            </Box>
        </Container>
    )
}