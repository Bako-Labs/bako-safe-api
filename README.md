# Bako Safe API

This repository contains the core logic for the Bako Safe multisignature wallet. It includes various packages and services that form the backbone of the Bako ecosystem, enabling secure and efficient management of multisig wallets.

## Directory Structure
Within the packages folder, you will find the following subdirectories:
- **[API](https://github.com/Bako-Labs/bako-safe-api/tree/main/packages/api):** Provides a REST API to facilitate communication within the Bako ecosystem.
- **[Gateway](https://github.com/Bako-Labs/bako-safe-api/tree/main/packages/gateway):** A GraphQL gateway that provides a single point of entry for all queries and mutations. More details can be found in the [Gateway Overview](https://bsafe-sdk-xqhdv7btu-infinity-base.vercel.app/gateway/overview).
- **[Socket Server](https://github.com/Bako-Labs/bako-safe-api/tree/main/packages/socket-server):** Enables real-time communication between decentralized applications (dApps) and the Bako ecosystem.

## Development
1. Install [Docker](https://docs.docker.com/engine/install/)
2. Install [PNPM](https://pnpm.io/installation#using-npm): `npm install -g pnpm`
3. Install dependencies: `pnpm install`
4. Run the chain: `cd packages/chain && pnpm chain:dev:start`
5. Run the database: `cd packages/database && pnpm db:dev:start`
6. Run the api in the root folder: `pnpm dev`

## Tests
1. Install [Docker](https://docs.docker.com/engine/install/)
2. Install [PNPM](https://pnpm.io/installation#using-npm): `npm install -g pnpm`
3. Install dependencies: `pnpm install`
4. Run the chain: `cd packages/chain && pnpm chain:dev:start`
5. Run the database: `cd packages/database && pnpm db:dev:start`
6. Run the api in the root folder: `pnpm dev`
7. In new terminal, run the tests: `cd packages/api && pnpm test`
