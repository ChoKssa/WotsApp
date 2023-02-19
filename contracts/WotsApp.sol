// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract WotsApp {
    enum messageType {
        SENT,
        RECEIVED
    }

    struct message {
        string data; // HASH MESSAGE TO GET BYTES32 after
        uint256 date;
        messageType _type;
    }

    struct contact {
        address contactAddress;
        message[] messages;
    }

    mapping(address => contact[]) private _conversations;

    modifier notZeroAddress(address _to) {
        require(_to != address(0), "Address cannot be the zero address.");
        _;
    }

    event contactsReceived(address[] indexed contacts);
    event messagesReceived(message[] indexed messages);

    function indexOfContact(address from, address _to)
        internal
        view
        returns (uint256)
    {
        contact[] memory contacts = _conversations[from];

        for (uint256 i = 0; i < contacts.length; i++) {
            if (contacts[i].contactAddress == _to) {
                return i;
            }
        }
        revert("Contact does not exists");
    }

    function createMessage(string calldata data, messageType _type)
        internal
        view
        returns (message memory)
    {
        return message(data, block.timestamp, _type);
    }

    function sendMessage(address _to, string calldata data)
        external
        notZeroAddress(_to)
    {
        uint256 indexOfContactSender = indexOfContact(msg.sender, _to);
        uint256 indexOfContactReceiver = indexOfContact(_to, msg.sender);

        _conversations[_to][indexOfContactReceiver].messages.push(
            createMessage(data, messageType.RECEIVED)
        );
        _conversations[msg.sender][indexOfContactSender].messages.push(
            createMessage(data, messageType.SENT)
        );
    }

    function deleteMessage(address _to, uint256 index)
        public
        notZeroAddress(_to)
    {
        require(index <= _conversations[msg.sender].length, "Index not valid");

        delete _conversations[msg.sender][index];
    }

    function editMessage(
        address _to,
        uint256 index,
        string calldata data
    ) external notZeroAddress(_to) {}

    function addNewContact(address _to) external notZeroAddress(_to) {
        // require(isContactExists(msg.sender, _to) == false, "Contact already exists");

        _conversations[msg.sender].push();
        _conversations[msg.sender][_conversations[msg.sender].length - 1]
            .contactAddress = _to;
        _conversations[_to].push();
        _conversations[_to][_conversations[_to].length - 1].contactAddress = msg
            .sender;
    }

    function getContactsAdresses() public returns (address[] memory) {
        address[] memory contactAddresses = new address[](
            _conversations[msg.sender].length
        );

        for (uint256 i = 0; i < _conversations[msg.sender].length; i++) {
            contactAddresses[i] = _conversations[msg.sender][i].contactAddress;
        }
        emit contactsReceived(contactAddresses);
        return contactAddresses;
    }

    function getMessagesFromContact(address _to)
        external
        returns (message[] memory)
    {
        uint256 index = indexOfContact(msg.sender, _to);
        message[] memory contactMessages = new message[](
            _conversations[msg.sender][index].messages.length
        );

        for (
            uint256 i = 0;
            i < _conversations[msg.sender][index].messages.length;
            i++
        ) {
            contactMessages[i] = _conversations[msg.sender][index].messages[i];
        }
        emit messagesReceived(contactMessages);
        return contactMessages;
    }

    function deleteContact(address _to) external notZeroAddress(_to) {}
}
