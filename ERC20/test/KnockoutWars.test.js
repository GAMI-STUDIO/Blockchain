const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("KnockoutWars", function () {
  async function deployKnockoutWarsFixture() {
    const [owner, addr1, rewardWallet, liquidityWallet] =
      await ethers.getSigners();

    // Deploy the contract with reward and liquidity wallets
    const KnockoutWars = await ethers.getContractFactory("KnockoutWars");
    const knockoutWars = await KnockoutWars.deploy(
      owner.address,
      rewardWallet.address,
      liquidityWallet.address
    );

    return { knockoutWars, owner, addr1, rewardWallet, liquidityWallet };
  }

  describe("Fee Percentages", function () {
    it("Should allow the owner to set reward, burn, and liquidity fees, and emit an event", async function () {
      const { knockoutWars, owner } = await loadFixture(
        deployKnockoutWarsFixture
      );

      // Set reward fee to 0.5%, burn fee to 0.3%, and liquidity fee to 0.2%
      await expect(knockoutWars.setFeePercentages(50, 30, 20))
        .to.emit(knockoutWars, "FeePercentagesUpdated")
        .withArgs(50, 30, 20);

      expect(await knockoutWars.rewardFeePercentage()).to.equal(50);
      expect(await knockoutWars.burnFeePercentage()).to.equal(30);
      expect(await knockoutWars.liquidityFeePercentage()).to.equal(20);

      // Try setting fees above 1% (expect revert)
      await expect(
        knockoutWars.setFeePercentages(60, 30, 20)
      ).to.be.revertedWith("Total fee cannot exceed 1%");
    });
  });

  describe("Fee Exemption", function () {
    it("Should exempt owner from paying fees", async function () {
      const { knockoutWars, owner, addr1 } = await loadFixture(
        deployKnockoutWarsFixture
      );

      // Owner should be fee exempt
      expect(await knockoutWars.isFeeExempt(owner.address)).to.be.true;

      // Transfer without fee for owner
      await knockoutWars
        .connect(owner)
        .transfer(addr1.address, ethers.parseUnits("100", 9));

      // No fee should be deducted, addr1 should receive the full amount
      expect(await knockoutWars.balanceOf(addr1.address)).to.equal(
        ethers.parseUnits("100", 9)
      );
    });

    it("Should allow owner to set fee exemption for other wallets", async function () {
      const { knockoutWars, owner, addr1 } = await loadFixture(
        deployKnockoutWarsFixture
      );

      // Add funds
      await knockoutWars
        .connect(owner)
        .transfer(addr1.address, ethers.parseUnits("100", 9));

      // Set addr1 as fee exempt
      await expect(knockoutWars.setFeeExemption(addr1.address, true))
        .to.emit(knockoutWars, "FeeExemptionUpdated")
        .withArgs(addr1.address, true);

      // Transfer without fee for addr1
      await knockoutWars
        .connect(addr1)
        .transfer(owner.address, ethers.parseUnits("100", 9));

      // No fee should be deducted, owner should receive full amount
      expect(await knockoutWars.balanceOf(owner.address)).to.equal(
        ethers.parseUnits("1000000000", 9)
      );
    });
  });

  describe("Fee Deduction (Reward + Burn + Liquidity)", function () {
    it("Should transfer and deduct reward, burn, and liquidity fees", async function () {
      const { knockoutWars, owner, addr1, rewardWallet, liquidityWallet } =
        await loadFixture(deployKnockoutWarsFixture);

      // Owner should have the total supply of 1 billion tokens with 9 decimals
      const initialSupply = ethers.parseUnits("1000000000", 9);

      // Owner transfers 100 tokens to addr1
      const baseAmount = ethers.parseUnits("100", 9);

      // Fee is calculated as 1% (50 for reward, 30 for burn, 20 for liquidity) of 100 tokens
      const totalFee = (baseAmount * 100n) / 10000n;
      const rewardFee = (baseAmount * 50n) / 10000n;
      const burnFee = (baseAmount * 30n) / 10000n;
      const liquidityFee = (baseAmount * 20n) / 10000n;
      const amountAfterFee = baseAmount - totalFee;

      //Add funds to addr1
      knockoutWars.connect(owner).transfer(addr1.address, baseAmount);

      // Perform the transfer
      await expect(
        knockoutWars.connect(addr1).transfer(owner.address, baseAmount)
      )
        .to.emit(knockoutWars, "FeeDistributed")
        .withArgs(rewardFee, burnFee, liquidityFee);

      // Check balances
      const addr1Balance = await knockoutWars.balanceOf(addr1.address);
      const rewardWalletBalance = await knockoutWars.balanceOf(
        rewardWallet.address
      );
      const liquidityWalletBalance = await knockoutWars.balanceOf(
        liquidityWallet.address
      );

      // addr1 should be 0
      expect(addr1Balance).to.equal(0);

      // Reward wallet should receive the reward fee (0.5 tokens)
      expect(rewardWalletBalance).to.equal(rewardFee);

      // Liquidity wallet should receive the liquidity fee (0.2 tokens)
      expect(liquidityWalletBalance).to.equal(liquidityFee);

      // Ensure owner's balance is correctly reduced
      expect(await knockoutWars.balanceOf(owner.address)).to.equal(
        initialSupply - totalFee
      );
    });
  });

  describe("Liquidity Wallet Update", function () {
    it("Should allow the owner to update the liquidity wallet", async function () {
      const { knockoutWars, owner, addr1 } = await loadFixture(
        deployKnockoutWarsFixture
      );

      // Update liquidity wallet to addr1
      await expect(knockoutWars.setLiquidityWallet(addr1.address))
        .to.emit(knockoutWars, "LiquidityWalletUpdated")
        .withArgs(addr1.address);

      // Check that the liquidity wallet address is updated
      expect(await knockoutWars.liquidityWallet()).to.equal(addr1.address);
    });
  });
});
