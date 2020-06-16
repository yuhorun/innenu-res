'use strict';

const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');

/** 生成关键词 */
const generateKeywords = require('./keyword');

generateKeywords();

// 读取旧版本号
const functionVersion = fs
  .readFileSync('./functionVersion.json', 'utf-8')
  .trim();
const pageVersion = fs.readFileSync('./pageVersion.json', 'utf-8').trim();

// 更新 function 版本号
fs.writeFileSync('./functionVersion.json', `${Number(functionVersion) + 1}\n`);

// 更新 page 版本号
fs.writeFileSync('./pageVersion.json', `${Number(pageVersion) + 1}\n`);

// 压缩文件
if (os.type() === 'Linux') {
  exec('zip -r function.zip function functionVersion.json');
  exec('zip -r page.zip page pageVersion.json');
} else if (os.type() === 'Windows_NT') {
  exec('"lib/7z" a -r function.zip @lib/function');
  exec('"lib/7z" a -r page.zip @lib/page');
} else throw new Error('Mac OS is not supported');
