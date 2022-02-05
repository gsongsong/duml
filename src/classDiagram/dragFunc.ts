import * as d3lib from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { Node } from "./types";

type Event = {
  active: boolean;
  dx: number;
  dy: number;
  identifier: string;
  sourceEvent: MouseEvent;
  subject: SimulationNodeDatum;
  target: Function;
  type: string;
  x: number;
  y: number;
};

/**
 * Drag function
 */
export function dragFunc(
  d3: typeof d3lib,
  simulation: d3lib.Simulation<Node, SimulationLinkDatum<Node>>
) {
  function dragstarted(event: Event, d: Node) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: Event, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: Event, d: Node) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return d3
    .drag<Element, Node>()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}
