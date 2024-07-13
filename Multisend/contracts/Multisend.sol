// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MultiSend {
    address public owner;

    // Event to log the transfers
    event TransferSent(address indexed recipient, uint256 amount);

    // Constructor to set the owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    // Function to perform batch transfers, restricted to the owner
    /**
     * @notice Transfers specified amounts of Ether to specified addresses
     * @param _addresses Array of addresses to send Ether to
     * @param _amounts Array of amounts of Ether to send to each address
     * @return bool indicating success
     */
    function multiTransfer_OST(
        address payable[] memory _addresses,
        uint256[] memory _amounts
    ) external payable onlyOwner returns (bool) {
        require(
            _addresses.length == _amounts.length,
            "Array lengths do not match"
        );

        for (uint256 i = 0; i < _addresses.length; i++) {
            _addresses[i].transfer(_amounts[i]);
            emit TransferSent(_addresses[i], _amounts[i]);
        }

        return true;
    }

    // Function to transfer ownership to a new owner
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        owner = newOwner;
    }
}