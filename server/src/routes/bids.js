// require("dotenv").config();
// const express = require("express");
// const router = express.Router();
// const { ConsensusMessageSubmitTransaction, TopicId } = require("@hashgraph/sdk");
// const createClient = require("../hedera/hederaClient");

// router.post("/post-bid", async (req, res) => {
//   const { amount, price, walletId } = req.body;

//   if (!amount || !price || !walletId) {
//     return res.status(400).json({ error: "Missing fields" });
//   }

//   const client = createClient();
//   const message = JSON.stringify({ type: "bid", amount, price, walletId });

//   try {
//     const submit = await new ConsensusMessageSubmitTransaction()
//       .setMessage(message)
//       .setTopicId(TopicId.fromString(process.env.TOPIC_ID))
//       .execute(client);

//     const receipt = await submit.getReceipt(client);

//     res.json({ status: "success", sequenceNumber: receipt.sequenceNumber });
//   } catch (err) {
//     res.status(500).json({ error: "Submission failed", details: err.toString() });
//   }
// });

// module.exports = router;