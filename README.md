⚙ Installation and Setup

⸻

1️⃣ Install prerequisites:
	•	Node.js (v18 or newer)
	•	Hardhat
	•	MetaMask or HashPack wallet
	•	Hedera testnet account

⸻

2️⃣ Clone the repository:

git clone <your-repo-url>
cd greenloop

3️⃣ Set up backend:

cd server
npm install

➥ Create .env file in server/ with:

TOPIC_ID=<your-Hedera-topic-id>
HEDERA_OPERATOR_ID=<your-testnet-operator-id>
HEDERA_OPERATOR_KEY=<your-testnet-operator-private-key>
PORT=5000

➥ Update server/src/hedera/hederaClient.js to match your credentials if needed.

⸻

4️⃣ Compile and deploy smart-contract (Hardhat)

cd hardhat
npm install
npx hardhat compile
npx hardhat deploy --network testnet

➥ Take the deployed smart-contract address and put it in your .env.

CONTRACT_ADDRESS=<your-contract-address>

5️⃣ Start backend:

cd server
node server.js

➥ API should be available at http://localhost:5000

6️⃣ Start frontend:

cd client
npm install
npm start

➥ React will be available at http://localhost:3000
