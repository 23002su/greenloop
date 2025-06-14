// // src/routes/messages.js
// const express = require("express");
// const router = express.Router();
// // const fetch = require("node-fetch"); 
// let fetch;
// (async () => {
//   fetch = (await import('node-fetch')).default;
// })();

// router.get("/messages", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://testnet.mirrornode.hedera.com/api/v1/topics/${process.env.TOPIC_ID}/messages`
//     );
//     const messages = await response.json();
//     res.json(messages);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Fetching messages failed", details: err.toString() });
//   }
// });

// module.exports = router;