// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {ByteHasher} from './helpers/ByteHasher.sol';
import {IWorldID} from './interfaces/IWorldID.sol';

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Candidate is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
  using ByteHasher for bytes;
  using Counters for Counters.Counter;

  /// @notice Thrown when attempting to reuse a nullifier
  error InvalidNullifier();

  /// @dev The WorldID instance that will be used for verifying proofs
  IWorldID internal immutable worldId;

  /// @dev The WorldID group ID (1)
  uint256 internal immutable groupId = 1;
  uint256 immutable actionId;

  /// @dev Whether a nullifier hash has been used already. Used to prevent double-signaling
  mapping(uint256 => bool) internal nullifierHashes;

  Counters.Counter private _tokenIdCounter;

  constructor(IWorldID _worldId, string memory _actionId)
    ERC721('Candidate', 'CAN')
  {
    worldId = _worldId;
    actionId = abi.encodePacked(_actionId).hashToField();
  }

  /// @param to User's address, used as the signal and minting address.
  /// @param uri IPFS hash.
  /// @param root The of the Merkle tree, returned by the SDK.
  /// @param nullifierHash The nullifier for this proof, preventing double signaling, returned by the SDK.
  /// @param proof The zero knowledge proof that demostrates the claimer is registered with World ID, returned by the SDK.
  function mintProfile(
    address to,
    string memory uri,
    uint256 root,
    uint256 nullifierHash,
    uint256[8] calldata proof
  ) external {
    // first, we make sure this person hasn't done this before
    if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

    // then, we verify they're registered with WorldID, and the input they've provided is correct
    worldId.verifyProof(
      root,
      groupId,
      abi.encodePacked(to).hashToField(),
      nullifierHash,
      actionId,
      proof
    );

    // finally, we record they've done this, so they can't do it again (proof of uniqueness)
    nullifierHashes[nullifierHash] = true;

    // mint logic
    require(
      msg.sender == to || msg.sender == super.owner(),
      'You can mint only for yourself'
    );
    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
  }

  // TODO: remove for prod
  function mintProfileLocal(address to, string memory uri) public {
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

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721) {
    require(from == address(0), 'Err: token is SOUL BOUND');
    super._beforeTokenTransfer(from, to, tokenId);
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
