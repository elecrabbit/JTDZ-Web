import mqtt from "mqtt";
export default {
	MQTTconnect(topic,payload) {
		var client;
		const options = {
		  connectTimeout: 4000000,
		  clientId: "mqtitId-Home",
		  username: "admin",
		  password: "password",
		  clean: true
		};
		client = mqtt.connect("ws://106.14.38.21:61623/mqtt", options);
		// mqtt连接
		client.on("connect", e => {
		  console.log("连接成功:");
		  client.subscribe(topic, { qos: 1 }, error => {
			if (!error) {
			  console.log("订阅成功");
			  client.publish(topic,payload);
			} else {
			  console.log("订阅失败");
			}
		  });
		});
		// 接收消息处理
		client.on("message", (topic, message) => {
		  console.log("收到来自", topic, "的消息", message.toString());
		  this.msg = message.toString();
		});
		// 断开发起重连
		client.on("reconnect", error => {
		  console.log("正在重连:", error);
		});
		// 链接异常处理
		client.on("error", error => {
		  console.log("连接失败:", error);
		});
	  }

}