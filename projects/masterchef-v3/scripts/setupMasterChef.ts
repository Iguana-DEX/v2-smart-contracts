import { ethers, network } from 'hardhat';
import { DeploymentsGlobal } from "../../../deployments/deploymentsGlobalType";

type Deployments = {
  MasterChefV3: string,
};

async function main() {
  const [owner] = await ethers.getSigners();
  const networkName = network.name;
  console.log('owner', owner.address);
  let deployments: Deployments = await import(`../deployments/${networkName}.json`);
  console.log('MasterChefV3', deployments.MasterChefV3);
  let deploymentsGlobal: DeploymentsGlobal = await import(`../../../deployments/${networkName}.json`);

  const masterChefV3 = await ethers.getContractAt("MasterChefV3", deployments.MasterChefV3);

  // set lm pool + set receiver
  await (await masterChefV3.setLMPoolDeployer(deploymentsGlobal.PancakeV3LmPoolDeployer)).wait();
  // masterchef receiver v2
  // await (await masterChefV3.setReceiver()).wait();
  console.log("LM pool deployer and owner set on Factory.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
