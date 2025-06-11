const { Client, TopicCreateTransaction, AccountId } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const client = Client.forTestnet();
  client.setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    process.env.HEDERA_PRIVATE_KEY
  );

  try {
    const transaction = await new TopicCreateTransaction()
      .setNodeAccountIds([AccountId.fromString("0.0.3")])
      .setTransactionValidDuration(180)
      .execute(client);

    const receipt = await transaction.getReceipt(client);
    console.log("✅ Your new TOPIC_ID is:", receipt.topicId.toString());
  } catch (error) {
    console.error("Error creating topic:", error);
  }
}

main();
