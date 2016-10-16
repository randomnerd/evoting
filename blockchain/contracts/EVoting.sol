pragma solidity ^0.4.2;

import 'Ballot.sol';

contract EVoting
{
    address public admin = msg.sender;
    address[] public issuers;
    string[] public issuerNames;
    address[] public ballots;
    mapping (address => uint) public indexByIssuer;
    mapping (address => uint) public indexByBallot;

    modifier onlyAdmin
    {
        if (admin == msg.sender) _;
    }

    modifier onlyIssuer
    {
        if (isSignedIssuer(msg.sender)) _;
    }

    function newIssuer(address id, string name) public onlyAdmin
    {
        indexByIssuer[id] = issuers.length + 1;
        issuers.push(id);
        issuerNames.push(name);
    }

    function signBallot(address _pubkey) public onlyIssuer
    {
        Ballot b = Ballot(_pubkey);
        if (b.issuer() != msg.sender) throw;
        indexByBallot[b] = ballots.length + 1;
        ballots.push(b);
    }

    function isSignedIssuer(address id) public constant
    returns (bool)
    {
        return 0x0 != id && indexByIssuer[id] > 0;
    }

    function isSignedBallot(address id) public constant
    returns (bool)
    {
        return 0x0 != id && indexByBallot[id] > 0;
    }

    function getBallots(bool _all) public constant
    returns (address[])
    {
        address[] memory _ballots = new address[](ballots.length);
        uint i;
        uint count = 0;
        for (i = 0; i < ballots.length; i++)
        {
            Ballot b = Ballot(ballots[i]);
            if (_all) {
              if (b.indexByVoter(msg.sender) > 0) {
                _ballots[i] = b;
                count++;
              }
            } else {
              if (b.canVote(msg.sender))
              {
                _ballots[i] = b;
                count++;
              }
            }
        }
        address[] memory _b = new address[](count);
        uint added = 0;
        for (i = 0; i < ballots.length; i++)
        {
            if (_ballots[i] != 0x0) {
              _b[added] = _ballots[i];
              added += 1;
            }
        }
        return _b;
    }

    function getIssuerName(address id) public constant
    returns (string)
    {
        return issuerNames[indexByIssuer[id] - 1];
    }
}
