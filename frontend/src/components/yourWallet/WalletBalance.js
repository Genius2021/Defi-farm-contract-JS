import React from 'react'
import { useEthers, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";
import BalanceMsg from "../BalanceMsg";


export default function WalletBalance({ token }) {
    const { image, name, address } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(address, account)
    console.log("The token balance in wei is", Number(tokenBalance))
    const formattedTokenBalance = tokenBalance && parseFloat(ethers.utils.formatEther(tokenBalance))

    return (
      <BalanceMsg 
        label={`${name} balance is: `}
        tokenImageSrc={image}
        amount={formattedTokenBalance}

      />
  )
}
