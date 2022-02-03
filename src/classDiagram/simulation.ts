import * as d3lib from "d3";
import { Node, Options, SegmentedLink } from "./types";

/**
 * Simulation boilerplate. Configures force
 */
export function initSimulation(
  d3: typeof d3lib,
  nodeList: Node[],
  linkList: SegmentedLink[],
  options: Options = {}
) {
  const force = options.force ?? -400;
  return d3
    .forceSimulation(nodeList)
    .force(
      "link",
      d3.forceLink<Node, SegmentedLink>(linkList).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(force))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
}
