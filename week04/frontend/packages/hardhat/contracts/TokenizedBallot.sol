// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot is Ownable {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping(address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) Ownable(msg.sender) {
        tokenContract = IMyToken(_tokenContract);
        // Validate if targetBlockNumber is in the past
        require(
            _targetBlockNumber < block.number,
            string.concat("Error: target block number ",Strings.toString(_targetBlockNumber)," is not in the past, should be less than", Strings.toString(block.number))
        );
        targetBlockNumber = _targetBlockNumber;

        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 votePower = getVotePower(msg.sender);
        require(
            votePower >= amount,
            "Error: trying to vote with more votes than available"
        );
        require(
            (proposal >= 0) && (proposal < proposals.length),
            string.concat("Invalid proposal number",Strings.toString(proposal),". Enter a proposal number between 0 and ",Strings.toString(proposals.length))
        );
        votePowerSpent[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotePower(address voter) public view returns (uint256) {
        return
            tokenContract.getPastVotes(voter, targetBlockNumber) - votePowerSpent[msg.sender];
    }
    
    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function setTargetBlockNumber(uint256 _targetBlockNumber) public onlyOwner {
        // Validate if targetBlockNumber is in the past
        require(
            _targetBlockNumber < block.number,
            string.concat("Error: target block number ",Strings.toString(_targetBlockNumber)," is not in the past, should be less than ", Strings.toString(block.number))
        );
        targetBlockNumber = _targetBlockNumber;
    }

}
