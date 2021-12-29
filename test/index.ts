import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Marketplace, Marketplace__factory, Token, Token__factory } from "../typechain-types";

describe("Marketplace", function () {
  let accounts: SignerWithAddress[];
  let owner: SignerWithAddress;
  let contract: Marketplace;
  let tokenContract: Token;

  before(async function () {
    accounts = await ethers.getSigners();
    owner = accounts[0];
  });

  beforeEach(async function () {
    tokenContract = await getTokenContract(owner);
    const tokenFactory = new Marketplace__factory(owner);
    contract = await tokenFactory.deploy(tokenContract.address);
    await contract.deployed();
  });

  it("Should have default values at start", async function () {
    const saleDetail = await contract.getSaleDetail(1);
    expect(ethers.utils.formatEther(saleDetail.allowedSellAmount))
      .to.equal('1.0');
    expect(ethers.utils.formatEther(saleDetail.tokenPrice))
      .to.equal('0.00001');
    expect(saleDetail.state)
      .to.equal(0);
  });

  it("Should register", async function () {
    expect(await contract.getAccountState(owner.address))
      .to.equal(0);

    await contract["register()"]();

    expect(await contract.getAccountState(owner.address))
      .to.equal(1);

    await expect(contract["register()"]())
      .to.be.revertedWith("This account already registered");

    await expect(contract.connect(accounts[1])["register(address)"](ethers.constants.AddressZero))
      .to.be.revertedWith("Referral address cannot be 0");

    await expect(contract.connect(accounts[2])["register(address)"](accounts[1].address))
      .to.be.revertedWith("Referral account should be active");
  });

  it("Should ban account", async function () {
    await expect(contract.banAccount(accounts[1].address))
      .to.be.revertedWith("Only active accounts can be banned");

    await contract.connect(accounts[1])["register()"]();

    expect(await contract.getAccountState(accounts[1].address))
      .to.equal(1);

    // Ban account
    await contract.banAccount(accounts[1].address);

    expect(await contract.getAccountState(accounts[1].address))
      .to.equal(2);
  });

  it("Should start sale", async function () {
    await contract.startSale();
    const saleDetail = await contract.getSaleDetail(1);

    const expectedAmountToMint = saleDetail.allowedSellAmount.div(saleDetail.tokenPrice);

    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(expectedAmountToMint.toString());

    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(expectedAmountToMint.toString());

    await expect(contract.startSale())
      .to.be.revertedWith("Sale must be inactive");
  });

  it("Should buy from sale", async function () {
    await expect(contract.buyFromSale())
      .to.be.revertedWith("Sale is not ongoing");
    await contract.startSale();

    // Owner's referral is acc1, acc1's referral is acc2, acc2 has no referral
    await contract.connect(accounts[2])["register()"]();
    await contract.connect(accounts[1])["register(address)"](accounts[2].address);
    await contract["register(address)"](accounts[1].address);

    const value = ethers.utils.parseEther("0.001");

    await expect(contract.buyFromSale({
      value: ethers.utils.parseEther("2.0")
    }))
      .to.be.revertedWith("Amount to buy exceeds max allowed amount");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, -value) //owner should lost value since it's the caller
      .to.changeEtherBalance(accounts[1], value.mul(5).div(100)) //acc1 should gain %5
      .to.changeEtherBalance(accounts[2], value.mul(3).div(100)) //acc2 should gain %3
      .to.changeEtherBalance(contract, value.mul(92).div(100)); //contract should gain %92

  });

  it("Should finish sale", async function () {
    await expect(contract.finishSale())
      .to.be.revertedWith("Sale is not ongoing");

    await contract.startSale();

    const value = ethers.utils.parseEther("1");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, value.mul(-1))
      .to.changeEtherBalance(contract, value); //contract should gain %100 since no ref

    await contract.finishSale();

    await expect((await contract.getSaleDetail(1)).state)
      .to.equal(2);
  });

  it("Should finish sale with time", async function () {
    await expect(contract.finishSale())
      .to.be.revertedWith("Sale is not ongoing");

    await contract.startSale();

    const value = ethers.utils.parseEther("0.999");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, value.mul(-1))
      .to.changeEtherBalance(contract, value); //contract should gain %100 since no ref

    await expect(contract.finishSale())
      .to.be.revertedWith("Sale is too early to finish");

    await simulateTimePassed();

    //before burn should have 100 tokens left since 0.001 eth left not sold
    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(100);


    await contract.finishSale();

    //after burn 0 tokens should left
    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(0);

    await expect((await contract.getSaleDetail(1)).state)
      .to.equal(2);
  });

  it("Should create trade", async function () {
    await contract.startSale();

    await expect(contract.createTrade())
      .to.be.revertedWith("Sale round must be finished first");

    const value = ethers.utils.parseEther("1");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, value.mul(-1))
      .to.changeEtherBalance(contract, value); //contract should gain %100 since no ref

    await contract.finishSale();

    await contract.createTrade();

    await expect(contract.createTrade())
      .to.be.revertedWith("Trade round is already created");
  });

  it("Should start trade", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("1");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, value.mul(-1))
      .to.changeEtherBalance(contract, value); //contract should gain %100 since no ref

    await contract.finishSale();

    await expect(contract.startTrade())
      .to.be.revertedWith("Trade round is not found");

    await contract.createTrade();

    await contract.startTrade();

    await expect((await contract.getTradeDetail(1)).state)
      .to.equal(1);

    await expect(contract.startTrade())
      .to.be.revertedWith("Trade round must be inactive");
  });

  it("Should create order", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("0.5");
    const amountToSell = 100;
    const sellValue = ethers.utils.parseEther("0.01");

    await contract.buyFromSale({
      value: value
    });

    await contract.connect(accounts[1]).buyFromSale({
      value: value
    });

    await contract.finishSale();
    await contract.createTrade();
    await contract.startTrade();

    await expect(contract.connect(accounts[2]).createOrder(100, 100))
      .to.be.revertedWith("Amount exceeds the balance");

    await tokenContract.increaseAllowance(contract.address, amountToSell);
    await contract.createOrder(amountToSell, sellValue);
    const order = await contract.getOrderDetail(0);

    expect(order.amount)
      .to.equal(amountToSell);

    expect(order.price)
      .to.equal(sellValue);

    expect(order.seller)
      .to.equal(owner.address);
  });

  it("Should cancel order", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("0.5");
    const amountToSell = 100;
    const sellValue = ethers.utils.parseEther("0.01");

    await contract.buyFromSale({
      value: value
    });

    await contract.connect(accounts[1]).buyFromSale({
      value: value
    });

    await contract.finishSale();
    await contract.createTrade();
    await contract.startTrade();

    await expect(contract.connect(accounts[2]).createOrder(100, 100))
      .to.be.revertedWith("Amount exceeds the balance");

    await tokenContract.increaseAllowance(contract.address, amountToSell);
    await contract.createOrder(amountToSell, sellValue);

    let order = await contract.getOrderDetail(0);

    expect(order.seller)
      .to.equal(owner.address);

    await expect(contract.connect(accounts[2]).cancelOrder(0))
      .to.be.revertedWith("You are not the order creator");

    await contract.cancelOrder(0);

    order = await contract.getOrderDetail(0);

    expect(order.seller)
      .to.equal(ethers.constants.AddressZero);
  });

  it("Should fill order", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("0.5");
    const amountToSell = 100;
    const sellValue = ethers.utils.parseEther("0.00001");
    const amountToPay = sellValue.mul(amountToSell);

    await contract.buyFromSale({
      value: value
    });

    await contract.connect(accounts[1]).buyFromSale({
      value: value
    });

    await contract.finishSale();
    await contract.createTrade();
    await expect(contract.fillOrder(0, amountToSell))
      .to.be.revertedWith("Order does not exist");

    //Create order
    await tokenContract.increaseAllowance(contract.address, amountToSell);
    await contract.createOrder(amountToSell, sellValue);

    await expect(contract.fillOrder(0, amountToSell))
      .to.be.revertedWith("Trade round must be ongoing");
    await contract.startTrade();

    await expect(contract.connect(accounts[1]).fillOrder(0, amountToSell + 10))
      .to.be.revertedWith("Amount you want to buy more than sellers quantity");

    await expect(contract.connect(accounts[1]).fillOrder(0, amountToSell, {
      value: amountToPay.sub(100)
    }))
      .to.be.revertedWith("The eth amount is not correct to buy");

    await contract.connect(accounts[2])["register()"]();
    await contract.connect(accounts[1])["register(address)"](accounts[2].address);
    await contract["register(address)"](accounts[1].address);

    await expect(await contract.connect(accounts[3]).fillOrder(0, amountToSell, {
      value: amountToPay
    }))
      .to.changeEtherBalance(accounts[3], -amountToPay) //accounts[3] should lost value since it's the caller
      .to.changeEtherBalance(accounts[1], amountToPay.mul(25).div(1000)) //acc1 should gain %2.5
      .to.changeEtherBalance(accounts[2], amountToPay.mul(25).div(1000)) //acc2 should gain %2.5
      .to.changeEtherBalance(owner, amountToPay.mul(95).div(100)); //owner should gain %95

    const tradeDetail = await contract.getTradeDetail(1);
    expect(tradeDetail.totalTradedAmount)
      .to.equal(amountToPay);
  });

  it("Should finish trade", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("0.5");
    const amountToSell = 100;
    const sellValue = ethers.utils.parseEther("0.00001");

    await contract.buyFromSale({
      value: value
    });

    await contract.connect(accounts[1]).buyFromSale({
      value: value
    });

    await contract.finishSale();
    await contract.createTrade();

    const contractTokens = await tokenContract.balanceOf(contract.address);

    //Create order
    await tokenContract.increaseAllowance(contract.address, amountToSell);
    await contract.createOrder(amountToSell, sellValue);
    await tokenContract.connect(accounts[1]).increaseAllowance(contract.address, amountToSell);
    await contract.connect(accounts[1]).createOrder(amountToSell, sellValue);

    await expect(contract.finishTrade())
      .to.be.revertedWith("Trade round must be ongoing");

    await contract.startTrade();

    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(contractTokens.add(amountToSell * 2));

    let order = await contract.getOrderDetail(0);
    let order2 = await contract.getOrderDetail(1);

    expect(order.seller)
      .to.equal(owner.address);

    expect(order2.seller)
      .to.equal(accounts[1].address);

    await contract.finishTrade();

    //none sold
    expect(await tokenContract.balanceOf(contract.address))
      .to.equal(contractTokens);

    await expect(contract.getOrderDetail(0))
      .to.be.revertedWith("Order does not exist");

    await expect(contract.getOrderDetail(1))
      .to.be.revertedWith("Order does not exist");
  });

  it("Should create new sale", async function () {
    await contract.startSale();

    const value = ethers.utils.parseEther("1");

    await expect(await contract.buyFromSale({
      value: value
    }))
      .to.changeEtherBalance(owner, value.mul(-1))
      .to.changeEtherBalance(contract, value); //contract should gain %100 since no ref

    await expect(contract.createSale())
      .to.be.revertedWith("Previous sale round must be finished first");

    await contract.finishSale();


    await contract.createTrade();
    await contract.startTrade();

    await expect(contract.createSale())
      .to.be.revertedWith("Previous trade round must be finished first");

    const amountToSell = 100;
    const sellValue = ethers.utils.parseEther("0.00001");
    const amountToPay = sellValue.mul(amountToSell);
    //Create order
    await tokenContract.increaseAllowance(contract.address, amountToSell);
    await contract.createOrder(amountToSell, sellValue);

    await contract.connect(accounts[1]).fillOrder(0, amountToSell / 2, {
      value: amountToPay.div(2)
    });

    await contract.connect(accounts[1]).fillOrder(0, amountToSell / 2, {
      value: amountToPay.div(2)
    });

    await contract.finishTrade();

    await contract.createSale();

    const prevSale = await contract.getSaleDetail(1);
    const prevTrade = await contract.getTradeDetail(1);
    const sale = await contract.getSaleDetail(2);

    expect(sale.tokenPrice)
      .to.equal(prevSale.tokenPrice.mul(103).div(100).add(ethers.utils.parseEther("0.000004")));

    expect(sale.allowedSellAmount)
      .to.equal(prevTrade.totalTradedAmount);
  });
});

async function getTokenContract(owner: SignerWithAddress) {
  const tokenFactory = new Token__factory(owner);
  const tokenContract = await tokenFactory.deploy("NAME", "NM");
  await tokenContract.deployed();

  return tokenContract;
}

async function simulateTimePassed() {
  const duration = 3 * (60 * 60 * 24); // 3days is standard
  await ethers.provider.send('evm_increaseTime', [duration]);
}

