// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Hello
 * @dev 一个简单的Hello协议，包含事件发送功能
 */
contract Hello {
    // 事件定义
    event HelloEvent(
        address indexed sender,
        string message,
        uint256 timestamp
    );
    
    event GreetingEvent(
        address indexed from,
        string greeting,
        uint256 timestamp
    );
    
    // 状态变量
    uint256 public counter;
    
    /**
     * @dev 发送Hello事件
     * @param message 要发送的消息
     */
    function sayHello(string memory message) public {
        // 发送Hello事件
        emit HelloEvent(
            msg.sender,
            message,
            block.timestamp
        );
    }
    
    /**
     * @dev 发送问候事件
     * @param greeting 问候语
     */
    function sendGreeting(string memory greeting) public {
        // 增加计数器
        counter++;
        
        // 发送问候事件
        emit GreetingEvent(
            msg.sender,
            greeting,
            block.timestamp
        );
    }
    
    /**
     * @dev 获取当前计数器值
     * @return 计数器当前值
     */
    function getCounter() public view returns (uint256) {
        return counter;
    }
}
