# talents-eth

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
