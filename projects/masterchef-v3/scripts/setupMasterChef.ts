import { ethers, network } from 'hardhat';
import { DeploymentsGlobal } from "../../../deployments/deploymentsGlobalType";

type Deployments = {
  MasterChefV3: string,
  MasterChefV3ReceiverV2: string,
  MasterChefV3KeeperV2: string
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
  await (await masterChefV3.setReceiver(deployments.MasterChefV3ReceiverV2)).wait();
  console.log("LM pool deployer and owner set on Factory.");

  // set operator with keeper as arg on receiver
  const masterChefV3ReceiverV2 = await ethers.getContractAt("MasterChefV3ReceiverV2", deployments.MasterChefV3ReceiverV2);
  await (await masterChefV3ReceiverV2.setOperator(deployments.MasterChefV3KeeperV2)).wait();

  // set on keeper set period duration: 129600 + set registry: chainlink upkeep etc
  const masterChefV3KeeperV2 = await ethers.getContractAt("MasterChefV3KeeperV2", deployments.MasterChefV3KeeperV2);
  await (await masterChefV3KeeperV2.setPeriodDuration(129600)).wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
