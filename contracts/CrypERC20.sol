// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CrypERC20 is ERC20 {
    constructor() ERC20("Cryp", "CRP") {
        _mint(msg.sender, 100000 * 10 ** decimals());
    }
}
