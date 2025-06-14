import React from "react";

export default function WalletIdInput({ walletId, setWalletId }) {
  return (
    <section style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Enter your wallet ID (e.g. 0.0.5915104)"
        value={walletId}
        onChange={(e) => setWalletId(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
        required
      />
    </section>
  );
}
