// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TokenFarm is Ownable{
    // address owner;
    ERC20 public elonToken;

    constructor(address _elonTokenAddress) public{
        // owner = msg.sender;
        elonToken = ERC20(_elonTokenAddress);
    }

    //mapping to keep track of how much has been sent to us. Token address -> staker address -> amount staked
    mapping(address => mapping(address => uint256)) public stakingBalance; //This simply means that a particular token address can map to many stakers and if you then give that token address a particular staker's address, then it will return the amount that staker has staked for that token;
    address[] public allowedTokens; // List of all the allowed tokens which is a list of their addresses.
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public stakers;

    function setPriceFeedContract(address _token, address _priceFeed) public onlyOwner{
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function rewardStakes() public onlyOwner{
        //issue tokens as reward to all stakers
        for(uint256 stakersIndex = 0; stakersIndex < stakers.length; stakersIndex++){
            address recipient = stakers[stakersIndex];
            uint256 userTotalValue = getUserTotalValue(recipient);
            //send them a token reward
            // based on their total value locked
            elonToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!");
        for(uint256 allowedTokensIndex = 0; allowedTokensIndex < allowedTokens.length; allowedTokensIndex++ ){
        //  totalValue = totalValue + stakingBalance[allowedTokens[allowedTokensIndex]][_user];
            totalValue = totalValue + getUserSingleTokenValue(_user, allowedTokens[allowedTokensIndex]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token) public view returns (uint256){
        if(uniqueTokensStaked[_user] <= 0){
            return 0;
        }
        //price of the token * stakingBalance[_token][_user]
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakingBalance[_token][_user] * price /  (10**decimals));
    }

    function getTokenValue(address _token) public view returns (uint256, uint256) {
         //priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface pricefeed = AggregatorV3Interface(priceFeedAddress);
        (,int price, , , ) = pricefeed.latestRoundData();
        uint256 decimals = uint256(pricefeed.decimals());
        return (uint256(price), decimals);
    }

    function stakeTokens(uint256 _amount, address _token) public payable{
        //what tokens can they stake?
        //how much can they stake?
        require(_amount > 0, "You can only stake token amounts greater than 0");
        // require (_token is allowed )
        require(tokenIsAllowed(_token), "Token is currently not allowed");
        // now, call the transferFrom function of the ERC20 contract
        //Basically, we are calling the transferFrom function since we are not the owner of the tokens to be transferred. 
        //We are only transferring the tokens on behalf of the owner of those tokens (i.e msg.sender). Otherwise we would have called just transfer function.
        ERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensState(msg.sender, _token); //This function basically helps us know how many unique tokens a user has. e.g DAI, LITECOIN which is 2 etc.
        stakingBalance[_token][msg.sender] = stakingBalance[_token][msg.sender] + _amount; 
        if(uniqueTokensStaked[msg.sender ] == 1){
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens(address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        stakingBalance[_token][msg.sender] = 0; 
        ERC20(_token).transfer(msg.sender, balance); 
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] - 1;

    }

    function updateUniqueTokensState(address _user, address _token) internal {
        if(stakingBalance[_token][_user] <= 0){ // This line means that if the user has never staked with this token
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1; //Then, increase the unique token count mapping by 1 for this particular user since by staking this token, he adds to the total number of unique tokens he has staked on our platform. 
        }
    }

    function addAllowedTokens(address _token) public onlyOwner {
        // require(msg.sender == owner, "Only the owner is authorized to call this function");
        allowedTokens.push(_token);
    }

    function removeAllowedTokens(address _token) public onlyOwner {
        // require(msg.sender == owner, "Only the owner is authorized to call this function");
        for(uint256 allowedtokenIndex = 0; allowedtokenIndex < allowedTokens.length; allowedtokenIndex++){
            if(allowedTokens[allowedtokenIndex] == _token){
                delete _token;
            }
        }
        return;
    }

    function tokenIsAllowed(address _token) public view returns(bool) {
        for(uint256 allowedtokenIndex = 0; allowedtokenIndex < allowedTokens.length; allowedtokenIndex++){
            if(allowedTokens[allowedtokenIndex] == _token){
                return true;
            }
        }
        return false;
    }

    function getStakingBalance(address _token, address _stakerAddress) public view returns(uint256){
        return stakingBalance[_token][_stakerAddress];
    }
}