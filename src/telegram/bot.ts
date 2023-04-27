// create class WalletBot that uses the ../tronweb/index.ts class methods
import { Telegraf } from "telegraf";
import { TronProvider } from "../tronweb";
import config from "../config/config";

export class WalletBot {
    private tronProvider: any;
    public bot: Telegraf;
    constructor() {
        this.tronProvider = new TronProvider({
        fullHost: config.TRON_FULL_HOST || 'https://api.nileex.io',
        fullNodeURL: config.TRON_FULL_NODE_URL || 'https://api.nileex.io',
        });
        this.bot = new Telegraf(config.BOT_TOKEN);
    }

    async generateKeyPair() {
        try {
            const keyPair = await this.tronProvider.generateDepositAddress();
            return keyPair;
        } catch (e: any){
            throw new Error(e)
        }
    }

    async transferTRX(privateKey: string, to: string, amount: number) {
        try {
            const result = await this.tronProvider.transferTRX(privateKey, to, amount);
            return result;
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async transfer(from: string, contract: string, privateKey: string, to: string, amount: number) {
        try {
            const result = await this.tronProvider.transfer(from, contract, privateKey, to, amount);
            return result;
        } catch (e: any) {
            throw new Error(e);
        }
    }

    async getBalance(address: string) {
        try {
            const result = await this.tronProvider.balancesByAddress(address);
            return result;
        } catch (e: any) {
            throw new Error(e);
        }
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