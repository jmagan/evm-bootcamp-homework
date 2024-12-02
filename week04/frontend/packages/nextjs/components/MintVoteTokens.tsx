import { useCallback } from "react";
import { useBlockNumber, useWriteContract } from "wagmi";
import * as tokenERC20ContractAbi from "~~/assets/MyToken.json";
import * as ballotContractAbi from "~~/assets/TokenizedBallot.json";

function MintVoteTokens(params: {
  tokenERC20ContractAddress: `0x${string}`;
  voterAddress: `0x${string}`;
  ballotContractAddress: `0x${string}`;
}) {
  const { tokenERC20ContractAddress, voterAddress, ballotContractAddress } = params;

  const { writeContract: mintAction, error: mintError, status: mintStatus } = useWriteContract();
  const { writeContract: delegateAction, error: delegateError, status: delegateStatus } = useWriteContract();
  const {
    writeContract: setBlockNumberAction,
    error: setBlockNumberError,
    status: setBlockNumberStatus,
  } = useWriteContract();

  const mintTokens = useCallback(async () => {
    mintAction(
      {
        address: tokenERC20ContractAddress,
        abi: tokenERC20ContractAbi.abi,
        functionName: "mint",
        args: [voterAddress, 100n * 10n ** 18n],
      },
      {
        onSettled: () =>
          delegateAction({
            address: tokenERC20ContractAddress,
            abi: tokenERC20ContractAbi.abi,
            functionName: "delegate",
            args: [voterAddress],
          }),
      },
    );
  }, [delegateAction, mintAction, tokenERC20ContractAddress, voterAddress]);

  const { data: blockNumber } = useBlockNumber({ watch: true });
  const updateBallotBlockNumber = useCallback(() => {
    alert("Setting block number");
    setBlockNumberAction({
      address: ballotContractAddress,
      abi: ballotContractAbi.abi,
      functionName: "setTargetBlockNumber",
      args: [blockNumber],
    });
  }, [setBlockNumberAction, ballotContractAddress, blockNumber]);

  return (
    <>
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-body">
          <h2 className="card-title">Mint and delegate tokens</h2>
          <div className="flex flex-col">
            <button className="btn" onClick={() => mintTokens()}>
              Mint tokens
            </button>
            {mintStatus !== "idle" && mintStatus !== "pending" && (
              <div>
                Result:
                {mintStatus === "success" ? "Success" : "Error"} {mintError?.message}
              </div>
            )}
            {delegateStatus !== "idle" && delegateStatus !== "pending" && (
              <div>
                Result:
                {delegateStatus === "success" ? "Success" : "Error"} {delegateError?.message}
              </div>
            )}
            <p>Set current block number in ballot contract</p>
            <button className="btn" onClick={() => updateBallotBlockNumber()}>
              Set current block number {blockNumber?.toString()}
            </button>
            {setBlockNumberStatus !== "idle" && setBlockNumberStatus !== "pending" && (
              <div>
                Result:
                {setBlockNumberStatus === "success" ? "Success" : "Error"} {setBlockNumberError?.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MintVoteTokens;
