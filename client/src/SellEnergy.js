import React from "react";

export default function SellEnergy({
  askAmount,
  setAskAmount,
  askPrice,
  setAskPrice,
  location,
  setLocation,
  submitAsk,
}) {
  return (
    <div className="sell-energy">
      <h3>Sell Your Solar Energy</h3>
      <input
        type="number"
        step="any"
        placeholder="Energy Amount (kWh)"
        value={askAmount}
        onChange={(e) => setAskAmount(e.target.value)}
        required
      />
      <input
        type="number"
        step="any"
        placeholder="Price per kWh ($)"
        value={askPrice}
        onChange={(e) => setAskPrice(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location (e.g. San Francisco, CA)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <button onClick={(e) => submitAsk(e)}>Create Energy Offer</button>
    </div>
  );
}
