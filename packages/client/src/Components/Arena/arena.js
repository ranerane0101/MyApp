import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constant";
import InvalidAttackMessage from "../InvalidAttackMessage/InvalidAttackMessage";
import myEpicGame from "../../utils/MyEpicGame.json";
import "./Arena.css";

//NFT キャラの情報を更新するため、setCharacterNFT を引数として追加します
const Arena = ({ characterNFT, setCharacterNFT }) => {
    //コントラクトのデータを保有する状態変数を初期化します
    const [gameContract, setGameContract] = useState(null);

    //攻撃の状態を保存する変数を初期化します
    const [attackState, setAttackState] = useState("");

    //ボスのメタデータを保存する状態変数を初期化します
    const [bosses, setBosses] = useState([]);

    //NFTキャラクターがボスを攻撃する際に使用する関数を定義している
    const runAttackAction = async (bossesIndex) => {
        try {
            //コントラクトが呼び出されたことを確認します
            if (gameContract) {
                //attackState　の状態をattacking に設定します
                setAttackState("attacking");
                console.log("Attacking boss...");

                //NFTキャラがボスを攻撃します
                const attackTxn = await gameContract.attackBoss(bossesIndex);

                //トランザクションがマイニングされるまで待ちます
                await attackTxn.wait();
                console.log("attackTxn:", attackTxn);

                //attackState の状態を　hitに設定します。
                setAttackState("hit");
            }
        } catch (error) {
            console.error("Error attacking boss:", error);
            setAttackState("invalid");
        }
    };

    //ページがロードされると下記が実行される
    useEffect(() => {
        // ボスのデータを取得する関数を追加します
        const fetchBosses = async () => {
            const boss1 = await gameContract.getBeverage(0);
            const boss2 = await gameContract.getBeverage(1);


            console.log("Boss 1:", boss1);
            console.log("Boss 2:", boss2);

            // ボスの状態を設定します
            setBosses([
                transformCharacterData(boss1),
                transformCharacterData(boss2)
            ]);
        };

        // AttackCompleteイベントを受信した時に起動するコールバックメソッドを追加します
        const onAttackComplete = (newBossHp, newPlayerHp) => {
            //ボスの新しいHPを取得します
            const bossHp = newBossHp.toNumber();
            //NFTキャラの新しいHPを取得する
            const playerHp = newPlayerHp.toNumber();
            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

            //NFTキャラとボスのHPを更新します
            setBosses((prevState) => {
                return { ...prevState, hp: bossHp };
            });
            setCharacterNFT((prevState) => {
                return { ...prevState, hp: playerHp };
            });
        };

        //コントラクトが呼び出されていたら、下記を実行します。
        if (gameContract) {
            fetchBosses();
            // リスナーの設定：ボスが攻撃された通知を受け取ります
            gameContract.on("AttackComplete", onAttackComplete);
        }

        //コンポーネントがマウントされたら、リスナーを停止する
        return () => {
            if (gameContract) {
                gameContract.off("AttackComplete", onAttackComplete);
            }
        };
    }, [gameContract]);
    //ページがロードされると下記が実行されます
    useEffect(() => {
        const { ethereum } = window;
        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                myEpicGame.abi,
                signer
            );
            setGameContract(gameContract);
        } else {
            console.log("Ethereum object not found");
        }
    }, []);
    return (
        <div className="arena-container">
            {/* ボスをレンダリングします */}
            <div className="bosses-container">
            {bosses.length > 0 && (
                <div className="bosses-list">
                    {bosses.map((boss, index) => (
                        <div className="boss-container" key={index}>
                            {/* attackState を追加します */}
                            <div className={`boss-content ${attackState}`}>
                                <h2>🔥 {boss.name} 🔥</h2>
                                <div className="image-content">
                                    <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
                                    <div className="health-bar">
                                        <progress value={boss.hp} max={boss.maxHp} />
                                        <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="attack-container">
                                <button className="cta-button" onClick={() => runAttackAction(index)}>
                                    {`💥 Attack ${boss.name}`}
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

            {/* NFT キャラクターをレンダリングします */ }
    {
        characterNFT && (
            <div className="players-container">
                <div className="player-container">
                    <h2>Your Character</h2>
                    <div className="image-content">
                        <h2>{characterNFT.name}</h2>
                        <img
                            src={characterNFT.imageURI}
                            alt={`Character ${characterNFT.name}`}
                        />
                        <div className="health-bar">
                            <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                            <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                        </div>
                    </div>
                    <div className="stats">
                        <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
                    </div>
                </div>
            </div>

        )
    }

    { attackState === "invalid" && <InvalidAttackMessage /> }
        </div >
    );
};
export default Arena;