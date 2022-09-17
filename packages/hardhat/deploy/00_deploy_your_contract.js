// deploy/00_deploy_your_contract.js

const { ethers } = require('hardhat');

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

const main = async (hre) => {
  const { getNamedAccounts, deployments, getChainId, ethernal } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  console.log('DEPLOYER', deployer);
  console.log('CHAIN ID', chainId);

  await deploy('Candidate', {
    from: deployer,
    log: true,
  });

  // Getting a previously deployed contract
  const Candidate = await ethers.getContract('Candidate', deployer);
  console.log('CANDIDATE NFT ADDRESS', Candidate.address);

  await deploy('Proposal', {
    from: deployer,
    log: true,
    args: [Candidate.address],
  });

  const Proposal = await ethers.getContract('Proposal', deployer);
  console.log('PROPOSAL NFT ADDRESS', Proposal.address);

  await ethernal.push({
    name: 'Candidate',
    address: Candidate.address,
  });

  await ethernal.push({
    name: 'Proposal',
    address: Proposal.address,
  });

  /*  await YourContract.setPurpose("Hello");
  
    // To take ownership of yourContract using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await YourContract.transferOwnership(
      "ADDRESS_HERE"
    );
    //const YourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

module.exports = main;
module.exports.tags = ['Candidate', 'Proposal'];
