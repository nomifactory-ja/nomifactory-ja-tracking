function rSplitOnce(str: string, splitter: string) {
  const i = str.lastIndexOf(splitter);
  return [str.slice(0, i), str.slice(i + 1)];
}

function filterASCII(str: string) {
  return str.replace(/[\x00-\x7F]/g, "");
}

interface ILang {
  title: string;
  desc: string;
}

interface ILangData {
  [key: string]: ILang;
}

const data = await fetch(
  "https://raw.githubusercontent.com/naari3/nomifactory-ja/main/src/assets/questbook/lang/en_us.lang"
);
const text = await data.text();
const valuableLines = text
  .split("\n")
  .filter((line) => line !== "")
  .filter((line) => !line.startsWith("#"));
const langData: ILangData = valuableLines.reduce((acc, line) => {
  const [key, value] = line.split("=");
  const [objKey, nextKey] = rSplitOnce(key, ".");
  if (!acc[objKey]) {
    acc[objKey] = {} as ILang;
  }
  if (nextKey === "title" || nextKey === "desc") {
    acc[objKey][nextKey] = value;
  } else {
    console.log("Unknown key: ", nextKey);
  }
  return acc;
}, {} as ILangData);

const titleTranslatedCount = Object.entries(langData).reduce(
  (acc, [, value]) => {
    const tilteHasJapanese = filterASCII(value.title).length > 0;

    if (tilteHasJapanese) {
      acc++;
    }
    return acc;
  },
  0
);

const descTranslatedCount = Object.entries(langData).reduce(
  (acc, [, value]) => {
    const descHasJapanese = filterASCII(value.desc).length > 0;

    if (descHasJapanese) {
      acc++;
    }
    return acc;
  },
  0
);

const translatedCount = Object.entries(langData).reduce((acc, [, value]) => {
  const tilteHasJapanese = filterASCII(value.title).length > 0;
  const descHasJapanese = filterASCII(value.desc).length > 0;

  if (tilteHasJapanese || (!tilteHasJapanese && descHasJapanese)) {
    acc++;
  }
  return acc;
}, 0);

export interface ResultData {
  createdAt: string;
  allCount: number;
  translatedCount: number;
  titleTranslatedCount: number;
  descTranslatedCount: number;
}

const result = {
  allCount: Object.keys(langData).length,
  translatedCount,
  titleTranslatedCount,
  descTranslatedCount,
};
console.log(result);

import * as fs from "fs/promises";
import { existsSync } from "fs";

const translatedResultFileName = "translated-result.json";

const isTranslatedResultFileExists = existsSync(translatedResultFileName);
const translatedResult = (
  isTranslatedResultFileExists
    ? JSON.parse(await fs.readFile(translatedResultFileName, "utf-8"))
    : []
) as ResultData[];

const currentDate = new Date().toLocaleString("ja-JP", { timeZone: "JST" });
translatedResult.push({
  createdAt: currentDate,
  ...result,
});

await fs.writeFile(
  translatedResultFileName,
  JSON.stringify(translatedResult, null, 2)
);
