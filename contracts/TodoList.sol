pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract TodoList {
    mapping (address => List) listOwner;
    event CompleteTodo(address _from, Todo[] todos);

    struct Todo {
        string name;
        bool isComplete;
    }

    struct List {
        Todo[] list;
    }


    function _add(string memory _name) public returns (string memory) {
        listOwner[msg.sender].list.push(Todo(_name, false));
        return _name;
    }

    function _getList() public view returns (Todo[] memory) {
        return listOwner[msg.sender].list;
    }

    function _clear() public returns (bool) {
        for (uint i = 0; i < listOwner[msg.sender].list.length; i++) {
            delete listOwner[msg.sender].list[i];
        }
        return true;
    }

    function _getTodo(uint _id) public view returns (Todo memory) {
        return listOwner[msg.sender].list[_id];
    }

    function _completeTodo(uint _id) public returns (bool) {
        listOwner[msg.sender].list[_id].isComplete = true;
        emit CompleteTodo(msg.sender, listOwner[msg.sender].list);
        return true;
    }
}