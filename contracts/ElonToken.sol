// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "../interfaces/IERC20.sol";


contract ElonToken is ERC20 {
    constructor() public ERC20("Elon Token", "ET"){
        _mint(msg.sender, 1000000000000000000000000); //1 million tokens then multiplied by 10**18
    }

}