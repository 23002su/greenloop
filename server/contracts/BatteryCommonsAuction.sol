// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BatteryCommonsAuction {

    struct Order {
        address trader;
        uint256 amount; // in kWh
        uint256 price; // in tinybar or HBAR
        bool isBuy;
    }
    
    Order[] public orders;

    

    event OrderPosted(uint256 indexed orderId, address trader, uint256 amount, uint256 price, bool isBuy);
    event OrdersMatched(uint256 indexed buyId, uint256 indexed sellId, uint256 amount, uint256 clearingPrice);

    function postOrder(uint256 amount, uint256 price, bool isBuy) external {
        orders.push(Order({ trader: msg.sender, amount: amount, price: price, isBuy: isBuy }));
        emit OrderPosted(orders.length - 1, msg.sender, amount, price, isBuy);
    }
    
    // Very simplistic matching: match first buy with first sell
    function matchOrders(uint256 buyId, uint256 sellId) external {
        require(orders[buyId].isBuy && !orders[sellId].isBuy, "Must match buy with sell.");
        require(orders[buyId].price >= orders[sellId].price, "Buy price < Sell price.");

        uint256 amount = orders[buyId].amount < orders[sellId].amount ? orders[buyId].amount : orders[sellId].amount;
        uint256 clearingPrice = (orders[buyId].price + orders[sellId].price) / 2;

        orders[buyId].amount -= amount;
        orders[sellId].amount -= amount;

        emit OrdersMatched(buyId, sellId, amount, clearingPrice);
    }
    function getAllOrders() external view returns (Order[] memory) {
        return orders;
    }
}


