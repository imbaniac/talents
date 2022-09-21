import { useContext, useEffect, useState } from 'react';

import { XmtpContext } from '../contexts/Xmtp';
import { checkIfPathIsEns } from '../utils/helpers';
import useMessageStore from './useMessageStore';

const useConversation = (peerAddress, onMessageCallback) => {
  const { client, convoMessages, loadingConversations } =
    useContext(XmtpContext);
  const { messageStore, dispatchMessages } = useMessageStore();
  const [conversation, setConversation] = useState(null);
  const [stream, setStream] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getConvo = async () => {
      if (!client || !peerAddress || checkIfPathIsEns(peerAddress)) {
        return;
      }
      console.log('Creating conversation with', peerAddress);
      const conversation = await client.conversations.newConversation(
        peerAddress
      );
      setConversation(conversation);
    };
    getConvo();
  }, [peerAddress, client]);

  useEffect(() => {
    const closeStream = async () => {
      if (!stream) return;
      await stream.return();
    };
    closeStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!conversation) return;
    const listMessages = () => {
      setLoading(true);
      if (dispatchMessages) {
        dispatchMessages({
          peerAddress: conversation.peerAddress,
          messages: convoMessages.get(conversation.peerAddress) ?? [],
        });
      }
      if (onMessageCallback) {
        onMessageCallback();
      }
      setLoading(false);
    };
    const streamMessages = async () => {
      const stream = await conversation.streamMessages();
      setStream(stream);
      for await (const msg of stream) {
        if (dispatchMessages) {
          await dispatchMessages({
            peerAddress: conversation.peerAddress,
            messages: [msg],
          });
        }
        if (onMessageCallback) {
          onMessageCallback();
        }
      }
    };
    listMessages();
    streamMessages();
  }, [
    conversation,
    convoMessages,
    loadingConversations,
    dispatchMessages,
    onMessageCallback,
  ]);

  const handleSend = async (message) => {
    if (!conversation) {
      console.log('No conversation');
      return;
    }
    await conversation.send(message);
  };

  return {
    loading,
    loadingConversations,
    messages: messageStore[peerAddress] ?? [],
    sendMessage: handleSend,
  };
};

export default useConversation;
