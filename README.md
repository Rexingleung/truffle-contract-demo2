# Hello 智能合约

这是一个简单的Hello智能合约，演示了如何在以太坊上发送事件。

## 功能特性

- **HelloEvent**: 发送Hello消息事件
- **GreetingEvent**: 发送问候事件
- 全局计数器跟踪
- 简单易用的接口

## 合约方法

### 事件发送方法

1. **sayHello(string memory message)**
   - 发送Hello事件
   - 参数：消息内容
   - 事件：HelloEvent

2. **sendGreeting(string memory greeting)**
   - 发送问候事件
   - 参数：问候语
   - 事件：GreetingEvent
   - 同时增加全局计数器

### 查询方法

1. **getCounter()** - 获取当前计数器值

## 事件定义

### HelloEvent
```solidity
event HelloEvent(
    address indexed sender,
    string message,
    uint256 timestamp
);
```

### GreetingEvent
```solidity
event GreetingEvent(
    address indexed from,
    string greeting,
    uint256 timestamp
);
```

## 安装和部署

### 1. 安装依赖
```bash
npm install
```

### 2. 编译合约
```bash
truffle compile
```

### 3. 运行测试
```bash
truffle test
```

### 4. 部署合约
```bash
truffle migrate
```

## 使用示例

### 在JavaScript中监听事件

```javascript
const Hello = artifacts.require("Hello");

// 部署合约
const hello = await Hello.deployed();

// 发送Hello事件
await hello.sayHello("Hello World!");

// 监听HelloEvent事件
hello.HelloEvent({}, { fromBlock: 'latest' })
  .on('data', function(event) {
    console.log('HelloEvent:', {
      sender: event.args.sender,
      message: event.args.message,
      timestamp: event.args.timestamp.toString()
    });
  })
  .on('error', console.error);
```

### 在Web3.js中监听事件

```javascript
const web3 = new Web3(Web3.givenProvider);
const contract = new web3.eth.Contract(Hello.abi, contractAddress);

// 监听所有事件
contract.events.allEvents({}, (error, event) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Event:', event);
});
```

### 发送问候并监听事件

```javascript
// 发送问候
await hello.sendGreeting("你好，区块链！");

// 监听GreetingEvent事件
hello.GreetingEvent({}, { fromBlock: 'latest' })
  .on('data', function(event) {
    console.log('GreetingEvent:', {
      from: event.args.from,
      greeting: event.args.greeting,
      timestamp: event.args.timestamp.toString()
    });
    
    // 获取当前计数器值
    hello.getCounter().then(counter => {
      console.log('当前计数器值:', counter.toNumber());
    });
  });
```

## 测试

运行测试套件：
```bash
truffle test
```

测试覆盖了以下功能：
- 合约初始化
- Hello事件发送
- Greeting事件发送
- 计数器功能
- 多用户交互
- 参数验证

## 技术栈

- Solidity ^0.8.0
- Truffle Framework
- Web3.js
- Mocha (测试框架)

## 许可证

MIT License 