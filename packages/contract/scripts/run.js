//run.js
const main = async () => {
  
    //これにより、`MyEpicGame`コントラクトがコンパイルされます。
    //コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルがartifactsディレクトリの直下に生成されます。
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    //HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。
    const gameContract = await gameContractFactory.deploy(
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
    //ここでは、`nftGame`コントラクトが、
    //ローカルのブロックチェーンにデプロイされるまで待つ処理を行なっている。
    const nftGame = await gameContract.deployed();
  
    console.log("Contract deployed to:", nftGame.address);
  
    let txn;

    txn = await gameContract.mintCharacterNFT(0);

    await txn.wait();
    txn = await gameContract.attackBoss();
    await txn.wait();
    
    console.log('First attack.');
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  runMain();