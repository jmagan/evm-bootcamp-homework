import {
  formatEther,
  parseEther,
  Hex,
  hexToString,
  http,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { getClientsAccts } from "./sharedUtils";

// contract address 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64
// npx ts-node --files ./scripts/GetBallotBlockNumber.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("Required contract address parameter not provided.");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

    const { publicClient, account, deployer } = getClientsAccts();
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Public client created. Last block number: ", blockNumber);

    // Fetch the contract's target block number
    const targetBlockNumber = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "targetBlockNumber",
    })) as bigint;
    console.log("Target block number of contract ", contractAddress, ":", targetBlockNumber.toString());

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
