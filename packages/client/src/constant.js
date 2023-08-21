//CONTRACT_ADDRESSに、自分のコントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "0x937De078749B8BB304423645ffB4C833729121Ab";

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