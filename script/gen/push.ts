import axios from "axios";
<<<<<<< HEAD
import appidInfo from "../appidInfo";
import { getFileList } from "../util/file";

const appidList = Object.keys(appidInfo);
=======
import { appIDInfo } from "../info";
import { getFileList } from "../util/file";

const appidList = Object.keys(appIDInfo);
>>>>>>> fe2eb1d3eec51dd9c854faddd4262cfaab192523

export const pushPages = (): Promise<void> => {
  const fileList = getFileList("./res/guide", "yml");

  const pageLists = fileList.map((filePath) => ({
    path: "module/page",
    query: `scene=${filePath.replace(/\.yml$/u, "")}`,
  }));

  const promises = appidList.map((appid) =>
    axios
      .get(
<<<<<<< HEAD
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appidInfo[appid]}`
=======
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appIDInfo[appid]}`
>>>>>>> fe2eb1d3eec51dd9c854faddd4262cfaab192523
      )
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .then(({ data: { access_token } }) => {
        return axios
          .post(
            `https://api.weixin.qq.com/wxa/search/wxaapi_submitpages?access_token=${access_token}`,
            {
              pages: pageLists,
            }
          )
          .then(({ data }) => {
            console.log(data);
          });
      })
  );

  return Promise.all(promises).then(() => {
    console.log("页面推送完成");
  });
};
