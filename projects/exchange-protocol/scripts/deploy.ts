import { ethers, network } from "hardhat";
import { writeFileSync } from 'fs'

const main = async () => {
  const networkName = network.name
  const deployedContracts = await import(`../data/deployments/${networkName}.json`)

  // Deployer
  const [ deployer ] = await ethers.getSigners();

  const deployerShort = `${deployer.address.substring(0,3)  }...${  deployer.address.substring(deployer.address.length - 3)}`;

  console.log(deployerShort, " is deploying Factory to: ", networkName);
  console.log("------------------------");

  // Deploy factory
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(deployer.address);

  await pancakeFactory.deployed();
  console.log("PancakeFactory deployed to:", pancakeFactory.address);
  console.log("PancakeFactory hash: ", await pancakeFactory.INIT_CODE_PAIR_HASH())

  console.log("Deploying Router..");
  console.log("------------------------");

  // Deploy router
  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  const pancakeRouter = await PancakeRouter.deploy(
    pancakeFactory.address, // Factory contract address
    deployedContracts.WXTZ  // WXTZ contract address
  );

  await pancakeFactory.deployed();
  console.log("PancakeRouter deployed to:", pancakeRouter.address);

  const contracts = {
    WXTZ: deployedContracts.WXTZ,
    PancakeFactory: pancakeFactory.address,
    PancakeRouter: pancakeRouter.address,
  }

  writeFileSync(`./data/deployments/${networkName}.json`, JSON.stringify(contracts, null, 2))

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });