/* eslint-disable react/prop-types */
import { Client } from '@xmtp/xmtp-js';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useSigner } from 'wagmi';

import { XmtpContext } from '../contexts/Xmtp';

export const XmtpProvider = ({ children }) => {
  const { data: signer } = useSigner();
  const [client, setClient] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [convoMessages, setConvoMessages] = useState(new Map());

  const [conversations, dispatchConversations] = useReducer(
    (state, newConvos) => {
      if (newConvos === undefined) {
        return new Map();
      }
      newConvos.forEach((convo) => {
        if (convo.peerAddress !== client?.address) {
          if (state && !state.has(convo.peerAddress)) {
            state.set(convo.peerAddress, convo);
          } else if (state === null) {
            state = new Map();
            state.set(convo.peerAddress, convo);
          }
        }
      });
      return state ?? new Map();
    },
    []
  );

  const initClient = useCallback(
    async (wallet) => {
      if (wallet && !client) {
        try {
          const newClient = await Client.create(wallet, {
            env: import.meta.env.VITE_XMTP_ENV,
          });
          setClient(newClient);
        } catch (e) {
          console.error(e);
          setClient(null);
        }
      }
    },
    [client]
  );

  const disconnect = () => {
    console.log('Disconnected');
    setClient(undefined);
    dispatchConversations(undefined);
  };

  // useEffect(() => {
  //   if (signer) {
  //     initClient(signer);
  //   } else {
  //     disconnect();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [signer]);

  useEffect(() => {
    if (!signer) {
      disconnect();
    }
  }, [signer]);

  useEffect(() => {
    if (!client) return;

    const listConversations = async () => {
      console.log('Listing conversations');
      setLoadingConversations(true);
      const convos = await client._conversations.list();
      for (const convo of convos) {
        const messages = await convo.messages();
        convoMessages.set(convo.peerAddress, messages);
        setConvoMessages(convoMessages);
        dispatchConversations([convo]);
      }
      setLoadingConversations(false);
    };
    listConversations();
  }, [client, convoMessages]);

  const [providerState, setProviderState] = useState({
    client,
    conversations,
    loadingConversations,
    initClient,
    convoMessages,
  });

  useEffect(() => {
    setProviderState({
      client,
      conversations,
      loadingConversations,
      initClient,
      convoMessages,
    });
  }, [client, conversations, convoMessages, initClient, loadingConversations]);

  return (
    <XmtpContext.Provider value={providerState}>
      {children}
    </XmtpContext.Provider>
  );
};

export default XmtpProvider;
