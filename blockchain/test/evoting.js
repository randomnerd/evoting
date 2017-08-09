var Ballot = artifacts.require("./Ballot.sol");
var EVoting = artifacts.require("./EVoting.sol");

contract('EVoting', function (accounts) {
    it("should create a new issuer", async function () {
        var ev = await EVoting.deployed();
        var issuer = accounts[1];
        var issuerName = 'issuer name';

        await ev.newIssuer(issuer, issuerName);
        var isSigned = await ev.isSignedIssuer(issuer);
        assert.equal(isSigned, true, 'issuer was not signed');
        var returnedName = await ev.getIssuerName(issuer);
        assert.equal(returnedName, issuerName, 'issuer name was not set properly');
    });

    it("should create and sign a ballot", async function () {
        var ev = await EVoting.deployed();
        var issuer = accounts[1];
        var ballot = await Ballot.new(
            issuer,
            'name',
            'question',
            'description',
            ['answer1', 'answer2', 'answer3'],
            new Date() / 1000,
            new Date() / 1000 + 3600 * 24 * 7,
            { from: issuer }
        );
        await ev.signBallot(ballot.address, { from: issuer });
        var isSigned = await ev.isSignedBallot(ballot.address, { from: issuer });
        assert.equal(isSigned, true, 'ballot was not signed');
    });

    it("should add voters to a ballot", async function () {
        var ev = await EVoting.deployed();
        var issuer = accounts[1];
        var voter1 = accounts[2];
        var voter2 = accounts[3];
        var ballot = Ballot.at(await ev.ballotsIndex.call(0));
        await ballot.addVoter(voter1, 'voter1', 1, { from: issuer });
        await ballot.addVoter(voter2, 'voter2', 2, { from: issuer });
        var numVoters = await ballot.numVoters.call();
        assert.equal(numVoters, 2, 'didnt add all voters');
        var totalWeight = await ballot.totalWeight.call();
        assert(totalWeight, 3, 'total weight didnt add up');
    });

    it("should activate a ballot", async function () {
        var ev = await EVoting.deployed();
        var issuer = accounts[1];
        var voter1 = accounts[2];
        var voter2 = accounts[3];
        var ballot = Ballot.at(await ev.ballotsIndex.call(0));
        await ballot.setActive({ from: issuer });
        var isActive = await ballot.isActive();
        assert.equal(isActive, true, "ballot didnt activate");
    });

    it("should list ballots available to vote", async function () {
        var ev = await EVoting.deployed();
        var voter1 = accounts[2];
        var ballots = await ev.getBallots(false, { from: voter1 });
        assert.equal(ballots.length, 1, 'ballot didnt show up in ballot list');
    });

    it("should allow voter to vote", async function () {
        var ev = await EVoting.deployed();
        var voter1 = accounts[2];
        var voter2 = accounts[3];
        var ballots = await ev.getBallots(false, { from: voter1 });
        var ballot = Ballot.at(ballots[0]);
        await ballot.setChoice(0, { from: voter1 });
        var totalVoted = await ballot.totalVoted.call({ from: voter1 });
        assert.equal(totalVoted, 1, 'totalVoted didnt add up');
        var totalVotedWeight = await ballot.totalVotedWeight.call({ from: voter1 });
        assert.equal(totalVotedWeight, 1, 'totalVotedWeight didnt add up');
        await ballot.setChoice(0, { from: voter2 });
        totalVoted = await ballot.totalVoted.call({ from: voter2 });
        assert.equal(totalVoted, 2, 'totalVoted didnt add up');
        totalVotedWeight = await ballot.totalVotedWeight.call({ from: voter2 });
        assert.equal(totalVotedWeight, 3, 'totalVotedWeight didnt add up');
    });

    it("should not show ballots that voter already voted for", async function () {
        var ev = await EVoting.deployed();
        var voter1 = accounts[2];
        var ballots = await ev.getBallots(false, { from: voter1 });
        assert.equal(ballots.length, 0, 'ballot did show up in ballot list');
    });

    it("should not allow voter to vote twice", async function () {
        var ev = await EVoting.deployed();
        var voter1 = accounts[2];
        var ballots = await ev.getBallots(true, { from: voter1 })
        var ballot = Ballot.at(ballots[0]);
        try {
            await ballot.setChoice(1, { from: voter1 });
        } catch (error) {
            assert(error, 'didnt catch an error while double voting');
        }
        var totalVoted = await ballot.totalVoted.call({ from: voter1 });
        assert.equal(totalVoted, 2, 'totalVoted did change');
        var totalVotedWeight = await ballot.totalVotedWeight.call({ from: voter1 });
        assert.equal(totalVotedWeight, 3, 'totalVotedWeight did change');
    });

    it("should create and show a second ballot", async function () {
        var ev = await EVoting.deployed();
        var issuer = accounts[1];
        var voter1 = accounts[2];
        var voter2 = accounts[3];
        var ballots = await ev.getBallots(false, { from: voter1 });
        assert.equal(ballots.length, 0, 'ballot didnt show up in ballot list');
        var ballot = await Ballot.new(
            issuer,
            'name2',
            'question2',
            'description2',
            ['answer1', 'answer2', 'answer3'],
            new Date() / 1000,
            new Date() / 1000 + 3600 * 24 * 7,
            { from: issuer }
        );
        await ev.signBallot(ballot.address, { from: issuer });
        await ballot.addVoter(voter1, 'voter1', 1, { from: issuer });
        await ballot.addVoter(voter2, 'voter2', 2, { from: issuer });
        await ballot.setActive({ from: issuer });
        ballots = await ev.getBallots(false, { from: voter1 });
        assert.equal(ballots.length, 1, 'ballot didnt show up in ballot list');
        ballots = await ev.getBallots(true, { from: voter1 });
        assert.equal(ballots.length, 2, 'ballot didnt show up in all ballots list')
    });

});