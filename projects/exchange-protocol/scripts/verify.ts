import { network } from 'hardhat'
import { verifyContract } from '../packages/common/verify'
import { sleep } from '../packages/common/sleep'

async function main() {
  const networkName = network.name
  const deployedContracts = await import(`../data/deployments/${networkName}.json`)

  const [ deployer ] = await ethers.getSigners()

  // Verify PancakeFactory
  console.log('Verifying Factory contract..')
  await verifyContract(deployedContracts.PancakeFactory, [deployer.address])
  await sleep(10000)

  // Verify PancakeRouter - needs to be verified with constructor arguments
  console.log('Verifying Router contract..')
  await verifyContract(deployedContracts.PancakeRouter, [deployedContracts.PancakeFactory, deployedContracts.WXTZ])
  await sleep(10000)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
