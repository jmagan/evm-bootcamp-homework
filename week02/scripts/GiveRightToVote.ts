import {
  createPublicClient,
  createWalletClient,
  formatEther,
  hexToString,
  http,
  toHex,
} from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { mnemonicToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const mnemonic = process.env.MNEMONIC || "";

const openStdin = function () {
  process.stdin.resume();
  return process.stdin;
};

// Contract address: 0x019974941a50943978c3382ce1f3eba279809dbd

// Use npx ts-node --files ./scripts/GiveRightToVote.ts "<CONTRACT ADDRESS>" "<VOTER ADDRESS>"
async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const voterAddress = parameters[1] as `0x${string}`;
  if (!/^0x[a-fA-F0-9]{40}$/.test(voterAddress))
    throw new Error("Invalid delegate address");

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const blockNumber = await publicClient.getBlockNumber();
  console.log("Last block number:", blockNumber);

  const account = mnemonicToAccount(mnemonic);
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

  const hash = await deployer.writeContract({
    address: contractAddress,
    abi,
    functionName: "giveRightToVote",
    args: [voterAddress],
  });
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed");
  console.log("Receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
