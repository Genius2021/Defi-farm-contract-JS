
1. Approve our `ETH` to be swapped for `WETH`
2. Swap an `amount` of `ETH` for `WETH`
3. Using `deposit_to_aave` we deposit the `WETH` as collateral
4. We use that collateral to borrow `DAI` with `borrow_erc20`
5. Then, we pay it back!
6. We can view the txs on etherscan to see what's going on under the hood.
