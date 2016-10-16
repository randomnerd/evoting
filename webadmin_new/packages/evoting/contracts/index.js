import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import solc from 'solc';
import Web3 from 'web3';
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
web3.eth.defaultAccount = web3.eth.accounts[0];
let contracts = null;
const contractsCacheFile = path.join(__dirname, 'contracts.json');
if (!process.env.COMPILE_CONTRACTS && fs.existsSync(contractsCacheFile)) {
  console.log('loading precompiled contracts')
  contracts = JSON.parse(fs.readFileSync(contractsCacheFile));
} else {
  console.log('compiling contracts...');
  const sources = {
    'Ballot.sol': fs.readFileSync(path.join(__dirname, 'Ballot.sol')).toString(),
    'EVoting.sol': fs.readFileSync(path.join(__dirname, 'EVoting.sol')).toString()
  };
  let out = solc.compile({sources}, 1);
  contracts = _.reduce(out.contracts, (memo, item, key) => {
    let {bytecode, solidity_interface} = item;
    memo[key] = { bytecode, solidity_interface, interface: JSON.parse(item.interface) };
    return memo;
  }, {});
  fs.writeFileSync(contractsCacheFile, JSON.stringify(contracts));
  console.log('done compiling contracts');
}

if (process.env.DEPLOY) {
  _.each(contracts, (contract, name) => {
    let c = web3.eth.contract(contract.interface);
    c.new({data: contract.bytecode}, (err, instance) => {
      if (err) return console.error(err);
      if (!instance.address) return;
      console.log('deployed', name, 'at', instance.address);
    });
  });
}

module.exports = contracts;
