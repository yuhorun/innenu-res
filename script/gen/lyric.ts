import { readFileSync, writeFileSync } from "fs";
import { getFileList } from "../util/file";

const lyricFolder = "./res/function/music";

interface LyricConfig {
  time: number;
  text: string;
}

export const genLyric = (): void => {
  console.log("开始处理歌词");
  const lyricList = getFileList(lyricFolder, ".lrc");

  lyricList.forEach((lyricPath) => {
    const content = readFileSync(`${lyricFolder}/${lyricPath}`, {
      encoding: "utf-8",
    });

    const lyrics = content.split("\n");
    const lyricConfig: LyricConfig[] = [];

    lyrics.forEach((lyric) => {
      const result = /\[(.*)\](.*)?/u.exec(lyric);
      if (result) {
        const timeResult = /(.*):(.*)/u.exec(result[1]) as RegExpExecArray;
        const time = Number(
          (Number(timeResult[1]) * 60 + Number(timeResult[2])).toFixed(3)
        );

        lyricConfig.push({ time, text: result[2] });
      }
    });

    writeFileSync(
      `./resource/function/music/${lyricPath.replace(/lrc$/u, "json")}`,
      JSON.stringify(lyricConfig)
    );
  });
  console.log("歌词处理完毕");
};
