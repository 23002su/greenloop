const { Client, TopicMessageSubmitTransaction } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const client = Client.forTestnet();
  client.setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    process.env.HEDERA_PRIVATE_KEY
  );

  const message = "Hello from the unused data marketplace!";
  const topicId = process.env.TOPIC_ID;

  const sendResponse = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);

  const receipt = await sendResponse.getReceipt(client);
  console.log("✅ Message sent! Status:", receipt.status.toString());
}

main().catch(console.error);
