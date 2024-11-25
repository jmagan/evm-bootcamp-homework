import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployTokenizedBallot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("TokenizedBallot", {
    from: deployer,
    log: true,
    autoMine: true,
  });
};

export default deployTokenizedBallot;

deployTokenizedBallot.tags = ["TokenizedBallot"];
