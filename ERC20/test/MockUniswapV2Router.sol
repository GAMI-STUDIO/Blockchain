// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/console.sol";

contract MockUniswapV2Router {
    address public _WETH;  // Renamed to _WETH to avoid conflict with function name
    address public pairAddress;

    constructor(address WETHAddress) {
        _WETH = WETHAddress;
        pairAddress = address(0x123456789ABCdef123456789AbcDEf1234567890); // Mock pair address
    }

    function factory() external pure returns (address) {
        console.log("MockUniswapV2Router: factory called");
        return address(0x1); // Mock factory address
    }

    function createPair(address tokenA, address tokenB) external returns (address) {
        console.log("createPair called with tokenA:", tokenA, "tokenB:", tokenB);
        return pairAddress;
    }

    function WETH() external view returns (address) {
        console.log("WETH() function called");
        return _WETH;
    }
}
