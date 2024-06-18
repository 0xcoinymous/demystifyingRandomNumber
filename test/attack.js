const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/")

const runs = 100

describe("attack", () => {

    const privatSeed = 111

    async function deployAndSetupContracts() {
        const [deployer, destroyer] = await ethers.getSigners();

        const Victim = ethers.getContractFactory("Victim");
        const Attacker = ethers.getContractFactory("Attacker");

        const victim = (await Victim).deploy(privatSeed)
        const attacker = (await Attacker).deploy() 

        console.log("victim address:", (await victim).target);

        await network.provider.send("hardhat_setBalance", [
            deployer.address,
            "0x1000000000000000000000",  // 19342805113825779031636186
        ]);

        // console.log("victim balance", await ethers.provider.getBalance((await victim).target));
        console.log("deployer balance", await ethers.provider.getBalance(deployer.address));  

        return {deployer, destroyer, victim, attacker}
    }

    it("simulate attack1 (article's method) and attack2 (my method)", async () => {      
        const {deployer, destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)
        const attack1 = async () => {
            await expect((await victim).connect(deployer).lottery({value: ethers.parseEther("8")})).to.changeEtherBalance((await victim).target, ethers.parseEther("8"))

            let destroyerBalanceBefore = await ethers.provider.getBalance(destroyer.address)

            await expect((await attacker).connect(destroyer).attack1(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
            
            let destroyerBalanceAfter = await ethers.provider.getBalance(destroyer.address)
            console.log('attack1 fee :>> ', (ethers.parseEther("8") - destroyerBalanceAfter + destroyerBalanceBefore));
        }

        const attack2 = async () => {
            await expect((await victim).connect(deployer).lottery({value: ethers.parseEther("8")})).to.changeEtherBalance((await victim).target, ethers.parseEther("8"))

            let destroyerBalanceBefore = await ethers.provider.getBalance(destroyer.address)

            await expect((await attacker).connect(destroyer).attack2(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
            
            let destroyerBalanceAfter = await ethers.provider.getBalance(destroyer.address)
            console.log('attack2 fee :>> ', (ethers.parseEther("8") - destroyerBalanceAfter + destroyerBalanceBefore));
        }

        let i = 0
        while(i <= runs){
            console.log(`round ${i}:`);
            await attack1()
            await attack2()
            i++
        }
    }).timeout(1000000);

    // it("simulate attack1 (article's method) and attack2 (my method)", async () => {      
    //     const attack1 = async () => {
    //         const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)
    //         console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    //         let trxGot = await expect((await attacker).connect(destroyer).attack1(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
    //         console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    //     }

    //     const attack2 = async () => {
    //         const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)
    //         console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    //         await expect((await attacker).connect(destroyer).attack2(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
    //         console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    //     }

    //     let i = runs
    //     while(i >= 0){
    //         await attack1()
    //         await attack2()
    //         i--
    //     }
    // })

    // it("attack method3 (my method2)", async () => {
    //     const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)

    //     let nonce = 0
    //     while(true){
    //         let result = await (await attacker).checkNonce(privatSeed, nonce)
    //         // console.log('result :>> ', result)
    //         if(result == true){
    //             break
    //         }
    //         nonce++;
    //     }
    //     console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    //     await expect((await attacker).connect(destroyer).attack3((await victim).target, nonce, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
    //     console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    // })
}) 

/*
attack1    0xdflsjdflsdfjldfjsldfjsldfjskldkf    gas: 10000 GWei    nonce: 20


*/  // 7999797524727762104


// 8.561497 %
// means 91.5% decrease in gas usage.