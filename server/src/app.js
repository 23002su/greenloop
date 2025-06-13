// src/app.js
const express = require("express");
const cors = require("cors");

const bidsRouter = require("./routes/bids");
const asksRouter = require("./routes/asks");
const messagesRouter = require("./routes/messages");

const app = express();
app.use(cors()); // allow requests from your React frontend
app.use(express.json()); // parse application/json

// routes
app.use("/api", bidsRouter);
app.use("/api", asksRouter);
app.use("/api", messagesRouter);

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
