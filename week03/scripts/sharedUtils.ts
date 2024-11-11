import {
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { mnemonicToAccount, privateKeyToAccount } from "viem/accounts";

export function getClientsAccts() {
    dotenv.config();

    const providerApiKey = process.env.ALCHEMY_API_KEY || "";
    const privateKey = process.env.PRIVATE_KEY || "";
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });

    const account = privateKeyToAccount(`0x${privateKey}`);
    const deployer = createWalletClient({
        account,
        chain: sepolia,
        transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
    });
    const acctAddress = deployer.account.address;
    console.log("Deployer address:", acctAddress);

    return { publicClient, account, deployer };
}
