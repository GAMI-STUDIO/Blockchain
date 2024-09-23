// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KnockoutWars is ERC20, ERC20Burnable, Ownable {
    uint8 constant _decimals = 9;
    uint256 public constant _totalSupply = 1_000_000_000 * (10 ** _decimals); // 1 billion tokens with 9 decimals
    uint256 public rewardFeePercentage; // Reward Wallet percentage (0.6%)
    uint256 public burnFeePercentage; // Burn percentage (0.4%)
    uint256 public liquidityFeePercentage; // Liquidity percentage (0.2%)
    uint256 public constant maxTotalFeePercentage = 100; // Maximum total fee 1% (100/10000)
    uint256 public feeDenominator = 10000; // Denominator for precise fee calculations
    address public rewardWallet;
    address public liquidityWallet;

    mapping(address => bool) public isFeeExempt;

    event FeeDistributed(uint256 rewardFee, uint256 burnedAmount, uint256 liquidityFee);
    event FeePercentagesUpdated(uint256 newRewardFee, uint256 newBurnFee, uint256 newLiquidityFee);
    event RewardWalletUpdated(address newRewardWallet);
    event LiquidityWalletUpdated(address newLiquidityWallet);
    event FeeExemptionUpdated(address account, bool isExempt);

    constructor(address initialOwner, address _rewardWallet, address _liquidityWallet)
        ERC20("Knockout Wars", "KWARS")
        Ownable(initialOwner)
    {
        rewardFeePercentage = 50; // Initial reward fee set to 0.5%
        burnFeePercentage = 30;   // Initial burn fee set to 0.3%
        liquidityFeePercentage = 20; // Liquidity fee set to 0.2%
        rewardWallet = _rewardWallet;
        liquidityWallet = _liquidityWallet;
        _mint(initialOwner, _totalSupply);

        // Exempt the owner from fees initially
        isFeeExempt[initialOwner] = true;
    }

    // Override the decimals function to set 9 decimal places
    function decimals() public pure override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Check if sender is exempt from fees
        if (isFeeExempt[_msgSender()]) {
            return super.transfer(recipient, amount);
        }

        // Calculate the total fee (reward + burn + liquidity)
        uint256 totalFee = calculateTotalFee(amount);

        // Calculate the reward, burn, and liquidity amounts
        uint256 rewardFee = calculateRewardFee(amount);
        uint256 burnFee = calculateBurnFee(amount);
        uint256 liquidityFee = calculateLiquidityFee(amount);

        // Transfer the reward fee to the reward Wallet
        if (rewardFee > 0) {
            super.transfer(rewardWallet, rewardFee);
        }

        // Burn the burn fee
        if (burnFee > 0) {
            burn(burnFee); // Burn the tokens using ERC20Burnable
        }

        // Transfer the liquidity fee to the liquidity wallet
        if (liquidityFee > 0) {
            super.transfer(liquidityWallet, liquidityFee);
        }

        emit FeeDistributed(rewardFee, burnFee, liquidityFee);

        // Transfer the remaining amount to the recipient
        uint256 amountAfterFee = amount - totalFee;
        return super.transfer(recipient, amountAfterFee);
    }

    function calculateTotalFee(uint256 amount) public view returns (uint256) {
        return (amount * (rewardFeePercentage + burnFeePercentage + liquidityFeePercentage)) / feeDenominator;
    }

    function calculateRewardFee(uint256 amount) public view returns (uint256) {
        return (amount * rewardFeePercentage) / feeDenominator;
    }

    function calculateBurnFee(uint256 amount) public view returns (uint256) {
        return (amount * burnFeePercentage) / feeDenominator;
    }

    function calculateLiquidityFee(uint256 amount) public view returns (uint256) {
        return (amount * liquidityFeePercentage) / feeDenominator;
    }

    // Setter for reward, burn, and liquidity fees, with a limit of 1% total
    function setFeePercentages(uint256 newRewardFee, uint256 newBurnFee, uint256 newLiquidityFee) external onlyOwner {
        require(newRewardFee + newBurnFee + newLiquidityFee <= maxTotalFeePercentage, "Total fee cannot exceed 1%");
        rewardFeePercentage = newRewardFee;
        burnFeePercentage = newBurnFee;
        liquidityFeePercentage = newLiquidityFee;
        emit FeePercentagesUpdated(newRewardFee, newBurnFee, newLiquidityFee);
    }

    // Setter for reward wallet address
    function setRewardWallet(address newRewardWallet) external onlyOwner {
        rewardWallet = newRewardWallet;
        emit RewardWalletUpdated(newRewardWallet);
    }

    // Setter for liquidity wallet address
    function setLiquidityWallet(address newLiquidityWallet) external onlyOwner {
        liquidityWallet = newLiquidityWallet;
        emit LiquidityWalletUpdated(newLiquidityWallet);
    }

    // Function to set fee exemption for a wallet
    function setFeeExemption(address account, bool exempt) external onlyOwner {
        isFeeExempt[account] = exempt;
        emit FeeExemptionUpdated(account, exempt);
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20)
    {
        super._update(from, to, value);
    }
}
