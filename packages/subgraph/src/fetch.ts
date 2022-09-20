import {
  Address,
  BigInt,
  Bytes,
  ethereum,
  ipfs,
  json,
  log,
} from '@graphprotocol/graph-ts';

import {
  Account,
  ERC721Contract,
  Profile,
  Proposal,
} from '../generated/schema';

import { Candidate as CandidateContract } from '../generated/Candidate/Candidate';
import { Proposal as ProposalContract } from '../generated/Proposal/Proposal';

export function supportsInterface(
  contract: ethereum.SmartContract,
  interfaceId: string,
  expected: boolean = true
): boolean {
  let result = ethereum.call(
    new ethereum.SmartContractCall(
      contract._name, // '',
      contract._address, // address,
      'supportsInterface', // '',
      'supportsInterface(bytes4):(bool)',
      [ethereum.Value.fromFixedBytes(Bytes.fromHexString(interfaceId) as Bytes)]
    )
  );

  return (
    result != null &&
    (result as Array<ethereum.Value>)[0].toBoolean() == expected
  );
}

export function fetchAccount(address: Address): Account {
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address);
    account.save();
  }
  return account;
}

export function fetchERC721(address: Address): ERC721Contract | null {
  let erc721 = CandidateContract.bind(address);

  // Try load entry
  let contract = ERC721Contract.load(address);
  if (contract != null) {
    return contract;
  }

  // Detect using ERC165
  let detectionId = address.concat(Bytes.fromHexString('80ac58cd')); // Address + ERC721
  let detectionAccount = Account.load(detectionId);

  // On missing cache
  if (detectionAccount == null) {
    detectionAccount = new Account(detectionId);
    let introspection_01ffc9a7 = supportsInterface(erc721, '01ffc9a7'); // ERC165
    let introspection_80ac58cd = supportsInterface(erc721, '80ac58cd'); // ERC721
    let introspection_00000000 = supportsInterface(erc721, '00000000', false);
    let isERC721 =
      introspection_01ffc9a7 &&
      introspection_80ac58cd &&
      introspection_00000000;
    detectionAccount.asERC721 = isERC721 ? address : null;
    detectionAccount.save();
  }

  // If an ERC721, build entry
  if (detectionAccount.asERC721) {
    contract = new ERC721Contract(address);
    let try_name = erc721.try_name();
    let try_symbol = erc721.try_symbol();
    contract.name = try_name.reverted ? '' : try_name.value;
    contract.symbol = try_symbol.reverted ? '' : try_symbol.value;
    contract.supportsMetadata = supportsInterface(erc721, '5b5e139f'); // ERC721Metadata
    contract.asAccount = address;
    contract.save();

    let account = fetchAccount(address);
    account.asERC721 = address;
    account.save();
  }

  return contract;
}

export function fetchProfileToken(
  contract: ERC721Contract,
  identifier: BigInt
): Profile {
  let id = contract.id.toHex().concat('/').concat(identifier.toHex());
  let token = Profile.load(id);

  if (token == null) {
    token = new Profile(id);
    token.contract = contract.id;
    token.identifier = identifier;

    if (contract.supportsMetadata) {
      let erc721 = CandidateContract.bind(Address.fromBytes(contract.id));
      let try_tokenURI = erc721.try_tokenURI(identifier);
      token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;

      // Fetch IPFS data
      const CID = token.uri.split('://')[1];
      log.info('IPFS CID: {}', [CID]);

      const metadata = ipfs.cat(CID);
      if (metadata) {
        const value = json.fromBytes(metadata).toObject();
        if (value) {
          const profileProperties = value.get('properties');
          if (profileProperties) {
            const profilePropertiesJson = profileProperties.toObject();

            const position = profilePropertiesJson.get('position');
            if (position) {
              token.position = position.toString();
            }

            const category = profilePropertiesJson.get('category');
            if (category) {
              token.category = category.toString();
            }

            const country = profilePropertiesJson.get('country');
            if (country) {
              token.country = country.toString();
            }

            const experience = profilePropertiesJson.get('experience');
            if (experience) {
              token.experience = experience.toBigInt();
            }

            const english = profilePropertiesJson.get('english');
            if (english) {
              token.english = english.toString();
            }

            const employmentTypes =
              profilePropertiesJson.get('employmentTypes');

            if (employmentTypes) {
              const employmentTypesArray = employmentTypes.toArray();
              // EmploymentTypes type in Graph is Array<string> | null, while IPFS returns Array<string>
              const employmentTypesTemp: Array<string> = [];
              for (let i = 0; i < employmentTypesArray.length; i++) {
                employmentTypesTemp.push(employmentTypesArray[i].toString());
              }
              token.employmentTypes = employmentTypesTemp;
            }

            const skills = profilePropertiesJson.get('skills');

            if (skills) {
              const skillsArray = skills.toArray();
              // Skills type in Graph is Array<string> | null, while IPFS returns Array<string>
              const skillsTemp: Array<string> = [];
              for (let i = 0; i < skillsArray.length; i++) {
                skillsTemp.push(skillsArray[i].toString());
              }
              token.skills = skillsTemp;
            }

            const details = profilePropertiesJson.get('details');
            if (details) {
              token.details = details.toString();
            }
          }
        }
      }
    }
  }

  return token as Profile;
}

export function fetchProposalToken(
  contract: ERC721Contract,
  identifier: BigInt
): Proposal {
  let id = contract.id.toHex().concat('/').concat(identifier.toHex());
  let token = Proposal.load(id);
  let erc721 = ProposalContract.bind(Address.fromBytes(contract.id));

  if (token == null) {
    token = new Proposal(id);
    token.contract = contract.id;
    token.identifier = identifier;

    const try_sender = erc721.try_sender(identifier);
    const sender = try_sender.reverted ? Address.zero() : try_sender.value;

    log.warning('SOMEHOW I AM HERE Sender is {}', [sender.toHexString()]);

    token.sender = fetchAccount(sender).id;

    if (contract.supportsMetadata) {
      let try_tokenURI = erc721.try_tokenURI(identifier);
      token.uri = try_tokenURI.reverted ? '' : try_tokenURI.value;

      // Fetch IPFS data
      const CID = token.uri.split('://')[1];
      log.info('IPFS CID: {}', [CID]);
      const metadata = ipfs.cat(CID);
      if (metadata) {
        const value = json.fromBytes(metadata).toObject();
        if (value) {
          const proposalProperties = value.get('properties');
          if (proposalProperties) {
            const proposalPropertiesJson = proposalProperties.toObject();

            const name = proposalPropertiesJson.get('name');
            if (name) {
              token.name = name.toString();
            }

            const position = proposalPropertiesJson.get('position');
            if (position) {
              token.position = position.toString();
            }

            const company = proposalPropertiesJson.get('company');
            if (company) {
              token.company = company.toString();
            }

            const message = proposalPropertiesJson.get('message');
            if (message) {
              token.message = message.toString();
            }
          }
        }
      }
    }
  }

  return token as Proposal;
}
