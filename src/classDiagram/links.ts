import * as d3lib from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

export function addLinks(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  associationList: any[]
) {
  return svg
    .append("g")
    .selectAll("path")
    .data(associationList)
    .join("path")
    .attr("stroke", "black")
    .attr("fill", "none")
    .attr("marker-end", (d) => (d.arrow ? "url(#arrow)" : ""));
}

/**
 * Renders an arc link
 */
 export function linkArcFunc(d: SimulationLinkDatum<SimulationNodeDatum>) {
  const target = d.target as SimulationNodeDatum;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;
  const source = d.source as SimulationNodeDatum;
  const sx = source.x ?? 0;
  const sy = source.y ?? 0;
  const r = Math.hypot(tx - sx, ty - sy);
  return `
      M${sx},${sy}
      A${r},${r} 0 0,1 ${tx},${ty}
    `;
}
