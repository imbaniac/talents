/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { useContext } from 'react';
import { useSigner } from 'wagmi';

import { XmtpContext } from '../contexts/Xmtp';
import Chat from './Chat';

const ChatWrapper = ({ proposal, isSender }) => {
  const { data: signer } = useSigner();

  const { initClient, client } = useContext(XmtpContext);

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        {isSender ? (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">
              Chat with {proposal.profile.position}
            </h1>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Chat with {proposal.name} </h1>
            <h2 className="font-bold flex items-center gap-2">
              {proposal.position} at {proposal.company}
              <span className="badge">Not verified</span>
            </h2>
          </div>
        )}
        <div className="flex bg-base-200 p-4 rounded-2xl gap-4 w-full">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
              <span>{proposal.name.substring(0, 1).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{proposal.message}</p>
            <div className="text-xs text-end">
              {format(new Date(proposal.createdAt * 1000), 'dd MMM, HH:mm')}
            </div>
          </div>
        </div>
        {/* {isSender && (
          <div className="flex gap-4">
            <button className="btn">Mint Offer</button>
          </div>
        )} */}
        {!isSender && (
          <div className="flex">
            <button className="btn btn-outline btn-secondary">
              Reject proposal
            </button>
          </div>
        )}
        <div className="divider m-0"></div>
        {client ? (
          <Chat
            recipientWalletAddr={
              isSender ? proposal.owner.id : proposal.sender.id
            }
          />
        ) : (
          <div className="flex justify-center">
            <button
              className="btn btn-outline"
              onClick={() => initClient(signer)}
            >
              Unlock to chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWrapper;
