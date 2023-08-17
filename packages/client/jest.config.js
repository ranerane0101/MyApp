module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  transform: {
    '\\.js$': 'babel-jest', // .js ファイルを Babel でトランスパイルする
    '\\.css$': 'jest-css-modules-transform', // .css ファイルを変換する場合
  },
  // 他の設定...
};
