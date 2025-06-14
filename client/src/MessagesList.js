import React from "react";

export default function MessagesList({ messages, loading, decodeMessage }) {
  return (
    <section>
      <h3>Market Transactions</h3>
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
              <strong>Message (decoded):</strong> {decodeMessage(msg.message)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
