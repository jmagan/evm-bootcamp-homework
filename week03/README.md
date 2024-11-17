# Homework 3 - TokenizedBallot smart contract (Group 6)

All the interactions are registered in the following spreadsheet:

[https://docs.google.com/spreadsheets/d/1P_LV1TY4d-n4d6JWWYEjrlbRiPV-h9o2luSF1WvFt-0/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1QB2mHbqejbi9BmbjcsVLlZZSc_FGzchGew3iYJSNy74/edit?usp=sharing)


## Representative Commands Run

```
# deployed ERC20 votes token contract to address 0xE366C5a151e568eCBC46894E0791E8327b5310f8
npx hardhat run ./scripts/DeployERC20VotesToken.ts --network sepolia

# mint 3 tokens
npx ts-node --files ./scripts/MintTokens.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 3 

# check self voting power
npx ts-node --files ./scripts/CheckVotingPower.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8

# mint 20 tokens
npx ts-node --files ./scripts/MintTokens.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 20

# transfer 10 tokens to address 0x6A9aFF7d5FfC964d2c00A8f5F500A6f87ace2f66
npx ts-node --files ./scripts/TransferTokens.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 0x6A9aFF7d5FfC964d2c00A8f5F500A6f87ace2f66 10

# deploy TokenizedBallot contract with 9 proposals to vote on, to address 0xE366C5a151e568eCBC46894E0791E8327b5310f8, targetBlockNumber 7097697
npx ts-node --files ./scripts/DeployTokenizedBallot.ts 0xE366C5a151e568eCBC46894E0791E8327b5310f8 7097697 proposal1 proposal2 proposal3 proposal4 proposal5 proposal6 proposal7 proposal8 proposal9

# check self ballot voting power
npx ts-node --files ./scripts/GetBallotVotingPower.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64

# cast 3 votes for proposal index 8 (proposal9)
npx ts-node --files ./scripts/CastVote.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64 8 3

# cast 1 votes for proposal index 4 (proposal5)
npx ts-node --files ./scripts/CastVote.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64 4 1

# query vote results
npx ts-node --files ./scripts/WinningProposal.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64

# check targetBlockNumber of TokenizedBallot
npx ts-node --files ./scripts/GetBallotBlockNumber.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64

update targetBlockNumber of the TokenizedBallot to 7097897
npx ts-node --files ./scripts/SetBallotBlockNumber.ts 0x929c3b2856b9f5a26e52563d87a8f96e2eed1a64 7097897

```

