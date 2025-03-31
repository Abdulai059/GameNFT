// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GameNFT is ERC1155, Ownable {
    uint256 public constant MAX_NFTS = 15;
    uint256 public constant BORROW_DURATION = 5 days;

    struct NFT {
        uint256 apePrice;
        uint256 xp;
        uint256 level;
    }

    mapping(uint256 => NFT) public nftDetails;
    mapping(uint256 => uint256) public totalSupply;
    mapping(address => mapping(uint256 => bool)) public hasMinted;
    mapping(address => uint256[]) public userNFTs;

    mapping(uint256 => bool) public isBorrowed;
    mapping(uint256 => address) public lenderOf;
    mapping(uint256 => address) public borrowerOf;
    mapping(uint256 => uint256) public borrowExpiration;

    mapping(address => address) public referrer;
    mapping(address => uint256) public referralRewards;

    IERC20 public apeToken;

    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTLent(uint256 indexed tokenId, address indexed lender, address indexed borrower, uint256 duration);
    event NFTReturned(uint256 indexed tokenId, address indexed borrower);
    event XPAdded(uint256 indexed tokenId, uint256 newXP, uint256 newLevel);
    event ReferralReward(address indexed referrer, address indexed newUser, uint256 reward);

    constructor(address _apeToken) ERC1155("https://game-nft.com/metadata/{id}.json") Ownable(msg.sender) {
        apeToken = IERC20(_apeToken);

        for (uint256 i = 1; i <= MAX_NFTS; i++) {
            nftDetails[i] = NFT({
                apePrice: i * 10 * 10**18,  
                xp: 0,
                level: 1
            });
        }
    }

    function mintWithAPE(uint256 tokenId, address _referrer) external {
        require(tokenId > 0 && tokenId <= MAX_NFTS, "Invalid NFT ID");
        require(!hasMinted[msg.sender][tokenId], "Already minted this NFT");

        uint256 price = nftDetails[tokenId].apePrice;
        require(apeToken.transferFrom(msg.sender, address(this), price), "APE payment failed");

        _mint(msg.sender, tokenId, 1, "");
        totalSupply[tokenId] += 1;
        hasMinted[msg.sender][tokenId] = true;
        userNFTs[msg.sender].push(tokenId);

        emit NFTMinted(msg.sender, tokenId);
        _handleReferral(_referrer);
    }

    function _handleReferral(address _referrer) internal {
        if (_referrer != address(0) && _referrer != msg.sender && referrer[msg.sender] == address(0)) {
            referrer[msg.sender] = _referrer;
            referralRewards[_referrer] += 5;
            emit ReferralReward(_referrer, msg.sender, 5);
        }
    }

    function earnXP(uint256 tokenId, uint256 xp) external {
        require(balanceOf(msg.sender, tokenId) > 0, "You don't own this NFT");
        
        nftDetails[tokenId].xp += xp;
        uint256 newLevel = nftDetails[tokenId].xp / 100;
        if (newLevel > nftDetails[tokenId].level) {
            nftDetails[tokenId].level = newLevel;
        }

        emit XPAdded(tokenId, nftDetails[tokenId].xp, nftDetails[tokenId].level);
    }

    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
}
