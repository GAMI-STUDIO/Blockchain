import { ethers } from "hardhat";
import {
    safeApproveHash,
    buildSafeTransaction,
    buildSignatureBytes,
    executeTx,
    executeContractCallWithSigners,
} from "../src/utils/execution";
const main = async () => {
    const [deployer] = await ethers.getSigners();
    const SAFE_ADDRESS = "0x29073e62c679105645F57bF2BF5E9843A27A0628";
    console.log('deployer address', deployer.address);
    const safe = await ethers.getContractAt("SafeL2", SAFE_ADDRESS, deployer);

    const tx = buildSafeTransaction({
        to: deployer.address,
        value: ethers.parseEther("0.5"),
        nonce: await safe.nonce(),
        operation: 0,
        gasPrice: 1,
        safeTxGas: 100000,
        refundReceiver: deployer.address,
    });

    await deployer.sendTransaction({ to: SAFE_ADDRESS, value: ethers.parseEther("1") });
    console.log('Balance of safe: ', ethers.formatEther(await ethers.provider.getBalance(SAFE_ADDRESS)))

    const additionalInfo = ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "address", "uint256"],
        [tx.nonce, deployer.address, 1],
    );
    const signatures = [await safeApproveHash(deployer, safe, tx, true)];
    const signatureBytes = buildSignatureBytes(signatures).toLowerCase();

    const txn = await executeTx(safe, tx, signatures);
    console.log('Transaction sucess: ',txn);
    console.log("Safe balance after executing transaction ", ethers.formatEther(await ethers.provider.getBalance(SAFE_ADDRESS)))
};

main()
.catch((err) => {
    console.error(err);
})