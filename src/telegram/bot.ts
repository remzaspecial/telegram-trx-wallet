// create class WalletBot that uses the ../tronweb/index.ts class methods
import { Telegraf } from "telegraf";
import { TronProvider } from "../tronweb";
import * as dotenv from 'dotenv';
dotenv.config();

export class WalletBot {
    private tronProvider: any;
    public bot: Telegraf;
    constructor() {
        this.tronProvider = new TronProvider({
        fullHost: process.env.TRON_FULL_HOST! || 'https://api.nileex.io',
        fullNodeURL: process.env.TRON_FULL_NODE_URL! || 'https://api.nileex.io',
        });
        this.bot = new Telegraf('6113184450:AAGcjnSRnnpR8T0d3Uk3jhzP4SCe-7a_TzQ');
    }

    async generateKeyPair() {
        const keyPair = await this.tronProvider.generateDepositAddress();
        return keyPair;
    }

    async transferTRX(privateKey: string, to: string, amount: number) {
        const result = await this.tronProvider.transferTRX(privateKey, to, amount);
        return result;
    }

    async transfer(from: string, contract: string, privateKey: string, to: string, amount: number) {
        const result = await this.tronProvider.transfer(from, contract, privateKey, to, amount);
        return result;
    }

    async getBalance(address: string) {
        const result = await this.tronProvider.balancesByAddress(address);
        return result;
    }

    async start() {
        this.bot.start((ctx) => ctx.reply('Welcome to WalletBot!'));
        this.bot.help((ctx) => ctx.reply('List of methods comming soon!'));
        this.bot.command('generate', async (ctx) => {
            const keyPair = await this.generateKeyPair();
            ctx.reply(`Your address: ${keyPair.address} and your private key: ${keyPair.privateKey}`);
        });
        this.bot.command('balance', async (ctx) => {
            const address = ctx.message.text.split(' ')[1];
            const balance = await this.getBalance(address);
            ctx.reply(`Your TRX balance: ${balance.trxBalance} and your USDT balance: ${balance.usdtBalance}`);
        });
        this.bot.command('transferTRX', async (ctx) => {
            const params = ctx.message.text.split(' ');
            const privateKey = params[1];
            const to = params[2];
            const amount = params[3];
            const result = await this.transferTRX(privateKey, to, Number(amount));
            ctx.reply(`Transaction hash: ${result.txid}`);
        });

        this.bot.command('transfer', async (ctx) => {
            const params = ctx.message.text.split(' ');
            const from = params[1];
            const contract = params[2];
            const privateKey = params[3];
            const to = params[4];
            const amount = params[5];
            const result = await this.transfer(from, contract, privateKey, to, Number(amount));
            ctx.reply(`Transaction hash: ${result.txid}`);
        });
        this.bot.launch();
    }
}