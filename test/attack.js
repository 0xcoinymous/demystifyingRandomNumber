const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("attack", () => {

    const privatSeed = 111

    async function deployAndSetupContracts() {
        const [deployer, destroyer] = await ethers.getSigners();

        const Victim = ethers.getContractFactory("Victim");
        const Attacker = ethers.getContractFactory("Attacker");

        const victim = (await Victim).deploy(privatSeed)
        const attacker = (await Attacker).deploy() 

        console.log((await victim).target);

        await expect((await victim).connect(deployer).lottery({value: ethers.parseEther("8")})).to.changeEtherBalance((await victim).target, ethers.parseEther("8"))

        console.log("victim balance", await ethers.provider.getBalance((await victim).target));

        return {deployer, destroyer, victim, attacker}
    }

    it("attack method1 (article's method)", async () => {
        const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)

        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
        await expect((await attacker).connect(destroyer).attack1(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    })

    it("attack method2 (article's method)", async () => {
        const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)

        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
        await expect((await attacker).connect(destroyer).attack2(privatSeed, (await victim).target, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    })

    it("attack method3 (article's method)", async () => {
        const {destroyer, victim, attacker} = await loadFixture(deployAndSetupContracts)

        let nonce = 0
        while(true){
            let result = await (await attacker).checkNonce(privatSeed, nonce)
            // console.log('result :>> ', result)
            if(result == true){
                break
            }
            nonce++;
        }
        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
        await expect((await attacker).connect(destroyer).attack3((await victim).target, nonce, {value: ethers.parseEther("1")})).to.changeEtherBalance(destroyer.address, ethers.parseEther("8"))
        console.log("destroyer balance", await ethers.provider.getBalance(destroyer.address))
    })
}) 
