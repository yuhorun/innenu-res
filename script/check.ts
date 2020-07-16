import { checkJSON } from "./util/json";

Promise.all([
  checkJSON("./resource/config"),
  checkJSON("./resource/function"),
  checkJSON("./resource/guide")
]).then(() => {
  console.log("检测完成");
});
