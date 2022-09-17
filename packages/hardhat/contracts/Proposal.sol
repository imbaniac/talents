// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import 'hardhat/console.sol';
import './Candidate.sol';

/* 
  Proposal is a NFT minted for owner of Candidate NFT
 */

contract Proposal is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  Candidate candidate;

  enum Status {
    Pending,
    Accepted,
    Rejected
  }

  event Response(uint256 indexed tokenId, bool indexed accepted);

  mapping(uint256 => Status) statuses;
  mapping(uint256 => address) senders;

  constructor(address candidateAddress) ERC721('Proposal', 'PROPOSAL') {
    candidate = Candidate(candidateAddress);
  }

  function mintProposal(uint256 candidateTokenId, string memory uri) public {
    address to = candidate.ownerOf(candidateTokenId);
    require(to != msg.sender, 'Can not mint proposal to myself');
    console.log('Minting Proposal to Candidate address:', to, msg.sender);
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    statuses[tokenId] = Status.Pending;
    senders[tokenId] = msg.sender;
  }

  function answerProposal(uint256 tokenId, bool accepted) public {
    require(
      super.ownerOf(tokenId) == msg.sender,
      'Only candidate can accept Proposal'
    );
    if (accepted) {
      statuses[tokenId] = Status.Accepted;
    } else {
      statuses[tokenId] = Status.Rejected;
    }
    emit Response(tokenId, accepted);
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721) {
    require(from == address(0), 'Err: token is SOUL BOUND');
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function status(uint256 tokenId) public view returns (Status) {
    return statuses[tokenId];
  }

  function sender(uint256 tokenId) public view returns (address) {
    return senders[tokenId];
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
}
