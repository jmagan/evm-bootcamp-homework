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
// npx ts-node --files ./scripts/CastVote.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64 <proposal # to vote for> <amount of votes to cast>
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 3)
        throw new Error("Required parameters not provided: <contract address> <proposal index number to vote for> <amount of votes to cast>");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");
    const proposalIndex = parameters[1];
    if (isNaN(Number(proposalIndex))) throw new Error("Invalid proposal index");
    const voteAmount = parseEther(parameters[2]);

    const { publicClient, account, deployer } = getClientsAccts();
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Last block number: ", blockNumber);

    // show proposal name for index and confirm
    console.log("Proposal index number selected: ", proposalIndex);
    const proposal = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "proposals",
        args: [proposalIndex],
    })) as any[];
    const name = hexToString(proposal[0], { size: 32 });
    console.log("Casting", voteAmount, "wei number of votes to proposal name", name);
    console.log("Confirm? (Y/n)");

    // cast vote
    const stdin = openStdin();
    stdin.addListener("data", async function (d) {
        if (d.toString().trim().toLowerCase() != "n") {
            const hash = await deployer.writeContract({
              address: contractAddress,
              abi,
              functionName: "vote",
              args: [proposalIndex, voteAmount],
            });
            console.log("Transaction hash:", hash);
            console.log("Waiting for confirmations...");
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log("Transaction confirmed");
            console.log("Receipt:", receipt);
        } else {
            console.log("Operation cancelled");
        }
        process.exit();
    });

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
