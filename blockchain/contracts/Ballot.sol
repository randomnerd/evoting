pragma solidity ^0.4.4;


contract Ballot {
    enum Stages {
        New,
        Active,
        Finalizing,
        Finished
    }

    struct Voter {
        address pubkey;
        string  name;
        uint    weight;
        uint8   choice;
        uint    votedAt;
    }

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
    address[] public votersIndex;
    mapping (address => Voter) public voters;
    mapping (uint => uint) public choicesByOption;
    mapping (uint => uint) public weightByOption;

    modifier onlyIssuer {
        require(msg.sender == issuer);
        _;
    }

    modifier onlyVoter {
        require(voters[msg.sender].pubkey == msg.sender);
        _;
    }

    modifier atStage(Stages _stage) {
        require(stage == _stage);
        _;
    }

    function Ballot(
        address _issuer,
        string _name,
        string _question,
        string _description,
        bytes32[] _options,
        uint _startAt,
        uint _endAt
    ) {
        issuer = _issuer;
        name = _name;
        question = _question;
        description = _description;
        options = _options;
        totalVotedWeight = 0;
        totalWeight = 0;
        totalVoted = 0;
        stage = Stages.New;
        createdAt = now;
        startAt = _startAt;
        endAt = _endAt;
    }

    function getOptions() public constant
    returns (bytes32[])
    {
        return options;
    }

    function addVoter(address _pubkey, string _name, uint _weight) public onlyIssuer atStage(Stages.New) returns (uint) {
        require(voters[_pubkey].pubkey == address(0));
        voters[_pubkey].name = _name;
        voters[_pubkey].pubkey = _pubkey;
        voters[_pubkey].weight = _weight;
        totalWeight += _weight;
        return votersIndex.push(_pubkey);
    }

    function numVoters() public constant returns (uint) {
        return votersIndex.length;
    }

    function setChoice(uint8 _choice) public onlyVoter atStage(Stages.Active) {
        // stop if choice is out of bounds
        require(_choice >= 0 && _choice < options.length);
        // stop if not in active stage
        require(this.canVote(msg.sender));

        voters[msg.sender].choice = _choice;
        voters[msg.sender].votedAt = now;
        totalVoted += 1;
        totalVotedWeight += voters[msg.sender].weight;
        choicesByOption[_choice] += 1;
        weightByOption[_choice] += voters[msg.sender].weight;
    }

    function getChoice() public constant onlyVoter atStage(Stages.Active) returns (uint8) {
        return voters[msg.sender].choice;
    }

    function setActive() public atStage(Stages.New) onlyIssuer {
        // no vote with less than two options or voters
        require(options.length >= 2 && votersIndex.length >= 2);
        /*//if (now > startAt) throw;*/
        stage = Stages.Active;
        StageChanged(this, stage);
    }

    function isActive() public constant
    returns (bool)
    {
        return stage == Stages.Active;
    }

    function canVote(address _pubkey) public constant
    returns (bool)
    {
        if (voters[_pubkey].pubkey == address(0)) {
            return false;
        }
        if (!isActive()) {
            return false;
        }
        if (voters[_pubkey].weight < 1) {
            return false;
        }
        if (voters[_pubkey].votedAt > 0) {
            return false;
        }
        return true;
    }

    function isVoter(address _pubkey) public constant returns (bool) {
        return voters[_pubkey].pubkey == _pubkey;
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
    ) {
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
