pragma solidity ^0.4.4;
import './Ballot.sol';


contract EVoting {
    address public admin = msg.sender;
    struct Issuer {
        address pubkey;
        string name;
    }
    address[] public issuersIndex;
    address[] public ballotsIndex;
    mapping (address => Issuer) public issuers;
    mapping (address => Ballot) public ballots;

    modifier onlyAdmin {
        require(admin == msg.sender);
        _;
    }

    modifier onlyIssuer {
        require(isSignedIssuer(msg.sender));
        _;
    }

    function newIssuer(address id, string name) public onlyAdmin {
        require(issuers[id].pubkey == address(0));
        issuersIndex.push(id);
        issuers[id] = Issuer(id, name);
    }

    function signBallot(address _pubkey) public onlyIssuer {
        Ballot b = Ballot(_pubkey);
        require(b.issuer() == msg.sender);
        ballots[_pubkey] = b;
        ballotsIndex.push(_pubkey);
    }

    function isSignedIssuer(address id) public constant
    returns (bool)
    {
        return id != address(0) && issuers[id].pubkey == id;
    }

    function isSignedBallot(address id) public constant
    returns (bool)
    {
        return id != address(0) && ballots[id].issuer() != address(0);
    }

    function getBallots(bool _all) public constant
    returns (address[])
    {
        address[] memory _ballots = new address[](ballotsIndex.length);
        uint i;
        uint count = 0;
        for (i = 0; i < ballotsIndex.length; i++) {
            Ballot b = Ballot(ballots[ballotsIndex[i]]);
            if (_all) {
                if (b.isVoter(msg.sender)) {
                    _ballots[i] = b;
                    count++;
                }
            } else {
                if (b.canVote(msg.sender)) {
                    _ballots[i] = b;
                    count++;
                }
            }
        }
        address[] memory _b = new address[](count);
        uint added = 0;
        for (i = 0; i < ballotsIndex.length; i++) {
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
        return issuers[id].name;
    }
}