import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider, createClient as createGraphqlClient } from 'urql';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { render } from 'preact';

import App from './App';
import CandidateProfile from './pages/CandidateProfile';
import CandidatesList from './pages/CandidatesList';
import Inbox from './pages/Inbox';
import MintProfile from './pages/MintProfile';
import NewProfile from './pages/NewProfile';
import ScrollToTop from './components/ScrollToTop';
import Welcome from './pages/Welcome';

const { chains, provider } = configureChains(
  [
    chain.hardhat,
    // chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum
  ],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'http://127.0.0.1:8545',
      }),
    }),
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
  url: '/subgraphs/name/talents-eth/candidate',
  requestPolicy: 'cache-and-network',
});

render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} showRecentTransactions>
      <Provider value={graphqlClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Welcome />} />
              <Route path="profile">
                <Route path="new" element={<NewProfile />} />
                <Route path="mint" element={<MintProfile />} />
                <Route
                  path=":contractAddress/:tokenId"
                  element={<CandidateProfile />}
                />
              </Route>
              <Route path="candidates" element={<CandidatesList />} />
              <Route path="inbox" element={<Inbox />} />
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
    </RainbowKitProvider>
  </WagmiConfig>,
  document.getElementById('root')
);
