//CONTRACT_ADDRESSに、自分のコントラクトアドレスを保存します。
const CONTRACT_ADDRESS = "0x0EeF5b9C608282CeB1a074e2F3b1809e820a868f";

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