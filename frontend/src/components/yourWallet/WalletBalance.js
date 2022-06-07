import React from 'react'
import { useEthers, useTokenBalance } from "@usedapp/core";
import { ethers } from "ethers";
import BalanceMsg from "../BalanceMsg";
import dotenv from "dotenv";

dotenv.config();


export default function WalletBalance({ token }) {
    const { image, name, address } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = tokenBalance && parseFloat(ethers.utils.formatEther(tokenBalance))
 

    return (
      <BalanceMsg 
        label={`Your unstaked ${name} balance`}
        tokenImageSrc={image}
        amount={formattedTokenBalance}

      />
  )
}
