import * as d3lib from "d3";
import { Options } from "./types";

/**
 * Canvas boilerplate. Configures width, height and view box
 */
export function initCanvas(d3: typeof d3lib, options: Options = {}) {
  const vw = options.vw ?? 600;
  const vh = options.vh ?? 600;
  const width = options.width ?? 600;
  const height = options.height ?? 600;
  return d3
    .create("svg")
    .attr("viewBox", [-vw / 2, -vh / 2, vw, vh])
    .attr("width", width)
    .attr("height", height);
}
