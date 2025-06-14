// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import fetch from "node-fetch";
// import {
//   Client,
//   TopicMessageSubmitTransaction,
//   AccountId,
//   PrivateKey,
// } from "@hashgraph/sdk";

// const app = express();
// app.use(express.json());

// const client = Client.forTestnet();
// client.setOperator(
//   AccountId.fromString(process.env.HEDERA_ACCOUNT_ID),
//   PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
// );
// const topicId = process.env.TOPIC_ID;

// // Endpoint générique pour publier un message (optionnel)
// app.post("/api/publish", async (req, res) => {
//   try {
//     const { type, data, price, walletId } = req.body;

//     const message = {
//       type,
//       data,
//       price,
//       walletId,
//       timestamp: new Date().toISOString(),
//     };

//     const tx = await new TopicMessageSubmitTransaction()
//       .setTopicId(topicId)
//       .setMessage(JSON.stringify(message))
//       .execute(client);

//     const receipt = await tx.getReceipt(client);
//     console.log("Message publié:", message);

//     res.json({
//       status: receipt.status.toString(),
//       message,
//     });
//   } catch (err) {
//     console.error("Erreur:", err);
//     res.status(500).json({ error: "Échec de publication" });
//   }
// });

// // Endpoint POST /api/post-bid
// app.post("/api/post-bid", async (req, res) => {
//   try {
//     const { amount, price, walletId } = req.body;

//     if (!amount || !price || !walletId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const message = {
//       type: "bid",
//       amount,
//       price,
//       walletId,
//       timestamp: new Date().toISOString(),
//     };

//     const tx = await new TopicMessageSubmitTransaction()
//       .setTopicId(topicId)
//       .setMessage(JSON.stringify(message))
//       .execute(client);

//     const receipt = await tx.getReceipt(client);
//     console.log("Bid publié:", message);

//     res.json({
//       status: receipt.status.toString(),
//       message,
//     });
//   } catch (err) {
//     console.error("Erreur publication bid:", err);
//     res.status(500).json({ error: "Échec de publication bid" });
//   }
// });

// // Endpoint POST /api/post-ask
// app.post("/api/post-ask", async (req, res) => {
//   try {
//     const { amount, price, walletId } = req.body;

//     if (!amount || !price || !walletId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const message = {
//       type: "ask",
//       amount,
//       price,
//       walletId,
//       timestamp: new Date().toISOString(),
//     };

//     const tx = await new TopicMessageSubmitTransaction()
//       .setTopicId(topicId)
//       .setMessage(JSON.stringify(message))
//       .execute(client);

//     const receipt = await tx.getReceipt(client);
//     console.log("Ask publié:", message);

//     res.json({
//       status: receipt.status.toString(),
//       message,
//     });
//   } catch (err) {
//     console.error("Erreur publication ask:", err);
//     res.status(500).json({ error: "Échec de publication ask" });
//   }
// });

// // GET messages (renvoie les messages déjà décodés JSON)
// app.get("/api/messages", async (req, res) => {
//   try {
//     console.log("Fetch messages from mirror node for topic:", topicId);

//     const response = await fetch(
//       `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`
//     );

//     if (!response.ok) {
//       throw new Error(`Mirror node responded with status ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Data received from mirror node:", data);

//     if (!data.messages) {
//       throw new Error("No messages found in response");
//     }

//     // Pour chaque message, on décode le base64 et parse JSON, mais on garde aussi consensus_timestamp
//     const messages = data.messages.map((msg) => ({
//       consensus_timestamp: msg.consensus_timestamp,
//       message: JSON.parse(Buffer.from(msg.message, "base64").toString()),
//     }));

//     res.json({ messages });
//   } catch (err) {
//     console.error("Erreur lecture messages:", err);
//     res.status(500).json({ error: "Échec récupération", details: err.message });
//   }
// });

// app.listen(5000, () => {
//   console.log("Backend démarré : http://localhost:5000");
// });