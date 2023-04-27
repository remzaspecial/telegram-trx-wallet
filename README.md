# Telegram TRX Wallet

Telegram TRX Wallet is a Telegram bot that enables you to manage your TRON cryptocurrency from within the Telegram app. The bot provides basic wallet functionalities such as generating new addresses, checking your TRX and USDT balances, and transferring TRX to other addresses.

## Installation

To use the Telegram TRX Wallet, you need to have the Telegram app installed on your device. Once you have the app, follow these steps:

1. Clone this repository.
2. Install the required dependencies by running `npm install`.
3. Rename `.env.example` to `.env` and update the environment variables with your values.
4. Run the bot using `npm start`.

***Btw you need to change TRON_FULL_HOST and TRON_FULL_NODE_URL***
***in .env to mainnet, to check mainnet balances***

## Features

The Telegram TRX Wallet currently supports the following features:

- Generating new TRON addresses
- Checking your TRX and USDT balances
- Transferring TRX to other addresses

## Usage

To use the Telegram TRX Wallet, follow these steps:

1. Open the Telegram app and search for the bot using the username `@<your_bot_name>`.
2. Start the bot by sending the `/start` command.
3. Select an option from the list to continue. You can generate a new TRON address or check your TRX and USDT balances.
4. If you select the option to check your balances, the bot will ask you to enter your TRON address. Enter your TRON address to check your balances.
5. If you select the option to generate a new address, the bot will generate a new TRON address for you and display the address, mnemonic phrase, and private key.

## Dependencies

The Telegram TRX Wallet is built using the following dependencies:

- `bip39`: Used for generating mnemonic phrases for new addresses.
- `tronweb`: Used for interacting with the TRON blockchain.
- `telegraf`: Used for building the Telegram bot.
- `dotenv`: Used for loading environment variables.
- `typescript`: Used for type checking and compiling the code.
- `node-fetch`: Used for making HTTP requests to the TRON API.

## License

This project is licensed under the terms of the MIT license.