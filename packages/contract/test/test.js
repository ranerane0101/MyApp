const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyEpicGame", function () {
  it("should return beverage data", async function () {
    const MyEpicGame = await ethers.getContractFactory("MyEpicGame");
    const myEpicGameContract = await MyEpicGame.deploy(
        ["ZORO"], //キャラクターの名前
    [
      "https://i.imgur.com/TZEhCTX.png", //キャラクターの画像
      
    ],
    [500], //キャラクターのHP
    [100],//キャラクターの攻撃力
    ["CROCODILE","COFFEE"],//Bossの名前
    ["https://i.imgur.com/BehawOh.png","https://2.bp.blogspot.com/-PpB9nmUiJgY/WzC9bkuNo3I/AAAAAAABM4o/9IluPPFOSn0GBC-YGP_3k3c4dFsJZeLlQCLcBGAs/s800/coffee_cup_paper_sleeve.png"],//Bossの画像
    [100,200],//Bossのhp
    [100,200]//Bossの攻撃力
    );
    await myEpicGameContract.deployed();

    const index = 0; // テストするインデックスを選択
    const result = await myEpicGameContract.getBeverage(index);

    // getBeverage 関数の結果を検証
    expect(result[0].name).to.equal("CROCODILE");
    expect(result[0].imageURI).to.equal("https://i.imgur.com/BehawOh.png");
    expect(result[0].hp).to.equal(100);
    expect(result[0].maxHp).to.equal(100);
    expect(result[0].attackDamage).to.equal(100);

  });
});
