import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("NFT", function () {

  async function deployNftFixture() {

    const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

    const contractInstance = await ethers.getContractFactory("NFT");
    const nft = await upgrades.deployProxy(contractInstance, [owner.address]);

    return { nft, owner, otherAccount, thirdAccount };
  }

  describe("NFT test scenarios", function () {
    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deployNftFixture);

      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should mint tokens", async () => {
      const { nft, owner, otherAccount } = await loadFixture(deployNftFixture);

      const tokenId = 1;
      const amount = 10;
      await nft.mint(otherAccount.address, tokenId, amount, "0x");
      const balance = await nft.balanceOf(otherAccount.address, tokenId);
      expect(balance).to.equal(amount);
    });

    it("Should transfer tokens", async () => {
      const { nft, owner, otherAccount } = await loadFixture(deployNftFixture);

      const tokenId = 1;
      const amount = 10;
      await nft
        .connect(owner)
        .mint(otherAccount.address, tokenId, amount, "0x");
      await nft
        .connect(otherAccount)
        .safeTransferFrom(
          otherAccount.address,
          owner.address,
          tokenId,
          amount,
          "0x"
        );
      const balanceUser1 = await nft.balanceOf(otherAccount.address, tokenId);
      const balanceUser2 = await nft.balanceOf(owner.address, tokenId);
      expect(balanceUser1).to.equal(0);
      expect(balanceUser2).to.equal(amount);
    });

    it("Should return correct balance", async () => {
      const { nft, owner, otherAccount, thirdAccount } = await loadFixture(
        deployNftFixture
      );

      const tokenId = 1;
      const amountUser1 = 10;
      const amountUser2 = 5;
      await nft
        .connect(owner)
        .mint(otherAccount.address, tokenId, amountUser1, "0x");
      await nft
        .connect(owner)
        .mint(thirdAccount.address, tokenId, amountUser2, "0x");
      const balanceUser1 = await nft.balanceOf(otherAccount.address, tokenId);
      const balanceUser2 = await nft.balanceOf(thirdAccount.address, tokenId);
      expect(balanceUser1).to.equal(amountUser1);
      expect(balanceUser2).to.equal(amountUser2);
    });

    it("Should revert if minting is not done by the owner", async () => {
      const { nft, otherAccount } = await loadFixture(deployNftFixture);

      const tokenId = 1;
      const amount = 10;
      await expect(
        nft
          .connect(otherAccount)
          .mint(otherAccount.address, tokenId, amount, "0x")
      ).to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });

    it("Should revert if transferring more tokens than owned", async () => {
      const { nft, owner, otherAccount } = await loadFixture(deployNftFixture);

      const tokenId = 1;
      const amount = 10;
      await nft
        .connect(owner)
        .mint(otherAccount.address, tokenId, amount, "0x");
      await expect(
        nft
          .connect(otherAccount)
          .safeTransferFrom(
            otherAccount.address,
            owner.address,
            tokenId,
            amount + 1,
            "0x"
          )
      ).to.be.revertedWithCustomError(nft, "ERC1155InsufficientBalance");
    });

    it("Should revert if transferring to zero address", async () => {
      const { nft, owner, otherAccount } = await loadFixture(deployNftFixture);

      const tokenId = 1;
      const amount = 10;
      await nft
        .connect(owner)
        .mint(otherAccount.address, tokenId, amount, "0x");
      await expect(
        nft
          .connect(otherAccount)
          .safeTransferFrom(
            otherAccount.address,
            "0x0000000000000000000000000000000000000000",
            tokenId,
            amount,
            "0x"
          )
      ).to.be.revertedWithCustomError(nft, "ERC1155InvalidReceiver");
    });
  });
});
