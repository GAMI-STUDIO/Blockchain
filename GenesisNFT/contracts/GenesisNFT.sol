// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GenesisNFT is
    ERC1155,
    Ownable,
    ERC1155Pausable,
    ERC1155Burnable,
    ERC1155Supply
{
    // Array to store all minted token IDs
    uint256[] private _allTokenIds;

    // Token name
    string public name = "Genesis";

    event UpdateNameEvent(string oldName, string newName);
    
    /**
     * @dev Constructor that sets the initial owner and initial base URI.
     * @param initialOwner Address of the initial owner.
     * @param initialBaseURI Base URI for the token metadata.
     */
    constructor(address initialOwner, string memory name_, string memory initialBaseURI) ERC1155(initialBaseURI) Ownable(initialOwner) {
       name = name_;
    }


    function updateName(string memory newName_) external onlyOwner{
        string memory oldName = name;
        name = newName_;
        emit UpdateNameEvent(oldName, name);
    }

    /**
     * @dev Function to update the base URI.
     * @param newuri New URI to set.
     */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /**
     * @dev Override the `uri` function to format the base URI with the token ID.
     * @param id Token ID.
     * @return The token URI.
     */
    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), Strings.toString(id), ".json"));
    }

    /**
     * @dev Function to pause all token transfers.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Function to unpause all token transfers.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Mint function to create new tokens.
     * @param account Address of the recipient.
     * @param id Token ID to mint.
     * @param amount Amount of tokens to mint.
     * @param data Additional data with no specified format.
     */
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        _mint(account, id, amount, data);
        _addTokenId(id);
    }

    /**
     * @dev Batch mint function to mint multiple tokens at once.
     * @param to Address of the recipient.
     * @param ids Array of token IDs to mint.
     * @param amounts Array of amounts of tokens to mint for each ID.
     * @param data Additional data with no specified format.
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
        _addTokenIds(ids);
    }

    /**
     * @dev Function to add a token ID to the list of all tokens.
     * @param id Token ID to add.
     */
    function _addTokenId(uint256 id) internal {
        if (!exists(id)) {
            _allTokenIds.push(id);
        }
    }

    /**
     * @dev Function to add multiple token IDs to the list of all tokens.
     * @param ids Array of token IDs to add.
     */
    function _addTokenIds(uint256[] memory ids) internal {
        for (uint256 i = 0; i < ids.length; i++) {
            _addTokenId(ids[i]);
        }
    }

    /**
     * @dev Efficient batch transfer function to transfer tokens to multiple addresses.
     * @param from Address of the sender.
     * @param to Array of recipient addresses.
     * @param ids Array of token ID arrays to transfer.
     * @param amounts Array of token amount arrays to transfer.
     * @param data Additional data with no specified format.
     */
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

    /**
     * @dev Function to get all token IDs owned by an address.
     * @param owner Address of the token owner.
     * @return Array of token IDs owned by the address.
     */
    function getOwnedTokens(address owner) public view returns (uint256[] memory) {
        uint256 totalTokenCount = _allTokenIds.length;
        uint256[] memory result = new uint256[](totalTokenCount);
        uint256 counter = 0;

        for (uint256 i = 0; i < totalTokenCount; i++) {
            uint256 id = _allTokenIds[i];
            if (balanceOf(owner, id) > 0) {
                result[counter] = id;
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

    /**
     * @dev Override function required by Solidity to update token transfers.
     * @param from Address of the sender.
     * @param to Address of the recipient.
     * @param ids Array of token IDs.
     * @param amounts Array of token amounts.
     */
    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, amounts);
    }
}