const { ethers } = require('hardhat');
const { expect } = require('chai');

const PROPOSAL_STATUSES_ENUM = {
  Pending: 0,
  Accepted: 1,
  Rejected: 2,
};

const testEncryptedMessage =
  'hgblu12enjkjfawdnawhjdb2qh1bjkfbwajkfbawkj213b12jk3dhb2h3b1hj3bjkdwakjdj213b1';

describe('Talents DAPP', function () {
  let candidate;
  let proposal;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe('Proposal', () => {
    it('Should deploy Proposal', async () => {
      const Candidate = await ethers.getContractFactory('Candidate');
      const Proposal = await ethers.getContractFactory('Proposal');

      candidate = await Candidate.deploy();
      proposal = await Proposal.deploy(candidate.address);

      expect(await proposal.name()).to.equal('Proposal');
    });

    describe('mintProposal()', () => {
      it('Other account should be able to mint to Candidate', async () => {
        const [, other1, other2] = await ethers.getSigners();

        await candidate.connect(other1).mintProfile(other1.address, 'cid');

        const candidateLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const candidateTokenId =
          candidateLogs[0].args[candidateLogs[0].args.length - 1];

        await proposal
          .connect(other2)
          .mintProposal(candidateTokenId, testEncryptedMessage);

        const proposalLogs = await proposal.queryFilter(
          proposal.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const proposalTokenId =
          proposalLogs[0].args[proposalLogs[0].args.length - 1];

        expect(await proposal.balanceOf(other1.address)).to.equal(1);
        expect(await proposal.tokenURI(proposalTokenId)).to.equal(
          'ipfs://' + testEncryptedMessage
        );
        expect(await proposal.status(proposalTokenId)).to.equal(
          PROPOSAL_STATUSES_ENUM.Pending
        );
      });

      it("User shouldn't be able to mint to yourself", async () => {
        const [, other1] = await ethers.getSigners();

        await candidate.connect(other1).mintProfile(other1.address, 'cid');

        const candidateLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const candidateTokenId =
          candidateLogs[0].args[candidateLogs[0].args.length - 1];

        await expect(
          proposal
            .connect(other1)
            .mintProposal(candidateTokenId, testEncryptedMessage)
        ).to.be.revertedWith('Can not mint proposal to myself');
      });
    });

    describe('Transfers', () => {
      it("Users shouldn't be able to transferFrom() Proposal NFT", async () => {
        const [, other1, other2] = await ethers.getSigners();
        const proposalForAnotherAccount = proposal.connect(other1);

        const logs = await proposalForAnotherAccount.queryFilter(
          proposalForAnotherAccount.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const lastTokenIdOther1 =
          logs[logs.length - 1].args[logs[0].args.length - 1];

        await expect(
          proposalForAnotherAccount.transferFrom(
            other1.address,
            other2.address,
            lastTokenIdOther1
          )
        ).to.be.revertedWith('Err: token is SOUL BOUND');
      });

      it("Users shouldn't be able to safeTransferFrom() Proposal NFT", async () => {
        const [, other1, other2] = await ethers.getSigners();
        const proposalForAnotherAccount = proposal.connect(other1);

        const logs = await proposalForAnotherAccount.queryFilter(
          proposalForAnotherAccount.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const lastTokenId = logs[logs.length - 1].args[logs[0].args.length - 1];

        await expect(
          proposalForAnotherAccount[
            'safeTransferFrom(address,address,uint256)'
          ](other1.address, other2.address, lastTokenId)
        ).to.be.revertedWith('Err: token is SOUL BOUND');
      });
    });

    describe('Statuses', () => {
      it('Candidate should be able to accept Proposal', async () => {
        const [, other1, other2] = await ethers.getSigners();
        await candidate.connect(other1).mintProfile(other1.address, 'cid');

        const candidateLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const candidateTokenId =
          candidateLogs[0].args[candidateLogs[0].args.length - 1];

        await proposal
          .connect(other2)
          .mintProposal(candidateTokenId, testEncryptedMessage);

        const proposalLogs = await proposal.queryFilter(
          proposal.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const proposalTokenId =
          proposalLogs[0].args[proposalLogs[0].args.length - 1];

        await expect(
          proposal.connect(other1).answerProposal(proposalTokenId, true)
        )
          .to.emit(proposal, 'Response')
          .withArgs(proposalTokenId, true);

        expect(await proposal.status(proposalTokenId)).to.be.equal(
          PROPOSAL_STATUSES_ENUM.Accepted
        );
      });

      it('Candidate should be able to reject Proposal', async () => {
        const [, other1, other2] = await ethers.getSigners();
        await candidate.connect(other1).mintProfile(other1.address, 'cid');

        const candidateLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const candidateTokenId =
          candidateLogs[0].args[candidateLogs[0].args.length - 1];

        await proposal
          .connect(other2)
          .mintProposal(candidateTokenId, testEncryptedMessage);

        const proposalLogs = await proposal.queryFilter(
          proposal.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const proposalTokenId =
          proposalLogs[0].args[proposalLogs[0].args.length - 1];

        await expect(
          proposal.connect(other1).answerProposal(proposalTokenId, false)
        )
          .to.emit(proposal, 'Response')
          .withArgs(proposalTokenId, false);

        expect(await proposal.status(proposalTokenId)).to.be.equal(
          PROPOSAL_STATUSES_ENUM.Rejected
        );
      });

      it("Other users shouldn't be able to answerProposal", async () => {
        const [, other1, other2] = await ethers.getSigners();
        await candidate.connect(other1).mintProfile(other1.address, 'cid');

        const candidateLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const candidateTokenId =
          candidateLogs[0].args[candidateLogs[0].args.length - 1];

        await proposal
          .connect(other2)
          .mintProposal(candidateTokenId, testEncryptedMessage);

        const proposalLogs = await proposal.queryFilter(
          proposal.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );
        const proposalTokenId =
          proposalLogs[0].args[proposalLogs[0].args.length - 1];

        await expect(
          proposal.connect(other2).answerProposal(proposalTokenId, false)
        ).to.be.revertedWith('Only candidate can accept Proposal');
      });
    });
  });
});
