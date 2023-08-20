//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.18;

//NFT発行のコントラクト　ERC721.sol　をインポートします。
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//OpenZeppelinが提供するヘルパー機能をインポートします。
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Base64.solからヘルパー関数をインポートする。
import "./library/Base64.sol";

import "hardhat/console.sol";

contract MyEpicGame is ERC721 {
    
    struct CharacterAttributes {
        uint characterIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    //飲み物の構造体
    struct Beverage {
        //新規追加
        uint beverageIndex;
        string name;
        string imageURI;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    //飲み物のデフォルトデータを保持するための配列　beveragesを作成します。それぞれの配列はBeverages型です
    Beverage[] public beverages;

    //OpenZeppelin　が提供する　tokenIdsを簡単に追跡するライブラリを呼び出しています。
    using Counters for Counters.Counter;
    //tokenIdsはNFTの一意な識別子で、0,1,2, .. Nのように付与されます。
    Counters.Counter private _tokenIds;

    //キャラクターのデフォルトデータを保持するための配列　defaultCharactersを作成します。それぞれの配列は、CharacterAttributes型です。
    CharacterAttributes[] defaultCharacters;

    //NFTのtokenIdとCharacterAttributesを紐付けるmappingを作成します。
    mapping(uint256 => CharacterAttributes) public nftHolderAttributes;

    //ユーザーのアドレスとNFTのtokeIdを紐付けるmappingを作成しています。
    mapping(address => uint256) public nftHolders;

    //ユーザーがNFTをMintしたことを示すイベント
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    //ボスへの攻撃が完了したことを示すイベント
    event AttackComplete(uint newBossHp, uint newPlayerHp);


    constructor(

    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint[] memory characterHp,
    uint[] memory characterAttackDmg,
    string[] memory beverageNames,
    string[] memory beverageImageURI,
    uint[] memory beveragePrice,
    uint[] memory beverageCost
    )
    //作成するNFTの名前とそのシンボルをERC721規格に渡しています。
    ERC721("Onepiece", "ONEPIECE")
    {
        

        //ゲームで扱う全てのキャラクターをループ処理で呼び出し、それぞれのキャラクターに付与されるデフォルト値をコントラクトに保存します。
        for(uint i = 0; i < characterNames.length; i += 1){
            defaultCharacters.push(CharacterAttributes({
            characterIndex: i,
            name: characterNames[i],
            imageURI: characterImageURIs[i],
            hp: characterHp[i],
            maxHp: characterHp[i],
            attackDamage: characterAttackDmg[i]
        }));
        CharacterAttributes memory character = defaultCharacters[i];

        //hardhatのconsole.log()では任意の順番で最大４つのパラメータを指定できます。
        //使用できるパラメータの種類：uint, string, bool, address
        console.log("Done initializing %s w/ HP %s, img %s", character.name, character.hp, character.imageURI);
    
       }

       //次のNFTがMintされるときのカウンターをインクリメントします。
       _tokenIds.increment();


       //ボスの情報の初期化
       for(uint i = 0; i < beverageNames.length; i += 1){
            beverages.push(Beverage({
            beverageIndex: i,
            name: beverageNames[i],
            imageURI: beverageImageURI[i],
            hp: beveragePrice[i],
            maxHp: beveragePrice[i],
            attackDamage: beverageCost[i]
        }));
        Beverage memory beverage = beverages[i];

        //hardhatのconsole.log()では任意の順番で最大４つのパラメータを指定できます。
        //使用できるパラメータの種類：uint, string, bool, address
        console.log("Done initializing %s w/ HP %s, img %s", beverage.name, beverage.hp, beverage.imageURI);
    
       }
    }

    //ユーザーはmintCharacterNFT関数を呼び出して、NFTをMintすることができます。
    //CharacterIndexはフロントエンドから送信されます。
    function mintCharacterNFT(uint _characterIndex) external {
        //現在のtokenIdを取得します(constructor内でインクリメントしているため、１から始まります)。
        uint256 newItemId = _tokenIds.current();

        //msg.senderでフロントエンドからユーザーのアドレスを取得して、NFTをユーザーにMintします。
        _safeMint(msg.sender, newItemId);

        //mappingで定義したtokenIdをCharacterAttributesに紐付けます。
        nftHolderAttributes[newItemId] = CharacterAttributes({
            characterIndex: _characterIndex,
            name: defaultCharacters[_characterIndex].name,
            imageURI: defaultCharacters[_characterIndex].imageURI,
            hp: defaultCharacters[_characterIndex].hp,
            maxHp: defaultCharacters[_characterIndex].maxHp,
            attackDamage: defaultCharacters[_characterIndex].attackDamage

        });

        console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

        //NFTの所有者を簡単に確認できるようにします。
        nftHolders[msg.sender] = newItemId;

        //次に使用する人のためにtokenIdをインクリメントします。
        _tokenIds.increment();

        //ユーザーがNFTをMintしたことをフロントエンドに伝えます。
        emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
    }

    //ブロックチェーンに書き込まれる
    function attackBoss(uint256 bossIn) public {
        require(bossIndex < beverages.length, "Invalid boss index.");

        //1.プレイヤーのNFTの状態を取得
        uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
        CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];


        Beverage memory beverage = beverages[bossIndex];
        console.log("\nPlayer w/ character %s about to attack. Has %s HP and %s AD", player.name, player.hp, player.attackDamage);
        console.log("Boss %s has %s HP and %s AD", beverage.name, beverage.hp, beverage.attackDamage);

        //2.プレイヤーのHPが０以上であることを確認する。コードを次に進めることができる
        require (
            player.hp > 0,
            "Error: Character must have HP to attack boss."
        );
        //3.ボスのHPが０以上であることを確認する。
        require (
            beverage.hp > 0,
            "Error: boss must have HP to attack characters."
        );

        //4.プレイヤーがボスを攻撃できるようにする。
        if (beverage.hp < player.attackDamage) {
            beverage.hp = 0;
        } else {
            beverage.hp = beverage.hp - player.attackDamage;
        }
        //5.ボスがプレイヤーを攻撃できるようにする。
        if (player.hp < beverage.attackDamage) {
            player.hp = 0;
        } else {
            player.hp = player.hp - beverage.attackDamage;
        }

        //プレイヤーの攻撃をターミナルに出力する。
        console.log("Player attacked boss. New boss hp: $s", beverage.hp);
        console.log("Boss attacked player. New Player hp: %s\n", player.hp);

        //ボスへの攻撃が完了したことをフロントエンドに伝えます。
        emit AttackComplete(beverage.hp, player.hp);
    }

     //ブロックチェーンに書き込まれない
    function checkIfUserHasNFT() public view returns (CharacterAttributes memory){
        //ユーザーのtokenIDを取得します。
        uint256 userNftTokenId = nftHolders[msg.sender];

        //ユーザーが既にtokenIDを持っている場合、そのキャラクターの属性情報を返す
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        //それ以外の場合は、空文字を返す。
        else {
            CharacterAttributes memory emptyStruct;
            return emptyStruct;
        }
    }
    //三体のNFTキャラクターのデフォルト情報の取得(ブロックチェーンに書き込まれない)
    function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
        return defaultCharacters;
    }

    //フロントエンドからボスのデータを取得する。（ブロックチェーンに書き込まれない）
    function getBeverage(uint256 index) public view returns (Beverage memory) {
        //飲み物の数より少ないことを確認
        require (index < beverages.length, "Error: Invalid index");
        //指定された番号の飲み物を返却する
        return beverages[index];
    }

    //ブロックチェーンに書き込まれない
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];
        //charAttributesのデータを編集して、JSONの構造に合わせた変数を格納しています。
        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

         string memory json = Base64.encode(
            //abi.encodePackedで文字列を結合します。
            //OpenSeaが採用するJSONデータをフォーマットしています、
            abi.encodePacked(
                '{"name": "',
                charAttributes.name,
                ' -- NFT #: ',
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                charAttributes.imageURI,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',strAttackDamage,'} ]}'
            )
         );
         //文字列　data:application/json;base64,とjsonの中身を結合して、tokenURIを作成しています。
         string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
         );
         return output;
    }
}