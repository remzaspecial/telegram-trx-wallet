// eslint-disable-next-line
const dotenv = require('dotenv');
dotenv.config();

export default {
  BOT_TOKEN: String(process.env.BOT_TOKEN),
  USDT_CONTRACT: String(process.env.USDT_CONTRACT),
  TRON_FULL_HOST: String(process.env.TRON_FULL_HOST),
  TRON_FULL_NODE_URL: String(process.env.TRON_FULL_NODE_URL)
};
