const { assert } = require("chai");
const truffleAssertions = require("truffle-assertions");

const tokenContract = artifacts.require("./LuckyBlock_ETH.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Testing", (accounts) => {
  let token;
  before(async () => {
    token = await tokenContract.new("Test", "TST", false);
  });
  describe("deployment", async () => {
    it("deploys token successfully", async () => {
      const address = await token.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("TOKEN: metadata", async () => {
    it("has a name", async () => {
      const name = await token.name();
      name.should.equal("Test", "Name not set correctly");
    });

    it("has a symbol", async () => {
      const symbol = await token.symbol();
      symbol.should.equal("TST", "Symbol not set correctly");
    });

    it("has 9 decimals", async () => {
      const decimals = await token.decimals();
      decimals.toString().should.equal("9", "Decimals not set correctly");
    });

    it("should return totalSupply as 0 initially", async () => {
      const totalSupply = await token.totalSupply();
      totalSupply.toString().should.equal("0", "Total supply is not 0");
    });

    it("should return correct minting status after deployment", async () => {
      const mint = await token.isMinting();
      mint.should.equal(false, "Mint status is not set correctly");
    });

    it("should return correct Hard Cap", async () => {
      const hard_cap = await token.HARD_CAP();
      hard_cap
        .toString()
        .should.equal("100000000000000000000", "Hard cap not set correctly");
    });
  });

  describe("TOKEN: privileges", async () => {
    it("should not allow others to change the minter", async () => {
      await truffleAssertions.fails(
        token.changeMinter(accounts[5], { from: accounts[4] }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not allow others to change the minting status", async () => {
      await truffleAssertions.reverts(
        token.changeMintingStatus(true, { from: accounts[5] }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not allow the owner to add 0 address for minting", async () => {
      await truffleAssertions.reverts(
        token.changeMinter("0x0000000000000000000000000000000000000000"),
        "Zero Minting address"
      );
    });

    it("should allow the owner to change the minter", async () => {
      await token.changeMinter(accounts[1]);
      const minter = await token.minter();
      minter.should.equal(accounts[1], "Minter not changed successfully");
    });

    it("should allow the owner to change the minting status", async () => {
      await token.changeMintingStatus(true);
      const status = await token.isMinting();
      status.should.equal(true, "Minting status not changed successfully");
    });
  });

  describe("TOKEN: minting", async () => {
    it("should not allow other to mint", async () => {
      await truffleAssertions.reverts(
        token.mint(accounts[2], "1000000000"),
        "Not the minter"
      );
    });

    it("should not allow the minter to mint to 0 address", async () => {
      await truffleAssertions.reverts(
        token.mint("0x0000000000000000000000000000000000000000", "1000", {
          from: accounts[1],
        }),
        "ERC20: mint to the zero address"
      );
    });

    it("should not allow the minter to mint more than 100bln tokens", async () => {
      await truffleAssertions.reverts(
        token.mint(accounts[2], "100000000000000000001", { from: accounts[1] }),
        "Hard cap exceeded!"
      );
    });

    it("should allow the minter to mint", async () => {
      await token.mint(accounts[2], "10000000000", { from: accounts[1] });
      const balance = await token.balanceOf(accounts[2]);
      balance
        .toString()
        .should.equal("10000000000", "Mint/Balance update failed");
      const totalSupply = await token.totalSupply();
      totalSupply
        .toString()
        .should.equal("10000000000", "Total supply update failed");
    });

    it("should not allow minter to mint when minting status is false", async () => {
      await token.changeMintingStatus(false);
      await truffleAssertions.reverts(
        token.mint(accounts[2], "1000000000", { from: accounts[1] }),
        "Minting is disabled"
      );
    });
  });

  describe("TOKEN: transfers", async () => {
    it("should allow the users to transfer tokens", async () => {
      await token.transfer(accounts[3], "10000000000", { from: accounts[2] });
      const balance = await token.balanceOf(accounts[3]);
      const balanceSender = await token.balanceOf(accounts[2]);
      balance.toString().should.equal("10000000000", "Transfer failed");
      balanceSender.toString().should.equal("0", "Transfer failed");
    });

    it("should not allow users to give approval to 0 address", async () => {
      await truffleAssertions.reverts(
        token.approve("0x0000000000000000000000000000000000000000", "100000", {
          from: accounts[3],
        }),
        "ERC20: approve to the zero address"
      );
    });

    it("should allow the users to give approval", async () => {
      await token.approve(accounts[4], "500000000", { from: accounts[3] });
      const approval = await token.allowance(accounts[3], accounts[4]);
      approval.toString().should.equal("500000000", "Allowance update failed");
    });

    it("should allow users to increase allowance", async () => {
      await token.increaseAllowance(accounts[4], "500000000", {
        from: accounts[3],
      });
      const approval = await token.allowance(accounts[3], accounts[4]);
      approval
        .toString()
        .should.equal("1000000000", "Allowance increase failed");
    });

    it("should allow users to decrease allowance", async () => {
      await token.decreaseAllowance(accounts[4], "500000000", {
        from: accounts[3],
      });
      const approval = await token.allowance(accounts[3], accounts[4]);
      approval
        .toString()
        .should.equal("500000000", "Allowance decrease failed");
    });

    it("should allow users to transfer from other wallets", async () => {
      await token.transferFrom(accounts[3], accounts[5], "100000000", {
        from: accounts[4],
      });
      const balance = await token.balanceOf(accounts[5]);
      balance.toString().should.equal("100000000", "Transfer failed");
      const approval = await token.allowance(accounts[3], accounts[4]);
      approval
        .toString()
        .should.equal("400000000", "Allowance not changed after transfer");
    });

    it("should not allow users to tranfer more than allowance", async () => {
      await truffleAssertions.reverts(
        token.transferFrom(accounts[3], accounts[5], "1000000000", {
          from: accounts[4],
        }),
        "ERC20: transfer amount exceeds allowance"
      );
    });

    it("should not allow users to decrease allowance below zero", async () => {
      await truffleAssertions.reverts(
        token.decreaseAllowance(accounts[4], "500000000", {
          from: accounts[3],
        }),
        "ERC20: decreased allowance below zero"
      );
    });

    it("should not allow transfer to 0 address", async () => {
      await truffleAssertions.reverts(
        token.transfer(
          "0x0000000000000000000000000000000000000000",
          "500000000",
          {
            from: accounts[3],
          }
        ),
        "ERC20: transfer to the zero address"
      );
    });

    it("should not allow transfer more than balance", async () => {
      await truffleAssertions.reverts(
        token.transfer(accounts[6], "50000000000", {
          from: accounts[3],
        }),
        "ERC20: transfer amount exceeds balance"
      );
    });
  });

  describe("TOKEN: ownership", async () => {
    it("should not allow others to change the owner", async () => {
      await truffleAssertions.reverts(
        token.transferOwnership(accounts[6], { from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not allow owner to set 0 address", async () => {
      await truffleAssertions.reverts(
        token.transferOwnership("0x0000000000000000000000000000000000000000", {
          from: accounts[0],
        }),
        "Ownable: new owner is the zero address"
      );
    });

    it("should not allow others to renounce the ownership", async () => {
      await truffleAssertions.reverts(
        token.renounceOwnership({ from: accounts[1] }),
        "Ownable: caller is not the owner"
      );
    });

    it("should allow owner to change owner", async () => {
      await token.transferOwnership(accounts[6], { from: accounts[0] });
      const owner = await token.owner();
      owner.should.equal(accounts[6], "Zero address owner failed");
    });

    it("should allow owner to renounce the ownership", async () => {
      await token.renounceOwnership({ from: accounts[6] });
      const owner = await token.owner();
      owner.should.equal(
        "0x0000000000000000000000000000000000000000",
        "Zero address owner failed"
      );
    });
  });
});
