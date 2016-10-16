pragma solidity ^0.4.2;

contract Ballot
{
    Stages  public stage;
    address public issuer;
    string  public name;
    string  public question;
    string  public description;
    uint    public startAt;
    uint    public endAt;
    uint    public createdAt;
    uint    public totalWeight;
    uint    public totalVoted;
    uint    public totalVotedWeight;
    bytes32[] public options;
    Voter[] public registry;
    uint    public numVoters;
    mapping (address => uint) public indexByVoter;
    mapping (uint => uint) public choicesByOption;
    mapping (uint => uint) public weightByOption;

    enum Stages
    {
        New,
        Active,
        Finalizing,
        Finished
    }

    struct Voter
    {
        address pubkey;
        string  fullName;
        uint    weight;
        uint8   choice;
        uint    votedAt;
    }

    modifier onlyIssuer
    {
        if (msg.sender == issuer) _;
    }

    modifier onlyVoter
    {
        if (indexByVoter[msg.sender] > 0) _;
    }

    modifier atStage(Stages _stage)
    {
        if (stage == _stage) _;
    }

  	function Ballot(address _issuer, string _name, string _question, string _description, bytes32[] _options, uint _startAt, uint _endAt)
    {
        issuer      = _issuer;
        name        = _name;
        question    = _question;
        description = _description;
        options     = _options;
        totalVotedWeight = 0;
        totalWeight = 0;
        totalVoted  = 0;
        numVoters   = 0;
        stage       = Stages.New;
        createdAt   = now;
        startAt     = _startAt;
        endAt       = _endAt;
  	}

    function getOptions() public constant
    returns (bytes32[])
    {
        return options;
    }

    function addVoter(address _pubkey, string _name, uint _weight) public onlyIssuer atStage(Stages.New)
    {
        indexByVoter[_pubkey] = registry.length + 1;
        registry.push(Voter(_pubkey, _name, _weight, 0x0, 0x0));
        totalWeight += _weight;
        numVoters += 1;
    }

    function setChoice(uint8 _choice) public onlyVoter atStage(Stages.Active)
    {
        if (!this.canVote(msg.sender)) throw;
        // stop if not in active stage
        Voter v = registry[indexByVoter[msg.sender] - 1];
        // stop if choice is out of bounds
        if (_choice < 0 || _choice > options.length - 1) throw;

        v.choice = _choice;
        v.votedAt = now;
        totalVoted += 1;
        totalVotedWeight += v.weight;
        choicesByOption[_choice] += 1;
        weightByOption[_choice] += v.weight;
    }

    function getChoice() public constant onlyVoter atStage(Stages.Active)
    returns (uint8)
    {
      Voter v = registry[indexByVoter[msg.sender] - 1];
      return v.choice;
    }

    function setActive() public atStage(Stages.New) onlyIssuer
    {
        // no vote with less than two options or voters
        if (options.length < 2) throw;
        if (registry.length < 2) throw;
        /*//if (now > startAt) throw;*/
        stage = Stages.Active;
        StageChanged(this, stage);
    }

    function isActive() public constant
    returns (bool)
    {
        return stage == Stages.Active;
    }

    function canVote(address pubkey) public constant
    returns (bool)
    {
        if (!isActive()) return false;
        Voter v = registry[indexByVoter[pubkey] - 1];
        if (v.weight < 1) return false;
        if (v.votedAt > 0) return false;
        return true;
    }

    function getInfo() public constant
    returns (
      address _pubkey,
      string _name,
      string _description,
      string _question,
      bytes32[] _options,
      uint _startAt,
      uint _endAt,
      Stages _stage
    )
    {
      _pubkey = issuer;
      _name = name;
      _description = description;
      _question = question;
      _options = options;
      _startAt = startAt;
      _endAt = endAt;
      _stage = stage;
    }

    event StageChanged(address id, Stages newStage);
}
