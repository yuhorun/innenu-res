import axios from "axios";
import appidInfo from "../appidInfo";
import { getFileList } from "../util/file";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";

const fileList = getFileList("./res/guide", ".yml").map((filePath) =>
  filePath.replace(/\.yml$/gu, "")
);

const appidList = Object.keys(appidInfo);

const promises = appidList.map((appid) =>
  axios
    .get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appidInfo[appid]}`
    )
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .then(({ data: { access_token } }) => {
      const photoPromises = fileList.map((filePath): Promise<void> | void => {
        const folderPath = dirname(resolve(`./img/QRCode/${appid}`, filePath));

        if (!existsSync(`${filePath}.png`)) {
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
                auto_color: true
              },
              { responseType: "stream" }
            )
            .then(({ data }) => {
              data.pipe(
                createWriteStream(
                  resolve(`./img/QRCode/${appid}`, `${filePath}.png`)
                )
              );
            });
        }
      });

      return Promise.all(photoPromises);
    })
);

Promise.all(promises).then(() => {
  console.log("二维码生成完成");
});
