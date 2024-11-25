"use client";

import CastVote from "./CastVote";
import MintVoteTokens from "./MintVoteTokens";
import { useAccount } from "wagmi";

function BallotContract() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const ballotContractAddress: `0x${string}` = "0x5999b38cb92947cdfce62ce27ca34941c52e490f";
  const tokenERC20ContractAddress: `0x${string}` = "0x30f7ca5ba20ee2b384e630298a762319da521835";
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
