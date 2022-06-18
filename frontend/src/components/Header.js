import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";


const useStyles = makeStyles(theme =>({
    container: {
        padding: theme.spacing(1),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
        
    }
}))


export const Header =()=>{
    const classes = useStyles()

    const {account, activateBrowserWallet, deactivate} = useEthers();
    const isConnected = account !== undefined;

    const lastCharacter = account?.length 

    return (<div className={classes.container}>
        { isConnected && <Button variant="contained" disableElevation size="small" >{isConnected && `${account.slice(0 , 4)}...${account.slice(lastCharacter - 4, lastCharacter)}`}</Button> }
        <Button color="primary" variant="contained" disableElevation size="small" onClick={isConnected ? ()=>deactivate() : ()=>activateBrowserWallet()}>{isConnected ? "Disconnect" : "Connect Account"}</Button>
    </div>)

}