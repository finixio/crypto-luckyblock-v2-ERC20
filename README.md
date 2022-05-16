# LuckyBlock_ETH(V2)

<p>ERC20 token contract with mintable access upto 100 billion tokens. </p>

## Functions

### Constructor

| Name        | Type    | Description         |
| ----------- | ------- | ------------------- |
| name\_      | string  | Name of the token   |
| symbol\_    | string  | Symbol of the token |
| isMinting\_ | boolean | Minting status      |

The `isMinting()` function will return the current minting status of the token contract.

### Name

```solidity
function name() public view virtual override returns (string memory)
```

Returns the name of the token contract.

### Symbol

```solidity
function symbol() public view virtual override returns (string memory)
```

Returns the symbol of the token contract.

### Decimals

```solidity
function decimals() public view virtual override returns (uint8)
```

Returns the decimals of the token contract. Since the LuckyBlock token on the Binance Smart Chain has 9 decimals, this value is set in the code.

### TotalSupply

```solidity
function totalSupply() public view virtual override returns (uint256)
```

Returns the current total supply of the token. This value updates everytime `mint` action is performed by the `minter` till it reaches the `HARD_CAP`.

### ChangeMinter

```solidity
function changeMinter(address _newMinter) external onlyOwner
```

| Name        | Type    | Description                |
| ----------- | ------- | -------------------------- |
| \_newMinter | address | New address for the minter |

Allows the `owner` of the contract to change the `minter`.

### ChangeMintingStatus

```solidity
function changeMintingStatus(bool isMinting_) external onlyOwner
```

| Name        | Type    | Description                       |
| ----------- | ------- | --------------------------------- |
| isMinting\_ | boolean | New minting status to be applied. |

Allows the `owner` of the contract to change the `isMinting` status.

### BalanceOf

```solidity
function balanceOf(address account) public view virtual override returns(uint256)
```

| Name    | Type    | Description         |
| ------- | ------- | ------------------- |
| account | address | Address of the user |

Returns the token balance of the user acccount.

### Transfer

```solidity
function transfer(address recipient, uint256 amount) public virtual override returns (bool)
```

| Name      | Type    | Description             |
| --------- | ------- | ----------------------- |
| recipient | address | Reciever of the tokens  |
| amount    | uint256 | # of tokens to be sent. |

Allows the user to transfer tokens to other users.

### Allowance

```solidity
function allowance(address _owner, address _spender) public view virtual override returns (uint256)
```

| Name      | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| \_owner   | address | Address to check the allowance from |
| \_spender | address | Address to check the allowance to   |

Allows the user to check the # of `_owner` tokens that are given as allowance to `_spender`.

### Approve

```solidity
function approve(address spender, uint256 amount) public virtual override returns (bool)
```

| Name    | Type    | Description                   |
| ------- | ------- | ----------------------------- |
| spender | address | Address to give allowance to  |
| amount  | uint256 | # of tokens to give allowance |

Allows the caller to give `amount` no of tokens as allowance to `spender`.

### TransferFrom

```solidity
function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool)
```

| Name      | Type    | Description                     |
| --------- | ------- | ------------------------------- |
| sender    | address | Address to transfer tokens from |
| recipient | address | Address to transfer tokens to   |
| amount    | uint256 | # of tokens to transfer         |

Allows the caller to send `amount` no of tokens from the `sender` to `recipient`.

### IncreaseAllowance

```solidity
function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool)
```

| Name       | Type    | Description                          |
| ---------- | ------- | ------------------------------------ |
| spender    | address | Address to increase allowance for    |
| addedValue | uint256 | # of tokens to increase allowance to |

Allows the caller to increase allowance to `spender` by `addedValue` amount of tokens.

### DecreaseAllowance

```solidity
function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool)
```

| Name            | Type    | Description                          |
| --------------- | ------- | ------------------------------------ |
| spender         | address | Address to decrease allowance for    |
| subtractedValue | uint256 | # of tokens to decrease allowance to |

Allows the caller to decrease allowance to `spender` by `subtractedValue` amount of tokens.

### Mint

```solidity
function mint(address user, uint256 amount) external onlyMinter minting returns (bool)
```

| Name   | Type    | Description                   |
| ------ | ------- | ----------------------------- |
| user   | address | Address to mint new tokens to |
| amount | uint256 | # of tokens to mint.          |

Allows only the `minter` to mint new tokens to the `user` when the `isMinting` status is `true`.

The `mint` function will not allow minting of tokens more than `HARD_CAP` set in during deployment(100 billion).
