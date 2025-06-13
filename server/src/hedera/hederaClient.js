// src/hedera/hederaClient.js
require("dotenv").config();
const { Client, PrivateKey, AccountId } = require("@hashgraph/sdk");

function createClient() {
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const privateKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
  const client = Client.forTestnet();
  client.setOperator(accountId, privateKey);
  return client;
}

module.exports = createClient;
