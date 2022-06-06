import { task } from 'hardhat/config';
import { ConfigNames } from '../../helpers/configuration';
import { deployYearnWBTCVault } from '../../helpers/contracts-deployments';
import { getLendingPoolConfiguratorProxy } from '../../helpers/contracts-getters';

const CONTRACT_NAME = 'YearnWBTCVault';

task(`testnet:deploy-yearn-wbtc-vault`, `Deploys the ${CONTRACT_NAME} contract`)
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .addFlag('verify', `Verify ${CONTRACT_NAME} contract via Etherscan API.`)
  .setAction(async ({ verify, pool }, localBRE) => {
    await localBRE.run('set-DRE');

    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }
    const yearnWBTCVault = await deployYearnWBTCVault(verify);
    const configurator = await getLendingPoolConfiguratorProxy();
    await configurator.registerVault(yearnWBTCVault.address);
    console.log(`${CONTRACT_NAME}.address`, yearnWBTCVault.address);
    console.log(`\tFinished ${CONTRACT_NAME} deployment`);
  });
