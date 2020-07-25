import axios from "axios";
import appidInfo from "../appidInfo";
import { getFileList } from "../util/file";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { promiseQueue } from "../util/queue";

const fileList = getFileList("./res/guide", ".yml").map((filePath) =>
  filePath.replace(/\.yml$/gu, "")
);

const appidList = Object.keys(appidInfo);

const removeQRCode = (): void => {
  appidList.forEach((appid) => {
    const imgList = getFileList(
      `./img/QRCode/${appid}`,
      ".png"
    ).map((filePath) => filePath.replace(/\.png$/gu, ""));

    imgList.forEach((imgPath) => {
      if (!fileList.includes(imgPath))
        unlinkSync(`./img/QRCode/${appid}/${imgPath}.png`);
    });
  });
};

const getQRCode = (): Promise<void> => {
  const promises = appidList.map((appid) =>
    axios
      .get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appidInfo[appid]}`
      )
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .then(({ data: { access_token } }) => {
        const photoPromises = fileList.map((filePath): (() => Promise<
          void
        >) => (): Promise<void> => {
          const folderPath = dirname(
            resolve(`./img/QRCode/${appid}`, filePath)
          );

          if (!existsSync(`./img/QRCode/${appid}/${filePath}.png`)) {
            console.log(`${appid}: ${filePath}.png 不存在`);
            if (!existsSync(folderPath))
              mkdirSync(folderPath, { recursive: true });

            return axios
              .post(
                `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${access_token}`,
                {
                  page: "module/page",
                  scene: filePath,
                  width: 1280,
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  auto_color: true,
                },
                { responseType: "arraybuffer" }
              )
              .then(({ data }) => {
                console.log(`${appid}: ${filePath}.png 下载完成`);

                writeFileSync(
                  resolve(`./img/QRCode/${appid}`, `${filePath}.png`),
                  data
                );

                console.log(`${appid}: ${filePath}.png 写入完成`);
              });
          } else return new Promise((resolve) => resolve());
        });

        return promiseQueue(photoPromises, 5);
      })
  );

  return Promise.all(promises).then(() => {
    console.log("二维码生成完成");
  });
};

export const genQRCode = (): Promise<void> => {
  removeQRCode();

  return getQRCode();
};
