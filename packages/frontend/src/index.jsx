import './index.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { WagmiConfig, chain, configureChains, createClient } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { render } from 'preact';
import App from './App';
import NewProfile from './components/NewProfile';
import Welcome from './components/Welcome';

const { chains, provider } = configureChains(
  [chain.hardhat, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
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

render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Welcome />} />
            <Route path="profile/new" element={<NewProfile />} />
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
    </RainbowKitProvider>
  </WagmiConfig>,
  document.getElementById('root')
);
