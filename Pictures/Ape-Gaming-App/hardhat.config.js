require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
 
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.26",
  networks: {
    apechain: {
      url: process.env.ALCHEMY_API_KEY 
        ? `https://apechain-curtis.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        : "https://rpc.apechain.com",
      accounts: [process.env.PRIVATE_KEY],
      timeout: 60000, // Increase timeout to 60 seconds
    },
  },
};