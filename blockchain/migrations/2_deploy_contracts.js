module.exports = function(deployer) {
  deployer.deploy(Ballot);
  deployer.autolink();
  deployer.deploy(EVoting);
};
