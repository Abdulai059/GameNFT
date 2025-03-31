// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
 
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
 
module.exports = buildModule("GameNFT", (m) => {
  const gameNFT = m.contract("GameNFT", ["0xfc39142b8121e5675314BAcf09cB1cE6f3a3645d"]); // Replace with actual APE token address
 
  return { gameNFT };
});