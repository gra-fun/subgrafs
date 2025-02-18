# Subgraph Project Documentation

## Overview
This project contains subgraphs for smart contracts organized into directories named by destination blockchain.
Each directory represents a separate subgraph project with similar functionality but different configurations.

The separation into different folders is necessary because:
1. Contract addresses are hardcoded in the subgraph code
2. There might be implementation differences for different blockchains

## Quick Start Guide

### Prerequisites
- [Node.js >= v18](https://nodejs.org/uk/download)
- [Yarn package manager](https://yarnpkg.com/)
- [Graph CLI](https://www.npmjs.com/package/@graphprotocol/graph-cli)

### Environment Setup
Install required global packages:
# Install Yarn globally
```bash
npm i -g yarn
```
# Install Graph CLI globally
```bash
yarn add -G @graphprotocol/graph-cli
```

### Project Setup and Deployment

1. Navigate to the desired network directory:
# For conflux-mainnet
```bash
cd conflux-mainnet
```

2. Install dependencies:
```bash
yarn
```

3. Generate contract schemas and types:
```bash
graph codegen
```

4. Build the project:
```bash
graph build
```

5. Deploy the subgraph:
   - First, authenticate with your subgraph space
   - Follow the deployment instructions from the official documentation: [The Graph Docs - Deploying](https://thegraph.com/docs/en/subgraphs/developing/deploying/using-subgraph-studio/#graph-auth)

### Additional Notes
- Make any necessary adjustments to the generated code before building
- Ensure you have the correct contract addresses configured for your target network
- Always test your subgraph thoroughly before deploying to mainnet
