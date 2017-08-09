Package.describe({
  name: 'randomnerd:evoting',
  version: '0.0.1',
  summary: 'EVoting',
  git: 'https://git.sickoffice.net/randomnerd/meteor-evoting',
  documentation: 'README.md'
});

Npm.depends({
  "ethereumjs-tx": "1.1.1",
  "web3": "0.20.1",
  "hooked-web3-provider": "1.0.0",
  "node-ethereumjs-keystore": "1.0.2",
  "lodash": "4.6.1"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ecmascript', 'mongo', 'accounts-base'], 'server');
  api.export(['keyStore', 'EVoting', 'EVotingContract', 'BallotContract'], ['server']);
  api.addAssets(['contracts.json'], 'server');
  api.addFiles('index.js', 'server');
});
