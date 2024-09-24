const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { ethers } = require("hardhat");

describe("KnockoutWars Fuzz Testing", function () {
  async function deployKnockoutWarsFixture() {
    const [owner, addr1, addr2, rewardWallet, liquidityWallet] =
      await ethers.getSigners();

    const KnockoutWars = await ethers.getContractFactory("KnockoutWars");
    const knockoutWars = await KnockoutWars.deploy(
      owner.address,
      rewardWallet.address,
      liquidityWallet.address
    );

    return { knockoutWars, owner, addr1, addr2, rewardWallet, liquidityWallet };
  }

  describe("Fuzz Testing for Transfers and Fee Deductions", function () {
    it("Should handle random transfer amounts and check fees", async function () {
      const {
        knockoutWars,
        owner,
        addr1,
        addr2,
        rewardWallet,
        liquidityWallet,
      } = await loadFixture(deployKnockoutWarsFixture);

      const count = 1000;
      const amount = 1000;

      // Perform the transfer from owner to addr2 (no fees deducted as owner is exempt)
      const fullAmount = ethers.parseUnits((amount * count + 1).toString(), 9);
      await knockoutWars.connect(owner).transfer(addr2.address, fullAmount);

      // Track initial balances of addr1, reward and liquidity wallets
      let addr1WalletBalance = await knockoutWars.balanceOf(addr1.address);
      let initialRewardWalletBalance = await knockoutWars.balanceOf(
        rewardWallet.address
      );
      let initialLiquidityWalletBalance = await knockoutWars.balanceOf(
        liquidityWallet.address
      );

      // Generate random values for multiple transfers
      for (let i = 0; i < count; i++) {
        // Generate random positive transfer amount between 1 and 1000 tokens
        const randomAmount = ethers.parseUnits(
          (Math.floor(Math.random() * amount) + 1).toString(),
          9
        );

        // Perform the transfer from addr2 to addr1
        await knockoutWars.connect(addr2).transfer(addr1.address, randomAmount);

        // Calculate fees and amount after fee deduction
        const totalFee = (randomAmount * 100n) / 10000n;
        const rewardFee = (randomAmount * 50n) / 10000n;
        const burnFee = (randomAmount * 30n) / 10000n;
        const liquidityFee = (randomAmount * 20n) / 10000n;
        const amountAfterFee = randomAmount - totalFee;

        // Accumulate fees into the reward and liquidity wallet balances
        addr1WalletBalance += amountAfterFee;
        initialRewardWalletBalance += rewardFee;
        initialLiquidityWalletBalance += liquidityFee;

        // Check accumulated balances of reward and liquidity wallets
        const rewardWalletBalance = await knockoutWars.balanceOf(
          rewardWallet.address
        );
        const liquidityWalletBalance = await knockoutWars.balanceOf(
          liquidityWallet.address
        );

        // Check the balance of addr1 to ensure fee deductions are correct
        expect(await knockoutWars.balanceOf(addr1.address)).to.equal(
          addr1WalletBalance
        );

        expect(rewardWalletBalance).to.equal(initialRewardWalletBalance);
        expect(liquidityWalletBalance).to.equal(initialLiquidityWalletBalance);
      }
    });
  });

  describe("Fuzz Testing Fee Exemptions", function () {
    it("should handle fuzzed fee exemption values correctly", async function () {
      const { knockoutWars, owner, addr1, addr2 } = await loadFixture(
        deployKnockoutWarsFixture
      );

      const count = 1000;
      const amount = 1000;

      // Perform the transfer from owner to addr2 (no fees deducted as owner is exempt)
      const fullAmount = ethers.parseUnits((amount * count + 1).toString(), 9);
      await knockoutWars.connect(owner).transfer(addr1.address, fullAmount);

      // Set up random fee exemptions and test
      for (let i = 0; i < count; i++) {
        const randomBool = Math.random() < 0.5;
        await knockoutWars.setFeeExemption(addr1.address, randomBool); // Randomly exempt addr1

        // Generate random positive transfer amount between 1 and 1000 tokens (fuzzValue)
        const randomAmount = Math.floor(Math.random() * amount) + 1; // Random number between 1 and 1000
        const fuzzValue = ethers.parseUnits(randomAmount.toString(), 9); // Convert to BigInt with 9 decimals

        const addr2BalanceBefore = await knockoutWars.balanceOf(addr2.address);
        const addr1BalanceBefore = await knockoutWars.balanceOf(addr1.address);

        // Perform the transfer from addr1 to addr2 (since addr1 is randomly fee exempt)
        await knockoutWars.connect(addr1).transfer(addr2.address, fuzzValue);

        const addr2BalanceAfter = await knockoutWars.balanceOf(addr2.address);
        const addr1BalanceAfter = await knockoutWars.balanceOf(addr1.address);

        // If addr1 (sender) is fee exempt, the full amount should be transferred
        if (randomBool) {
          expect(addr2BalanceAfter).to.equal(addr2BalanceBefore + fuzzValue); // Full amount transferred
        } else {
          // If addr1 is not fee-exempt, fees should be deducted
          const totalFee = await knockoutWars.calculateTotalFee(fuzzValue);
          expect(addr2BalanceAfter).to.equal(
            addr2BalanceBefore + (fuzzValue - totalFee)
          ); // After fee deduction
        }

        // Ensure that addr1's balance is reduced correctly by the full transfer amount
        expect(addr1BalanceAfter).to.equal(addr1BalanceBefore - fuzzValue);
      }
    });
  });
});
