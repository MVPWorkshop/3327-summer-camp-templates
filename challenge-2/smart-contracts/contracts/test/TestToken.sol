// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract TestToken is ERC20 {
    constructor(uint totalSupply) ERC20("TestToken", "TEST") {
        _mint(msg.sender, totalSupply);
    }

    function setDecimalPlaces(uint8 decimals) public {
        _setupDecimals(decimals);
    }
}
