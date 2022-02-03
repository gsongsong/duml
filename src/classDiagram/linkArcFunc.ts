import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

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
