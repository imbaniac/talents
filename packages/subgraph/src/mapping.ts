import { log } from '@graphprotocol/graph-ts';
import { Transfer as TransferEvent } from '../generated/Candidate/Candidate';
import { fetchAccount, fetchERC721, fetchERC721Token } from './fetch';
// import { ERC721Transfer } from '../generated/schema';

export function handleTransfer(event: TransferEvent): void {
  let contract = fetchERC721(event.address);
  if (contract != null) {
    let token = fetchERC721Token(contract, event.params.tokenId);
    let from = fetchAccount(event.params.from);
    let to = fetchAccount(event.params.to);

    token.createdAt = event.block.timestamp;
    token.owner = to.id;
    // token.approval = fetchAccount(Address.zero()).id; // implicit approval reset on transfer

    if (token.position) {
      contract.save();
      token.save();
    } else {
      log.info('NOT SAVED TOKEN {} WITH URI {}', [token.id, token.uri]);
    }

    // let ev = new ERC721Transfer(events.id(event));
    // ev.emitter = contract.id;
    // ev.transaction = transactions.log(event).id;
    // ev.timestamp = event.block.timestamp;
    // ev.contract = contract.id;
    // ev.token = token.id;
    // ev.from = from.id;
    // ev.to = to.id;
    // ev.save();
  }
}

// import { BigInt, Address } from '@graphprotocol/graph-ts';
// import { Candidate, SetPurpose } from '../generated/Candidate/YourContract';
// import { Purpose, Sender } from '../generated/schema';

// export function handleSetPurpose(event: SetPurpose): void {
//   let senderString = event.params.sender.toHexString();

//   let sender = Sender.load(senderString);

//   if (sender === null) {
//     sender = new Sender(senderString);
//     sender.address = event.params.sender;
//     sender.createdAt = event.block.timestamp;
//     sender.purposeCount = BigInt.fromI32(1);
//   } else {
//     sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1));
//   }

//   let purpose = new Purpose(
//     event.transaction.hash.toHex() + '-' + event.logIndex.toString()
//   );

//   purpose.purpose = event.params.purpose;
//   purpose.sender = senderString;
//   purpose.createdAt = event.block.timestamp;
//   purpose.transactionHash = event.transaction.hash.toHex();

//   purpose.save();
//   sender.save();
// }
