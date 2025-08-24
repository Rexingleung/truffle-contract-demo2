const Hello = artifacts.require("Hello");

module.exports = async function (callback) {
  try {
    console.log("=== Hello合约Gas消耗分析 ===\n");
    
    // 部署合约
    console.log("1. 合约部署Gas消耗:");
    const deployStart = Date.now();
    const helloInstance = await Hello.new();
    const deployEnd = Date.now();
    console.log(`   部署时间: ${deployEnd - deployStart}ms`);
    console.log(`   合约地址: ${helloInstance.address}\n`);
    
    // 测试sayHello函数的gas消耗
    console.log("2. sayHello函数Gas消耗:");
    const accounts = await web3.eth.getAccounts();
    const user1 = accounts[1];
    
    // 测试不同长度的消息
    const testMessages = [
      "",                    // 空字符串
      "Hello",              // 短消息
      "Hello World!",       // 中等消息
      "这是一个中文消息",     // 中文消息
      "This is a very long message that contains many characters to test gas consumption for different string lengths".repeat(3) // 长消息
    ];
    
    for (let i = 0; i < testMessages.length; i++) {
      const message = testMessages[i];
      const messageLength = message.length;
      
      // 估算gas
      const estimatedGas = await helloInstance.sayHello.estimateGas(message, { from: user1 });
      
      // 实际执行并获取gas消耗
      const tx = await helloInstance.sayHello(message, { from: user1 });
      const actualGas = tx.receipt.gasUsed;
      
      console.log(`   消息长度: ${messageLength} 字符`);
      console.log(`   估算Gas: ${estimatedGas}`);
      console.log(`   实际Gas: ${actualGas}`);
      console.log(`   消息预览: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
      console.log("");
    }
    
    // 测试sendGreeting函数的gas消耗
    console.log("3. sendGreeting函数Gas消耗:");
    const testGreetings = [
      "",                    // 空字符串
      "Hi",                  // 短问候
      "你好，区块链！",       // 中文问候
      "Hello, this is a greeting message for testing gas consumption".repeat(2) // 长问候
    ];
    
    for (let i = 0; i < testGreetings.length; i++) {
      const greeting = testGreetings[i];
      const greetingLength = greeting.length;
      
      // 获取当前计数器值
      const counterBefore = await helloInstance.getCounter();
      
      // 估算gas
      const estimatedGas = await helloInstance.sendGreeting.estimateGas(greeting, { from: user1 });
      
      // 实际执行并获取gas消耗
      const tx = await helloInstance.sendGreeting(greeting, { from: user1 });
      const actualGas = tx.receipt.gasUsed;
      
      // 获取更新后的计数器值
      const counterAfter = await helloInstance.getCounter();
      
      console.log(`   问候语长度: ${greetingLength} 字符`);
      console.log(`   估算Gas: ${estimatedGas}`);
      console.log(`   实际Gas: ${actualGas}`);
      console.log(`   计数器变化: ${counterBefore} -> ${counterAfter}`);
      console.log(`   问候语预览: ${greeting.substring(0, 50)}${greeting.length > 50 ? '...' : ''}`);
      console.log("");
    }
    
    // 测试getCounter函数的gas消耗
    console.log("4. getCounter函数Gas消耗:");
    const counterEstimatedGas = await helloInstance.getCounter.estimateGas();
    console.log(`   估算Gas: ${counterEstimatedGas}`);
    console.log(`   注意: getCounter是view函数，实际不消耗gas\n`);
    
    // 分析事件gas消耗
    console.log("5. 事件Gas消耗分析:");
    console.log("   HelloEvent事件包含:");
    console.log("   - indexed address sender (32字节)");
    console.log("   - string message (动态长度)");
    console.log("   - uint256 timestamp (32字节)");
    console.log("   每个事件消耗约375 gas基础费用");
    console.log("   每个indexed参数消耗约375 gas");
    console.log("   非indexed参数按字节数计算gas\n");
    
    // 分析状态变量gas消耗
    console.log("6. 状态变量Gas消耗分析:");
    console.log("   counter (uint256): 存储新值消耗约20,000 gas");
    console.log("   从0变为非0值: 20,000 gas");
    console.log("   从非0变为非0值: 5,000 gas");
    console.log("   从非0变为0值: 5,000 gas + 15,000 gas退款\n");
    
    // 总结
    console.log("7. Gas消耗总结:");
    console.log("   - 合约部署: 约200,000-300,000 gas");
    console.log("   - sayHello: 约25,000-50,000 gas (取决于消息长度)");
    console.log("   - sendGreeting: 约45,000-70,000 gas (包含状态变量更新)");
    console.log("   - getCounter: 0 gas (view函数)");
    console.log("   - 事件发送: 约750-1,125 gas (基础费用 + indexed参数)");
    
    callback();
  } catch (error) {
    console.error("Gas分析过程中出现错误:", error);
    callback(error);
  }
}; 