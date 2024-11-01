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

async function main() {
  const proposals = process.argv.slice(2);
  if (!proposals || proposals.length < 1)
    throw new Error("Proposals not provided");
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

  // ************************************************************************************************
  //                                        UNCOMMENT THIS TO DEPLOY THE CONTRACT
  // ************************************************************************************************

  // console.log("\nDeploying Ballot contract");

  //   const hash = await deployer.deployContract({
  //     abi,
  //     bytecode: bytecode as `0x${string}`,
  //     args: [proposals.map((prop) => toHex(prop, { size: 32 }))],
  //   });
  const hash =
    "0x59f6ba22e79670fcb37751d1a802962fc355b163cb1cc1a9cbd08edd3bd4693a";
  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmations...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Ballot contract deployed to:", receipt.contractAddress);

  console.log("Proposals: ");
  for (let index = 0; index < proposals.length; index++) {
    const proposal = (await publicClient.readContract({
      address: receipt.contractAddress!,
      abi,
      functionName: "proposals",
      args: [BigInt(index)],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log({ index, name, proposal });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
