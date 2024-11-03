import {
  createPublicClient,
  createWalletClient,
  formatEther,
  hexToString,
  http,
} from 'viem';
import { sepolia } from 'viem/chains';
import * as dotenv from 'dotenv';
import { mnemonicToAccount } from 'viem/accounts';
import { abi } from '../artifacts/contracts/Ballot.sol/Ballot.json';

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || '';
const mnemonic = process.env.MNEMONIC || '';

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error('Parameters not provided');
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error('Contract address not provided');
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error('Invalid contract address');

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = mnemonicToAccount(mnemonic);
  const deployer = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  console.log('Deployer address:', deployer.account.address);
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    'Deployer balance:',
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );

  // Fetch the winning proposal index
  const winningProposalIndex = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'winningProposal',
  })) as BigInt;

  console.log('Winning Proposal Index:', winningProposalIndex.toString());

  // Fetch the winning proposal details
  const proposal = (await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: 'proposals',
    args: [winningProposalIndex],
  })) as any[];

  const name = hexToString(proposal[0], { size: 32 });
  const voteCount = proposal[1];

  console.log(`Winning Proposal: ${name}`);
  console.log(`Vote Count: ${voteCount}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
