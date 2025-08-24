const Hello = artifacts.require("Hello");

contract("Hello", function (accounts) {
  let helloInstance;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async function () {
    helloInstance = await Hello.new({ from: owner });
  });

  describe("基本功能测试", function () {
    it("应该正确初始化合约", async function () {
      const counter = await helloInstance.getCounter();
      assert.equal(counter.toNumber(), 0, "计数器应该初始化为0");
    });

    it("应该能够发送Hello事件", async function () {
      const message = "Hello World!";
      const tx = await helloInstance.sayHello(message, { from: user1 });
      
      // 验证事件
      assert.equal(tx.logs.length, 1, "应该发送一个事件");
      assert.equal(tx.logs[0].event, "HelloEvent", "事件名称应该是HelloEvent");
      assert.equal(tx.logs[0].args.sender, user1, "发送者地址应该正确");
      assert.equal(tx.logs[0].args.message, message, "消息内容应该正确");
      assert(tx.logs[0].args.timestamp > 0, "时间戳应该大于0");
    });

    it("应该能够发送问候事件并增加计数器", async function () {
      const greeting = "你好，区块链！";
      const tx = await helloInstance.sendGreeting(greeting, { from: user1 });
      
      // 验证事件
      assert.equal(tx.logs.length, 1, "应该发送一个事件");
      assert.equal(tx.logs[0].event, "GreetingEvent", "事件名称应该是GreetingEvent");
      assert.equal(tx.logs[0].args.from, user1, "发送者地址应该正确");
      assert.equal(tx.logs[0].args.greeting, greeting, "问候语应该正确");
      assert(tx.logs[0].args.timestamp > 0, "时间戳应该大于0");
      
      // 验证计数器增加
      const counter = await helloInstance.getCounter();
      assert.equal(counter.toNumber(), 1, "计数器应该增加到1");
    });
  });

  describe("多用户测试", function () {
    it("多个用户应该能够发送事件", async function () {
      // 用户1发送问候
      await helloInstance.sendGreeting("用户1的问候", { from: user1 });
      
      // 用户2发送问候
      await helloInstance.sendGreeting("用户2的问候", { from: user2 });
      
      // 验证计数器
      const counter = await helloInstance.getCounter();
      assert.equal(counter.toNumber(), 2, "计数器应该是2");
    });

    it("计数器应该被所有用户共享", async function () {
      await helloInstance.sendGreeting("问候1", { from: user1 });
      await helloInstance.sendGreeting("问候2", { from: user2 });
      await helloInstance.sendGreeting("问候3", { from: owner });
      
      const counter = await helloInstance.getCounter();
      assert.equal(counter.toNumber(), 3, "计数器应该是3");
    });
  });

  describe("事件参数测试", function () {
    it("应该正确处理空字符串", async function () {
      const tx = await helloInstance.sayHello("", { from: user1 });
      assert.equal(tx.logs[0].args.message, "", "空字符串应该被正确处理");
    });

    it("应该正确处理长消息", async function () {
      const longMessage = "这是一个很长的消息，用来测试合约是否能正确处理长字符串。".repeat(5);
      const tx = await helloInstance.sayHello(longMessage, { from: user1 });
      assert.equal(tx.logs[0].args.message, longMessage, "长消息应该被正确处理");
    });
  });
}); 