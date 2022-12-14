import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Provider,
  cacheExchange,
  createClient as createGraphqlClient,
  dedupExchange,
  fetchExchange,
} from 'urql';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import { refocusExchange } from '@urql/exchange-refocus';
import { render } from 'preact';
import { requestPolicyExchange } from '@urql/exchange-request-policy';

import App from './App';
import CandidateProfile from './pages/CandidateProfile';
import CandidatesList from './pages/CandidatesList';
import EditProfile from './pages/EditProfile';
import Inbox from './pages/Inbox';
import MintProfile from './pages/MintProfile';
import MyProfile from './pages/MyProfile';
import NewProfile from './pages/NewProfile';
import Outbox from './pages/Outbox';
import ProposalChat from './pages/ProposalChat';
import ScrollToTop from './components/ScrollToTop';
import Welcome from './pages/Welcome';
import XmtpProvider from './components/XmtpProvider';

const { chains, provider } = configureChains(
  [
    chain.polygonMumbai,
    chain.hardhat,
    // chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum
  ],
  [
    jsonRpcProvider({
      rpc: (rpcChain) => {
        if (rpcChain.id !== chain.polygonMumbai.id) {
          return null;
        }
        console.log('Using Quicknode mumbai endpoint');
        return {
          http: `https://misty-wandering-dew.matic-testnet.discover.quiknode.pro/${
            import.meta.env.VITE_QUICKNODE_API_KEY
          }/`,
        };
      },
    }),
    jsonRpcProvider({
      rpc: (rpcChain) => {
        console.log('Using Hardhat local endpoint');
        if (rpcChain.id !== chain.hardhat.id) {
          return null;
        }
        return { http: 'http://127.0.0.1:8545' };
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Talents',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const graphqlClient = createGraphqlClient({
  url:
    import.meta.env.VITE_THEGRAPH_URI ||
    '/subgraphs/name/talents-eth/candidate',
  requestPolicy: 'cache-and-network',
  exchanges: [
    dedupExchange,
    refocusExchange(),
    requestPolicyExchange({
      // The amount of time in ms that has to go by before upgrading, default is 5 minutes.
      ttl: 60 * 1000, // 1 minute.
    }),
    cacheExchange,
    fetchExchange,
  ],
});

render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} showRecentTransactions>
      <XmtpProvider>
        <Provider value={graphqlClient}>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<Welcome />} />
                <Route path="profile">
                  <Route path="self" element={<MyProfile />} />
                  <Route path="self/edit" element={<EditProfile />} />
                  <Route path="new" element={<NewProfile />} />
                  <Route path="mint" element={<MintProfile />} />
                  <Route
                    path=":contractAddress/:tokenId"
                    element={<CandidateProfile />}
                  />
                </Route>
                <Route path="candidates" element={<CandidatesList />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="outbox" element={<Outbox />} />
                <Route
                  path="chat/:contractAddress/:proposalId"
                  element={<ProposalChat />}
                />
                <Route
                  path="*"
                  element={
                    <main style={{ padding: '1rem' }}>
                      <p>There is nothing here!</p>
                    </main>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </XmtpProvider>
    </RainbowKitProvider>
  </WagmiConfig>,
  document.getElementById('root')
);
