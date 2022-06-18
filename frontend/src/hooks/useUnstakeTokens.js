import { constants, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/interfaces/IERC20.json"
import networkMapping from "../chain-info/deployments/map.json";
import { useEthers, useContractFunction, useCall, useContractCall } from "@usedapp/core";
import { useState, useEffect } from "react";



function useUnstakeTokens(tokenAddress) {
    const {chainId, account } = useEthers();
    const {abi} = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero;
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)
    
    // const erc20ABI = ERC20.abi
    // const erc20Interface = new utils.Interface(erc20ABI)
    // const erc20Contract = new Contract(tokenAddress, erc20Interface)

    const { send: unstakeSend , state: unstakeState} = useContractFunction(tokenFarmContract, "unstakeTokens", {transactionName: "Unstake ERC20 token"})
    const value = useContractCall({abi: tokenFarmInterface, address: tokenFarmAddress, method: "getStakingBalance", args: [tokenAddress, account] })
    // const { value , error } = useCall({contract: tokenFarmContract, method: "getStakingBalance", args: [tokenAddress, account] })
    
    const [state, setState] = useState(unstakeState)
    const [stakedBalance, setStakedBalance] = useState(0)

    // const unstake = ()=>{
    //     return unstakeSend(tokenAddress)
    //   }
    
    useEffect(()=>{
      setStakedBalance(parseInt(value))
      console.log(parseInt(value), 222)
    }, [tokenAddress, value])

    
    useEffect(()=>{
      //if the approval was successful then you stake
      if(unstakeState.status === "Success"){
        setState(unstakeState) 
      }
    }, [unstakeState])
    

  return { unstakeSend, stakedBalance, state }
}

export default useUnstakeTokens