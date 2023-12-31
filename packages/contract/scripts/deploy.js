//deploy.js
const main = async () => {
  
  //これにより、`MyEpicGame`コントラクトがコンパイルされます。
  //コントラクトがコンパイルされたら、コントラクトを扱うために必要なファイルがartifactsディレクトリの直下に生成されます。
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  //HardhatがローカルのEthereumネットワークを、コントラクトのためだけに作成します。
  const gameContract = await gameContractFactory.deploy(
    ["財布"], //キャラクターの名前
    [
      "https://2.bp.blogspot.com/-6eX4a0aKzH0/UVTVHAV0-DI/AAAAAAAAPCc/JP2uDFtSvqk/s1600/saifu_gamaguchi.png", //キャラクターの画像
      
    ],
    [500], //キャラクターのHP
    [100],//キャラクターの攻撃力
    ["いちごオレ","コーヒー"],//Bossの名前
    ["https://3.bp.blogspot.com/-QRmjSVflVnI/WUdZD_XfNaI/AAAAAAABFCQ/lOmpyY_m4w4SeiAbvaUNsEC9RIHOG8pewCLcBGAs/s800/milk_ichigo_pack.png","https://2.bp.blogspot.com/-PpB9nmUiJgY/WzC9bkuNo3I/AAAAAAABM4o/9IluPPFOSn0GBC-YGP_3k3c4dFsJZeLlQCLcBGAs/s800/coffee_cup_paper_sleeve.png"],//Bossの画像
    [100,200],//Bossのhp
    [100,200]//Bossの攻撃力
  );
  //ここでは、`nftGame`コントラクトが、
  //ローカルのブロックチェーンにデプロイされるまで待つ処理を行なっている。
  const nftGame = await gameContract.deployed();

  console.log("Contract deployed to:", nftGame.address);

  
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