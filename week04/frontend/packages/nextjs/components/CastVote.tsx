import { useCallback, useState } from "react";
import { formatEther } from "viem";
import { useWriteContract } from "wagmi";
import * as ballotContractAbi from "~~/assets/TokenizedBallot.json";
import useQueryVotingPower from "~~/hooks/useQueryVotingPower";

function CastVote(params: { ballotContractAddress: `0x${string}`; voterAddress: `0x${string}` }) {
  const { ballotContractAddress, voterAddress } = params;

  const { votePower, isLoading, error } = useQueryVotingPower(ballotContractAddress, voterAddress);

  const { writeContract, error: voteError, status } = useWriteContract();

  const proposals = [
    "proposal1",
    "proposal2",
    "proposal3",
    "proposal4",
    "proposal5",
    "proposal6",
    "proposal7",
    "proposal8",
    "proposal9",
  ];

  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);

  const vote = useCallback(() => {
    if (selectedProposal === null) {
      return;
    }
    // Call the vote function
    writeContract({
      address: ballotContractAddress,
      abi: ballotContractAbi.abi,
      functionName: "vote",
      args: [selectedProposal, votePower],
    });
  }, [selectedProposal, writeContract, ballotContractAddress, votePower]);

  return (
    <>
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-body">
          <h2 className="card-title">Cast your vote</h2>
          <p>Your vote power: {!isLoading ? formatEther(votePower as bigint) : "Loading..."}</p>
          {error && <p>Error: {error.message}</p>}
          {proposals.map((proposal, index) => (
            <div className="form-control" key={index}>
              <label className="label cursor-pointer">
                <span className="label-text">{proposal}</span>
                <input
                  type="radio"
                  key={index}
                  id={proposal}
                  name="proposal"
                  value={proposal}
                  onChange={() => setSelectedProposal(index)}
                />
              </label>
            </div>
          ))}
          <button disabled={isLoading || status !== "idle"} className="btn" onClick={() => vote()}>
            Vote
          </button>
          {voteError && <p>Error: {voteError.message}</p>}
        </div>
      </div>
    </>
  );
}

export default CastVote;
