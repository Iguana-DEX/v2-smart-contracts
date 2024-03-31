import { ethers, network } from "hardhat";
import { writeFileSync } from 'fs'

const main = async () => {
  const networkName = network.name
  const deployedContracts = await import(`../data/deployments/${networkName}.json`)

  // Deploy router
  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  const pancakeRouter = await PancakeRouter.deploy(
    deployedContracts.PancakeFactory, // Factory contract address
    deployedContracts.WXTZ  // WXTZ contract address
  );

  await pancakeRouter.deployed();
  console.log("PancakeRouter deployed to:", pancakeRouter.address);

  const contracts = {
    WXTZ: deployedContracts.WXTZ,
    PancakeV3Factory: deployedContracts.PancakeFactory,
    PancakeV3PoolDeployer: pancakeRouter.address,
  }

  writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });