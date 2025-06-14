// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnergyMarket is ReentrancyGuard, Ownable {
    // Token used for energy trading (e.g., HBAR or custom token)
    IERC20 public paymentToken;
    
    // Structure for energy orders
    struct Order {
        address seller;
        uint256 amount;     // in kWh
        uint256 price;      // price per kWh
        uint256 timestamp;
        bool isActive;
        bool isBuy;         // true for buy orders, false for sell orders
    }
    
    // Mapping of order ID to Order
    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;
    
    // Events
    event OrderCreated(uint256 indexed orderId, address indexed seller, uint256 amount, uint256 price, bool isBuy);
    event OrderMatched(uint256 indexed buyOrderId, uint256 indexed sellOrderId, uint256 amount, uint256 price);
    event OrderCancelled(uint256 indexed orderId);
    event SettlementCompleted(uint256 indexed buyOrderId, uint256 indexed sellOrderId, uint256 amount, uint256 price);
    
    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }
    
    // Create a new order
    function createOrder(uint256 amount, uint256 price, bool isBuy) external returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        
        uint256 orderId = nextOrderId++;
        orders[orderId] = Order({
            seller: msg.sender,
            amount: amount,
            price: price,
            timestamp: block.timestamp,
            isActive: true,
            isBuy: isBuy
        });
        
        emit OrderCreated(orderId, msg.sender, amount, price, isBuy);
        return orderId;
    }
    
    // Match a buy order with a sell order
    function matchOrders(uint256 buyOrderId, uint256 sellOrderId) external nonReentrant {
        Order storage buyOrder = orders[buyOrderId];
        Order storage sellOrder = orders[sellOrderId];
        
        require(buyOrder.isActive && sellOrder.isActive, "Orders must be active");
        require(buyOrder.isBuy && !sellOrder.isBuy, "Invalid order types");
        require(buyOrder.price >= sellOrder.price, "Buy price must be >= sell price");
        
        uint256 matchAmount = buyOrder.amount < sellOrder.amount ? buyOrder.amount : sellOrder.amount;
        uint256 matchPrice = sellOrder.price; // Use seller's price for the match
        
        // Calculate total payment
        uint256 totalPayment = matchAmount * matchPrice;
        
        // Transfer tokens from buyer to seller
        require(
            paymentToken.transferFrom(msg.sender, sellOrder.seller, totalPayment),
            "Token transfer failed"
        );
        
        // Update order amounts
        buyOrder.amount -= matchAmount;
        sellOrder.amount -= matchAmount;
        
        // Deactivate orders if fully matched
        if (buyOrder.amount == 0) buyOrder.isActive = false;
        if (sellOrder.amount == 0) sellOrder.isActive = false;
        
        emit OrderMatched(buyOrderId, sellOrderId, matchAmount, matchPrice);
        emit SettlementCompleted(buyOrderId, sellOrderId, matchAmount, matchPrice);
    }
    
    // Cancel an order
    function cancelOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(order.seller == msg.sender, "Only order creator can cancel");
        require(order.isActive, "Order is not active");
        
        order.isActive = false;
        emit OrderCancelled(orderId);
    }
    
    // Get order details
    function getOrder(uint256 orderId) external view returns (
        address seller,
        uint256 amount,
        uint256 price,
        uint256 timestamp,
        bool isActive,
        bool isBuy
    ) {
        Order storage order = orders[orderId];
        return (
            order.seller,
            order.amount,
            order.price,
            order.timestamp,
            order.isActive,
            order.isBuy
        );
    }
    
    // Update payment token (only owner)
    function updatePaymentToken(address _newPaymentToken) external onlyOwner {
        require(_newPaymentToken != address(0), "Invalid token address");
        paymentToken = IERC20(_newPaymentToken);
    }
} 