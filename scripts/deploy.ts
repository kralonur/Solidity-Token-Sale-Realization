import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Marketplace__factory, Token__factory } from "../typechain-types";

async function main() {
  const [owner] = await ethers.getSigners();
  const tokenContract = await getTokenContract(owner);
  const tokenFactory = new Marketplace__factory(owner);
  const contract = await tokenFactory.deploy(tokenContract.address);
  await contract.deployed();

  console.log("ErcToken deployed to:", tokenContract.address);
  console.log("Marketplace deployed to:", contract.address);
}

async function getTokenContract(owner: SignerWithAddress) {
  const tokenFactory = new Token__factory(owner);
  const tokenContract = await tokenFactory.deploy("NAME", "NM");
  await tokenContract.deployed();

  return tokenContract;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
