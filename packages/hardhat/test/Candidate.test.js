const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Talents DAPP', function () {
  let candidate;

  // quick fix to let gas reporter fetch data from gas station & coinmarketcap
  before((done) => {
    setTimeout(done, 2000);
  });

  describe('Candidate', () => {
    it('Should deploy Candidate', async () => {
      const Candidate = await ethers.getContractFactory('CandidateNoVerify');

      candidate = await Candidate.deploy();
      expect(await candidate.name()).to.equal('Candidate');
    });

    describe('mintProfile()', () => {
      it('Owner should mint to itself and others', async () => {
        const [owner, other1] = await ethers.getSigners();
        const testUri = 'google.com';
        await candidate.mintProfile(owner.address, testUri + '/1');
        await candidate.mintProfile(other1.address, testUri + '/2');

        const myLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            owner.address
          )
        );

        const otherLogs = await candidate.queryFilter(
          candidate.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const myTokenId = myLogs[0].args[myLogs[0].args.length - 1];
        const otherTokenId = otherLogs[0].args[otherLogs[0].args.length - 1];

        expect(await candidate.balanceOf(owner.address)).to.equal(1);
        expect(await candidate.balanceOf(other1.address)).to.equal(1);

        expect(await candidate.tokenURI(myTokenId)).to.equal(
          'ipfs://' + testUri + '/1'
        );
        expect(await candidate.tokenURI(otherTokenId)).to.equal(
          'ipfs://' + testUri + '/2'
        );
      });

      it('Users should be able to mint for themself', async () => {
        const [, , other2] = await ethers.getSigners();
        const testUri = 'google.com';
        const candidateForAnotherAccount = candidate.connect(other2);
        await candidateForAnotherAccount.mintProfile(other2.address, testUri);

        const logs = await candidateForAnotherAccount.queryFilter(
          candidateForAnotherAccount.filters.Transfer(
            ethers.constants.AddressZero,
            other2.address
          )
        );

        const tokenId = logs[0].args[logs[0].args.length - 1];

        expect(
          await candidateForAnotherAccount.balanceOf(other2.address)
        ).to.equal(1);
        expect(await candidateForAnotherAccount.tokenURI(tokenId)).to.equal(
          'ipfs://' + testUri
        );
      });

      it("Users shouldn't be able to mint for others", async () => {
        const [, , other2, other3] = await ethers.getSigners();
        const testUri = 'google.com';
        const candidateForAnotherAccount = candidate.connect(other2);
        await expect(
          candidateForAnotherAccount.mintProfile(other3.address, testUri)
        ).to.be.revertedWith('You can mint only for yourself');
      });
    });

    describe('Transfers', () => {
      it("Users shouldn't be able to transferFrom() Candidate NFT", async () => {
        const [, other1, other2] = await ethers.getSigners();
        const candidateForAnotherAccount = candidate.connect(other1);

        const logs = await candidateForAnotherAccount.queryFilter(
          candidateForAnotherAccount.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const lastTokenIdOther1 =
          logs[logs.length - 1].args[logs[0].args.length - 1];

        await expect(
          candidateForAnotherAccount.transferFrom(
            other1.address,
            other2.address,
            lastTokenIdOther1
          )
        ).to.be.revertedWith('Err: token is SOUL BOUND');
      });

      it("Users shouldn't be able to safeTransferFrom() Candidate NFT", async () => {
        const [, other1, other2] = await ethers.getSigners();
        const candidateForAnotherAccount = candidate.connect(other1);

        const logs = await candidateForAnotherAccount.queryFilter(
          candidateForAnotherAccount.filters.Transfer(
            ethers.constants.AddressZero,
            other1.address
          )
        );

        const lastTokenId = logs[logs.length - 1].args[logs[0].args.length - 1];

        await expect(
          candidateForAnotherAccount[
            'safeTransferFrom(address,address,uint256)'
          ](other1.address, other2.address, lastTokenId)
        ).to.be.revertedWith('Err: token is SOUL BOUND');
      });

      // it('Owner should be able to transferFrom() Candidate NFT', async () => {
      //   const [, other1, other2] = await ethers.getSigners();
      //   await expect(candidate.transferFrom(other1.address, other2.address))
      //     .to.emit(candidate, 'Transfer')
      //     .withArgs(other2.address, other2.address);
      // });
    });
  });
});
