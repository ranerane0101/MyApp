// InvalidAttackMessage.js

import React from 'react';
import "./InvalidAttackMessage.css";

const InvalidAttackMessage = () => {
  return (
    <div className="invalid-attack-message-container">
      <div className="invalid-attack-message">
        <p>攻撃が無効です。ボスまたはプレイヤーがHPを持っている必要があります。</p>
      </div>
    </div>
  );
};

export default InvalidAttackMessage;
