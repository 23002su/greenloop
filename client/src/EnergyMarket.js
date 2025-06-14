import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBolt, FaDollarSign, FaMapMarkerAlt, FaPlus, FaUserCircle, FaRegStar, FaShoppingCart, FaRegClock } from "react-icons/fa";
import { MdOutlineGridOn, MdOutlineMessage } from "react-icons/md";
import './EnergyMarket.css';

const EnergyMarket = () => {
  const [messages, setMessages] = useState([]);
  const [bidAmount, setBidAmount] = useState("");
  const [bidPrice, setBidPrice] = useState("");
  const [askAmount, setAskAmount] = useState("");
  const [askPrice, setAskPrice] = useState("");
  const [walletId, setWalletId] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("offers");

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
          <pre style={{ backgroundColor: "#f0f0f0", padding: "8px", borderRadius: "4px", overflowX: "auto" }}>
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

  // Tab content components
  const OffersTab = () => (
    <section>
      <div className="energy-messages-list">
        {loading ? (
          <p>Loading messages...</p>
        ) : (
          messages.length === 0 ? (
            <div>No messages found.</div>
          ) : (
            messages.map((msg, idx) => {
              // Try to parse the message as JSON, fallback to plain text
              let data = {};
              try {
                data = JSON.parse(atob(msg.message));
              } catch {
                data = { company: "Unknown", location: "-", amount: "-", price: "-", time: "-" };
              }
              // Fallbacks for missing fields
              const company = data.company || "Energy Provider";
              const location = data.location || "Unknown";
              const amount = data.amount || "-";
              const price = data.price || "-";
              const time = msg.consensus_timestamp ? new Date(Number(msg.consensus_timestamp.split(".")[0]) * 1000).toLocaleTimeString() : "-";
              const total = (parseFloat(amount) * parseFloat(price)).toFixed(2);
              const rating = data.rating || 4.8;
              return (
                <div className="energy-message-card" key={msg.consensus_timestamp || idx}>
                  <div className="energy-message-card__header">
                    <span className="energy-message-card__title">{company}</span>
                    <span className="energy-message-card__rating"><FaRegStar /> {rating}</span>
                  </div>
                  <div className="energy-message-card__body">
                    <div className="energy-message-card__row">
                      <span className="energy-message-card__location"><FaMapMarkerAlt /> {location}</span>
                    </div>
                    <div className="energy-message-card__row" style={{justifyContent: 'space-between'}}>
                      <span className="energy-message-card__energy"><FaBolt />{amount}<span className="energy-message-card__label">kWh Available</span></span>
                      <span className="energy-message-card__price"><FaDollarSign />{parseFloat(price).toFixed(3)}<span className="energy-message-card__label">per kWh</span></span>
                    </div>
                    <div className="energy-message-card__row" style={{justifyContent: 'space-between'}}>
                      <span className="energy-message-card__time"><FaRegClock />{time}</span>
                      <span className="energy-message-card__total">Total: <span style={{color:'#338a36'}}>${isNaN(total) ? '-' : total}</span></span>
                    </div>
                    <button className="energy-message-card__button"><FaShoppingCart /> Purchase Energy</button>
                  </div>
                </div>
              );
            })
          )
        )}
      </div>
    </section>
  );

  const BuyTab = () => (
    <section className="energy-card energy-card--tab">
      <div className="energy-card__header">
        <div className="energy-card__title">Buy Energy</div>
        <div className="energy-card__subtitle">Submit a bid to buy energy</div>
      </div>
      <form className="energy-form" onSubmit={submitBid}>
        <div className="energy-form__input-wrapper">
          <FaUserCircle className="energy-form__input-icon" />
          <input
            className="energy-form__input"
            type="text"
            placeholder="Enter your wallet ID (e.g. 0.0.5915104)"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            required
          />
        </div>
        <div className="energy-form__input-group">
          <div className="energy-form__input-wrapper">
            <FaBolt className="energy-form__input-icon" />
            <input
              className="energy-form__input"
              type="number"
              placeholder="Amount (e.g. 5 kWh)"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              required
            />
          </div>
          <div className="energy-form__input-wrapper">
            <FaDollarSign className="energy-form__input-icon" />
            <input
              className="energy-form__input"
              type="number"
              step="any"
              placeholder="Price per kWh (€)"
              value={bidPrice}
              onChange={(e) => setBidPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="energy-form__button">
          <FaPlus /> Submit Bid
        </button>
      </form>
    </section>
  );

  const SellTab = () => (
    <section className="energy-card energy-card--tab">
      <div className="energy-card__header">
        <div className="energy-card__title">Sell Your Solar Energy</div>
        <div className="energy-card__subtitle">List your excess solar energy for sale</div>
      </div>
      <form className="energy-form" onSubmit={submitAsk}>
        <div className="energy-form__input-wrapper">
          <FaUserCircle className="energy-form__input-icon" />
          <input
            className="energy-form__input"
            type="text"
            placeholder="Enter your wallet ID (e.g. 0.0.5915104)"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value)}
            required
          />
        </div>
        <div className="energy-form__input-group">
          <div className="energy-form__input-wrapper">
            <FaBolt className="energy-form__input-icon" />
            <input
              className="energy-form__input"
              type="number"
              placeholder="Amount (e.g. 5 kWh)"
              value={askAmount}
              onChange={(e) => setAskAmount(e.target.value)}
              required
            />
          </div>
          <div className="energy-form__input-wrapper">
            <FaDollarSign className="energy-form__input-icon" />
            <input
              className="energy-form__input"
              type="number"
              step="any"
              placeholder="Price per kWh (€)"
              value={askPrice}
              onChange={(e) => setAskPrice(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="energy-form__button">
          <FaPlus /> Submit Ask
        </button>
      </form>
    </section>
  );

  return (
    <div className="energy-page">
      <nav className="energy-navbar">
        <div className="energy-navbar__logo1">
        <div className="energy-navbar__logo">
          <FaBolt className="energy-navbar__logo-icon" />
          </div>
          <span className="energy-navbar__logo-text">SolarTrade</span>
        </div>
        <div className="energy-navbar__tabs">
          <button className={`energy-navbar__tab${activeTab === "offers" ? " energy-navbar__tab--active" : ""}`} onClick={() => setActiveTab("offers")}>Offers</button>
          <button className={`energy-navbar__tab${activeTab === "sell" ? " energy-navbar__tab--active" : ""}`} onClick={() => setActiveTab("sell")}>Sell</button>
          <button className={`energy-navbar__tab${activeTab === "buy" ? " energy-navbar__tab--active" : ""}`} onClick={() => setActiveTab("buy")}>Buy</button>
        </div>
        <div className="energy-navbar__user">
          <FaUserCircle className="energy-navbar__user-icon" />
          <span className="energy-navbar__user-name">John Solar</span>
        </div>
      </nav>
      <div className="energy-tabs-content">
        {activeTab === "offers" && <OffersTab />}
        {activeTab === "buy" && <BuyTab />}
        {activeTab === "sell" && <SellTab />}
      </div>
      <div className="energy-benefits-card">
        <div className="energy-benefit">
          <FaDollarSign className="energy-benefit__icon" />
          <div className="energy-benefit__title">Earn Revenue</div>
          <div className="energy-benefit__desc">Monetize your excess solar production</div>
        </div>
        <div className="energy-benefit">
          <FaBolt className="energy-benefit__icon" />
          <div className="energy-benefit__title">Reduce Waste</div>
          <div className="energy-benefit__desc">Don't let surplus energy go unused</div>
        </div>
        <div className="energy-benefit">
          <MdOutlineGridOn className="energy-benefit__icon" />
          <div className="energy-benefit__title">Support Grid</div>
          <div className="energy-benefit__desc">Help stabilize local energy supply</div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMarket;
