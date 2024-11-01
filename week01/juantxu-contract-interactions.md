# l0hxPm - Juantxu's smart contract interactions

## Contract code

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    string private text;
    address public owner;

    modifier onlyOwner()
    {
        require (msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor() {
        text = "Hello World";
        owner = msg.sender;
    }

    function helloWorld() public view returns (string memory) {
        return text;
    }

    function setText(string calldata newText) public onlyOwner {
        text = newText;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
```

## Interactions

1. Contract deployment:

Log:

```
OK: [vm]from: 0x5B3...eddC4to: HelloWorld.(constructor)value: 0 weidata: 0x608...a0033logs: 0hash: 0x183...356cf
```

Now we have the contract at the address: 0xf8e81D47203A594245E36C48e151709F0C19fBe8. The owner is: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4.

2. Call helloWorld with new contract

Log:

```
OK: [call]from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4to: HelloWorld.helloWorld()data: 0xc60...5f76c
```

It returns the initial text:

Output:

```json
{
  "0": "string: Hello World"
}
```

3. Owner call setText

The owner account (0x5B38Da6a701c568545dCfcB03FcB875f56beddC4) call the setText.

Log:

```
OK: [vm]from: 0x5B3...eddC4to: HelloWorld.setText(string) 0xf8e...9fBe8value: 0 weidata: 0x5d3...00000logs: 0hash: 0x77c...f63e7
```

Now, we can call helloWorld:

```
OK: [call]from: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4to: HelloWorld.helloWorld()data: 0xc60...5f76c
```

Output:

```json
{
  "0": "string: Juantxu was here"
}
```

4. Account 2 call setText

The account 2 (0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2) calls `setText`method. It should fails because we have the `onlyOwner`modifier.

Log:

```
FAIL: [vm]from: 0xAb8...35cb2to: HelloWorld.setText(string) 0xf8e...9fBe8value: 0 weidata: 0x5d3...00000logs: 0hash: 0x51a...01465

transact to HelloWorld.setText errored: Error occurred: revert.

revert
	The transaction has been reverted to the initial state.
Reason provided by the contract: "Caller is not the owner".
If the transaction failed for not having enough gas, try increasing the gas limit gently.
```

As expected, the transaction fails because we aren't the owner

5. Change owner to account 2 and change text

The owner change the owner to account 2 and we change the text with the new owner.

We call `transferOwnership(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2)`.

Log:

```
OK: [vm]from: 0x5B3...eddC4to: HelloWorld.transferOwnership(address) 0xf8e...9fBe8value: 0 weidata: 0xf2f...35cb2logs: 0hash: 0x40e...64544
```

Now we call `setText("Account 2 was here")` within account 2:

Log:

```
OK: [vm]from: 0xAb8...35cb2to: HelloWorld.setText(string) 0xf8e...9fBe8value: 0 weidata: 0x5d3...00000logs: 0hash: 0x66e...acaa3
```

If anybody calls `helloWorld`, the text is "Account 2 was here":

Log:

```
OK: [call]from: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2to: HelloWorld.helloWorld()data: 0xc60...5f76c
```

Output:

```json
{
  "0": "string: Account 2 was here"
}
```
