import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
  toHex,
} from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import {
  abi,
  bytecode,
} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const privateKey = process.env.PRIVATE_KEY || "";

// token contract address 0xE366C5a151e568eCBC46894E0791E8327b5310f8
// npx ts-node --files ./scripts/DeployTokenizedBallot.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 7000000 proposal1 proposal2 proposal3 proposal4 proposal5 proposal6 proposal7 proposal8 proposal9
async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 3)
    throw new Error(
      "Required parameters not provided: <token contract address> <target block number> <proposal names>"
    );
  const tokenContractAddress = parameters[0] as `0x${string}`;
  if (!tokenContractAddress)
    throw new Error("token contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(tokenContractAddress))
    throw new Error("Invalid contract address");
  const targetBlock = parameters[1];
  // parameters[2] through end are the proposal names
  const proposals = parameters.slice(2);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number: ", blockNumber);

  const account = privateKeyToAccount(`0x${privateKey}`);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Deployer address:", deployer.account.address);

  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "Deployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  console.log("\nDeploying TokenizedBallot contract");
  const hash = await deployer.deployContract({
    abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposals.map((prop) => toHex(prop, { size: 32 })),
      tokenContractAddress,
      targetBlock,
    ],
  });
  console.log("Transaction hash: ", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    "TokenizedBallot contract deployed to address: ",
    receipt.contractAddress
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
