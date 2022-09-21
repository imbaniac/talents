/* eslint-disable import/prefer-default-export */
import { createContext } from 'react';

export const XmtpContext = createContext({
  client: undefined,
  conversations: null,
  loadingConversations: false,
  initClient: () => undefined,
  convoMessages: new Map(),
});
