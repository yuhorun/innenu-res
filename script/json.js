'use strict';

const fs = require('fs');

const testJSON = (path) => {
  const content = fs.readFileSync(path, { encoding: 'utf-8' });

  try {
    JSON.parse(content);
  } catch (err) {
    console.error(`${path} is not a correct JSON file`);
  }
};

const checkJSON = (path) =>
  new Promise((resolve, reject) => {
    fs.readdir(path, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`读取文件夹 ${path} 出错`, err);

        return reject(err);
      }

      const checkProcess = [];

      files.forEach((file) => {
        // 是文件
        if (file.isDirectory())
          checkProcess.push(checkJSON(`${path}/${file.name}`));
        else if (file.name.split('.').pop() === 'json')
          checkProcess.push(testJSON(`${path}/${file.name}`));
      });

      return Promise.all(checkProcess).then(() => resolve());
    });
  });

Promise.all([
  checkJSON('./config'),
  checkJSON('./function'),
  checkJSON('./page')
]).then(() => {
  console.log('检测完成');
});
