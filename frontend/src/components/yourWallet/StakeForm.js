import { useEthers, useTokenBalance, useNotifications } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import { ethers, utils } from "ethers";
import { Button, Input, CircularProgress, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import useStakeTokens from '../../hooks/useStakeTokens';


function StakeForm({token}) {
    const {address: tokenAddress } = token;
    const {notifications} = useNotifications();


    const [amount, setAmount] = useState('');
    const handleInputChange = (e)=>{
        const newAmount = Number(e.target.value)
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeERC20State} = useStakeTokens(tokenAddress)

    const handleStakeSubmit = ()=>{
        const amountAsWei = utils.parseEther(amount.toString())
        console.log("The staked amount in wei is ", amountAsWei)
        setAmount("")
        return approveAndStake(amountAsWei)
    }

    const isMining = approveAndStakeERC20State.status === "Mining"
    const [showERC20ApprovalSuccess, setShowERC20ApprovalSuccess] = useState(false)
    const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false)

    const handleCloseSnack =()=>{
        setShowERC20ApprovalSuccess(false)
        setShowStakeTokenSuccess(false)

    }


    useEffect(()=>{
        if(notifications.filter(notification =>( //filter takes in a function
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 transfer"
        )).length > 0){
            setShowERC20ApprovalSuccess(true)
            setShowStakeTokenSuccess(false)

        }

        if(notifications.filter(notification =>( //filter takes in a function
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Stake Tokens"
        )).length > 0){
            setShowERC20ApprovalSuccess(false)
            setShowStakeTokenSuccess(true)
        }

    }, [notifications, showERC20ApprovalSuccess, showStakeTokenSuccess])

  return (
    <>
        <Input onChange={handleInputChange} type="number" size="small" value={amount} />
        <Button
        onClick={handleStakeSubmit}
        color="primary"
        variant="outlined"
        size="medium"
        disabled={amount === "" || isMining }
        >{isMining ? <CircularProgress size={20} /> : "Stake" }</Button>
        <Snackbar open={showERC20ApprovalSuccess} onClose={handleCloseSnack} autoHideDuration={5000} >
            <Alert onClose={handleCloseSnack} severity="success">
                ERC20 token transfer approved! Now, confirm the transaction.
            </Alert>
        </Snackbar>
        <Snackbar open={showStakeTokenSuccess} onClose={handleCloseSnack} autoHideDuration={5000} >
            <Alert onClose={handleCloseSnack} severity="success">
                Tokens staked!
            </Alert>
        </Snackbar>
    </>
  )
}

export default StakeForm 