// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract GenesisNFT is
    ERC1155,
    Ownable,
    ERC1155Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    // Counter for the next token ID
    uint256 public nextTokenId = 0;

    // Constructor that sets the initial owner and initial base URI
    constructor(address initialOwner, string memory initialBaseURI) ERC1155(initialBaseURI) Ownable(initialOwner) {
       
    }

    // Function to update the base URI
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // Function to pause all token transfers
    function pause() public onlyOwner {
        _pause();
    }

    // Function to unpause all token transfers
    function unpause() public onlyOwner {
        _unpause();
    }

    // Mint function
    function mint(
        address account,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _mint(account, tokenId, amount, data);
    }

    // Batch mint function to mint multiple tokens at once
    // function mintBatch(
    //     address to,
    //     uint256[] memory amounts,
    //     bytes memory data
    // ) public onlyOwner {
    //     uint256[] memory tokenIds = new uint256[](amounts.length);

    //     for (uint256 i = 0; i < amounts.length; i++) {
    //         tokenIds[i] = nextTokenId;
    //         nextTokenId++;
    //     }

    //     _mintBatch(to, tokenIds, amounts, data);
    // }

    // Batch mint function to mint multiple tokens at once
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // Efficient batch transfer function
    function safeBatchTransferFromBatch(
        address from,
        address[] calldata to,
        uint256[][] calldata ids,
        uint256[][] calldata amounts,
        bytes memory data
    ) public {
        require(to.length == ids.length && ids.length == amounts.length, "Mismatched input lengths");

        for (uint256 i = 0; i < to.length; i++) {
            safeBatchTransferFrom(from, to[i], ids[i], amounts[i], data);
        }
    }

    // Function to get all token IDs owned by an address
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        uint256 totalSupply = nextTokenId - 1;
        uint256[] memory result = new uint256[](totalSupply);
        uint256 counter = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (balanceOf(owner, i) > 0) {
                result[counter] = i;
                counter++;
            }
        }

        // Resize the result array to remove empty slots
        uint256[] memory trimmedResult = new uint256[](counter);
        for (uint256 j = 0; j < counter; j++) {
            trimmedResult[j] = result[j];
        }

        return trimmedResult;
    }

    // Override functions required by Solidity


    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, amounts);
    }
}
