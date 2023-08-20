//CONTRACT_ADDRESSに、自分のコントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "0x474c967598EB61232DfC9b4abcaB9d4aab284701";

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