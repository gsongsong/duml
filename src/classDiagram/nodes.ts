import * as d3lib from "d3";
import { DragBehavior, SubjectPosition } from "d3";
import { FONT_SIZE } from "./canvas";
import { Node } from "./types";
import { attributeToStr } from "./utils";

export function addNodes(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  classList: Node[],
  drag: DragBehavior<Element, Node, Node | SubjectPosition>
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
    .attr("opacity", (d) => 'edge' in d ? 0.25 : 1)
    .attr("width", (d) => (d.maxLength + 2) * FONT_SIZE)
    .attr("height", FONT_SIZE);

  node
    .append("text")
    .text((d) => d.name)
    .style("font-family", "monospace")
    .attr("dominant-baseline", "text-after-edge")
    .attr("x", FONT_SIZE)
    .attr("y", FONT_SIZE);

  // Node attributes
  node
    .append("rect")
    .attr("y", FONT_SIZE)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("opacity", (d) => 'edge' in d ? 0.25 : 1)
    .attr("width", (d) => (d.maxLength + 2) * FONT_SIZE)
    .attr("height", (d) => (d.attributes?.length ?? 0) * FONT_SIZE);

  node
    .append("text")
    .attr("y", 2 * FONT_SIZE)
    .style("font-family", "monospace")
    .selectAll("tspan")
    .data((d) => d.attributes ?? [])
    .join("tspan")
    .text((d) => attributeToStr(d))
    .attr("dominant-baseline", "text-after-edge")
    .attr("x", FONT_SIZE)
    .attr("dy", (_, index) => index ? FONT_SIZE : 0);

  return node;
}

export function nodeTransformFunc(d: Node) {
  return `translate(
    ${(d.x ?? 0) - ((d.maxLength + 2) * FONT_SIZE) / 2},
    ${(d.y ?? 0) - (d.maxRows * FONT_SIZE) / 2}
  )`;
}
