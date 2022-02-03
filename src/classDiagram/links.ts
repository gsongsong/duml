import * as d3lib from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { FONT_SIZE } from "./canvas";

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
  function xy(node: SimulationNodeDatum) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    return [x, y];
  }

  function nodeRatio(node: any) {
    return node.maxRows / (node.maxLength + 2);
  }

  function offset(
    dx: number,
    dy: number,
    node: any,
    additionalMargin: boolean = false
  ) {
    const slopeLink = dy / dx;
    const slopeAbs = Math.abs(slopeLink);
    const targetRatio = nodeRatio(node);
    const margin = Number(additionalMargin);
    const [x_sign, y_sign] = [-Math.sign(dx), -Math.sign(dy)];
    // Check link touches left/right or top/bottom side of node
    if (slopeAbs < targetRatio) {
      // Link touches left/right side of node
      const tx_offset =
        (x_sign * ((node as any).maxLength + 2 + margin) * FONT_SIZE) / 2;
      const ty_offset =
        (y_sign * ((node as any).maxLength + 2) * slopeAbs * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    } else if (slopeAbs > targetRatio) {
      // Link touches top/bottom side of node
      const tx_offset =
        (((x_sign * (node as any).maxRows) / slopeAbs) * FONT_SIZE) / 2;
      const ty_offset =
        (y_sign * ((node as any).maxRows + margin) * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    } else {
      const tx_offset =
        (x_sign * ((node as any).maxLength + 2 + margin) * FONT_SIZE) / 2;
      const ty_offset =
        (y_sign * ((node as any).maxRows + margin) * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    }
  }

  const [tx, ty] = xy(d.target as SimulationNodeDatum);
  const [sx, sy] = xy(d.source as SimulationNodeDatum);

  const dx = tx - sx;
  const dy = ty - sy;

  // Target
  const [tx_offset, ty_offset] = offset(dx, dy, d.target, (d as any).arrow);
  // Source
  const [sx_offset, sy_offset] = offset(dx, dy, d.source);

  const r = Math.hypot(dx + tx_offset + sx_offset, dy + ty_offset + sy_offset);

  return `
      M${sx - sx_offset},${sy - sy_offset}
      A${r},${r} 0 0,1 ${tx + tx_offset},${ty + ty_offset}
    `;
}
