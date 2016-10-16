import Web3 from 'web3';
import Promise from 'bluebird';

const web3 = new Web3();

Object.assign(Promise.prototype, {
  mapUtf8()   { return Promise.map(this, web3.toUtf8); },
  toUtf8()    { return this.then(result => { return web3.toUtf8(result); }); },
  toNumber()  { return this.then(result => { return result.toNumber(); }); },
  toString()  { return this.then(result => { return result.toString(); }); },
  toDate()    { return this.then(result => { return new Date(result.toNumber() * 1000); }); }
});

Object.assign(String.prototype, {
  toUtf8()    { return web3.toUtf8(this); }
});

export default class Ballot {
  constructor(addr) {
    this.addr = addr;
  }

  parseVoter(item) {
    return {
      address:  item[0],
      fullName: web3.toUtf8(item[1]),
      weight:   item[2].toNumber(),
      choice:   item[4].toNumber() > 0 ? item[3].toNumber() : null,
      votedAt:  item[4].toNumber() > 0 ? new Date(item[4].toNumber() * 1000) : null
    };
  }

  getRegistry(services, skip = 0, batch = 10) {
    let ballot = Promise.promisifyAll(services.ballot.at(this.addr));
    return ballot.numVotersAsync().then(numVoters => {
      return Promise.map(new Array(batch), (item, idx) => {
        return ballot.registryAsync(skip + idx);
      }).then(registry => {
        return registry.map(item => { return this.parseVoter(item); });
      });
    });
  }


  load(services) {
    let ballot = Promise.promisifyAll(services.ballot.at(this.addr));
    let myAddr = "0x" + controller.get(['account', 'address']);
    return ballot.getInfoAsync().then(data => {
      // function getInfo() public constant
      // returns (
      //   address _pubkey,
      //   string _name,
      //   string _description,
      //   string _question,
      //   bytes32[] _options,
      //   uint _startAt,
      //   uint _endAt
      // )
      Object.assign(this, {
        issuer: data[0],
        name: data[1].toUtf8(),
        description: data[2].toUtf8(),
        question: data[3].toUtf8(),
        options: _.map(data[4], web3.toUtf8),
        startAt: new Date(data[5].toNumber() * 1000),
        endAt: new Date(data[6].toNumber() * 1000),
        stage: data[7].toNumber()
      });
      return services.evoting.getIssuerNameAsync(this.issuer);
    }).then(name => {
      this.issuerName = name;
      return ballot.indexByVoterAsync(myAddr);
    }).then(idx => {
      console.log('!!!', idx.toNumber());
      if (idx.toNumber() < 1) return false;
      else return ballot.registry(idx.toNumber() - 1);
    }).then(item => {
      if (item) this.voterInfo = this.parseVoter(item);
    });
  }

  contract(services) { return Promise.promisifyAll(services.ballot.at(this.addr)); }
}
