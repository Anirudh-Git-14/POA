// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title POAToken
 * @notice Proof-of-Attention Token Contract
 * @dev Tracks and mints POA tokens for verified attention sessions
 * 
 * Design:
 * - One POA per user per task (prevents duplicates)
 * - Stores: user address, taskId, timestamp, IPFS hash
 * - Anti-spam: cooldown period between POA mints
 * - Public verification functions
 */
contract POAToken {
    // ============ State Variables ============
    
    // Owner of the contract (can update settings)
    address public owner;
    
    // Counter for unique POA token IDs
    uint256 private _tokenIdCounter;
    
    // Minimum time between POA mints for same user (anti-spam)
    uint256 public cooldownPeriod; // in seconds
    
    // ============ Data Structures ============
    
    /**
     * @notice POA token data structure
     * @param userAddress Address of the user who earned the POA
     * @param taskId Unique identifier for the task
     * @param timestamp Block timestamp when POA was minted
     * @param ipfsHash IPFS hash pointing to proof metadata
     */
    struct POAData {
        address userAddress;
        string taskId;
        uint256 timestamp;
        string ipfsHash;
    }
    
    // Mapping: tokenId => POA data
    mapping(uint256 => POAData) public poaTokens;
    
    // Mapping: user address => taskId => tokenId (prevents duplicates)
    mapping(address => mapping(string => uint256)) public userTaskToTokenId;
    
    // Mapping: user address => last mint timestamp (for cooldown)
    mapping(address => uint256) public lastMintTimestamp;
    
    // ============ Events ============
    
    /**
     * @notice Emitted when a new POA is minted
     * @param tokenId Unique token ID
     * @param userAddress Address of the user
     * @param taskId Task identifier
     * @param timestamp Mint timestamp
     * @param ipfsHash IPFS hash of proof
     */
    event POAMinted(
        uint256 indexed tokenId,
        address indexed userAddress,
        string taskId,
        uint256 timestamp,
        string ipfsHash
    );
    
    /**
     * @notice Emitted when cooldown period is updated
     * @param newCooldown New cooldown period in seconds
     */
    event CooldownUpdated(uint256 newCooldown);
    
    // ============ Modifiers ============
    
    /**
     * @notice Restricts function to contract owner only
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "POAToken: Only owner can call this");
        _;
    }
    
    /**
     * @notice Ensures user has waited for cooldown period
     * @param userAddress Address to check cooldown for
     */
    modifier cooldownCheck(address userAddress) {
        uint256 lastMint = lastMintTimestamp[userAddress];
        require(
            lastMint == 0 || block.timestamp >= lastMint + cooldownPeriod,
            "POAToken: Cooldown period not elapsed"
        );
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @notice Initializes the contract
     * @param _cooldownPeriod Minimum seconds between POA mints per user
     */
    constructor(uint256 _cooldownPeriod) {
        owner = msg.sender;
        cooldownPeriod = _cooldownPeriod;
        _tokenIdCounter = 1; // Start from 1
    }
    
    // ============ Main Functions ============
    
    /**
     * @notice Mints a new POA token
     * @dev Can only be called by backend server (or owner for testing)
     * @param userAddress Address of the user earning the POA
     * @param taskId Unique task identifier
     * @param ipfsHash IPFS hash of the attention proof metadata
     * @return tokenId The ID of the newly minted POA token
     */
    function mintPOA(
        address userAddress,
        string memory taskId,
        string memory ipfsHash
    ) 
        external 
        cooldownCheck(userAddress)
        returns (uint256) 
    {
        // Check if user already has POA for this task
        require(
            userTaskToTokenId[userAddress][taskId] == 0,
            "POAToken: POA already exists for this user and task"
        );
        
        // Validate inputs
        require(userAddress != address(0), "POAToken: Invalid user address");
        require(bytes(taskId).length > 0, "POAToken: Task ID cannot be empty");
        require(bytes(ipfsHash).length > 0, "POAToken: IPFS hash cannot be empty");
        
        // Get next token ID
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Create POA data
        POAData memory newPOA = POAData({
            userAddress: userAddress,
            taskId: taskId,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });
        
        // Store POA data
        poaTokens[tokenId] = newPOA;
        
        // Mark this user+task combination as used
        userTaskToTokenId[userAddress][taskId] = tokenId;
        
        // Update last mint timestamp for cooldown
        lastMintTimestamp[userAddress] = block.timestamp;
        
        // Emit event
        emit POAMinted(
            tokenId,
            userAddress,
            taskId,
            block.timestamp,
            ipfsHash
        );
        
        return tokenId;
    }
    
    // ============ Read Functions (Public Verification) ============
    
    /**
     * @notice Get POA data by token ID
     * @param tokenId The token ID to query
     * @return POA data structure
     */
    function getPOA(uint256 tokenId) 
        external 
        view 
        returns (POAData memory) 
    {
        require(tokenId > 0 && tokenId < _tokenIdCounter, "POAToken: Invalid token ID");
        return poaTokens[tokenId];
    }
    
    /**
     * @notice Check if user has POA for a specific task
     * @param userAddress User address to check
     * @param taskId Task ID to check
     * @return exists True if POA exists
     * @return tokenId The token ID if exists, 0 otherwise
     */
    function hasPOA(address userAddress, string memory taskId)
        external
        view
        returns (bool exists, uint256 tokenId)
    {
        tokenId = userTaskToTokenId[userAddress][taskId];
        exists = tokenId != 0;
    }
    
    /**
     * @notice Get total number of POA tokens minted
     * @return Total count (token IDs start from 1, so count = counter - 1)
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    /**
     * @notice Check if user can mint (cooldown check)
     * @param userAddress User address to check
     * @return canMint True if user can mint now
     * @return timeRemaining Seconds remaining in cooldown (0 if can mint)
     */
    function canUserMint(address userAddress)
        external
        view
        returns (bool canMint, uint256 timeRemaining)
    {
        uint256 lastMint = lastMintTimestamp[userAddress];
        
        if (lastMint == 0) {
            // User has never minted
            canMint = true;
            timeRemaining = 0;
        } else {
            uint256 elapsed = block.timestamp - lastMint;
            if (elapsed >= cooldownPeriod) {
                canMint = true;
                timeRemaining = 0;
            } else {
                canMint = false;
                timeRemaining = cooldownPeriod - elapsed;
            }
        }
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update cooldown period (owner only)
     * @param newCooldown New cooldown period in seconds
     */
    function setCooldownPeriod(uint256 newCooldown) external onlyOwner {
        require(newCooldown > 0, "POAToken: Cooldown must be greater than 0");
        cooldownPeriod = newCooldown;
        emit CooldownUpdated(newCooldown);
    }
    
    /**
     * @notice Transfer ownership (owner only)
     * @param newOwner Address of new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "POAToken: New owner cannot be zero address");
        owner = newOwner;
    }
}
