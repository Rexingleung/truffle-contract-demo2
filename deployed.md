# 部署流程
## 准备工作
首先准备好 `.env` 文件, 并在文件填写好对应信息
```conf
MNEMONIC="xxxx xxx xxx ...."
PROJECT_ID=xxx
ETHERSCAN_API_KEY=xxx
```

## 1. 首先检查钱包余额
如果余额为 0，需要先获取测试 ETH
```bash
npx truffle console --network sepolia
```

运行起来后, 在命令行分别输入
```JavaScript
// 查看你的账户地址
accounts[0]

// 查看余额（单位是 Wei）
balance = await web3.eth.getBalance(accounts[0])

// 转换为 ETH 单位查看
web3.utils.fromWei(balance, 'ether')
```

## 2. 编译合约
```bash
npx truffle compile
```

## 3. 部署到 Sepolia
```bash
npx truffle migrate --network sepolia
```

## 4. 验证是否部署成功
在 Truffle Console 中验证
```bash
npx truffle console --network sepolia
```
执行这个命令后, 它会在命令行给我们输入的操作, 我们逐行输入一下命令, 查看对应的操作是否成功

```JavaScript
// 获取部署的合约实例
let hello = await Hello.deployed()

// 查看合约地址
hello.address

// 调用合约函数
await hello.sayHello("Hello Sepolia!", {from: accounts[0]})

// 查看计数器
counter = await hello.getCounter()
console.log("Counter:", counter.toString())

// 发送问候
await hello.sendGreeting("First deployment test!", {from: accounts[0]})

// 再次查看计数器
newCounter = await hello.getCounter()
console.log("New Counter:", newCounter.toString())
```
## 5. 验证合约方法是否成功
都成功后, 执行我们编写的脚本, 这个脚本是完全自定义的, 用于测试合约方法是否能成功执行
```bash
npx truffle exec scripts/demo.js --network sepolia
```

## 6. 通过命令行 "Verify and Publish" 合约
安装插件
```bash
npm install -D truffle-plugin-verify
```

```bash
npx truffle run verify Hello --network sepolia
```


# Hello 合约部署信息

## 网络信息
- 网络: Sepolia Testnet
- 网络 ID: 11155111
- 部署日期: 20260826

## 合约信息
- 合约名称: Hello
- 合约地址: 0x84a80fAd2660803848eF124D5E3FA824c31A9B1A
- 部署账户: 0x88ab2Fb66F3d5156E95cD8B1f9e308BCE45E7a26
- 部署交易哈希: 0x948c40e0e899bf8573ef05b9ae862a5d867a978b407c105ccdc7ff89bb6074dd

## 合约功能
- `sayHello(string message)`: 发送 HelloEvent 事件
- `sendGreeting(string greeting)`: 发送 GreetingEvent 事件并增加计数器
- `getCounter()`: 获取当前计数器值

## Etherscan 链接
- 合约: https://sepolia.etherscan.io/address/[合约地址]
- 部署交易: https://sepolia.etherscan.io/tx/[交易哈希]

## 交互示例
```javascript
// 在 truffle console 中
let hello = await Hello.deployed()
await hello.sayHello("Hello Sepolia!")
let counter = await hello.getCounter()
```