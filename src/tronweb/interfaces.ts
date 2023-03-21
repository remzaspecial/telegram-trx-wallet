export interface ITronProviderOptions {
    fullHost: string;
    fullNodeURL?: string;
    solidityNodeURL?: string;
    eventNodeURL?: string;
    privateKey?: string;
    apiKey?: string;
  }
  
  export interface IUserBalance {
    address: string;
    trxBalance: number;
    usdtBalance: number;
  }
  
  export interface IWallet {
    address: string;
    privateKey: string;
  }
  
  export interface IKeyPair {
    address: string;
    privateKey: string;
  }
  
  export interface ITokenInfo {
    symbol: string;
    address: string;
    decimals: string;
    name: string;
  }
  
  export interface ITransaction {
    transaction_id: string;
    token_info: ITokenInfo;
    block_timestamp: string;
    from: string;
    to: string;
    type: string;
    value: string;
  }