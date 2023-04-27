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
        this.bot.start(async (ctx) => {
            const keyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Generate new TRON address',
                                callback_data: 'generate',
                            },
                            {
                                text: 'Check TRX and USDT balance',
                                callback_data: 'balance',
                            },
                        ]
                    ],
                },
            };
            const message = `Welcome to WalletBot!\n\nPlease select an option from the list below to continue:`;
            await ctx.reply(message, keyboard);
        });
        this.bot.help((ctx) => ctx.reply('List of methods comming soon!'));
        this.bot.action('generate', async (ctx) => {
            const keyPair = await this.generateKeyPair();
            ctx.reply(`***Your address:*** \n${keyPair.address} \n***Mnemonic:*** \n${keyPair.phrase} \n***Private Key:*** \n${keyPair.privateKey}`, { parse_mode: 'MarkdownV2' });
        });
        this.bot.action('balance', async (ctx) => {
            ctx.reply('Please enter your TRON address:');
            // ждем ответа от пользователя
            this.bot.hears(/^T[a-zA-Z0-9]{33}$/, async (ctx) => {
                const address = ctx.message.text;
                const balance = await this.getBalance(address);
                ctx.reply(`Your TRX balance: ${balance.trxBalance} and your USDT balance: ${balance.usdtBalance}`);
            });
        });
        this.bot.launch();
    }
}