import * as d3lib from "d3";

export function addDefinitions(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  associationList: any[],
  color: d3lib.ScaleOrdinal<string, string, never>,
) {
  svg
    .append("defs")
    .selectAll("marker")
    .data(associationList)
    .join("marker")
    .attr("id", (d) => `arrow-${d.type}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", (d) => color(d.type))
    .attr("d", "M0,-5L10,0L0,5");
}
