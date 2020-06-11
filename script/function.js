'use strict';

const { client, putFile, putFolder } = require('ftp-hope');
const { exec } = require('child_process');
const fs = require('fs');
const loginDetail = require('../lib/loginDetail');

// 读取当前版本号
const functionVersion = fs
  .readFileSync('./functionVersion.json', 'utf-8')
  .trim();

// 更新function版本号
fs.writeFileSync('./functionVersion.json', `${Number(functionVersion) + 1}\n`);

// 压缩文件
exec('"lib/7z" a -r function.zip @lib/function.txt');

// 连接客户端
client.connect(loginDetail);

client.on('ready', () => {
  putFolder('./function')
    .then(() => putFile('./functionVersion.json'))
    .then(() => putFile('./function.zip'))
    .then(() => {
      console.log('function 上传成功');
      client.end();
    });
});
