import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Marketplace, Marketplace__factory } from "../typechain-types";


task("register", "Register")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);
        await contract["register()"]();
        console.log("Registered without referral");
    });

task("register-referral", "Register using referral")
    .addParam("contract", "The address of the contract")
    .addParam("referral", "The address of the referral")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract["register(address)"](taskArgs.referral);
        console.log("Registered using referral address: " + taskArgs.referral);
    });

task("create-sale", "Creates a sale")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.createSale();
        const round = await contract.round;
        console.log("Sale created. Current round: " + round);
    });

task("start-sale", "Starts the sale")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.startSale();
        const round = await contract.round;
        console.log("Sale started. Current round: " + round);
    });

task("finish-sale", "Finishes the sale")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.finishSale();
        const round = await contract.round;
        console.log("Sale finished. Current round: " + round);
    });

task("buy-from-sale", "Buys from the sale")
    .addParam("contract", "The address of the contract")
    .addParam("amount", "The amount of eth to buy")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.buyFromSale({
            value: taskArgs.amount
        })
        console.log("Bought " + taskArgs.amount + " wei amounts of token");
    });

task("create-trade", "Creates the trade round")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.createTrade();
        const round = await contract.round;
        console.log("Trade created. Current round: " + round);
    });

task("start-trade", "Starts the trade round")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.startSale();
        const round = await contract.round;
        console.log("Trade started. Current round: " + round);
    });

task("finish-trade", "Finishes the trade round")
    .addParam("contract", "The address of the contract")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.startSale();
        const round = contract.round;
        console.log("Trade finished. Current round: " + round);
    });

task("create-order", "Creates an order")
    .addParam("contract", "The address of the contract")
    .addParam("amount", "The amount of token to sell")
    .addParam("price", "The of each token")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.createOrder(taskArgs.amount, taskArgs.price);
        console.log("Order created. Selling: " + taskArgs.amount + " tokens, for the price: " + taskArgs.price);
    });

task("cancel-order", "Cancels an order")
    .addParam("contract", "The address of the contract")
    .addParam("index", "The index of the order")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        await contract.cancelOrder(taskArgs.index);
        console.log("Order " + taskArgs.index + " canceled");
    });

task("fill-order", "Fills an order")
    .addParam("contract", "The address of the contract")
    .addParam("index", "The index of the order")
    .addParam("amount", "The amount of token to buy")
    .setAction(async (taskArgs, hre) => {
        const contract: Marketplace = await getMarketplace(hre, taskArgs.contract);

        const orderDetail = await contract.getOrderDetail(taskArgs.index);
        const ethToSend = taskArgs.amount.mul(orderDetail.price);

        await contract.fillOrder(taskArgs.index, taskArgs.amount, { value: ethToSend });
        console.log("Order filled. Bought: " + taskArgs.amount + " .In total spent: " + ethToSend);
    });

async function getMarketplace(hre: HardhatRuntimeEnvironment, contractAddress: string) {
    const MyContract: Marketplace__factory = <Marketplace__factory>await hre.ethers.getContractFactory("Marketplace__factory");
    const contract: Marketplace = MyContract.attach(contractAddress);
    return contract;
}
