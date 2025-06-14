const { ethers } = require('ethers');
const EnergyMarket = require('../artifacts/contracts/EnergyMarket.sol/EnergyMarket.json');

class MatchingService {
    constructor(contractAddress, provider, signer) {
        this.contract = new ethers.Contract(contractAddress, EnergyMarket.abi, signer);
        this.provider = provider;
        this.signer = signer;
    }

    // Create a new order on-chain
    async createOrder(amount, price, isBuy) {
        try {
            const tx = await this.contract.createOrder(amount, price, isBuy);
            const receipt = await tx.wait();
            
            // Find the OrderCreated event
            const event = receipt.events.find(e => e.event === 'OrderCreated');
            if (!event) throw new Error('Order creation event not found');
            
            return {
                orderId: event.args.orderId.toNumber(),
                seller: event.args.seller,
                amount: event.args.amount.toNumber(),
                price: event.args.price.toNumber(),
                isBuy: event.args.isBuy
            };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    // Match orders on-chain
    async matchOrders(buyOrderId, sellOrderId) {
        try {
            const tx = await this.contract.matchOrders(buyOrderId, sellOrderId);
            const receipt = await tx.wait();
            
            // Find the OrderMatched event
            const event = receipt.events.find(e => e.event === 'OrderMatched');
            if (!event) throw new Error('Order match event not found');
            
            return {
                buyOrderId: event.args.buyOrderId.toNumber(),
                sellOrderId: event.args.sellOrderId.toNumber(),
                amount: event.args.amount.toNumber(),
                price: event.args.price.toNumber()
            };
        } catch (error) {
            console.error('Error matching orders:', error);
            throw error;
        }
    }

    // Cancel an order
    async cancelOrder(orderId) {
        try {
            const tx = await this.contract.cancelOrder(orderId);
            await tx.wait();
            return true;
        } catch (error) {
            console.error('Error cancelling order:', error);
            throw error;
        }
    }

    // Get order details
    async getOrder(orderId) {
        try {
            const order = await this.contract.getOrder(orderId);
            return {
                seller: order.seller,
                amount: order.amount.toNumber(),
                price: order.price.toNumber(),
                timestamp: new Date(order.timestamp.toNumber() * 1000),
                isActive: order.isActive,
                isBuy: order.isBuy
            };
        } catch (error) {
            console.error('Error getting order:', error);
            throw error;
        }
    }

    // Find potential matches for an order
    async findMatches(orderId) {
        try {
            const order = await this.getOrder(orderId);
            const isBuy = order.isBuy;
            
            // Get all active orders from the contract
            // Note: This is a simplified version. In production, you'd want to:
            // 1. Use events to track orders
            // 2. Maintain an off-chain database of orders
            // 3. Implement pagination for large numbers of orders
            const filter = this.contract.filters.OrderCreated(null, null, null, null, !isBuy);
            const events = await this.contract.queryFilter(filter);
            
            const potentialMatches = [];
            for (const event of events) {
                const matchOrderId = event.args.orderId.toNumber();
                if (matchOrderId === orderId) continue;
                
                const matchOrder = await this.getOrder(matchOrderId);
                if (!matchOrder.isActive) continue;
                
                // For buy orders, find sell orders with price <= buy price
                // For sell orders, find buy orders with price >= sell price
                if ((isBuy && matchOrder.price <= order.price) ||
                    (!isBuy && matchOrder.price >= order.price)) {
                    potentialMatches.push({
                        orderId: matchOrderId,
                        ...matchOrder
                    });
                }
            }
            
            // Sort matches by price (best price first)
            return potentialMatches.sort((a, b) => 
                isBuy ? a.price - b.price : b.price - a.price
            );
        } catch (error) {
            console.error('Error finding matches:', error);
            throw error;
        }
    }
}

module.exports = MatchingService; 