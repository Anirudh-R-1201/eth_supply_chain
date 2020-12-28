pragma solidity >=0.4.22 <0.9.0;

contract Asset {
  string public name;
  address public custodian;
  STATUSES public status;

  enum STATUSES {
    CREATED,
    SENT,
    RECEIVED
  }

  event Action(
    string name,
    address account,
    address custodian,
    uint timestamp
  );

  constructor(string memory _name) public {
    name = _name;
    custodian = msg.sender;
    status = STATUSES.CREATED;
    emit Action("CREATE", msg.sender, msg.sender, block.timestamp);
  }

  function send(address _to) public {
    require(msg.sender == custodian);
    require(_to != custodian);
    require(status != STATUSES.SENT);
    status = STATUSES.SENT;
    custodian = _to;
    emit Action("SEND", msg.sender, _to, block.timestamp);
  }

  function receive() public {
    require(msg.sender == custodian);
    require(status == STATUSES.SENT);
    status = STATUSES.RECEIVED;
    emit Action("RECEIVE", msg.sender, msg.sender, block.timestamp);
  }
}