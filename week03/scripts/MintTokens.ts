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
// npx ts-node --files ./scripts/MintTokens.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 <# tokens to mint>
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("Parameters not provided");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");
    const mintValue = parseEther(parameters[1]);

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

    // Minting some tokens
    const mintTx = await deployer.writeContract({
        address: contractAddress,
        abi,
        functionName: "mint",
        args: [deployer.account.address, mintValue],
    });
    console.log("Transaction hash:", mintTx);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash: mintTx });
    console.log("Transaction confirmed. Receipt:", receipt);
    console.log(
      `Minted ${mintValue.toString()} decimal units to account ${
        deployer.account.address
      }\n`
    );

    const balance = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "balanceOf",
        args: [deployer.account.address],
    })) as bigint;
    console.log(
        "Account ", deployer.account.address, " has ",
        balance.toString(),
        "decimal units of MyToken\n"
    );


}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
