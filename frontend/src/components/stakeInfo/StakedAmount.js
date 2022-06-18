// import { useEthers, useTokenAllowance } from "@usedapp/core";
import { ethers, constants } from "ethers";
import BalanceMsg from "../BalanceMsg";
// import networkMapping from "../../chain-info/deployments/map.json";
import { useEffect } from "react";



export default function StakedAmount({ token, stakedBalance }) {
    const { image, name } = token;
    // const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero;
    const formattedTokenBalance = stakedBalance ? parseInt(ethers.utils.formatEther(stakedBalance.toString())) : 0 ;

      useEffect(()=>{
    console.log(stakedBalance, "is")
   }, [stakedBalance])

    return (
      <BalanceMsg 
        label={`${name} staked is: `}
        tokenImageSrc={image}
        amount={formattedTokenBalance}
      />
  )
}

