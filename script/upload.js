"use strict";

const { client, putFolder } = require("ftp-hope");
const loginInfo = require("./loginInfo");

// 连接客户端
client.connect(loginInfo);

client.on("ready", () => {
  putFolder("./service/info")
    .then(() => {
      console.log("upload success");
      client.end();
    });
});
