const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const MatchingService = require('../services/matchingService');

// Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(process.env.HEDERA_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize matching service
const matchingService = new MatchingService(
    process.env.CONTRACT_ADDRESS,
    provider,
    signer
);

// Create a new order
router.post('/orders', async (req, res) => {
    try {
        const { amount, price, isBuy } = req.body;
        
        // Validate input
        if (!amount || !price || typeof isBuy !== 'boolean') {
            return res.status(400).json({ error: 'Invalid input parameters' });
        }
        
        const order = await matchingService.createOrder(amount, price, isBuy);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get potential matches for an order
router.get('/orders/:orderId/matches', async (req, res) => {
    try {
        const { orderId } = req.params;
        const matches = await matchingService.findMatches(parseInt(orderId));
        res.json(matches);
    } catch (error) {
        console.error('Error finding matches:', error);
        res.status(500).json({ error: 'Failed to find matches' });
    }
});

// Match orders
router.post('/orders/match', async (req, res) => {
    try {
        const { buyOrderId, sellOrderId } = req.body;
        
        // Validate input
        if (!buyOrderId || !sellOrderId) {
            return res.status(400).json({ error: 'Invalid input parameters' });
        }
        
        const match = await matchingService.matchOrders(
            parseInt(buyOrderId),
            parseInt(sellOrderId)
        );
        res.json(match);
    } catch (error) {
        console.error('Error matching orders:', error);
        res.status(500).json({ error: 'Failed to match orders' });
    }
});

// Cancel an order
router.post('/orders/:orderId/cancel', async (req, res) => {
    try {
        const { orderId } = req.params;
        await matchingService.cancelOrder(parseInt(orderId));
        res.json({ success: true });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

// Get order details
router.get('/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await matchingService.getOrder(parseInt(orderId));
        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ error: 'Failed to get order details' });
    }
});

module.exports = router; 