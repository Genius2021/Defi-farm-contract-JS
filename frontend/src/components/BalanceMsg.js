import React from 'react'
import {makeStyles} from "@material-ui/core";
import useStakeTokens from "../hooks/useStakeTokens"

const useStyles = makeStyles(theme =>({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1),
        alignItems: "center"
        
    },
    tokenImg: {
        width: "32px"
    },
    amount: {
        fontWeight: 700
    }
}))

function BalanceMsg({label, amount, tokenImageSrc}) {
    const classes = useStyles()

    return (
    <div className={classes.container}>
        <div>{label}</div>
        <div className={classes.amount}>{amount}</div>
        <img className={classes.tokenImg} src={tokenImageSrc}  alt="token logo" />
        {/* <useStakeTokens /> */}
    </div>
  )
}

export default BalanceMsg