require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers")
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        defaultNetwork: "localhost",
        networks:{
            localhost: {
                url: "http://127.0.0.1:8545/",
                // mining: {
                //     auto: false,
                //     interval: 0
                // },
                // blockGasLimit: 300000000
            }
        },
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
