// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract SokoP2P is ReentrancyGuard, Pausable {
    using EnumerableSet for EnumerableSet.UintSet;

    enum OrderStatus { Open, Matched, PaymentConfirmed, Completed, Canceled, Disputed }
    enum AssetType { ETH, ERC20 }

    // Structure for orders (P2P-style)
    struct Order {
        address creator;          // Seller or buyer who posted the order
        bool isSellOrder;         // True = sell crypto, False = buy crypto
        uint256 totalAmount;      // Total crypto amount offered
        uint256 remainingAmount;  // Remaining unmatched amount (Final Adjustment: Partial Matching)
        uint256 priceInFiat;      // Price per unit in fiat (e.g., USD per ETH)
        uint256 minAmount;        // Min crypto amount per match
        uint256 maxAmount;        // Max crypto amount per match
        OrderStatus status;
        uint256 createdAt;
        AssetType assetType;
        address tokenAddress;
        bytes32 locationHash;     // Local area identifier
        bytes32 paymentMethod;    // e.g., "Bank Transfer"
        address fiatFeed;         // Chainlink feed for fiat conversion
    }

    // Structure for matches against an order
    struct Match {
        address matcher;          // User who matched the order
        uint256 amount;           // Crypto amount matched
        uint256 escrowAmount;     // Funds locked in escrow for this match
        OrderStatus status;       // Status of this specific match
        uint256 matchedAt;        // Timestamp of match
    }

    // User profile for reputation and stats
    struct UserProfile {
        uint256 tradeCount;
        uint256 completedTrades;
        uint256 rating;
        bool isVerified;
    }

    // Core state variables
    address public arbitrator;
    address public platformWallet;
    uint256 public baseFeePercentage; // Base fee in basis points (e.g., 100 = 1%)
    mapping(address => AggregatorV3Interface) public priceFeeds; // Multiple fiat feeds
    mapping(uint256 => Order) public orders;                     // Order storage
    mapping(uint256 => Match[]) public matches;                  // Matches per order (Final Adjustment: Partial Matching)
    mapping(uint256 => mapping(uint256 => uint256)) public escrowBalances; // OrderID -> MatchID -> Amount
    mapping(address => UserProfile) public userProfiles;
    EnumerableSet.UintSet private activeOrders;                  // Final Adjustment: Active Trades List
    uint256 public orderCounter;

    // Events
    event OrderCreated(uint256 orderId, address indexed creator, bool isSellOrder, uint256 amount, uint256 priceInFiat);
    event OrderMatched(uint256 orderId, uint256 matchId, address indexed matcher, uint256 amount);
    event PaymentConfirmed(uint256 orderId, uint256 matchId);
    event OrderCompleted(uint256 orderId, uint256 matchId);
    event OrderCanceled(uint256 orderId);
    event OrderDisputed(uint256 orderId, uint256 matchId);
    event DisputeResolved(uint256 orderId, uint256 matchId, uint256 matcherAmount, uint256 creatorAmount);
    event FeesCollected(uint256 orderId, uint256 matchId, uint256 feeAmount);
    event UserRated(address indexed user, uint256 rating);

    modifier onlyArbitrator() { require(msg.sender == arbitrator, "Only arbitrator"); _; }
    modifier orderExists(uint256 _orderId) { require(_orderId > 0 && _orderId <= orderCounter, "Order does not exist"); _; }
    modifier matchExists(uint256 _orderId, uint256 _matchId) { 
        require(_matchId < matches[_orderId].length, "Match does not exist"); 
        _; 
    }

    // Constructor
    constructor(address _arbitrator, address _platformWallet, uint256 _baseFeePercentage) {
        arbitrator = _arbitrator;
        platformWallet = _platformWallet;
        baseFeePercentage = _baseFeePercentage;
    }

    // Set price feed for a fiat currency
    function setPriceFeed(address _fiatFeed, string calldata _currency) external onlyArbitrator {
        priceFeeds[_fiatFeed] = AggregatorV3Interface(_fiatFeed);
    }

    // Create an order (sell or buy)
    function createOrder(
        bool _isSellOrder,
        uint256 _amount,
        uint256 _priceInFiat,
        uint256 _minAmount,
        uint256 _maxAmount,
        AssetType _assetType,
        address _tokenAddress,
        bytes32 _locationHash,
        bytes32 _paymentMethod,
        address _fiatFeed
    ) external payable whenNotPaused {
        require(_amount >= _minAmount && _amount <= _maxAmount, "Amount out of range");
        require(priceFeeds[_fiatFeed] != AggregatorV3Interface(address(0)), "Invalid fiat feed");
        if (_assetType == AssetType.ERC20) require(_tokenAddress != address(0), "Invalid token address");

        (, int256 fiatPrice,,,) = priceFeeds[_fiatFeed].latestRoundData();
        require(fiatPrice > 0, "Invalid fiat price");

        orderCounter++;
        orders[orderCounter] = Order(
            msg.sender, _isSellOrder, _amount, _amount, _priceInFiat, _minAmount, _maxAmount,
            OrderStatus.Open, block.timestamp, _assetType, _tokenAddress, _locationHash, _paymentMethod, _fiatFeed
        );
        // Final Adjustment: Add to active orders list
        activeOrders.add(orderCounter);

        // Lock creator funds for sell orders
        if (_isSellOrder) {
            uint256 priceInAsset = (_amount * _priceInFiat * 1e18) / uint256(fiatPrice * 1e10);
            if (_assetType == AssetType.ETH) {
                require(msg.value == priceInAsset, "Incorrect ETH amount");
                escrowBalances[orderCounter][0] = priceInAsset; // Initial escrow for full amount
            } else {
                IERC20 token = IERC20(_tokenAddress);
                require(token.transferFrom(msg.sender, address(this), priceInAsset), "Token transfer failed");
                escrowBalances[orderCounter][0] = priceInAsset;
            }
        }

        emit OrderCreated(orderCounter, msg.sender, _isSellOrder, _amount, _priceInFiat);
    }

    // Match an order with a specified amount
    function matchOrder(uint256 _orderId, uint256 _tradeAmount) external payable orderExists(_orderId) nonReentrant whenNotPaused {
        Order storage order = orders[_orderId];
        require(order.status == OrderStatus.Open, "Order not open");
        require(_tradeAmount >= order.minAmount && _tradeAmount <= order.maxAmount, "Amount out of range");
        require(_tradeAmount <= order.remainingAmount, "Insufficient remaining amount");

        (, int256 fiatPrice,,,) = priceFeeds[order.fiatFeed].latestRoundData();
        uint256 priceInAsset = (_tradeAmount * order.priceInFiat * 1e18) / uint256(fiatPrice * 1e10);

        // Final Adjustment: Partial Matching - Create a new match entry
        uint256 matchId = matches[_orderId].length;
        if (order.isSellOrder) {
            // Buyer locks fiat equivalent
            if (order.assetType == AssetType.ETH) {
                require(msg.value >= priceInAsset, "Incorrect ETH amount");
                escrowBalances[_orderId][matchId] = priceInAsset;
                if (msg.value > priceInAsset) payable(msg.sender).transfer(msg.value - priceInAsset); // Refund excess
            } else {
                IERC20 token = IERC20(order.tokenAddress);
                require(token.transferFrom(msg.sender, address(this), priceInAsset), "Token transfer failed");
                escrowBalances[_orderId][matchId] = priceInAsset;
            }
        } else {
            // Seller locks crypto for buy order
            if (order.assetType == AssetType.ETH) {
                require(msg.value >= priceInAsset, "Incorrect ETH amount");
                escrowBalances[_orderId][matchId] = priceInAsset;
                if (msg.value > priceInAsset) payable(msg.sender).transfer(msg.value - priceInAsset); // Refund excess
            } else {
                IERC20 token = IERC20(order.tokenAddress);
                require(token.transferFrom(msg.sender, address(this), priceInAsset), "Token transfer failed");
                escrowBalances[_orderId][matchId] = priceInAsset;
            }
        }

        matches[_orderId].push(Match(msg.sender, _tradeAmount, priceInAsset, OrderStatus.Matched, block.timestamp));
        order.remainingAmount -= _tradeAmount;
        if (order.remainingAmount == 0) {
            order.status = OrderStatus.Matched;
            // Final Adjustment: Remove from active orders when fully matched
            activeOrders.remove(_orderId);
        }

        emit OrderMatched(_orderId, matchId, msg.sender, _tradeAmount);
    }

    // Confirm fiat payment for a match
    function confirmPayment(uint256 _orderId, uint256 _matchId) external orderExists(_orderId) matchExists(_orderId, _matchId) nonReentrant whenNotPaused {
        Order storage order = orders[_orderId];
        Match storage orderMatch = matches[_orderId][_matchId];
        require(msg.sender == order.creator, "Only creator can confirm");
        require(orderMatch.status == OrderStatus.Matched, "Match not active");

        orderMatch.status = OrderStatus.PaymentConfirmed;
        emit PaymentConfirmed(_orderId, _matchId);
    }

    // Release funds for a match
    function releaseFunds(uint256 _orderId, uint256 _matchId) external orderExists(_orderId) matchExists(_orderId, _matchId) nonReentrant whenNotPaused {
        Order storage order = orders[_orderId];
        Match storage orderMatch = matches[_orderId][_matchId];
        require(msg.sender == order.creator, "Only creator can release");
        require(orderMatch.status == OrderStatus.PaymentConfirmed, "Payment not confirmed");

        uint256 totalAmount = escrowBalances[_orderId][_matchId];
        uint256 fee = calculateFee(totalAmount);
        uint256 payoutAmount = totalAmount - fee;

        escrowBalances[_orderId][_matchId] = 0;
        orderMatch.status = OrderStatus.Completed;

        address recipient = order.isSellOrder ? orderMatch.matcher : order.creator;
        if (order.assetType == AssetType.ETH) {
            if (fee > 0) payable(platformWallet).transfer(fee);
            payable(recipient).transfer(payoutAmount);
        } else {
            IERC20 token = IERC20(order.tokenAddress);
            if (fee > 0) require(token.transfer(platformWallet, fee), "Fee transfer failed");
            require(token.transfer(recipient, payoutAmount), "Payout failed");
        }

        userProfiles[order.creator].completedTrades++;
        userProfiles[orderMatch.matcher].completedTrades++;
        emit FeesCollected(_orderId, _matchId, fee);
        emit OrderCompleted(_orderId, _matchId);
    }

    // Cancel an order (only if unmatched or fully remaining)
    function cancelOrder(uint256 _orderId) external orderExists(_orderId) nonReentrant whenNotPaused {
        Order storage order = orders[_orderId];
        require(msg.sender == order.creator, "Only creator can cancel");
        require(order.status == OrderStatus.Open, "Order not open");
        require(matches[_orderId].length == 0, "Order has matches");

        uint256 refundAmount = escrowBalances[_orderId][0]; // Initial escrow for sell orders
        escrowBalances[_orderId][0] = 0;
        order.status = OrderStatus.Canceled;
        // Final Adjustment: Remove from active orders on cancellation
        activeOrders.remove(_orderId);

        if (refundAmount > 0) {
            if (order.assetType == AssetType.ETH) {
                payable(order.creator).transfer(refundAmount);
            } else {
                IERC20 token = IERC20(order.tokenAddress);
                require(token.transfer(order.creator, refundAmount), "Refund failed");
            }
        }
        emit OrderCanceled(_orderId);
    }

    // Dispute a match
    function disputeOrder(uint256 _orderId, uint256 _matchId) external orderExists(_orderId) matchExists(_orderId, _matchId) whenNotPaused {
        Order storage order = orders[_orderId];
        Match storage orderMatch = matches[_orderId][_matchId];
        require(msg.sender == order.creator || msg.sender == orderMatch.matcher, "Only participants can dispute");
        require(orderMatch.status == OrderStatus.Matched || orderMatch.status == OrderStatus.PaymentConfirmed, "Not disputable");

        orderMatch.status = OrderStatus.Disputed;
        emit OrderDisputed(_orderId, _matchId);
    }

    // Resolve a dispute
    function resolveDispute(uint256 _orderId, uint256 _matchId, uint256 matcherAmount) 
        external onlyArbitrator orderExists(_orderId) matchExists(_orderId, _matchId) nonReentrant 
    {
        Order storage order = orders[_orderId];
        Match storage orderMatch = matches[_orderId][_matchId];
        require(orderMatch.status == OrderStatus.Disputed, "Not disputed");

        uint256 totalAmount = escrowBalances[_orderId][_matchId];
        uint256 fee = calculateFee(totalAmount);
        uint256 remainingAmount = totalAmount - fee;
        uint256 creatorAmount = remainingAmount > matcherAmount ? remainingAmount - matcherAmount : 0;

        escrowBalances[_orderId][_matchId] = 0;
        orderMatch.status = OrderStatus.Canceled;

        if (order.assetType == AssetType.ETH) {
            if (fee > 0) payable(platformWallet).transfer(fee);
            if (matcherAmount > 0) payable(orderMatch.matcher).transfer(matcherAmount);
            if (creatorAmount > 0) payable(order.creator).transfer(creatorAmount);
        } else {
            IERC20 token = IERC20(order.tokenAddress);
            if (fee > 0) require(token.transfer(platformWallet, fee), "Fee transfer failed");
            if (matcherAmount > 0) require(token.transfer(orderMatch.matcher, matcherAmount), "Matcher transfer failed");
            if (creatorAmount > 0) require(token.transfer(order.creator, creatorAmount), "Creator transfer failed");
        }

        emit FeesCollected(_orderId, _matchId, fee);
        emit DisputeResolved(_orderId, _matchId, matcherAmount, creatorAmount);
    }

    // Rate a user
    function rateUser(uint256 _orderId, uint256 _matchId, uint256 _rating) 
        external orderExists(_orderId) matchExists(_orderId, _matchId) whenNotPaused 
    {
        Order storage order = orders[_orderId];
        Match storage orderMatch = matches[_orderId][_matchId];
        require(orderMatch.status == OrderStatus.Completed || orderMatch.status == OrderStatus.Canceled, "Match not finalized");
        require(_rating <= 100, "Rating must be 0-100");
        address ratedUser = (msg.sender == order.creator) ? orderMatch.matcher : order.creator;
        require(msg.sender == order.creator || msg.sender == orderMatch.matcher, "Only participants can rate");

        UserProfile storage profile = userProfiles[ratedUser];
        profile.rating = (profile.rating * profile.tradeCount + _rating) / (profile.tradeCount + 1);
        profile.tradeCount++;
        emit UserRated(ratedUser, _rating);
    }

    // Final Adjustment: Active Trades List - Get active orders for UI
    function getActiveOrders() external view returns (uint256[] memory) {
        return activeOrders.values();
    }

    // Get order details
    function getOrder(uint256 _orderId) external view orderExists(_orderId) returns (Order memory) {
        return orders[_orderId];
    }

    // Get match details
    function getMatch(uint256 _orderId, uint256 _matchId) external view orderExists(_orderId) matchExists(_orderId, _matchId) returns (Match memory) {
        return matches[_orderId][_matchId];
    }

    // Internal fee calculation
    function calculateFee(uint256 _amount) internal view returns (uint256) {
        uint256 fee = (_amount * baseFeePercentage) / 10000;
        if (_amount < 0.1 ether) fee = fee / 2; // Discount for small trades
        return fee;
    }

    // Pause/unpause
    function pause() external onlyArbitrator { _pause(); }
    function unpause() external onlyArbitrator { _unpause(); }
}