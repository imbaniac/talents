/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { useContext } from 'react';
import { useSigner } from 'wagmi';

import { XmtpContext } from '../contexts/Xmtp';
import Chat from './Chat';

const SenderChat = ({ proposal }) => {
  const { data: signer } = useSigner();

  const { initClient, client } = useContext(XmtpContext);

  return (
    <div className="container mt-16 mx-auto max-w-2xl px-8 pb-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">
            Chat with {proposal.profile.position}
          </h1>
        </div>
        <div className="flex bg-base-200 p-4 rounded-2xl gap-4 w-full">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
              <span>{proposal.name.substring(0, 1).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>{proposal.message}</p>
            <div className="text-xs text-end">
              {format(
                new Date(proposal.createdAt * 1000),
                'MMM dd, yyyy HH:mm'
              )}
            </div>
          </div>
        </div>
        <div className="divider m-0"></div>
        {client ? (
          <Chat recipientWalletAddr={proposal.owner.id} />
        ) : (
          <div className="flex justify-center">
            <button
              className="btn btn-outline"
              onClick={() => initClient(signer)}
            >
              Unlock to dialog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SenderChat;
