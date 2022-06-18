import { useEthers, useContractFunction } from '@usedapp/core';
import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import ERC20 from "../chain-info/interfaces/IERC20.json";
import networkMapping from "../chain-info/deployments/map.json";
import { useEffect, useState } from 'react';



function useStakeTokens(tokenAddress) {
    const {chainId} = useEthers();
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero;
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    
    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)

    //approve
    //stake tokens
    const {send:approveERC20Send, state: approveAndStakeERC20State} = useContractFunction(erc20Contract, "approve", {transactionName: "Approve ERC20 transfer"})
    
    const [amountToStake, setAmountToStake] = useState("0")
    
    const approveAndStake = (amount)=>{
      console.log("approveAndStake amount is ", amount.toString())
      setAmountToStake(amount)
      return approveERC20Send(tokenFarmAddress, amount)
    }

    const {send: stakeSend, state: stakeState} = useContractFunction(tokenFarmContract, "stakeTokens", {transactionName: "Stake Tokens"})
    
    useEffect(()=>{
      //if the approval was successful then you stake
      if(approveAndStakeERC20State.status === "Success"){
        console.log(amountToStake, tokenAddress, "yep")
        stakeSend(amountToStake, tokenAddress)
      }

    }, [approveAndStakeERC20State, amountToStake, tokenAddress])

    const [state, setState] = useState(approveAndStakeERC20State)
    useEffect(()=>{
      //if the approval was successful then you stake
      if(approveAndStakeERC20State.status === "Success"){
        setState(stakeState) //if successful, then stakeState will enter into "Mining" state and loading spinner starts
      }else{
        setState(approveAndStakeERC20State)
      }

  }, [approveAndStakeERC20State, stakeState])

    return {approveAndStake, state}
}

export default useStakeTokens