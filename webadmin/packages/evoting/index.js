// const Promise = Npm.require('bluebird');
const HookedProvider = Npm.require('hooked-web3-provider');
const Web3 = Npm.require('web3');
const _ = Npm.require('lodash');
const Transaction = Npm.require('ethereumjs-tx');
const crypto = Npm.require('crypto');
const KeyStore = Npm.require('node-ethereumjs-keystore');
const fs = Npm.require('fs');
const path = Npm.require('fs');
contracts = JSON.parse(Assets.getText('contracts.json'));

web3 = new Web3();
const EVotingContract = web3.eth.contract(contracts.EVoting.interface);
const BallotContract = web3.eth.contract(contracts.Ballot.interface);

keyStore = new KeyStore();
const provider = new HookedProvider({
  host: 'http://' + (process.env.GETH_HOST || '127.0.0.1') + ':' + (process.env.GETH_PORT || '8545'),
  transaction_signer: keyStore
});
web3.setProvider(provider);

EVoting = null;

if (process.env.CONTRACT_ADDRESS) {
  EVoting = EVotingContract.at(process.env.CONTRACT_ADDRESS);
} else {
  throw new Error('CONTRACT_ADDRESS not specified')
}

Accounts.onCreateUser((options, user) => {
  if (!_.includes(options.roles, 'issuer')) return user;
  user.profile = options.profile || {};
  let key = keyStore.newAccount();
  user.profile.key = {
    address: key.address,
    secret:  key.secretKey.toString('hex')
  }
  Meteor.wrapAsync(web3.eth.sendTransaction)({
    to: key.address,
    from: keyStore.admin.address,
    value: web3.toWei(100500, 'ether'),
    nonce: web3.eth.getTransactionCount('0x'+keyStore.admin.address)
  });
  Meteor.wrapAsync(EVoting.newIssuer)(
    '0x' + key.address,
    web3.fromUtf8(user.username),
    {from: keyStore.admin.address}
  );
  return user;
});

Accounts.onLogin(() => {
  let user = Meteor.user();
  if (!(user && user.profile && user.profile.key)) return;
  let key = user.profile.key;
  keyStore.importKey(key.secret);
});

Meteor.methods({
  startMeet(meetId) {
    this.unblock();
    let key = Meteor.user().profile.key;
    let meet = Meteor.Meetings.findOne({_id: meetId});

    // create ballot
    let newBallot = (callback) => {
      BallotContract.new(
        '0x' + Meteor.user().profile.key.address,
        web3.fromUtf8(meet.name),
        web3.fromUtf8(meet.question),
        web3.fromUtf8(meet.description),
        meet.answers,
        +new Date(moment(meet.startDate, "DD.MM.YYYY"))/1000,
        +new Date(moment(meet.stopDate, "DD.MM.YYYY"))/1000,
        { from: key.address, data: contracts.Ballot.bytecode },
        (err, ret) => {
          if (err) return callback(err);
          if (!ret.address) return;
          return callback(null, ret);
        }
      );
    }
    if (!meet) throw new Meteor.Error('meeting not found');
    meet.answers = _.map(meet.answers, web3.fromUtf8);

    let ballot = Meteor.wrapAsync(newBallot)();
    Meteor.wrapAsync(EVoting.signBallot)(ballot.address, {from: key.address});
    let registry = Meteor.users.find({meeting: meetId}).fetch();
    _.each(registry, (voter) => {
      Meteor.wrapAsync(ballot.addVoter)(
        '0x' + voter.profile.key.address,
        web3.fromUtf8(voter.username),
        voter.shares,
        {from: key.address}
      );
      Meteor.wrapAsync(web3.eth.sendTransaction)({
        to: voter.profile.key.address,
        from: keyStore.admin.address,
        value: web3.toWei('1', 'ether')
      });
      console.log('added voter', voter.username, voter.profile.key.address, voter.profile.key.secret);
    });
    Meteor.wrapAsync(ballot.setActive)({from: key.address});
    console.log('started ballot', ballot.address);
    Meteor.Meetings.update(meetId, { $set: { status: "started" } });
    return ballot.address;
  }
});
