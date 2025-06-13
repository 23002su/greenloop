import React, { useEffect, useState } from "react";
import axios from "axios";

const EnergyMarket = () => {
  const [messages, setMessages] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [askPrice, setAskPrice] = useState("");
  const [walletId, setWalletId] = useState(""); // New state for walletId
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/messages");
      setMessages(res.data.messages || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages", err);
      setLoading(false);
    }
  };

  const submitBid = async (e) => {
    e.preventDefault();
    if (!walletId) {
      alert("Please enter your wallet ID");
      return;
    }
    try {
      await axios.post("/api/post-bid", {
        amount: bidAmount,
        price: bidPrice,
        walletId,
      });
      alert("Bid submitted!");
      setBidAmount("");
      setBidPrice("");
      fetchMessages();
    } catch (err) {
      alert("Error submitting bid");
      console.error(err);
    }
  };

  const submitAsk = async (e) => {
    e.preventDefault();
    if (!walletId) {
      alert("Please enter your wallet ID");
      return;
    }
    try {
      await axios.post("/api/post-ask", {
        amount: askAmount,
        price: askPrice,
        walletId,
      });
      alert("Ask submitted!");
      setAskAmount("");
      setAskPrice("");
      fetchMessages();
    } catch (err) {
      alert("Error submitting ask");
      console.error(err);
    }
  };

  // Helper to decode base64 and parse JSON if possible
  const decodeMessage = (base64Str) => {
    try {
      const decoded = atob(base64Str); // base64 decode
      try {
        // Try to parse JSON
        const json = JSON.parse(decoded);
        // Pretty-print JSON with indentation
        return (
          <pre
            style={{
              backgroundColor: "#f0f0f0",
              padding: "8px",
              borderRadius: "4px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(json, null, 2)}
          </pre>
        );
      } catch {
        // Not JSON, return plain decoded text
        return <span>{decoded}</span>;
      }
    } catch {
      return <span style={{ color: "red" }}>Invalid base64 message</span>;
    }
  };

  return (
    <div
      style={{ maxWidth: 600, margin: "auto", fontFamily: "Arial, sans-serif" }}
    >
      <h2>Energy Market - Hedera HCS</h2>

      <section style={{ marginBottom: 20 }}>
        <h3>Wallet ID</h3>
        <input
          type="text"
          placeholder="Enter your wallet ID (e.g. 0.0.5915104)"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Submit a Bid</h3>
        <form onSubmit={submitBid}>
          <input
            type="number"
            step="any"
            placeholder="Amount (e.g. 5 kWh)"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Price per kWh (€)"
            value={bidPrice}
            onChange={(e) => setBidPrice(e.target.value)}
            required
          />
          <button type="submit">Submit Bid</button>
        </form>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>Submit an Ask</h3>
        <form onSubmit={submitAsk}>
          <input
            type="number"
            step="any"
            placeholder="Amount (e.g. 5 kWh)"
            value={askAmount}
            onChange={(e) => setAskAmount(e.target.value)}
            required
          />
          <input
            type="number"
            step="any"
            placeholder="Price per kWh (€)"
            value={askPrice}
            onChange={(e) => setAskPrice(e.target.value)}
            required
          />
          <button type="submit">Submit Ask</button>
        </form>
      </section>

      <section>
        <h3>Market Messages</h3>
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {messages.length === 0 && <li>No messages found.</li>}
            {messages.map((msg) => (
              <li
                key={msg.consensus_timestamp}
                style={{
                  marginBottom: 20,
                  borderBottom: "1px solid #ddd",
                  paddingBottom: 10,
                }}
              >
                <strong>Time:</strong>{" "}
                {new Date(
                  Number(msg.consensus_timestamp.split(".")[0]) * 1000
                ).toLocaleString()}
                <br />
                <strong>Message (decoded):</strong>
                <div>{decodeMessage(msg.message)}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EnergyMarket;
