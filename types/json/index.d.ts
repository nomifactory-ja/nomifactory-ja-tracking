declare module "*/translated-result.json" {
  interface ResultData {
    createdAt: string;
    translatedCount: number;
    allCount: number;
  }

  const value: ResultData[];
  export = value;
}
