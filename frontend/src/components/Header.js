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

    return (<div className={classes.container}>
        <Button color="primary" variant="contained" size="small" onClick={isConnected ? ()=>deactivate() : ()=>activateBrowserWallet()}>{isConnected ? "Disconnect" : "Connect Account"}</Button>
    </div>)

}