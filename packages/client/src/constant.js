//CONTRACT_ADDRESSに、自分のコントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "0xfC78256AD158e539D8Fa6A1e7a8A66fa49354cA6";

//NFTキャラクターの属性をフォーマットしてオブジェクトとして返します。
const transformCharacterData = (CharacterData) => {
    return {
        name: CharacterData.name,
        imageURI:CharacterData.imageURI,
        hp: CharacterData.hp.toNumber(),
        maxHp: CharacterData.maxHp.toNumber(),
        attackDamage: CharacterData.attackDamage.toNumber(),
    };
};
export { CONTRACT_ADDRESS, transformCharacterData };