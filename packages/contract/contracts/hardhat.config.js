require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/uqlL1WrqkM2lCTnB2VYNqtWLasCbhD3p",
      accounts: ["129c98c590b13a2bd9689e0da86604eb2f367111727cb01fe1acbb13b20fb577"],
    },
  },
};
