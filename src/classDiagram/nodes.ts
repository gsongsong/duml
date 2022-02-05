import * as d3lib from "d3";
import { DragBehavior, SubjectPosition } from "d3";
import { FONT_SIZE } from "./canvas";
import { Node } from "./types";
import { attributeToStr } from "./utils";

export function addNodes(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  classList: Node[],
  drag: DragBehavior<Element, Node, Node | SubjectPosition>,
  color: d3lib.ScaleOrdinal<string, string, never>
) {
  const node = svg
    .append("g")
    .selectAll("g")
    // `filter()` prevents node with zero length (e.g. association intermediate node) being rendered
    .data(classList.filter((cls) => cls.width))
    .join("g")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .call(drag as any);

  // Node name
  node
    .append("rect")
    .attr("stroke", (d) => 'edge' in d ? color((d as Node).id) : 'black')
    .attr("fill", "white")
    .attr("width", (d) => d.width)
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
    .attr("stroke", (d) => 'edge' in d ? color((d as Node).id) : 'black')
    .attr("fill", "white")
    .attr("width", (d) => d.width)
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
    ${(d.x ?? 0) - d.width / 2},
    ${(d.y ?? 0) - d.height / 2}
  )`;
}
