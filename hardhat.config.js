require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            // optimizer: {
            //   enabled: true,
            //   runs: 2000
            // }
        }
    },
    gasReporter: {
        enabled: (process.env.REPORT_GAS) ? true : false
    }
};
