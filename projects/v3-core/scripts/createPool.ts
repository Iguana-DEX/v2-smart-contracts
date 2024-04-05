import { ethers, network } from 'hardhat';
import { DeploymentsGlobal } from "../../../deployments/deploymentsGlobalType";
import { PancakeV3Factory } from '../typechain-types/contracts/PancakeV3Factory';
import { encodePriceSqrt } from '../test/shared/utilities';
import { computePoolAddress } from '../../v3-periphery/test/shared/computePoolAddress';
import { MockTimePancakeV3Pool } from '../typechain-types/contracts/test/MockTimePancakeV3Pool';

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

  const pancakeV3Factory = await ethers.getContractAt("PancakeV3Factory", deployments.PancakeV3Factory) as PancakeV3Factory;

  // Hardcoded ERC20 tokens & fees for the pool
  const token0Address = "0xB1Ea698633d57705e93b0E40c1077d46CD6A51d8"; // WXTZ
  const token1Address = "0x56548B3d12B4EF70DCd66e38Ba6aCf7Db4d288eB"; // Any other token
  const fees = 2500; // 500, 2500, 10000

  console.log("Creating a pool with:");
  console.log("Token 0:", token0Address);
  console.log("Token 1:", token1Address);
  await (await pancakeV3Factory.createPool(token0Address, token1Address, fees)).wait();
  console.log("Pool created!");

  // TODO: init the pool price after creation
  // console.log("Initialize pool price.");
  // const expectedAddress = computePoolAddress(
  //   deployments.PancakeV3Factory,
  //   [token0Address, token1Address],
  //   fees
  // );
  // console.log("pool:", expectedAddress);
  // const pool = await ethers.getContractAt("PancakeV3Factory", deployments.PancakeV3Factory) as MockTimePancakeV3Pool;
  // const startingPrice = encodePriceSqrt(1, 1);
  // await (await pool.initialize(startingPrice)).wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
