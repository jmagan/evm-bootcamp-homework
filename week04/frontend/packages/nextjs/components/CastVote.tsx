import { useReadContract } from "wagmi";
import * as ballotContractAbi from "~~/assets/TokenizedBallot.json";

function CastVote(params: { ballotContractAddress: `0x${string}`; voterAddress: `0x${string}` }) {
  const { ballotContractAddress, voterAddress } = params;

  const { data: votePower, error } = useReadContract({
    address: ballotContractAddress,
    abi: ballotContractAbi.abi,
    functionName: "getVotePower",
    args: [voterAddress.toLocaleLowerCase()],
  });
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

  return (
    <>
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-body">
          <h2 className="card-title">Cast your vote</h2>
          <h3 className="card-title">Your vote power: {votePower as string}</h3>
          {error && <p>Error: {error.message}</p>}
          {proposals.map((proposal, index) => (
            <div className="form-control" key={index}>
              <label className="label cursor-pointer">
                <span className="label-text">{proposal}</span>
                <input type="radio" key={index} id={proposal} name="proposal" value={proposal} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CastVote;
