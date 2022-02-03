import * as d3lib from "d3";
import { SimulationNodeDatum } from "d3";
import { FONT_SIZE } from "./canvas";
import { AssociationNode, SegmentedLink } from "./types";
import { nodeRatio } from "./utils";

export function addLinks(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  linkList: SegmentedLink[],
  color: d3lib.ScaleOrdinal<string, string, never>
) {
  return svg
    .append("g")
    .selectAll("path")
    .data(linkList)
    .join("path")
    .attr("stroke", (d) => color(d.type))
    .attr("fill", "none")
    .attr("marker-end", (d) => (d.arrow ? `url(#arrow-${d.type})` : ""));
}

/**
 * Renders an arc link
 */
export function linkArcFunc(d: SegmentedLink) {
  function xy(node: SimulationNodeDatum) {
    const x = node.x ?? 0;
    const y = node.y ?? 0;
    return [x, y];
  }

  function offset(
    dx: number,
    dy: number,
    node: AssociationNode,
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
        (x_sign * (node.maxLength + 2 + margin) * FONT_SIZE) / 2;
      const ty_offset =
        (y_sign * (node.maxLength + 2) * slopeAbs * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    } else if (slopeAbs > targetRatio) {
      // Link touches top/bottom side of node
      const tx_offset = (((x_sign * node.maxRows) / slopeAbs) * FONT_SIZE) / 2;
      const ty_offset = (y_sign * (node.maxRows + margin) * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    } else {
      const tx_offset =
        (x_sign * (node.maxLength + 2 + margin) * FONT_SIZE) / 2;
      const ty_offset = (y_sign * (node.maxRows + margin) * FONT_SIZE) / 2;
      return [tx_offset, ty_offset];
    }
  }

  const [tx, ty] = xy(d.target as SimulationNodeDatum);
  const [sx, sy] = xy(d.source as SimulationNodeDatum);

  const dx = tx - sx;
  const dy = ty - sy;

  if (
    typeof d.target === "string" ||
    typeof d.target === "number" ||
    !("maxLength" in d.target) ||
    typeof d.source === "string" ||
    typeof d.source === "number" ||
    !("maxLength" in d.source)
  ) {
    return null;
  }
  // Target
  const [tx_offset, ty_offset] = offset(dx, dy, d.target, d.arrow);
  // Source
  const [sx_offset, sy_offset] = offset(dx, dy, d.source);

  const r = Math.hypot(dx + tx_offset + sx_offset, dy + ty_offset + sy_offset);

  return `
      M${sx - sx_offset},${sy - sy_offset}
      A${r},${r} 0 0,1 ${tx + tx_offset},${ty + ty_offset}
    `;
}
