/* eslint-disable react/prop-types */
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { utils } from 'ethers';

import Spinner from './_atoms/Spinner';
import useConversation from '../hooks/useConversation';

const Chat = ({ recipientWalletAddr }) => {
  const messagesEndRef = useRef(null);
  const scrollToMessagesEndRef = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const checksumAddress = utils.getAddress(recipientWalletAddr);
  const [currentValue, setCurrentValue] = useState(''); // you can manage data with it
  const { messages, sendMessage, loading, loadingConversations } =
    useConversation(checksumAddress, scrollToMessagesEndRef);

  const handleSend = () => {
    sendMessage(currentValue);
    setCurrentValue('');
  };

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (!hasMessages) return;
    const initScroll = () => {
      scrollToMessagesEndRef();
    };
    initScroll();
  }, [recipientWalletAddr, hasMessages, scrollToMessagesEndRef]);

  const getIsMe = (msg) => msg.senderAddress !== checksumAddress;
  const isLoading = loadingConversations || loading;
  return (
    <div className="flex gap-4 flex-col">
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {messages.map((message) => (
        <div
          key={message.id}
          className={getIsMe(message) ? 'flex justify-end' : ''}
        >
          <div
            className={`flex p-4 rounded-2xl gap-4 w-fit max-w-[80%] ${
              getIsMe(message) ? 'bg-blue-100' : 'bg-base-200'
            }`}
          >
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8">
                <span>A</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <p>{message.content}</p>
              <div className="text-xs text-end">
                {format(new Date(message.sent), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
      <textarea
        className="textarea textarea-bordered w-full mt-4"
        placeholder="Type something..."
        rows={1}
        value={currentValue}
        onChange={(e) => {
          e.target.style.height = 'inherit';
          e.target.style.height = `${e.target.scrollHeight}px`;
          setCurrentValue(e.target.value);
        }}
        disabled={isLoading}
      ></textarea>
      <div className="flex justify-end">
        <button
          className="btn btn-outline w-1/3"
          onClick={handleSend}
          disabled={isLoading}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default Chat;
