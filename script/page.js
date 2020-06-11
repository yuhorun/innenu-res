/*
 * @Author: Mr.Hope
 * @Date: 2019-08-30 23:40:54
 * @LastEditors: Mr.Hope
 * @LastEditTime: 2019-12-02 22:31:28
 * @Description: page处理
 */
'use strict';

const { client, putFile, putFolder } = require('ftp-hope');
const { exec } = require('child_process');
const fs = require('fs');
/** 生成关键词 */
const generateKeywords = require('./keyword');
const loginDetail = require('../lib/loginDetail');

generateKeywords();

// 读取旧版本号
const pageVersion = fs.readFileSync('./pageVersion.json', 'utf-8');

// 更新page版本号
fs.writeFileSync('./pageVersion.json', Number(pageVersion) + 1);

// 压缩文件
exec('"lib/7z" a -r page.zip @lib/page.txt');

// 连接客户端
client.connect();

client.on('ready', () => {
  putFolder('./page')
    .then(() => putFile('./pageVersion.json'))
    .then(() => putFile('./page.zip'))
    .then(() => {
      console.log('page 上传成功');
      client.end();
    });
});
