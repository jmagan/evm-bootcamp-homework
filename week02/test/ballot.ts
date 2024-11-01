import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const [deployer] = await viem.getWalletClients();
  const contract = await viem.deployContract("Ballot", [
    PROPOSALS.map((p) => toHex(p, { size: 32 })),
  ]);

  return { contract, deployer };
}

describe("Ballot", async () => {
  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      const { contract } = await loadFixture(deployContract);

      const proposals = await Promise.all(
        [...PROPOSALS.keys()].map(async (i) => {
          const proposal = await contract.read.proposals([BigInt(i)]);
          return proposal[0];
        })
      );

      expect(proposals).to.be.deep.equal(
        PROPOSALS.map((p) => toHex(p, { size: 32 }))
      );
    });

    it("has zero votes for all proposals", async () => {
      const { contract } = await loadFixture(deployContract);
      [...PROPOSALS.keys()].forEach(async (i) => {
        const proposal = await contract.read.proposals([BigInt(i)]);
        expect(proposal[1]).to.equal(0n);
      });
    });
    it("sets the deployer address as chairperson", async () => {
      const { contract, deployer } = await loadFixture(deployContract);

      const chairperson = await contract.read.chairperson();
      expect(chairperson.toLowerCase()).to.equal(
        deployer.account.address.toLowerCase()
      );
    });
    it("sets the voting weight for the chairperson as 1", async () => {
      const { contract } = await loadFixture(deployContract);
      const chairpersonWeight = await contract.read.voters([
        await contract.read.chairperson(),
      ]);
      expect(chairpersonWeight[0]).to.equal(1n);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has voted", async () => {
      // TODO
      throw Error("Not implemented");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      // TODO
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});
