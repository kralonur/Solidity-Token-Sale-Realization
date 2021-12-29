# Solidity Token Sale Realization

This contract provides platform for selling and trading erc token.

Notes:

During development some choices made by purpose, like:
Instead of Ownable , AccessControl could be used , but this contract focuses on Marketplace, and for marketplace Ownable was enough.

Some functions on the contract could be divided into smaller functions if necessary.

Logic of the contract could be changed if necessary (like): instead of creating trade round after sale rounds ends, it can be created and started after sale rounds end etc etc. 
## Development

The contract is written with solidity.

Hardhat development environment being used to write this contract.

The test coverage is %100 (result from solidity-coverage).

The contract size is checked and it's under limits.

For linting solhint and prettier is being used.

Contract could be deployed to rinkeby testnet using infura api key and wallet private key.
Environment file has to be created to use test network and contract validation. (.env.example file contains example template)

Scripts folder contains the script for contract deployment.

For the easier contract interaction, hardhat tasks are created.
To see the list of tasks, write `npx hardhat` to the terminal.