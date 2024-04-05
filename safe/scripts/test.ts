import { expect } from "chai";
import hre, { deployments, ethers } from "hardhat";
import { getMock, getSafeWithOwners } from "../utils/setup";
import {
    safeApproveHash,
    buildSafeTransaction,
    buildSignatureBytes,
    executeTx,
    executeContractCallWithSigners,
} from "../../src/utils/execution";
import { safeContractUnderTest } from "../utils/config";

const TESTNET_ACCOUNT = "0x392d5d216bB6fBfDc04dC7e137F1F4C9289E07a4";
const TESTNET_ACCOUNT_2 = "0x41E5B10dE3E51014191F9969aD4871Fda5Fb4DfB";
const SAFE_ADDRESS = "0x1bac6CcD84D19b471f64c6F2ecDb1F6F9f1d5847"
import { AddressZero } from "@ethersproject/constants";


let safe: any;
let owner: any;
let testnet: any;

describe("Safe", () => {

    before(async () => {
        [owner] = await ethers.getSigners();
        testnet = await ethers.getImpersonatedSigner(TESTNET_ACCOUNT);

        safe = await ethers.getContractAt("SafeL2", SAFE_ADDRESS, testnet);

    });

    describe("Test Safe contract", () => {
        // it("Test with Single owner", async () => {
        //     let data = await safe.getThreshold();
        //     console.log("Threshold ", data);

        //     // const fallbackHandler = "";

        //     await safe.connect(testnet).setup([TESTNET_ACCOUNT], 1 , AddressZero, "0x", AddressZero , AddressZero, 0, AddressZero)

        //     let owners = await safe.getOwners();

        //     console.log("Owners ", owners);

        //     const tx = buildSafeTransaction({
        //         to: testnet.address,
        //         value: ethers.parseEther("0.5"),
        //         nonce: await safe.nonce(),
        //         operation: 0,
        //         gasPrice: 1,
        //         safeTxGas: 100000,
        //         refundReceiver: testnet.address,
        //     });

        //     await testnet.sendTransaction({ to: SAFE_ADDRESS, value: ethers.parseEther("1") });
        //     await expect(await hre.ethers.provider.getBalance(SAFE_ADDRESS)).to.be.deep.eq(ethers.parseEther("1"));

        //     const additionalInfo = ethers.AbiCoder.defaultAbiCoder().encode(
        //         ["uint256", "address", "uint256"],
        //         [tx.nonce, testnet.address, 1],
        //     );
        //     const signatures = [await safeApproveHash(testnet, safe, tx, true)];
        //     const signatureBytes = buildSignatureBytes(signatures).toLowerCase();

        //     console.log("Safe balance before executing transaction ", await hre.ethers.provider.getBalance(SAFE_ADDRESS))

        //     await expect(executeTx(safe, tx, signatures))
        //         .to.emit(safe, "ExecutionSuccess")
        //         .to.emit(safe, "SafeMultiSigTransaction")
        //         .withArgs(
        //             tx.to,
        //             tx.value,
        //             tx.data,
        //             tx.operation,
        //             tx.safeTxGas,
        //             tx.baseGas,
        //             tx.gasPrice,
        //             tx.gasToken,
        //             tx.refundReceiver,
        //             signatureBytes,
        //             additionalInfo,
        //         );
        //         console.log("Safe balance after executing transaction ", await hre.ethers.provider.getBalance(SAFE_ADDRESS))

        // })

        it("Test with Multiple owner", async () => {
            let data = await safe.getThreshold();
            console.log("Threshold ", data);

            // const fallbackHandler = "";

            await safe.connect(testnet).setup([TESTNET_ACCOUNT, TESTNET_ACCOUNT_2], 2, AddressZero, "0x", AddressZero, AddressZero, 0, AddressZero)

            let owners = await safe.getOwners();

            console.log("Owners ", owners);

            const tx = buildSafeTransaction({
                to: testnet.address,
                value: ethers.parseEther("0.5"),
                nonce: await safe.nonce(),
                operation: 0,
                gasPrice: 1,
                safeTxGas: 100000,
                refundReceiver: testnet.address,
            });

            await testnet.sendTransaction({ to: SAFE_ADDRESS, value: ethers.parseEther("1") });
            await expect(await hre.ethers.provider.getBalance(SAFE_ADDRESS)).to.be.deep.eq(ethers.parseEther("1"));

            const additionalInfo = ethers.AbiCoder.defaultAbiCoder().encode(
                ["uint256", "address", "uint256"],
                [tx.nonce, testnet.address, 1],
            );
            const signatures = [await safeApproveHash(testnet, safe, tx, true)];
            const signatureBytes = buildSignatureBytes(signatures).toLowerCase();

            console.log("Safe balance before executing transaction ", await hre.ethers.provider.getBalance(SAFE_ADDRESS))

            await expect(executeTx(safe, tx, signatures))
                .to.emit(safe, "ExecutionSuccess")
                .to.emit(safe, "SafeMultiSigTransaction")
                .withArgs(
                    tx.to,
                    tx.value,
                    tx.data,
                    tx.operation,
                    tx.safeTxGas,
                    tx.baseGas,
                    tx.gasPrice,
                    tx.gasToken,
                    tx.refundReceiver,
                    signatureBytes,
                    additionalInfo,
                );
            console.log("Safe balance after executing transaction ", await hre.ethers.provider.getBalance(SAFE_ADDRESS))
            
        })

    });

});