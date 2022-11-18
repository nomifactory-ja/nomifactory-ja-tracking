import { createWriteStream } from "fs";
import { parse, View } from "vega";
import { Config, TopLevelSpec, compile } from "vega-lite";
import values from "./translated-result.json" assert { type: "json" };

const spec: TopLevelSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  data: {
    values,
  },
  repeat: {
    layer: ["translatedCount", "allCount"],
  },
  spec: {
    mark: "line",
    encoding: {
      x: {
        field: "createdAt",
        type: "temporal",
        title: "Date",
      },
      y: {
        aggregate: "mean",
        field: { repeat: "layer" },
        type: "quantitative",
        title: "Count",
      },
      color: {
        datum: { repeat: "layer" },
        type: "nominal",
      },
    },
  },
};

const config: Config = {
  bar: {
    color: "firebrick",
  },
};

const vegaSpec = compile(spec, { config }).spec;

const view = new View(parse(vegaSpec)).renderer("none").finalize();
view
  .toCanvas(3)
  .then(function (canvas) {
    // process node-canvas instance for example, generate a PNG stream to write var
    // stream = canvas.createPNGStream();
    console.log("Writing PNG to file...");
    const out = createWriteStream("translated-result.png");
    const stream = (canvas as any).createPNGStream();
    stream.on("data", (chunk: any) => {
      out.write(chunk);
    });
  })
  .catch(function (err) {
    console.log("Error writing PNG to file:");
    console.error(err);
  });
