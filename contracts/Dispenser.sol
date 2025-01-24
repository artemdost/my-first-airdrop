// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Dispenser {
    IERC20 USDT;
    IERC20 CRYP;
    mapping(address => bool) received;

    constructor(address _USDT, address _CRYP) {
        USDT = IERC20(_USDT);
        CRYP = IERC20(_CRYP);
    }

    function mint() external {
        require(
            received[msg.sender] == false,
            "You already received your drop"
        );
        USDT.transfer(msg.sender, 1 * 10 ** 6);
        CRYP.transfer(msg.sender, 100 * 10 ** 18);
        received[msg.sender] = true;
    }
}
