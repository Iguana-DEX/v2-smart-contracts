import { ethers, network } from "hardhat";
import { writeFileSync } from 'fs'

const main = async () => {
  const networkName = network.name
  const deployedContracts = await import(`../data/deployments/${networkName}.json`)

  // Deployer
  const [ deployer ] = await ethers.getSigners();

  // Deploy factory
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(deployer.address);

  await pancakeFactory.deployed();
  console.log("PancakeFactory deployed to:", pancakeFactory.address);
  console.log("PancakeFactory hash: ", await pancakeFactory.INIT_CODE_PAIR_HASH())


  const contracts = {
    WXTZ: deployedContracts.WXTZ,
    PancakeV3Factory: pancakeFactory.address,
  }

  writeFileSync(`./data/deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });