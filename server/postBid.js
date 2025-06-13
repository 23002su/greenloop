require("dotenv").config();
const {
  Client,
  ContractExecuteTransaction,
  Hbar,
  AccountId,
  PrivateKey,
  ContractFunctionParameters,
} = require("@hashgraph/sdk");

async function postBid(qty, price) {
  const client = Client.forTestnet();
  client.setOperator(
    AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
    PrivateKey.fromString(process.env.HEDERA_OPERATOR_KEY)
  );

  const txn = await new ContractExecuteTransaction()
    .setContractId(process.env.CONTRACT_ID)
    .setGas(100000)
    .setFunction(
      "postBid",
      new ContractFunctionParameters().addUint256(qty).addUint256(price)
    )
    .execute(client);

  const receipt = await txn.getReceipt(client);
  console.log("📨 Bid posted - Status:", receipt.status.toString());
}

postBid(1000, 300); // 1000MB at 300 tinybars/MB
