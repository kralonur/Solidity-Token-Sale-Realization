//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Token.sol";

/**
 * @title A contract to sell token and trade it
 * @author Me
 */
contract Marketplace is Ownable, ReentrancyGuard {
    /// Enum for holding states of the sale
    enum SaleState {
        SALE_INACTIVE,
        SALE_ONGOING,
        SALE_FINISHED
    }

    /// Enum for holding states of the trade
    enum TradeState {
        TRADE_INACTIVE,
        TRADE_ONGOING,
        TRADE_FINISHED
    }

    /// Enum for holding states of the account
    enum AccountState {
        ACCOUNT_INACTIVE,
        ACCOUNT_ACTIVE,
        ACCOUNT_BANNED
    }

    /**
     * @dev This struct holds information about the sale
     * @param createdAt Creation time of sale
     * @param allowedSellAmount Maximum allowed sell amount during the sale round
     * @param totalSoldAmount Total sold amount during the sale round
     * @param tokenPrice The price of each token on sale
     * @param state see {SaleState}
     */
    struct Sale {
        uint256 createdAt;
        uint256 allowedSellAmount;
        uint256 totalSoldAmount;
        uint256 tokenPrice;
        SaleState state;
    }

    /**
     * @dev This struct holds information about the trade
     * @param createdAt Creation time of trade
     * @param totalTradedAmount Total trade amount during the trade round
     * @param state see {TradeState}
     */
    struct Trade {
        uint256 createdAt;
        uint256 totalTradedAmount;
        TradeState state;
    }

    /**
     * @dev This struct holds information about the order
     * @param amount The amount of tokens on the sale
     * @param price The price of each token on the sale
     * @param seller The address of the order creator
     */
    struct Order {
        uint256 amount;
        uint256 price;
        address seller;
    }

    /// Erc token
    Token private token;

    /// Constant round length
    uint256 public constant roundLength = 3 days;
    /// Current round
    uint256 public round = 1;

    /// Open order list
    Order[] public orders;

    /// A mapping for storing address and its state
    mapping(address => AccountState) private _accountState;
    /// A mapping for storing Sale object for each round
    mapping(uint256 => Sale) private _roundSale;
    /// A mapping for storing Trade object for each round
    mapping(uint256 => Trade) private _roundTrade;
    /// A mapping for storing referrals of addresses
    mapping(address => address) private _addressReferal;

    /**
     * @dev Emitted when a sale created
     * @param round The round of created sale
     * @param tokenPrice The price of each token on the sale
     * @param allowedSellAmount Maximum allowed sell amount during the sale round
     */
    event SaleCreated(
        uint256 round,
        uint256 tokenPrice,
        uint256 allowedSellAmount
    );
    /**
     * @dev Emitted when a sale started
     * @param round The round of started sale
     */
    event SaleStarted(uint256 round);
    /**
     * @dev Emitted when a sale finished
     * @param round The round of finished sale
     */
    event SaleFinished(uint256 round);
    /**
     * @dev Emitted when an user buys from sale
     * @param round The round of the sale bought from
     * @param buyerAddress The address of the buyer
     * @param amount The amount of tokens being bought
     */
    event BoughtFromSale(
        uint256 round,
        address indexed buyerAddress,
        uint256 amount
    );

    /**
     * @dev Emitted when a trade created
     * @param round The round of created trade
     */
    event TradeCreated(uint256 round);
    /**
     * @dev Emitted when a trade started
     * @param round The round of started trade
     */
    event TradeStarted(uint256 round);
    /**
     * @dev Emitted when a trade finished
     * @param round The round of finished trade
     * @param tradeVolume The trade volume during token trade
     */
    event TradeFinished(uint256 round, uint256 tradeVolume);

    /**
     * @dev Emitted when an order is created
     * @param sellerAddress The creator of the order
     * @param orderIndex The index of created order
     * @param amount The amount of tokens being sold
     * @param price The price of tokens being sold
     */
    event OrderCreated(
        address indexed sellerAddress,
        uint256 orderIndex,
        uint256 amount,
        uint256 price
    );
    /**
     * @dev Emitted when an order is canceled
     * @param orderIndex The index of canceled order
     */
    event OrderCanceled(uint256 orderIndex);
    /**
     * @dev Emitted when an order is filled
     * @param orderIndex The index of filled order
     * @param amount The amount of tokens being sold
     * @param orderClosed The status of the token if it's closed or not
     */
    event OrderFilled(uint256 orderIndex, uint256 amount, bool orderClosed);

    constructor(address tokenAddress) {
        token = Token(tokenAddress);

        Sale storage sale = _roundSale[round];

        sale.createdAt = block.timestamp;
        sale.allowedSellAmount = 1 ether;
        sale.tokenPrice = 0.00001 ether;
        sale.state = SaleState.SALE_INACTIVE;

        emit SaleCreated(round, sale.tokenPrice, sale.allowedSellAmount);
    }

    // ACCOUNT

    /// @dev see {_register}
    function register() external {
        _register(address(0));
    }

    /// @dev see {_register}
    function register(address referral) external {
        require(referral != address(0), "Referral address cannot be 0");
        require(
            _accountState[referral] == AccountState.ACCOUNT_ACTIVE,
            "Referral account should be active"
        );
        _register(referral);
    }

    /**
     * @dev Registers an address with it's referral
     * @param referral The referral to register with
     */
    function _register(address referral) private {
        require(
            _accountState[_msgSender()] == AccountState.ACCOUNT_INACTIVE,
            "This account already registered"
        );
        _accountState[_msgSender()] = AccountState.ACCOUNT_ACTIVE;
        _addressReferal[_msgSender()] = referral;
    }

    /**
     * @dev Bans an account
     * @param addressToBan The address to ban
     */
    function banAccount(address addressToBan) external onlyOwner {
        require(
            _accountState[addressToBan] == AccountState.ACCOUNT_ACTIVE,
            "Only active accounts can be banned"
        );
        _accountState[addressToBan] = AccountState.ACCOUNT_BANNED;
    }

    // SALE

    /// @dev Creates a sale round
    function createSale() external onlyOwner {
        Sale storage prevSale = _roundSale[round];
        Trade storage prevTrade = _roundTrade[round];

        require(
            prevSale.state == SaleState.SALE_FINISHED,
            "Previous sale round must be finished first"
        );
        require(
            prevTrade.state == TradeState.TRADE_FINISHED,
            "Previous trade round must be finished first"
        );

        Sale storage sale = _roundSale[++round];

        sale.createdAt = block.timestamp;
        sale.allowedSellAmount = prevTrade.totalTradedAmount;
        sale.tokenPrice =
            (prevSale.tokenPrice * 10300) /
            10000 +
            0.000004 ether;
        sale.state = SaleState.SALE_INACTIVE;

        emit SaleCreated(round, sale.tokenPrice, sale.allowedSellAmount);
    }

    /// @dev Starts a sale round
    function startSale() external onlyOwner {
        Sale storage sale = _roundSale[round];
        require(sale.state == SaleState.SALE_INACTIVE, "Sale must be inactive");
        sale.state = SaleState.SALE_ONGOING;

        uint256 tokenToMint = sale.allowedSellAmount / sale.tokenPrice;
        token.mint(address(this), tokenToMint);

        emit SaleStarted(round);
    }

    /// @dev Finishes a sale round
    function finishSale() external onlyOwner {
        Sale storage sale = _roundSale[round];
        require(sale.state == SaleState.SALE_ONGOING, "Sale is not ongoing");

        if (sale.totalSoldAmount != sale.allowedSellAmount) {
            require(
                sale.createdAt + roundLength < block.timestamp,
                "Sale is too early to finish"
            );
        }

        sale.state = SaleState.SALE_FINISHED;

        _burnExtraTokens();
        emit SaleFinished(round);
    }

    /// @dev Burns unsold tokens from sale round
    function _burnExtraTokens() private {
        Sale storage sale = _roundSale[round];
        uint256 tokensToBurn = (sale.allowedSellAmount - sale.totalSoldAmount) /
            sale.tokenPrice;

        if (tokensToBurn > 0) token.burn(address(this), tokensToBurn);
    }

    /// @dev Buys token from sale for the caller
    function buyFromSale() external payable nonReentrant {
        Sale storage sale = _roundSale[round];
        require(sale.state == SaleState.SALE_ONGOING, "Sale is not ongoing");

        require(
            sale.totalSoldAmount + msg.value <= sale.allowedSellAmount,
            "Amount to buy exceeds max allowed amount"
        );

        uint256 amountLeftForPlatform = msg.value;
        uint256 amountForFirstReferal = msg.value - (msg.value * 9500) / 10000; // Basis points
        uint256 amountForSecondReferal = msg.value - (msg.value * 9700) / 10000;

        address firstReferal = _addressReferal[_msgSender()];
        address secondReferal = _addressReferal[firstReferal];

        if (firstReferal != address(0)) {
            payable(firstReferal).transfer(amountForFirstReferal);
            amountLeftForPlatform -= amountForFirstReferal;
        }
        if (secondReferal != address(0)) {
            payable(secondReferal).transfer(amountForSecondReferal);
            amountLeftForPlatform -= amountForSecondReferal;
        }

        uint256 tokens = amountLeftForPlatform / sale.tokenPrice;
        sale.totalSoldAmount += amountLeftForPlatform;

        token.transfer(_msgSender(), tokens);

        emit BoughtFromSale(round, _msgSender(), tokens);
    }

    // TRADE

    /// @dev Creates a trade round
    function createTrade() external onlyOwner {
        Sale storage sale = _roundSale[round];
        Trade storage trade = _roundTrade[round];

        require(
            sale.state == SaleState.SALE_FINISHED,
            "Sale round must be finished first"
        );
        require(trade.createdAt == 0, "Trade round is already created");

        trade.createdAt = block.timestamp;
        trade.state = TradeState.TRADE_INACTIVE;

        emit TradeCreated(round);
    }

    /// @dev Starts a trade round
    function startTrade() external onlyOwner {
        Trade storage trade = _roundTrade[round];
        require(trade.createdAt != 0, "Trade round is not found");
        require(
            trade.state == TradeState.TRADE_INACTIVE,
            "Trade round must be inactive"
        );
        trade.state = TradeState.TRADE_ONGOING;

        emit TradeStarted(round);
    }

    /// @dev Finishes a trade round
    function finishTrade() external onlyOwner nonReentrant {
        Trade storage trade = _roundTrade[round];
        require(
            trade.state == TradeState.TRADE_ONGOING,
            "Trade round must be ongoing"
        );
        for (uint256 i = 0; i < orders.length; i++) {
            token.transfer(_msgSender(), orders[i].amount);
        }

        delete orders;

        trade.state = TradeState.TRADE_FINISHED;

        emit TradeFinished(round, trade.totalTradedAmount);
    }

    // ORDER

    /**
     * @dev Creates an order
     * @param amount The amount of tokens to sell
     * @param price The price of tokens for trading
     */
    function createOrder(uint256 amount, uint256 price) external nonReentrant {
        require(
            amount <= token.balanceOf(_msgSender()),
            "Amount exceeds the balance"
        );

        Order memory order = Order({
            amount: amount,
            price: price,
            seller: _msgSender()
        });

        token.transferFrom(_msgSender(), address(this), amount);

        orders.push(order);

        emit OrderCreated(_msgSender(), orders.length - 1, amount, price);
    }

    /**
     * @dev Cancels an order
     * @param orderIndex The index of order to cancel
     */
    function cancelOrder(uint256 orderIndex) external nonReentrant {
        Order storage order = orders[orderIndex];
        require(order.seller == _msgSender(), "You are not the order creator");

        token.transfer(_msgSender(), order.amount);

        delete (orders[orderIndex]);

        emit OrderCanceled(orderIndex);
    }

    /**
     * @dev Fills an order
     * @param orderIndex The index of order to fill
     * @param tokenAmountToBuy The amount of tokens to buy for caller
     */
    function fillOrder(uint256 orderIndex, uint256 tokenAmountToBuy)
        external
        payable
        nonReentrant
    {
        require(orders.length > orderIndex, "Order does not exist");
        Trade storage trade = _roundTrade[round];
        Order storage order = orders[orderIndex];
        require(
            trade.state == TradeState.TRADE_ONGOING,
            "Trade round must be ongoing"
        );
        require(
            order.amount >= tokenAmountToBuy,
            "Amount you want to buy more than sellers quantity"
        );
        require(
            msg.value == tokenAmountToBuy * order.price,
            "The eth amount is not correct to buy"
        );

        uint256 amountLeftForSeller = msg.value;
        uint256 amountForReferal = msg.value - (msg.value * 9750) / 10000;
        uint256 amountForPlatform = 0;

        address firstReferal = _addressReferal[order.seller];
        address secondReferal = _addressReferal[firstReferal];

        if (firstReferal != address(0)) {
            payable(firstReferal).transfer(amountForReferal);
            amountLeftForSeller -= amountForReferal;
        } else {
            amountForPlatform += amountForReferal;
        }
        if (secondReferal != address(0)) {
            payable(secondReferal).transfer(amountForReferal);
            amountLeftForSeller -= amountForReferal;
        } else {
            amountForPlatform += amountForReferal;
        }

        if (amountForPlatform > 0) {
            amountLeftForSeller -= amountForPlatform;
        }

        payable(order.seller).transfer(amountLeftForSeller);

        token.transfer(_msgSender(), tokenAmountToBuy);
        order.amount -= tokenAmountToBuy;
        if (order.amount == 0) delete (orders[orderIndex]);

        trade.totalTradedAmount += msg.value;

        emit OrderFilled(orderIndex, tokenAmountToBuy, order.amount == 0);
    }

    // GETTER

    /// @dev see {Sale}
    function getSaleDetail(uint256 saleRound)
        external
        view
        returns (
            uint256 createdAt,
            uint256 allowedSellAmount,
            uint256 totalSoldAmount,
            uint256 tokenPrice,
            SaleState state
        )
    {
        Sale storage sale = _roundSale[saleRound];

        return (
            sale.createdAt,
            sale.allowedSellAmount,
            sale.totalSoldAmount,
            sale.tokenPrice,
            sale.state
        );
    }

    /// @dev see {Trade}
    function getTradeDetail(uint256 saleRound)
        external
        view
        returns (
            uint256 createdAt,
            uint256 totalTradedAmount,
            TradeState state
        )
    {
        Trade storage trade = _roundTrade[saleRound];

        return (trade.createdAt, trade.totalTradedAmount, trade.state);
    }

    /// @dev see {_accountState}
    function getAccountState(address account)
        external
        view
        returns (AccountState state)
    {
        return _accountState[account];
    }

    /// @dev see {Order}
    function getOrderDetail(uint256 orderIndex)
        external
        view
        returns (
            uint256 amount,
            uint256 price,
            address seller
        )
    {
        require(orders.length > orderIndex, "Order does not exist");
        Order storage order = orders[orderIndex];
        return (order.amount, order.price, order.seller);
    }
}
