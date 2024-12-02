"use client";

import CastVote from "./CastVote";
import MintVoteTokens from "./MintVoteTokens";
import { useAccount } from "wagmi";

function BallotContract() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const ballotContractAddress: `0x${string}` = "0x36c167074d7794935f63f68406065e7e7a9d60c7";
  const tokenERC20ContractAddress: `0x${string}` = "0x7204e456e73b9e1a9aa041b77ffe56512bd11534";
  if (address)
    return (
      <div className="flex flex-row gap-2">
        <CastVote ballotContractAddress={ballotContractAddress} voterAddress={address as `0x${string}`} />
        <MintVoteTokens
          tokenERC20ContractAddress={tokenERC20ContractAddress}
          voterAddress={address as `0x${string}`}
          ballotContractAddress={ballotContractAddress}
        />
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

export default BallotContract;
