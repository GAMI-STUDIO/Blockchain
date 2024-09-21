// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "forge-std/Test.sol";
import "../src/ReflectionToken.sol";
import "./MockUniswapV2Router.sol";  // Mock UniswapV2 router for testing

contract ReflectionTokenTest is Test {
    ReflectionToken token;
    MockUniswapV2Router mockRouter;

    // Variables for the constructor
    address mockWETH = address(0x2); // Mock WETH address
    string name = "Reflection Token";
    string symbol = "RTK";

    function setUp() public {
        // Deploy the mock Uniswap V2 router with the mock WETH address
        mockRouter = new MockUniswapV2Router(mockWETH);
        
        // Deploy the ReflectionToken contract with the mock router
        token = new ReflectionToken(address(mockRouter), name, symbol);
    }

    // Test 1: Constructor sets the correct token details
    function testConstructor() public {
        // Verify token name, symbol, and decimals
        assertEq(token.name(), name);
        assertEq(token.symbol(), symbol);
        assertEq(token.decimals(), 9);
        
        // Verify the initial supply
        uint256 expectedSupply = 1000000 * 10**6 * 10**9;
        assertEq(token.totalSupply(), expectedSupply);

        // Verify that the deployer (owner) has the total supply
        assertEq(token.balanceOf(token.owner()), expectedSupply);
    }
}
