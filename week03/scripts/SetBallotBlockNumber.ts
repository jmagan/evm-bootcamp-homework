import {
  formatEther,
  parseEther,
  Hex,
  hexToString,
  http,
  toHex,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { getClientsAccts } from "./sharedUtils";

const openStdin = function () {
  process.stdin.resume();
  return process.stdin;
};

// contract address 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64
// npx ts-node --files ./scripts/SetBallotBlockNumber.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64 <target block #>
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 2)
        throw new Error("Required parameters not provided: <contract address> <target block number in the past>");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");
    const targetBlock = parameters[1];

    const { publicClient, account, deployer } = getClientsAccts();
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number: ", blockNumber);

    // print current contract block number
    const origTargetBlockNumber = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "targetBlockNumber",
    })) as bigint;
    console.log("Contract targetBlockNumber before update:", origTargetBlockNumber.toString());

    // try to set target block number
    const hash = await deployer.writeContract({
      address: contractAddress,
      abi,
      functionName: "setTargetBlockNumber",
      args: [targetBlock],
    });
    console.log("Target block set to", targetBlock,". Transaction hash:", hash);
    console.log("Waiting for confirmations...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed");
    console.log("Receipt:", receipt);

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
