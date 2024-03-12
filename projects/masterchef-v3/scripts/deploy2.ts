/* eslint-disable camelcase */
import { ethers, run, network } from "hardhat";
import { configs } from "@pancakeswap/common/config";
import { tryVerify } from "@pancakeswap/common/verify";
import { writeFileSync } from "fs";

async function main() {
  // Get network data from Hardhat config (see hardhat.config.ts).
  const networkName = network.name;
  // Check if the network is supported.
  console.log(`Deploying to ${networkName} network...`);

  // Compile contracts.
  await run("compile");
  console.log("Compiled contracts...");

  const config = configs[networkName as keyof typeof configs];
  if (!config) {
    throw new Error(`No config found for network ${networkName}`);
  }

  const v3PeripheryDeployedContracts = await import(`@pancakeswap/v3-periphery/deployments/${networkName}.json`);
  const positionManager_address = v3PeripheryDeployedContracts.NonfungiblePositionManager;

  const MasterChefV3 = await ethers.getContractFactory("MasterChefV3");
  const masterChefV3 = await MasterChefV3.deploy(config.cake, positionManager_address, config.WNATIVE);

  console.log("masterChefV3 deployed to:", masterChefV3.address);
  // await tryVerify(masterChefV3, [config.cake, positionManager_address]);

  // deploy MasterchefV3ReceiverV2
  const MasterChefV3ReceiverV2 = await ethers.getContractFactory("MasterChefV3ReceiverV2");
  const masterChefV3ReceiverV2 = await MasterChefV3ReceiverV2.deploy(masterChefV3.address, config.cake);

  console.log("masterChefV3ReceiverV2 deployed to:", masterChefV3ReceiverV2.address);

  // deploy MasterChefV3KeeperV2
  const MasterChefV3KeeperV2 = await ethers.getContractFactory("MasterChefV3KeeperV2");
  const masterChefV3KeeperV2 = await MasterChefV3KeeperV2.deploy(masterChefV3.address, masterChefV3ReceiverV2.address, config.cake);

  console.log("masterChefV3KeeperV2 deployed to:", masterChefV3KeeperV2.address);

  // Write the address to a file.
  writeFileSync(
    `./deployments/${networkName}.json`,
    JSON.stringify(
      {
        MasterChefV3: masterChefV3.address,
        MasterChefV3ReceiverV2: masterChefV3ReceiverV2.address,
        MasterChefV3KeeperV2: masterChefV3KeeperV2.address
      },
      null,
      2
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
