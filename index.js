import { program } from "commander";
import { ethers } from "ethers";

/**
 * TODO:
 * - fetch all validators from LSD
 * - dappnode LSD: DNST
 */

(async () => {
  program.command
    .requiredOption("--network <string>", "mainnet or goerli")
    .requiredOption("--ethUrl <string>", "The Ethereum RPC URL")
    .requiredOption("--privateKey <string>", "The private key of the account")
    .requiredOption(
      "--command <string>",
      "getDaoAddress, getSavETHVaultAddress, isWhitelistingEnabled, isNodeRunnerWhitelisted, isNodeRunnerBanned, updateWhitelisting, updateNodeRunnerWhitelistStatus, getNetworkFeeRecipient"
    )
    .option("--nodeRunnerAddress <string>", "The address of the node operator")
    .option("--newWhitelistingStatus <boolean>", "The new whitelisting status");

  program.parse(process.argv);
  const options = program.opts();

  if (options.network !== "mainnet" && options.network !== "goerli") {
    throw new Error("Invalid network");
  }

  const provider = new ethers.JsonRpcApiProvider(options.ethUrl);
  const signer = new ethers.Wallet(PRIV_KEY, provider);
  const wizard = new Wizard({
    signer: signer, // signer or provider
  });

  switch (options.command) {
    /**
     * To get Ethereum address specified as the DAO during deployment of the LSD network.
     * @see https://docs.joinstakehouse.com/lsd/wizardutils#getdaoaddress-function
     */
    case "getDaoAddress":
      console.log(await wizard.utils.getDAOAddress());
      break;
    /**
     * Fetches Protected Staking pool address of the LSD network.
     * @see https://docs.joinstakehouse.com/lsd/wizardutils#getsavethvaultaddress-function
     */
    case "getSavETHVaultAddress":
      console.log(await wizard.utils.getSavETHVaultAddress());
      break;
    /**
     * isWhitelistingEnabled: Fetches the status of whitelisting in the LSD network. Is whitelisting is enabled, only selected node runners can become a node operator in the network. If disabled, anyone can become a node operator.
     * @see https://docs.joinstakehouse.com/lsd/WizardUtils#iswhitelistingenabled-function
     */
    case "isWhitelistingEnabled":
      console.log(await wizard.utils.isWhitelistingEnabled());
      break;

    /**
     * isNodeRunnerWhitelisted: Fetches the whitelist status of the node operator in the LSD network.
     * @param nodeRunnerAddress - The address of the node operator
     * @see https://docs.joinstakehouse.com/lsd/WizardUtils#isnoderunnerwhitelisted-function
     */
    case "isNodeRunnerWhitelisted":
      console.log(
        await wizard.utils.isNodeRunnerWhitelisted(options.nodeRunnerAddress)
      );
      break;
    /**
     * isNodeRunnerBanned: Fetches the ban status of a node runner. A node runner can be banned by the LSD deployer if the node runner is found to be malicious.
     * @param nodeRunnerAddress - The address of the node operator
     * @see https://docs.joinstakehouse.com/lsd/WizardUtils#isnoderunnerbanned-function
     */
    case "isNodeRunnerBanned":
      console.log(
        await wizard.utils.isNodeRunnerBanned(options.nodeRunnerAddress)
      );
      break;
    /**
     * updateWhitelisting: Update the whitelisting status of the LSD. When enabled, only selected node operators can become a node runner for this LSD network. Can be only called by the DAO.
     * @param newWhitelistingStatus - The new whitelisting status
     * @see https://docs.joinstakehouse.com/lsd/wizardutils#updatewhitelisting-function
     */
    case "updateWhitelisting":
      console.log(
        await wizard.utils.updateWhitelisting(options.newWhitelistingStatus)
      );
      console.log("Whitelisting status updated");
      break;
    /**
     * updateNodeRunnerWhitelistStatus: Update the whitelist status of a node runner. Can be only called by the DAO.
     * @param nodeRunnerAddress - Address of the node runner
     * @param newWhitelistingStatus - The new whitelisting status
     * @see https://docs.joinstakehouse.com/lsd/wizardutils#updatenoderunnerwhiteliststatus-function
     */
    case "updateNodeRunnerWhitelistStatus":
      console.log(
        await wizard.utils.updateNodeRunnerWhitelistStatus(
          options.nodeRunnerAddress,
          options.newWhitelistingStatus
        )
      );
      console.log("Node runner whitelist status updated");
      break;
    /**
     * getNetworkFeeRecipient: Fetch the network recipient, which the node runner must set in order to receive rewards after their KNOT has been activated. Every LSD network has a single fee recipient determined by its syndicate contract.
     * @see https://docs.joinstakehouse.com/lsd/wizardutils#getnetworkfeerecipient-function
     */
    case "getNetworkFeeRecipient":
      console.log(await wizard.utils.getNetworkFeeRecipient());
      break;
    default:
      throw new Error("Invalid command");
  }
})();
