import _ from 'lodash';
import Ballot from '../lib/ballot';

export const importKey = ({input, state, output, services}) => {
  let account = services.blockchain.keyStore.importKey(input.secretKey);
  state.set('account', {address: account.address, secretKey: account.secretKey.toString('hex')});
}

export const logInputs = ({input, state, output}) => {
  console.log(input);
}

export const getBallots = ({input, state, output, services}) => {
  services.blockchain.evoting.getBallotsAsync(true, {from: state.get('account.address')}).then(ballots => {
    output.success({ballots: _.without(ballots, '0x0000000000000000000000000000000000000000')});
  }).catch(e => { output.error({e}); } );
}; getBallots.async = true;

export const resolveBallots = ({input, state, output, services}) => {
  // map addresses to Ballot instances
  let ballots = _.map(input.ballots, addr => { return new Ballot(addr); });
  // load all ballots
  Promise.all(_.invokeMap(ballots, 'load', services.blockchain)).then(r => {
    ballots = _.reduce(ballots, (memo, ballot) => {
      memo[ballot.addr] = ballot;
      return memo;
    }, {});
    output.success({ballots});
  }).catch(e => { output.error({e}) });
}; resolveBallots.async = true;

export const commitChoice = ({input, state, output, services}) => {
  const {choice} = input;
  const ballot = new Ballot(input.ballot.addr);
  ballot.contract(services.blockchain).setChoiceAsync(choice, {from: state.get('account.address')})
    .then(tx => { output.success({tx}) })
    .catch(e => { output.error({e}) });
}; commitChoice.async = true;

export const getRegistry = ({input, state, output, services}) => {
  let perPage = 10;
  let {ballot, page} = input;
  let address = state.get('blockchain.selected');
  if (!page) page = 0;
  if (!ballot && address) ballot = new Ballot(address);
  ballot.getRegistry(services.blockchain, (page || 0) * perPage, perPage).then(registry => {
    output.success({address, registry});
  }).catch(error => { output.error({error}) });
}; getRegistry.async = true;

export const setRegistry = ({input, state, output, services}) => {
  let {address, registry} = input;
  state.set(['blockchain', 'ballots', address, 'registry'], registry);
}
