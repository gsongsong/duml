import * as d3lib from "d3";
import { Options } from "./types";

/**
 * Simulation boilerplate. Configures force
 */
export function initSimulation(
  d3: typeof d3lib,
  classList: any[],
  associationList: any[],
  options: Options = {}
) {
  const force = options.force ?? -400;
  return d3
    .forceSimulation(classList)
    .force(
      "link",
      d3.forceLink(associationList).id((d) => (d as any).id)
    )
    .force("charge", d3.forceManyBody().strength(force))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
}
