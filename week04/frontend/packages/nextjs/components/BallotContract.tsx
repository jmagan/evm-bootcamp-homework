"use client";

import CastVote from "./CastVote";
import { useAccount } from "wagmi";

function BallotContract() {
  const { address, isConnecting, isDisconnected } = useAccount();
  const ballotContractAddress: `0x${string}` = "0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64";
  const tokenERC20ContractAddress: `0x${string}` = "0xE366C5a151e568eCBC46894E0791E8327b5310f8";
  if (address)
    return (
      <div>
        <CastVote ballotContractAddress={ballotContractAddress} voterAddress={address as `0x${string}`} />
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
