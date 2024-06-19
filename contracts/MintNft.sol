// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PuzzleRewards is ERC1155, Ownable {
    struct TokenInfo {
        string name; 
        uint256 id;
    }
    enum LEVEL {
        PIONEER,
        ADVANCED,
        MASTER,
        AMBASSADOR
    }
    string metadataUri;
    TokenInfo[] public tokens;
    TokenInfo[] public medals;
    
    mapping(string => uint256) public quiz;
    mapping(uint256 => LEVEL) private levelMapping;
    mapping(uint256 => TokenInfo) private tokenInfo;
    mapping(address => mapping(uint256 => bool)) public userProgress; 
    mapping(address => uint256) public levelCompleted; 

    constructor(string memory _metadataUri) ERC1155(_metadataUri) Ownable(msg.sender) {
        levelMapping[1] = LEVEL.PIONEER;
        levelMapping[2] = LEVEL.ADVANCED;
        levelMapping[3] = LEVEL.MASTER;
        levelMapping[4] = LEVEL.AMBASSADOR;
        metadataUri = _metadataUri;
    }


    function getQuizStatus() public view returns (bool[10] memory) {
        TokenInfo[] memory list = getQuizList();
        bool[10] memory status;
        for (uint i = 0; i < list.length; i++) {
           status[i] = userProgress[msg.sender][list[i].id];
        }
        return status;
    }
    function generateQuiz(TokenInfo[] memory _tokenInfo) public onlyOwner {
        for (uint256 i = 0; i < _tokenInfo.length; i++) {
            tokens.push(_tokenInfo[i]);
           require(quiz[_tokenInfo[i].name] == 0, "Token already exists");
            quiz[_tokenInfo[i].name] = _tokenInfo[i].id;
        }
    } 

    function getQuizList() public view returns (TokenInfo[] memory) {
        return tokens;
    }

    function solveQuestion(uint256 id, string memory _name, uint32 level) public {
        require(!userProgress[msg.sender][id], "Question already solved");

        uint256 tokenId = quiz[_name];
        require(tokenId > 0 && tokenId == id, "Invalid question or answer");

        userProgress[msg.sender][id] = true;

        _mint(msg.sender, id, 1, "");


        if (checkAllQuestionsSolved()) {
            awardMedalToken(msg.sender, level);
        }
    } 

    function balanceOfNfts(address _owner) public view returns (uint256[] memory) {
        uint256[] memory result; 

        for (uint256 i = 0; i < tokens.length; i++) {
            result[i] = balanceOf(_owner, quiz[tokens[i].name]);
        }
        return result;
    }

    function checkAllQuestionsSolved() public view returns (bool) {
        for (uint256 i = 1; i <= 10; i++) {
            if (!userProgress[msg.sender][i]) {
                return false;
            }
        }
        return true;
    }

    function getCurrentLevel(address to) public view returns (uint256 level) {
        return levelCompleted[to];
    }
    
    function awardMedalToken(address to, uint256 level) internal returns (string memory) {
        require(levelCompleted[to] >= level , "Medal already awarded");

        levelCompleted[to] = level;
     
         string memory levelName;
        if (level == 1) {
            levelName = "PIONEER";
        } else if (level == 2) {
            levelName = "ADVANCED";
        } else if (level == 3) {
            levelName = "MASTER";
        } else if (level == 4) {
            levelName = "AMBASSADOR";
        } else {
            revert("Invalid level");
        }

        medals[level] = TokenInfo(levelName, level);
        _mint(to, level, 1, "");
         return string(abi.encodePacked(metadataUri, Strings.toString(level), ".json"));
    }

    function getTokenInfo(uint256 id) public view returns (string memory name) {
        TokenInfo memory info = tokenInfo[id];
        return (info.name);
    }

    function uri(uint256 id) public pure override returns (string memory) {
        return string(abi.encodePacked("https://token-cdn-domain/", Strings.toString(id), ".json"));
    }
}
