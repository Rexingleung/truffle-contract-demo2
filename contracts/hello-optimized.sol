// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title HelloOptimized
 * @dev Hello合约的优化版本，专注于减少gas消耗
 */
contract HelloOptimized {
    // 优化1: 合并事件，减少重复代码
    event MessageEvent(
        address indexed sender,
        string message,
        uint256 timestamp,
        uint8 messageType  // 0=hello, 1=greeting
    );
    
    // 优化2: 使用更小的数据类型，节省存储gas
    uint128 public counter;
    
    // 优化3: 添加字符串长度限制，防止过长的字符串消耗过多gas
    uint8 public constant MAX_MESSAGE_LENGTH = 100;
    
    /**
     * @dev 发送Hello消息
     * @param message 要发送的消息
     */
    function sayHello(string memory message) public {
        // 优化4: 添加长度检查
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message too long");
        
        emit MessageEvent(
            msg.sender,
            message,
            block.timestamp,
            0  // messageType = 0 for hello
        );
    }
    
    /**
     * @dev 发送问候消息并增加计数器
     * @param message 问候消息
     */
    function sendGreeting(string memory message) public {
        // 优化4: 添加长度检查
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message too long");
        
        // 优化5: 使用unchecked来节省gas（因为我们知道counter不会溢出）
        unchecked {
            counter++;
        }
        
        emit MessageEvent(
            msg.sender,
            message,
            block.timestamp,
            1  // messageType = 1 for greeting
        );
    }
    
    /**
     * @dev 优化6: 合并两个函数，提供统一的接口
     * @param message 消息内容
     * @param isGreeting 是否为问候消息
     */
    function sendMessage(string memory message, bool isGreeting) public {
        require(bytes(message).length <= MAX_MESSAGE_LENGTH, "Message too long");
        
        if (isGreeting) {
            unchecked {
                counter++;
            }
        }
        
        emit MessageEvent(
            msg.sender,
            message,
            block.timestamp,
            isGreeting ? 1 : 0
        );
    }
    
    /**
     * @dev 获取当前计数器值
     * @return 计数器当前值
     */
    function getCounter() public view returns (uint128) {
        return counter;
    }
    
    /**
     * @dev 优化7: 批量发送消息，减少多次调用的gas消耗
     * @param messages 消息数组
     * @param isGreeting 是否为问候消息
     */
    function sendBatchMessages(string[] memory messages, bool isGreeting) public {
        uint256 length = messages.length;
        require(length <= 10, "Too many messages"); // 防止gas消耗过大
        
        for (uint256 i = 0; i < length;) {
            require(bytes(messages[i]).length <= MAX_MESSAGE_LENGTH, "Message too long");
            
            if (isGreeting) {
                unchecked {
                    counter++;
                }
            }
            
            emit MessageEvent(
                msg.sender,
                messages[i],
                block.timestamp,
                isGreeting ? 1 : 0
            );
            
            unchecked {
                i++;
            }
        }
    }
    
    /**
     * @dev 优化8: 提供gas估算函数
     * @param message 消息内容
     * @param isGreeting 是否为问候消息
     * @return 预估gas消耗
     */
    function estimateGasForMessage(string memory message, bool isGreeting) public view returns (uint256) {
        // 这是一个简化的估算，实际应该使用更复杂的计算
        uint256 baseGas = 21000; // 基础交易费用
        uint256 eventGas = 375 + 375; // 事件基础费用 + indexed参数
        uint256 stringGas = bytes(message).length * 16; // 字符串处理gas
        uint256 storageGas = isGreeting ? 5000 : 0; // 状态变量更新gas
        
        return baseGas + eventGas + stringGas + storageGas;
    }
} 