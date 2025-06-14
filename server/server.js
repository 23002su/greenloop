const express = require('express');
const cors = require('cors');
const {
  Client,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  PrivateKey
} = require('@hashgraph/sdk');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ===== Stockage en mémoire =====
let bids = [];
let asks = [];

// ===== Hedera SDK Init =====
const operatorId = process.env.HEDERA_ACCOUNT_ID;
const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
const topicId = process.env.TOPIC_ID;
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

// ===== Envoi vers HCS =====
async function sendToHCS(type, data) {
  const message = JSON.stringify({ type, ...data });

  try {
    const tx = await new TopicMessageSubmitTransaction({
      topicId,
      message,
    }).execute(client);
    await tx.getReceipt(client);
    console.log(`📤 Message sent to HCS:`, message);
  } catch (err) {
    console.error('❌ Failed to send message to HCS:', err);
  }
}

// ===== Synchronisation depuis HCS =====
async function syncFromHCS() {
  console.log('📥 Syncing from HCS...');
  bids = [];
  asks = [];

  try {
    await new TopicMessageQuery()
      .setTopicId(topicId)
      .setStartTime(0)
      .subscribe(client, null, (message) => {
        const raw = Buffer.from(message.contents, 'utf8').toString();

        try {
          const json = JSON.parse(raw);

          // Conversion des timestamps en Date
          if (json.timestamp && typeof json.timestamp === 'string') {
            json.timestamp = new Date(json.timestamp);
          }
          if (json.expirationDate && typeof json.expirationDate === 'string') {
            json.expirationDate = new Date(json.expirationDate);
          }

          if (json.type === 'bid') {
            bids.push(json);
          } else if (json.type === 'ask') {
            asks.push(json);
          } else if (json.type === 'offer') {
            // Gestion spécifique si besoin
            console.log('🟡 Offer message received:', json);
          } else {
            console.log('📎 Ignored non-offer message:', json);
          }
        } catch (err) {
          console.log('⚠️ Ignored non-JSON message:', raw);
        }
      }, (err) => {
        console.error("❌ Error during HCS sync:", err);
      });
  } catch (e) {
    console.error("❌ Failed to query topic:", e);
  }
}

// ===== Trie les offres par date décroissante =====
function sortOffersByDateDesc(arr) {
  return arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// ===== POST BID =====
app.post('/api/post-bid', async (req, res) => {
  const { amount, price, expirationDate } = req.body;

  if (
    amount == null ||
    price == null ||
    !expirationDate ||
    isNaN(amount) ||
    isNaN(price) ||
    isNaN(Date.parse(expirationDate))
  ) {
    return res.status(400).json({ error: 'Invalid bid data or expirationDate' });
  }

  const bid = {
    amount: Number(amount),
    price: Number(price),
    expirationDate: new Date(expirationDate),
    timestamp: new Date(),
  };

  await sendToHCS('bid', bid);
  res.status(200).json({ message: 'Bid submitted', bid });
});

// ===== POST ASK =====
app.post('/api/post-ask', async (req, res) => {
  const { amount, price, expirationDate } = req.body;

  if (
    amount == null ||
    price == null ||
    !expirationDate ||
    isNaN(amount) ||
    isNaN(price) ||
    isNaN(Date.parse(expirationDate))
  ) {
    return res.status(400).json({ error: 'Invalid ask data or expirationDate' });
  }

  const ask = {
    amount: Number(amount),
    price: Number(price),
    expirationDate: new Date(expirationDate),
    timestamp: new Date(),
  };

  await sendToHCS('ask', ask);
  res.status(200).json({ message: 'Ask submitted', ask });
});

// ===== GET OFFERS avec filtre expirationDate > now =====
app.get('/api/offers', (req, res) => {
  const now = new Date();

  // Filtrer uniquement les offres valides (expirationDate dans le futur)
  const validBids = bids.filter(bid => bid.expirationDate > now);
  const validAsks = asks.filter(ask => ask.expirationDate > now);

  const sortedBids = sortOffersByDateDesc(validBids);
  const sortedAsks = sortOffersByDateDesc(validAsks);

  res.status(200).json({ bids: sortedBids, asks: sortedAsks });
});

// ===== Démarrage du serveur =====
app.listen(PORT, async () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  await syncFromHCS(); // Initial sync depuis Hedera
});