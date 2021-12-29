//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Token.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    enum SaleState {
        SALE_INACTIVE,
        SALE_ONGOING,
        SALE_FINISHED
    }

    enum TradeState {
        TRADE_INACTIVE,
        TRADE_ONGOING,
        TRADE_FINISHED
    }

    enum AccountState {
        ACCOUNT_INACTIVE,
        ACCOUNT_ACTIVE,
        ACCOUNT_BANNED
    }

    struct Sale {
        uint256 createdAt;
        uint256 allowedSellAmount;
        uint256 totalSoldAmount;
        uint256 tokenPrice;
        SaleState state;
    }

    struct Trade {
        uint256 createdAt;
        uint256 totalTradedAmount;
        TradeState state;
    }

    struct Order {
        uint256 amount;
        uint256 price;
        address seller;
    }

    Token private token;

    uint256 public constant roundLength = 3 days;
    uint256 public round = 1;

    Order[] public orders;

    mapping(address => AccountState) private _accountState;
    mapping(uint256 => Sale) private _roundSale;
    mapping(uint256 => Trade) private _roundTrade;
    mapping(address => address) private _addressReferal;

    event SaleCreated(
        uint256 round,
        uint256 tokenPrice,
        uint256 allowedSellAmount
    );

    event SaleStarted(uint256 round);
    event SaleFinished(uint256 round);
    event BoughtFromSale(
        uint256 round,
        address indexed buyerAddress,
        uint256 amount
    );

    event TradeCreated(uint256 round);
    event TradeStarted(uint256 round);
    event TradeFinished(uint256 round, uint256 tradeVolume);

    event OrderCreated(
        address indexed sellerAddress,
        uint256 orderIndex,
        uint256 amount,
        uint256 price
    );
    event OrderCanceled(uint256 orderIndex);
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

    function register() external {
        _register(address(0));
    }

    function register(address referral) external {
        require(referral != address(0), "Referral address cannot be 0");
        require(
            _accountState[referral] == AccountState.ACCOUNT_ACTIVE,
            "Referral account should be active"
        );
        _register(referral);
    }

    function _register(address referral) private {
        require(
            _accountState[_msgSender()] == AccountState.ACCOUNT_INACTIVE,
            "This account already registered"
        );
        _accountState[_msgSender()] = AccountState.ACCOUNT_ACTIVE;
        _addressReferal[_msgSender()] = referral;
    }

    function banAccount(address addressToBan) external onlyOwner {
        require(
            _accountState[addressToBan] == AccountState.ACCOUNT_ACTIVE,
            "Only active accounts can be banned"
        );
        _accountState[addressToBan] = AccountState.ACCOUNT_BANNED;
    }

    // SALE

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

    function startSale() external onlyOwner {
        Sale storage sale = _roundSale[round];
        require(sale.state == SaleState.SALE_INACTIVE, "Sale must be inactive");
        sale.state = SaleState.SALE_ONGOING;

        uint256 tokenToMint = sale.allowedSellAmount / sale.tokenPrice;
        token.mint(address(this), tokenToMint);

        emit SaleStarted(round);
    }

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

    function _burnExtraTokens() private {
        Sale storage sale = _roundSale[round];
        uint256 tokensToBurn = (sale.allowedSellAmount - sale.totalSoldAmount) /
            sale.tokenPrice;

        if (tokensToBurn > 0) token.burn(address(this), tokensToBurn);
    }

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

    function cancelOrder(uint256 orderIndex) external nonReentrant {
        Order storage order = orders[orderIndex];
        require(order.seller == _msgSender(), "You are not the order creator");

        token.transfer(_msgSender(), order.amount);

        delete (orders[orderIndex]);

        emit OrderCanceled(orderIndex);
    }

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

    function getAccountState(address account)
        external
        view
        returns (AccountState state)
    {
        return _accountState[account];
    }

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
