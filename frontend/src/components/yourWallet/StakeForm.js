import { useEthers, useTokenBalance, useNotifications } from '@usedapp/core';
import React, { useEffect, useState } from 'react';
import { ethers, utils } from "ethers";
import { Button, Input, CircularProgress } from '@material-ui/core';
import useStakeTokens from '../../hooks/useStakeTokens';



function StakeForm({token}) {
    const {address: tokenAddress, name} = token;
    console.log("The token tokenAddress is", tokenAddress)
    const {account} = useEthers();
    const tokenBalance = useTokenBalance(tokenAddress, account)
    const formattedTokenBalance = tokenBalance && parseFloat(ethers.utils.formatEther(tokenBalance))
    const {notifications} = useNotifications();


    const [amount, setAmount] = useState('');
    const handleInputChange = (e)=>{
        const newAmount = e.target.value === "" ? "" : Number(e.target.value)
        setAmount(newAmount)
    }

    const {approveAndStake, state: approveAndStakeERC20State} = useStakeTokens(tokenAddress)
    const handleStakeSubmit = ()=>{
        const amountAsWei = utils.parseEther(amount?.toString())
        return approveAndStake(amountAsWei.toString())
    }

    const isMining = approveAndStakeERC20State.status === "Mining"

    useEffect(()=>{
        if(notifications.filter(notification =>( //filter takes in a function
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Approve ERC20 transfer"
        )).length > 0){
            console.log("Approved!")
        }

        if(notifications.filter(notification =>( //filter takes in a function
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Stake Tokens"
        )).length > 0){
            console.log("Tokens have been staked!")
        }

    }, [notifications])

  return (
    <>
    <Input onChange={handleInputChange} value={amount} />
    <Button
    onClick={handleStakeSubmit}
    color="primary"
    size="medium"
    disabled={isMining}
    >{isMining ? <CircularProgress size={20} /> : "Stake" }</Button>
    </>
  )
}

export default StakeForm 