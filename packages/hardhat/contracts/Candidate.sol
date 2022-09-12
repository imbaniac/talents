// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import 'hardhat/console.sol';

contract Candidate is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter;

  constructor() ERC721('Candidate', 'CAN') {}

  function createCandidate(address to, string memory uri) public {
    require(
      msg.sender == to || msg.sender == super.owner(),
      'You can mint only for yourself'
    );
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  function _baseURI() internal pure override returns (string memory) {
    return 'ipfs://';
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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721) {
    require(from == address(0), 'Err: token is SOUL BOUND');
    super._beforeTokenTransfer(from, to, tokenId);
  }
}
