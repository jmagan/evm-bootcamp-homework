# ky6YXu - cryptodabbler's local smart contract interactions

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

1. Create and deploy contract:

Output/log:

```
creation of HelloWorld pending...
[vm]from: 0xdD8...92148to: HelloWorld.(constructor)value: 0 weidata: 0x608...a0033logs: 0hash: 0x6f2...b73b4
status	0x1 Transaction mined and execution succeed
transaction hash	0x6f2123d01151d12b7ed8cf12e18aba161493d45c685044ad51d0a3fa779b73b4
block hash	0xb098738cdaf6a8c8cd6b775c7942a1b51d525cd5729d9cb58a2df99f47f06af6
block number	7
contract address	0x6a4583868847e0b8B00E367293F5A5443Db8a09c
from	0xdD870fA1b7C4700F2BD7f44238821C26f7392148
to	HelloWorld.(constructor)
gas	668586 gas
transaction cost	581379 gas 
execution cost	481007 gas 
```

Contract address: 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
Owner: 0xdD870fA1b7C4700F2BD7f44238821C26f7392148

2. call to HelloWorld.helloWorld()

Output/log:

```
[call]from: 0xdD870fA1b7C4700F2BD7f44238821C26f7392148to: HelloWorld.helloWorld()data: 0xc60...5f76c
from	0xdD870fA1b7C4700F2BD7f44238821C26f7392148
to	HelloWorld.helloWorld() 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
execution cost	3350 gas (Cost only applies when called by a contract)
input	0xc60...5f76c
output	0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b48656c6c6f20576f726c64000000000000000000000000000000000000000000
decoded input	{}
decoded output	{
	"0": "string: Hello World"
}
logs	[]
raw logs	[]
```


3. call to HelloWorld.setText(), by owner 0xdD870fA1b7C4700F2BD7f44238821C26f7392148

Output/log:

```
[vm]from: 0xdD8...92148to: HelloWorld.setText(string) 0x6a4...8a09cvalue: 0 weidata: 0x5d3...00000logs: 0hash: 0x7ec...a377c
status	0x1 Transaction mined and execution succeed
transaction hash	0x7ecfddb82abef98dcad6ad84fba682084f5d4f693246a878a6831f2998fa377c
block hash	0xfae703988dd38bf4a5ef7567e83d41a4a713a04def03c8b305534d5cdebbc9d1
block number	8
from	0xdD870fA1b7C4700F2BD7f44238821C26f7392148
to	HelloWorld.setText(string) 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
gas	34530 gas
transaction cost	30026 gas 
execution cost	8230 gas 
input	0x5d3...00000
output	0x
decoded input	{
	"string newText": "hello cryptodabbler testing"
}
decoded output	{}
logs	[]
raw logs	[]
```

4. Transfer ownership

owner 0xdD870fA1b7C4700F2BD7f44238821C26f7392148 calls HelloWorld.transferOwnership() to transfer ownership to account 0x583031D1113aD414F02576BD6afaBfb302140225

Output/log:

```
transact to HelloWorld.transferOwnership pending ... 
[vm]from: 0xdD8...92148to: HelloWorld.transferOwnership(address) 0x6a4...8a09cvalue: 0 weidata: 0xf2f...40225logs: 0hash: 0x1ec...db220
status	0x1 Transaction mined and execution succeed
transaction hash	0x1ec12a1f8b63a5930708a9f4de64d29e5c1c98857385c3d6619f79c9f5bdb220
block hash	0xee8d4e641ae9b584ac59502b2798c473157674f99fd0d131ff1e7b0370c864bb
block number	9
from	0xdD870fA1b7C4700F2BD7f44238821C26f7392148
to	HelloWorld.transferOwnership(address) 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
gas	31234 gas
transaction cost	27160 gas 
execution cost	5728 gas 
input	0xf2f...40225
output	0x
decoded input	{
	"address newOwner": "0x583031D1113aD414F02576BD6afaBfb302140225"
}
decoded output	{}
logs	[]
raw logs	[]
>
```


5. call to HelloWorld.setText() again, by 0xdD870fA1b7C4700F2BD7f44238821C26f7392148

Output/Log:

```
transact to HelloWorld.setText pending ... 
[vm]from: 0xdD8...92148to: HelloWorld.setText(string) 0x6a4...8a09cvalue: 0 weidata: 0x5d3...00000logs: 0hash: 0xafc...19de1
status	0x0 Transaction mined but execution failed
transaction hash	0xafcfaa62ab81323196040afd3489e27ec12ae9d5ed3f967252b1df3825919de1
block hash	0xa4f9e0572ed7d5f99c02ee7984f61d886a3de95b238462a89d7a4a0ab57698d6
block number	10
from	0xdD870fA1b7C4700F2BD7f44238821C26f7392148
to	HelloWorld.setText(string) 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
gas	3000000 gas
transaction cost	25001 gas 
execution cost	2897 gas 
input	0x5d3...00000
output	0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001743616c6c6572206973206e6f7420746865206f776e6572000000000000000000
decoded input	{
	"string newText": "hello cryptodabbler testing after transfer"
}
decoded output	{}
logs	[]
raw logs	[]
transact to HelloWorld.setText errored: Error occurred: revert.

revert
	The transaction has been reverted to the initial state.
Reason provided by the contract: "Caller is not the owner".
If the transaction failed for not having enough gas, try increasing the gas limit gently.
```

Because 0xdD870fA1b7C4700F2BD7f44238821C26f7392148 is no longer the owner, the transaction fails at onlyOwner()

6. call to HelloWorld.setText(), by 0x583031D1113aD414F02576BD6afaBfb302140225

Output/Log:

```
transact to HelloWorld.setText pending ... 
[vm]from: 0x583...40225to: HelloWorld.setText(string) 0x6a4...8a09cvalue: 0 weidata: 0x5d3...00000logs: 0hash: 0xb5e...10eaf
status	0x1 Transaction mined and execution succeed
transaction hash	0xb5ed49247de79cfbe110dceaf27db1c875dc9676e2543b568e20414f57910eaf
block hash	0x2024f8bf2599dd381359f003d57079ea86a4fe462fe47994d0f86474c1993cb1
block number	11
from	0x583031D1113aD414F02576BD6afaBfb302140225
to	HelloWorld.setText(string) 0x6a4583868847e0b8B00E367293F5A5443Db8a09c
gas	112068 gas
transaction cost	97450 gas 
execution cost	74810 gas 
input	0x5d3...00000
output	0x
decoded input	{
	"string newText": "hello testing from 0x583031D1113aD414F02576BD6afaBfb302140225 after transfer"
}
decoded output	{}
logs	[]
raw logs	[]
>
```

This succeeds because 0x583031D1113aD414F02576BD6afaBfb302140225 is the owner.
