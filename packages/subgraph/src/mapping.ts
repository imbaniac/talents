import { log } from '@graphprotocol/graph-ts';
import { Transfer as TransferCandidateEvent } from '../generated/Candidate/Candidate';
import {
  Transfer as TransferProposalEvent,
  Response as ResponseProposalEvent,
} from '../generated/Proposal/Proposal';
import {
  fetchAccount,
  fetchERC721,
  fetchProfileToken,
  fetchProposalToken,
} from './fetch';
import { sendEPNSNotification } from './EPNSNotification';

export const subgraphID = 'imbaniac/talents-ninja';

export function handleProfileMint(event: TransferCandidateEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchProfileToken(contract, event.params.tokenId);
    // let from = fetchAccount(event.params.from);
    let to = fetchAccount(event.params.to);

    token.createdAt = event.block.timestamp;
    token.owner = to.id;

    if (token.position) {
      contract.save();
      token.save();
    } else {
      log.info('NOT SAVED PROFILE {} WITH URI {}', [token.id, token.uri]);
    }
  }
}

export function handleProposalMint(event: TransferProposalEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchProposalToken(contract, event.params.tokenId);
    // let from = fetchAccount(event.params.from);
    let to = fetchAccount(event.params.to);

    token.createdAt = event.block.timestamp;
    token.owner = to.id;

    if (token.message) {
      let recipient = to.id.toHexString(),
        type = '3',
        title = `You have a new job proposal from ${token.company}`,
        body = `
From: ${token.name}
Message: ${token.message}
`,
        subject = `You have a new job proposal from ${token.company}`,
        message = `
From: ${token.name}
Message: ${token.message}
`,
        image = 'null',
        secret = 'null',
        cta = `https://demo.talents.ninja/chat/${token.id}`;

      let notification = `{\"type\": \"${type}\", \"title\": \"${title}\", \"body\": \"${body}\", \"subject\": \"${subject}\", \"message\": \"${message}\", \"image\": \"${image}\", \"secret\": \"${secret}\", \"cta\": \"${cta}\"}`;
      sendEPNSNotification(recipient, notification);

      contract.save();
      token.save();
    } else {
      log.info('NOT SAVED PROPOSAL {} WITH URI {}', [token.id, token.uri]);
    }
  }
}

export function handleProposalResponse(event: ResponseProposalEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchProposalToken(contract, event.params.tokenId);
    token.status = event.params.status;
    token.save();
  }
}
