Package.describe({
  name: 'randomnerd:evoting',
  version: '0.0.1',
  summary: 'EVoting',
  git: 'https://git.sickoffice.net/randomnerd/meteor-evoting',
  documentation: 'README.md'
});

Npm.depends({
  "ethereumjs-util": "4.1.0",
  "ethereumjs-tx": "1.1.1",
  "web3": "0.15.3",
  "hooked-web3-provider": "1.0.0",
  "node-ethereumjs-keystore": "1.0.2",
  "solc": "0.3.0-1",
  "lodash": "4.6.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ecmascript', 'mongo', 'accounts-base'], 'server');
  api.export(['keyStore', 'EVoting', 'EVotingContract', 'BallotContract'], ['server']);
  api.addAssets(['contracts/contracts.json'], 'server');
  api.addFiles('index.js', 'server');
});
