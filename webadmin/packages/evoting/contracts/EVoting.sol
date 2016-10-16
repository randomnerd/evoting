import 'Ballot.sol';

contract EVoting
{
    address public admin = msg.sender;
    address[] public issuers;
    string[] public issuerNames;
    address[] public ballots;
    address[] public activeBallots;
    mapping (address => uint) public indexByIssuer;
    mapping (address => uint) public indexByBallot;
    mapping (address => uint) public indexByActiveBallot;

    modifier onlyAdmin
    {
        if (admin != msg.sender) throw; _
    }

    modifier onlyIssuer
    {
        if (indexByIssuer[msg.sender] < 1) throw; _
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

    function getActiveBallots(bool _all) public constant
    returns (address[])
    {
        // if (_all) return activeBallots;
        address[] memory _ballots = new address[](activeBallots.length);
        uint i;
        uint count = 0;
        for (i = 0; i < activeBallots.length; i++)
        {
            Ballot b = Ballot(activeBallots[i]);
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
        for (i = 0; i < count; i++)
        {
            _b[i] = _ballots[i];
        }
        return _b;
    }

    function activateBallot(address id) public onlyIssuer
    {
        Ballot b = Ballot(id);
        b.setActive();
        indexByActiveBallot[id] = activeBallots.length + 1;
        activeBallots.push(id);
    }

    function getIssuerName(address id) public constant
    returns (string)
    {
        return issuerNames[indexByIssuer[id] - 1];
    }
}
