import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployMyERC20Votes: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MyERC20Votes", {
    from: deployer,
    log: true,
    autoMine: true,
  });
};

export default deployMyERC20Votes;

deployMyERC20Votes.tags = ["MyERC20Votes"];
