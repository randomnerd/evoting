contract('EVoting', function(accounts) {
  it("should create a new issuer", function() {
    var ev = EVoting.deployed();
    var issuer = accounts[1];
    var issuerName = 'issuer name';

    return ev.newIssuer(issuer, issuerName).then(function() {
      return ev.isSignedIssuer(issuer);
    }).then(function(isSigned) {
      assert.equal(isSigned, true, 'issuer was not signed');
      return ev.getIssuerName(issuer);
    }).then(function(returnedName) {
      assert.equal(returnedName, issuerName, 'issuer name was not set properly');
    });
  });

  it("should create and sign a ballot", function() {
    var ev = EVoting.deployed();
    var issuer = accounts[1];
    var ballot = null;
    return Ballot.new(issuer, 'name', 'question', 'description', ['answer1', 'answer2', 'answer3'], new Date()/1000, new Date()/1000 + 3600 * 24 * 7, {from: issuer}).then(function(result) {
      ballot = result;
      return ev.signBallot(ballot.address, {from: issuer});
    }).then(function() {
      return ev.isSignedBallot(ballot.address, {from: issuer});
    }).then(function(isSigned) {
      assert.equal(isSigned, true, 'ballot was not signed');
    });
  });

  it("should add voters to a ballot", function() {
    var ev = EVoting.deployed();
    var issuer = accounts[1];
    var voter1 = accounts[2];
    var voter2 = accounts[3];
    var ballot = null;
    return ev.ballots.call(0).then(function(result) {
      ballot = Ballot.at(result);
      return ballot.addVoter(voter1, 'voter1', 1, {from: issuer});
    }).then(function() {
      return ballot.addVoter(voter2, 'voter2', 2, {from: issuer});
    }).then(function() {
      return ballot.numVoters.call();
    }).then(function(numVoters) {
      assert.equal(numVoters, 2, 'didnt add all voters');
      return ballot.totalWeight.call();
    }).then(function(totalWeight) {
      assert(totalWeight, 3, 'total weight didnt add up');
    });
  });

  it("should activate a ballot", function() {
    var ev = EVoting.deployed();
    var issuer = accounts[1];
    var voter1 = accounts[2];
    var voter2 = accounts[3];
    var ballot = null;
    return ev.ballots.call(0).then(function(result) {
      ballot = Ballot.at(result);
      return ballot.setActive({from: issuer});
    }).then(function() {
      return ballot.isActive();
    }).then(function(isActive) {
      assert.equal(isActive, true, "ballot didnt activate");
    });
  });

  it("should list ballots available to vote", function() {
    var ev = EVoting.deployed();
    var voter1 = accounts[2];
    return ev.getBallots(false, {from: voter1}).then(function(ballots) {
      assert.equal(ballots.length, 1, 'ballot didnt show up in ballot list');
    });
  });

  it("should allow voter to vote", function() {
    var ev = EVoting.deployed();
    var voter1 = accounts[2];
    var voter2 = accounts[3];
    var ballot = null;
    return ev.getBallots(false, {from: voter1}).then(function(ballots) {
      ballot = Ballot.at(ballots[0]);
      return ballot.setChoice(0, {from: voter1});
    }).then(function() {
      return ballot.totalVoted.call({from: voter1});
    }).then(function(totalVoted) {
      assert.equal(totalVoted, 1, 'totalVoted didnt add up');
      return ballot.totalVotedWeight.call({from: voter1});
    }).then(function(totalVotedWeight) {
      assert.equal(totalVotedWeight, 1, 'totalVotedWeight didnt add up');
      return ballot.setChoice(0, {from: voter2});
    }).then(function() {
      return ballot.totalVoted.call({from: voter2});
    }).then(function(totalVoted) {
      assert.equal(totalVoted, 2, 'totalVoted didnt add up');
      return ballot.totalVotedWeight.call({from: voter2});
    }).then(function(totalVotedWeight) {
      assert.equal(totalVotedWeight, 3, 'totalVotedWeight didnt add up');
    });
  });

  it("should not show ballots that voter already voted for", function() {
    var ev = EVoting.deployed();
    var voter1 = accounts[2];
    var ballot = null;
    return ev.getBallots(false, {from: voter1}).then(function(ballots) {
      assert.equal(ballots.length, 0, 'ballot did show up in ballot list');
    });
  });

  it("should not allow voter to vote twice", function() {
    var ev = EVoting.deployed();
    var voter1 = accounts[2];
    var ballot = null;
    return ev.getBallots(true, {from: voter1}).then(function(ballots) {
      ballot = Ballot.at(ballots[0]);
        return ballot.setChoice(1, {from: voter1});
    }).catch(function(error) {
      assert(error, 'didnt catch an error while double voting');
    }).then(function() {
      return ballot.totalVoted.call({from: voter1});
    }).then(function(totalVoted) {
      assert.equal(totalVoted, 2, 'totalVoted did change');
      return ballot.totalVotedWeight.call({from: voter1});
    }).then(function(totalVotedWeight) {
      assert.equal(totalVotedWeight, 3, 'totalVotedWeight did change');
    });
  });

  it("should create and show a second ballot", function() {
    var ev = EVoting.deployed();
    var issuer = accounts[1];
    var ballot = null;
    var voter1 = accounts[2];
    var voter2 = accounts[3];
    return ev.getBallots(false, {from: voter1}).then(function(ballots) {
      assert.equal(ballots.length, 0, 'ballot didnt show up in ballot list');
      return Ballot.new(issuer, 'name2', 'question2', 'description2', ['answer1', 'answer2', 'answer3'], new Date()/1000, new Date()/1000 + 3600 * 24 * 7, {from: issuer})
    }).then(function(result) {
      ballot = result;
      return ev.signBallot(ballot.address, {from: issuer});
    }).then(function() {
      return ballot.addVoter(voter1, 'voter1', 1, {from: issuer});
    }).then(function() {
      return ballot.addVoter(voter2, 'voter2', 2, {from: issuer});
    }).then(function() {
      return ballot.setActive({from: issuer});
    }).then(function() {
      return ev.getBallots(false, {from: voter1});
    }).then(function(ballots) {
      assert.equal(ballots.length, 1, 'ballot didnt show up in ballot list');
      return ev.getBallots(true, {from: voter1});
    }).then(function(ballots) {
      assert.equal(ballots.length, 2, 'ballot didnt show up in all ballots list')
    });
  });

});
