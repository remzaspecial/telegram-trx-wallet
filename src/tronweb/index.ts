import { IKeyPair, ITransaction, ITronProviderOptions, IUserBalance } from './interfaces';
import fetch from 'node-fetch';
import getLogger from '../logger';
const bip39 = require('bip39');
import hdkey from 'hdkey';
import * as dotenv from 'dotenv';
dotenv.config();

const TronWeb = require('tronweb');
const logger = getLogger('TronProvider');

export class TronProvider {
  protected tronWeb: any;
  public CONTRACT: string = process.env.USDT_CONTRACT!;
  logger: any;
  constructor(options: ITronProviderOptions) {
    this.logger = logger;
    this.tronWeb = new TronWeb(options);
  }

  async configureContract() {
    try {
      await this.tronWeb.setAddress(this.CONTRACT);
      const { abi } = await this.tronWeb.trx.getContract(this.CONTRACT);
      return this.tronWeb.contract(abi.entrys, this.CONTRACT);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async generateDepositAddress(): Promise<IKeyPair> {
    this.logger.info('Creating deposit address on TRC20');
    try {
      // Generate a 12-word mnemonic phrase
      const mnemonic = await bip39.generateMnemonic();

      // Derive a private key from the mnemonic
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      const privateKey = root.derive("m/44'/195'/0'/0/0").privateKey.toString('hex');

      // Create a TRON address from the private key
      const address = this.tronWeb.address.fromPrivateKey(privateKey);

      return {
        address: address,
        privateKey: privateKey,
        phrase: mnemonic,
      } as IKeyPair;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async transfer(from: string, contract: string, mnemonic: string, to: string, amount: number) {
    this.logger.info(`Transfering USDT to address ${to} with amount ${amount}`);
    try {
      // Derive private key from mnemonic phrase
      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      const privateKey = root.derive("m/44'/195'/0'/0/0").privateKey.toString('hex');

      this.logger.warn(`Creating transaction on TRC20`);
      const options = {
        feeLimit: 100000000,
        callValue: 0,
      };
      const tx = await this.tronWeb.transactionBuilder.triggerSmartContract(
        contract,
        'transfer(address,uint256)',
        options,
        [
          {
            type: 'address',
            value: to,
          },
          {
            type: 'uint256',
            value: amount * 1000000,
          },
        ],
        this.tronWeb.address.toHex(from),
      );
      const signedTx = await this.tronWeb.trx.sign(tx.transaction, privateKey);
      const txHash = await this.tronWeb.trx.sendRawTransaction(signedTx);
      return txHash;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async transferTRX(privateKey: string, to: string, amount: number) {
    this.logger.info(`Transfering TRX to address ${to} with amount ${amount}`);
    try {
      return await this.tronWeb.trx.sendTransaction(to, amount * 1000000, privateKey);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async balancesByAddress(address: any): Promise<IUserBalance> {
    try {
      const trxBalance = await this.tronWeb.trx.getBalance(address);
      const usdtContract = await this.configureContract();
      const usdtBalance = await usdtContract.methods.balanceOf(address).call();
      const result: IUserBalance = {
        address: address,
        trxBalance: this.tronWeb.toDecimal(trxBalance) / 1000000,
        usdtBalance: this.tronWeb.toDecimal(usdtBalance) / 1000000,
      };
      return result;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async txListByAddress(address: string): Promise<ITransaction[]> {
    const result = await fetch(`${process.env.TRONGRID_URL}/v1/accounts/${address}/transactions/trc20`, {
      method: 'GET',
    }).then((response: any) => response.json());
    this.logger.debug(`Result: ${JSON.stringify(result.data)}`);
    return result.data.filter((tx: ITransaction) => tx.token_info.symbol === 'USDT');
  }
}
