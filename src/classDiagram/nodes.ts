import * as d3lib from "d3";
import { DragBehavior, SimulationNodeDatum } from "d3";
import { Attribute, Class } from "./types";
import { attributeToStr } from "./utils";

export function addNodes(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  classList: any[],
  drag: DragBehavior<Element, unknown, unknown>
) {
  const node = svg
    .append("g")
    .selectAll("g")
    .data(classList)
    .join("g")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .call(drag as any);

  // Node name
  node
    .append("rect")
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("width", (d) => (d.width + 2) * 8)
    .attr("height", "1em");

  node
    .append("text")
    .text((d) => (d as Class).name)
    .style("font-family", "monospace")
    .attr("x", "1em")
    .attr("y", "1em");

  // Node attributes
  node
    .append("rect")
    .attr("y", "1em")
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("width", (d) => (d.width + 2) * 8)
    .attr("height", (d) => `${d.attributes?.length ?? 0}em`);

  node
    .append("text")
    .attr("y", "2em")
    .style("font-family", "monospace")
    .selectAll("tspan")
    .data((d) => d.attributes ?? [])
    .join("tspan")
    .text((d) => attributeToStr(d as Attribute))
    .attr("x", "1em")
    .attr("dy", (_, index) => `${index}em`);

  return node;
}

export function nodeTransformFunc(d: any) {
  return `translate(${((d as SimulationNodeDatum).x ?? 0) - (d.width + 2) * 4},${
    (d as SimulationNodeDatum).y
  })`
}
