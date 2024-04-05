// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract GasTest {
    uint256 public value;
    function callGasleft() external returns (uint256){
        uint256 startgas = gasleft();
        value += 1;
        return startgas - gasleft();
    }
}