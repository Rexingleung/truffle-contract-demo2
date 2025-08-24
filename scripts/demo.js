const Hello = artifacts.require("Hello");

module.exports = async function(callback) {
  try {
    console.log("🚀 开始Hello合约演示...\n");
    
    // 获取合约实例
    const hello = await Hello.deployed();
    console.log("✅ 合约已部署，地址:", hello.address);
    
    // 获取当前计数器值
    const initialCounter = await hello.getCounter();
    console.log("📊 初始计数器值:", initialCounter.toNumber());
    
    // 发送Hello事件
    console.log("\n📢 发送Hello事件...");
    const tx1 = await hello.sayHello("Hello, Ethereum!");
    console.log("✅ Hello事件已发送，交易哈希:", tx1.tx);
    
    // 发送问候事件
    console.log("\n👋 发送问候事件...");
    const tx2 = await hello.sendGreeting("你好，区块链世界！");
    console.log("✅ 问候事件已发送，交易哈希:", tx2.tx);
    
    // 再次发送问候
    console.log("\n👋 再次发送问候事件...");
    const tx3 = await hello.sendGreeting("Welcome to Web3!");
    console.log("✅ 问候事件已发送，交易哈希:", tx3.tx);
    
    // 获取最终计数器值
    const finalCounter = await hello.getCounter();
    console.log("\n📊 最终计数器值:", finalCounter.toNumber());
    
    console.log("\n🎉 演示完成！");
    console.log("\n📋 事件详情:");
    console.log("- HelloEvent:", {
      sender: tx1.logs[0].args.sender,
      message: tx1.logs[0].args.message,
      timestamp: tx1.logs[0].args.timestamp.toString()
    });
    console.log("- GreetingEvent 1:", {
      from: tx2.logs[0].args.from,
      greeting: tx2.logs[0].args.greeting,
      timestamp: tx2.logs[0].args.timestamp.toString()
    });
    console.log("- GreetingEvent 2:", {
      from: tx3.logs[0].args.from,
      greeting: tx3.logs[0].args.greeting,
      timestamp: tx3.logs[0].args.timestamp.toString()
    });
    
  } catch (error) {
    console.error("❌ 演示过程中出现错误:", error);
  }
  
  callback();
}; 