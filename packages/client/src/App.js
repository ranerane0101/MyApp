import Arena from "./Components/Arena/arena";
import myEpicGame from "./utils/MyEpicGame.json";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "./constant";
import React, { useEffect, useState } from 'react';
import './App.css';
//SelectCharacterに入っているファイルをインポートします。
import SelectCharacter from './Components/SelectCharacter';

const App = () => {
  //ユーザーのウォレットアドレスを格納するために使用する状態変数を定義
  const [currentAccount, setCurrentAccount] = useState(null);
  //characterNFTとsetCharacterNFTを初期化します。
  const [characterNFT, setCharacterNFT] = useState(null);
  //ユーザーがSepoliaNetworkに接↑うされているか確認します。
  //11155111はSepoliaのネットワークコードです
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== "11155111") {
        alert("Sepolia Test Network　に接続してください");
      } else {
        console.log("Sepolia　に接続されています");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //ユーザーがMetamaskを持っているかを確認
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        //accountsにウェブサイトを訪れたユーザーのウォレットアカウントを格納します
        //（複数持っている場合も加味、よってaccountsと変数を定義している）
        const accounts = await ethereum.request({ method: "eth_accounts" });
        //もしアカウンっとが一つでも存在したら、以下を実行
        if (accounts.length !== 0) {
          //accountsという変数にユーザーの一つ目（＝JavaScriptでいう0番目）のアドレスを格納
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          //currentAccountにユーザーのアカウントアドレスを格納
          setCurrentAccount(account);

          //これ必要か不安
          checkNetwork();
        } else {
          console.log("No authorized account found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  //レンダリングメソッド
  const renderContent = () => {
    //シナリオ１
    //ユーザーがWEBアプリにログインしていない場合、WEBアプリ上に、"Connect Wallet to Get Started"ボタンを表示する
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://i.imgur.com/TXBQ4cC.png" alt="LUFFY" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      );
      //シナリオ２
      //ユーザーはWEBアプリにログインしており、かつ　NFTキャラクターを持っていない場合、WEBアプリ上に、を表示する

    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
      //シナリオ３
      //ユーザーはWEBアプリにログインしており、かつ、NFTキャラを持っている場合、
      //Arenaでボスと戦います
    } else if (currentAccount && characterNFT) {
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />;
    }
  };
  //connectWallet メソッドを実装します
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("MetaMask をダウンロードしてください！");
        return;
      }

      //ユーザーがウォレットを持っているか確認する。
      checkIfWalletIsConnected();

      //ウォレットアドレスに対してアクセスをリクエストしています
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      //ウォレットアドレスをcurrentAccountに紐付けます
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      //ユーザーがSepoliaに接続されているか確認します。
      checkNetwork();
    } catch (error) {
      console.log(error);
    }
  };

  //ページがロードされたときに、useEffect()内の関数が呼び出されます
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  //ページがロードされた時に、useEffect()内の関数が呼び出されます。
  useEffect(() => {
    //スマートコントラクトを呼び出す関数です
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };

    //接続されたウォレットがある場合のみ、下記を実行します。
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚡️ METAVERSE GAME ⚡️</p>
          <p className="sub-text">プレイヤーと協力してボスを倒そう✨</p>
          {/* renderContent メソッドを呼び出します。 */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
