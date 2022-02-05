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
    .attr("stroke-width", 1.5)
    .attr("fill", "none")
    .attr("marker-end", (d) => `url(#arrow-${d.type})`);
}

/**
 * Renders an arc link
 */
export function linkFunc(d: SegmentedLink) {
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
    const margin = Number(additionalMargin) * FONT_SIZE;
    const [x_sign, y_sign] = [-Math.sign(dx), -Math.sign(dy)];
    // Check link touches left/right or top/bottom side of node
    if (slopeAbs < targetRatio) {
      // Link touches left/right side of node
      const x_offset =
        x_sign * Math.min((node.width + margin) / 2, Math.abs(dx));
      const y_offset = y_sign * Math.abs(x_offset) * slopeAbs;
      return [x_offset, y_offset];
    } else if (slopeAbs > targetRatio) {
      // Link touches top/bottom side of node
      const y_offset =
        y_sign * Math.min((node.height + margin) / 2, Math.abs(dy));
      const x_offset = (x_sign * Math.abs(y_offset)) / slopeAbs;
      return [x_offset, y_offset];
    } else {
      const x_offset =
        x_sign * Math.min((node.width + margin) / 2, Math.abs(dx));
      const y_offset =
        y_sign * Math.min((node.height + margin) / 2, Math.abs(dy));
      return [x_offset, y_offset];
    }
  }

  const [tx, ty] = xy(d.target as SimulationNodeDatum);
  const [i2x, i2y] = xy((d as any).intermediate2 as SimulationNodeDatum);
  const [ax, ay] = xy((d as any).associationNode as SimulationNodeDatum);
  const [i1x, i1y] = xy((d as any).intermediate1 as SimulationNodeDatum);
  const [sx, sy] = xy(d.source as SimulationNodeDatum);

  if (
    typeof d.target === "string" ||
    typeof d.target === "number" ||
    !("width" in d.target) ||
    typeof d.source === "string" ||
    typeof d.source === "number" ||
    !("width" in d.source)
  ) {
    return null;
  }
  // Target
  const [tx_offset, ty_offset] = offset(tx - ax, ty - ay, d.target, true);
  // Source
  const [sx_offset, sy_offset] = offset(ax - sx, ay - sy, d.source);

  return `
      M${sx - sx_offset},${sy - sy_offset}
      Q${i1x},${i1y} ${ax},${ay} ${i2x},${i2y} ${tx + tx_offset},${
    ty + ty_offset
  }
    `;
}
