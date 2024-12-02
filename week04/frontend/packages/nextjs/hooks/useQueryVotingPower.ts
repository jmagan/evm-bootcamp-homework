import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockNumber, useReadContract } from "wagmi";
import * as ballotContractAbi from "~~/assets/TokenizedBallot.json";

function useQueryVotingPower(ballotContractAddress: `0x${string}`, voterAddress: `0x${string}`) {
  const {
    data: votePower,
    error,
    isLoading,
    queryKey: votingPowerQueryKey,
  } = useReadContract({
    address: ballotContractAddress,
    abi: ballotContractAbi.abi,
    functionName: "getVotePower",
    args: [voterAddress],
  });

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: { enabled: true, poll: true, pollingInterval: 5000 } });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: votingPowerQueryKey });
  }, [blockNumber, queryClient, votingPowerQueryKey]);

  return { votePower, error, isLoading, votingPowerQueryKey };
}

export default useQueryVotingPower;
