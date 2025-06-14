import React from "react";

export default function BuyEnergy({
  bidAmount,
  setBidAmount,
  bidPrice,
  setBidPrice,
  submitBid,
}) {
  return (
    <div className="buy-energy">
      <h3>Buy Energy</h3>
      <input
        type="number"
        step="any"
        placeholder="Energy Amount (kWh)"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Price per kWh ($)"
        value={bidPrice}
        onChange={(e) => setBidPrice(e.target.value)}
        required
      />
      <button onClick={(e) => submitBid(e)}>Submit Bid</button>
    </div>
  );
}
