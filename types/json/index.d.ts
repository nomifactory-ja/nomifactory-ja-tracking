declare module "*/translated-result.json" {
  interface ResultData {
    createdAt: string;
    allCount: number;
    translatedCount: number;
    titleTranslatedCount: number;
    descTranslatedCount: number;
  }

  const value: ResultData[];
  export = value;
}
