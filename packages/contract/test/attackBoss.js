// test/attackBossTest.js

const { expect } = require("chai");

describe("AttackBossContract", function () {
  let attackBossContract;
  let playerTokenId;
  let bossIndex;

  beforeEach(async function () {
    const AttackBossContract = await ethers.getContractFactory("MyEpicGame");
    attackBossContract = await AttackBossContract.deploy();

    // Deploy the contract and set up initial player and boss attributes
    playerTokenId = 1;
    await attackBossContract.setCharacterAttributes(playerTokenId, "Player", 100, 20);

    bossIndex = 0;
    await attackBossContract.setBeverageAttributes(bossIndex, "Boss", 150, 25);
  });

  it("should successfully attack boss and update player and boss HP", async function () {
    // Ensure player and boss are ready for attack
    const initialPlayerHP = await attackBossContract.getCharacterHP(playerTokenId);
    const initialBossHP = await attackBossContract.getBeverageHP(bossIndex);

    expect(initialPlayerHP).to.equal(100);
    expect(initialBossHP).to.equal(150);

    // Attack the boss
    await attackBossContract.attackBoss(playerTokenId, bossIndex);

    // Verify updated player and boss HP after the attack
    const updatedPlayerHP = await attackBossContract.getCharacterHP(playerTokenId);
    const updatedBossHP = await attackBossContract.getBeverageHP(bossIndex);

    expect(updatedPlayerHP).to.be.below(100);
    expect(updatedBossHP).to.be.below(150);
  });
});
