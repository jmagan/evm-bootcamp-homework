import {
  formatEther,
  parseEther,
  Hex,
  hexToString,
  http,
} from "viem";
import { abi, bytecode } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import { getClientsAccts } from "./sharedUtils";

// contract address 0xB02Ee3F354dE80D8C421cd383e8299b1569B3d20
// npx ts-node --files ./scripts/GetBallotVotingPower.ts 0xB02Ee3F354dE80D8C421cd383e8299b1569B3d20 <wallet address - optional, get address from private key in .env if not given>
async function main() {
    const parameters = process.argv.slice(2);
    if (!parameters || parameters.length < 1)
        throw new Error("Required contract address parameter not provided. Required: <contract address> Optional: <wallet address>");
    const contractAddress = parameters[0] as `0x${string}`;
    if (!contractAddress) throw new Error("Contract address not provided");
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
        throw new Error("Invalid contract address");

    const { publicClient, account, deployer } = getClientsAccts();
    const blockNumber = await publicClient.getBlockNumber();
    console.log("Public client created. Last block number: ", blockNumber);

    let acctAddress : string;
    if (parameters.length >= 2) {
        acctAddress = parameters[1];
        console.log("Checking voting power of address:", acctAddress);
    }
    else {
        acctAddress = deployer.account.address;
        console.log("Checking voting power of Deployer address:", acctAddress);
    }

    // Checking vote power
    const votes = (await publicClient.readContract({
        address: contractAddress,
        abi,
        functionName: "getVotePower",
        args: [acctAddress],
    })) as bigint;
    console.log(
      `Account ${acctAddress}
      has ${formatEther(votes)} units of voting power\n`
    );

}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
