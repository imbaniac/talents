# talents-eth

## Sponsors

Implented:

- Polygon: Smart contracts are deployed on Mumbai Polygon network (testnet) — for scalability and lower fees.
- TheGraph: Self-hosted graph with IPFS and full-text search features.
- Worldcoin: To create a Candidate NFT, you need to prove that you're real human and forces to have only one account.
- IPFS/Filecoin: NFT metadata is stored on IPFS network, pinned by NFT.storage.
- XMTP: Communication between candidate and employer

- EPNS: to send notification about new proposal
- Sizmo: Badges for my Candidate NFT, loading existing NFTs from API (polygon and mainnet)
- QuickNode: for RPC on frontend site for Mainner Ethereum network

Need to do:

- AURORA: deploy and test
- Cronos: deploy
- Skale. Launch Dapp to share reward. (20k)
- ENS: to use domains in change of addresses when possible

Worth trying (in priority order):

- Livepeer (start Livepeer call for interview)
- Unlock. For companies account.
- Spruce for login.
- Abacus
- Tableland. To store, update and fetch metadata instead of IPFS and TheGraph
- Unstoppable login
- Superfluid. To pay for test tasks. (20k)

#### Worldcoin

**Use case:**
For Anonymous Talent Pool to be usefull, each Candidate should be a real person.
Thanks to Worldcoin, Employer can be sure that he communicate with real person with only one profile.

**Depth of the integration:**
For hackathon I used onchain integration on staging environment.
Smart contract implementation: `/packages/hardhat/contracts/Candidate.sol`
Front-end implementation: `/packages/frontend/src/pages/MintProfile.jsx`

**Future posibilities:**

- Candidates and Employers at our platform could be a good fit for being Orb Operators — after building a track record of successfull hires and employements. And this will help to onboard new people to Talents.

**What can be improved:**

- Please, fix React widget — it changes fonts for the whole application.
- Sign out from mobile app.
- Improve availability of Worldcoin Simulator.

### TheGraph

Unfortunately I can't deploy my subgraph, as it's using IPFS and full-text search features. And my protocol isn't useful without this features. Subgraph for Talents propocol could be used to query Candidates by required parameters and use for statistics, HRs etc.

**Issues**

- ipfs.cat returns null from time to time (needs time to appear on network). And it breaks subgraph.
- `graph build` deletes startBlock attribute from .yaml cofig

### XMTP

**Issues**

- XMTP uses checksumed Ethereum addresses and considers lowercased as different one. It shouldn't be a case, as it's the same address.

### EPNS

**Issues**

- On dashboard it's not possible to change channel info or to use same Alias Address twice
- Incorrect number of subscribers on Admin Dashboard

### How to run

```
yarn chain
yarn deploy
yarn run-graph-node
yarn graph-create-local
yarn graph-ship-local
```

Each time you stop hardhat node, state is lost => you'll need:

- Reset Metamask wallet (to reset nonce)
- Clearn graph-node

### Issue with --network localhost

Go to /etc/hosts and comment out this line

```
::1             localhost
```

### To setup UCAN for NFT-Storage

```
    <!-- If you don't have PK -->
    yarn ucan-keypair-new
    <!-- Reads UCAN_PK variable from .env -->
    yarn ucan-keypair-from

    <!-- Save DID and PUB_KEY to .env or elsewhere to use later -->

    <!-- Register your DID in NFT.Storage -->
    curl -X POST -H "Authorization: Bearer $NFT_STORAGE_KEY" -H 'Content-Type: application/json' --data "{\"did\": \"$DID\"}"
```

- Generate main DID token and save it
  - Generate new PK if no in .env
  - Request all data from PK
- Register API KEY
- Get ROOT token
-

### The graph

Run $CHAIN={your_chain_name} yarn create-config
