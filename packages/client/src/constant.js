//CONTRACT_ADDRESSに、自分のコントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "0x4Cdf16dE244e2A2A64351d2220a5C7b33F94C3DC";

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