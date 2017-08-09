import _ from 'lodash';
import Promise from 'bluebird';
import HookedProvider from 'hooked-web3-provider';
import copy from 'cerebral-addons/copy';
import set from 'cerebral-addons/set';

import Web3 from 'web3';
import KeyStore from 'node-ethereumjs-keystore';
import contracts from './contracts.json';
const web3 = new Web3();
const EVotingContract = web3.eth.contract(contracts.EVoting.interface);
const BallotContract = web3.eth.contract(contracts.Ballot.interface);
const keyStore = new KeyStore();
const provider = new HookedProvider({
  host: 'http://127.0.0.1:8545',
  transaction_signer: keyStore
});
web3.setProvider(provider);
const EVoting = EVotingContract.at(process.env.CONTRACT_ADDRESS || '0xc8cec6524b9e3cbced59aa7a582664723fdbef97');

import {logInputs, getBallots, resolveBallots, commitChoice, importKey, getRegistry, setRegistry} from './actions';

export const loadBallots = [
  getBallots, {
    success: [
      resolveBallots, {
        success: [ logInputs, copy('input:/ballots', 'state:/blockchain.ballots') ],
        error: [logInputs]
    } ],
    error: [logInputs]
  }
];
export const loadRegistry = [
  getRegistry, {
    success: [ setRegistry, logInputs ],
    error:   [ logInputs ]
  }
];
export const loadKey = [ importKey, ...loadBallots ];
export const showList = [ loadBallots, set('state:/blockchain.selected', null), set('blockchain.vote', false) ];
export const choiceSet = [ copy('input:/choice', 'state:/blockchain.choice') ];
export const ballotSelected = [ copy('input:/addr', 'state:/blockchain.selected'), ...loadRegistry ];
export const voteSelected = [ set('blockchain.vote', true) ];
export const voteDeSelected = [ set('blockchain.vote', false) ];
export const resultsSelected = [ set('blockchain.results', true) ];
export const resultsDeSelected = [ set('blockchain.results', false) ];

export const choiceSaved = [
  commitChoice, {
    success: [logInputs, ...showList],
    error: [logInputs]
  }
];


export default (options = {}) => {
  return (module, controller) => {

    module.addState({
      ballots: {},
      selected: null,
      vote: false,
      results: false
    });

    module.addSignals({
      loadKey,
      loadBallots,
      ballotSelected,
      voteSelected,
      voteDeSelected,
      resultsSelected,
      resultsDeSelected,
      choiceSet,
      choiceSaved,
      showList,
      loadRegistry
    });

    module.addServices({
      web3,
      keyStore,
      evoting: Promise.promisifyAll(EVoting),
      ballot: BallotContract
    });

  };
}
