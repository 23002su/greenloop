const { Client, TopicMessageQuery } = require("@hashgraph/sdk");
require("dotenv").config();

async function main() {
  const client = Client.forTestnet();
  client.setOperator(
    process.env.HEDERA_ACCOUNT_ID,
    process.env.HEDERA_PRIVATE_KEY
  );

  new TopicMessageQuery()
    .setTopicId(process.env.TOPIC_ID)
    .subscribe(client, null, (message) => {
      const receivedMessage = Buffer.from(message.contents, "utf8").toString();
      console.log("📨 Received message:", receivedMessage);
    });
}

main().catch(console.error);
