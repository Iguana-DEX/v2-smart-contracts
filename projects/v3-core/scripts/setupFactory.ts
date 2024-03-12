import { ethers, network } from 'hardhat';
import { DeploymentsGlobal } from "../../../deployments/deploymentsGlobalType";

type Deployments = {
  PancakeV3Factory: string,
  PancakeV3PoolDeployer: string
};

async function main() {
  const [owner] = await ethers.getSigners();
  const networkName = network.name;
  console.log('owner', owner.address);
  let deployments: Deployments = await import(`../deployments/${networkName}.json`);
  console.log('factory', deployments.PancakeV3Factory);
  let deploymentsGlobal: DeploymentsGlobal = await import(`../../../deployments/${networkName}.json`);

  const pancakeV3Factory = await ethers.getContractAt("PancakeV3Factory", deployments.PancakeV3Factory);

  // set lm pool deployer & owner on factory
  await (await pancakeV3Factory.setLmPoolDeployer(deploymentsGlobal.PancakeV3LmPoolDeployer)).wait();
  await (await pancakeV3Factory.setOwner(owner.address)).wait();
  console.log("LM pool deployer and owner set on Factory.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
