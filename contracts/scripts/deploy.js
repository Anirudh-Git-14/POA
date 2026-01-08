const hre = require("hardhat");

/**
 * Deployment script for POAToken contract
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network mumbai
 *   npx hardhat run scripts/deploy.js --network polygon
 */
async function main() {
  console.log("Deploying POAToken contract...");

  // Get the contract factory
  const POAToken = await hre.ethers.getContractFactory("POAToken");

  // Set cooldown period (e.g., 1 hour = 3600 seconds)
  // For hackathon, you might want shorter: 5 minutes = 300 seconds
  const cooldownPeriod = 300; // 5 minutes in seconds

  // Deploy the contract
  const poaToken = await POAToken.deploy(cooldownPeriod);

  // Wait for deployment
  await poaToken.waitForDeployment();

  const contractAddress = await poaToken.getAddress();
  console.log("\n✅ POAToken deployed successfully!");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Cooldown Period:", cooldownPeriod, "seconds");

  // Verify contract (optional, requires POLYGONSCAN_API_KEY)
  if (hre.network.name !== "hardhat" && process.env.POLYGONSCAN_API_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await poaToken.deploymentTransaction().wait(5);

    console.log("Verifying contract on PolygonScan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [cooldownPeriod],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️  Verification failed:", error.message);
    }
  }

  console.log("\n📝 Save this address in your .env files:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
