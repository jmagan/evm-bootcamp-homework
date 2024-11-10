import {
  createPublicClient,
  createWalletClient,
  formatEther,
  parseEther,
  Hex,
  hexToString,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";
import { abi, bytecode } from "../artifacts/contracts/MyERC20Votes.sol/MyToken.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const privateKey = process.env.PRIVATE_KEY || "";

// contract address 0xE366C5a151e568eCBC46894E0791E8327b5310f8
// npx ts-node --files ./scripts/DelegateVotingPower.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 <# tokens to mint>
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("Required contract address parameter not provided. Required: <contract address> Optional: <wallet address>");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

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

    let acctAddress : string;
    if (parameters.length >= 2) {
        acctAddress = parameters[1];
        console.log("Delegating to address:", acctAddress);
    }
    else {
        acctAddress = deployer.account.address;
        console.log("Self delegating to Deployer address:", acctAddress);
    }

    // Self delegation transaction
    const delegateTx = await deployer.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [acctAddress],
    });
    console.log("Transaction hash:", delegateTx);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash: delegateTx });
    console.log("Transaction confirmed. Receipt:", receipt);

    // Checking vote power
    const votes = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getVotes",
        args: [acctAddress],
    })) as bigint;

    console.log(
      `Account ${acctAddress}
      has ${votes.toString()} units of voting power after self delegating\n`
    );


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
