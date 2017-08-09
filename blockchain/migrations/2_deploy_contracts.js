var Ballot = artifacts.require("./Ballot.sol");
var EVoting = artifacts.require("./EVoting.sol");

module.exports = function(deployer) {
  deployer.deploy(Ballot);
  deployer.link(Ballot, EVoting);
  deployer.deploy(EVoting);
};
