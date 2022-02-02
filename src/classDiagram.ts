import * as d3lib from "d3";
import { SimulationLinkDatum, SimulationNodeDatum } from "d3";

type Class = {
  name: string;
};

type Association = {
  name: string;
  source: string;
  target: string;
};

type Options = {
  width?: number;
  height?: number;
  vw?: number;
  vh?: number;
  force?: number;
};

export function ClassDiagram(
  d3: typeof d3lib,
  { classes, associations }: { classes: Class[]; associations: Association[] },
  options: Options = {}
) {
  const classList = classes.map(Object.create);
  const associationList = associations.map(Object.create);
  const associationNameList = associationList.map((a) => a.name);
  const colorSchema = d3.schemeCategory10;
  const color = d3.scaleOrdinal(associationNameList, colorSchema);

  const force = options.force ?? -400;
  const simulation = d3
    .forceSimulation(classList)
    .force(
      "link",
      d3.forceLink(associationList).id((d) => (d as Class).name)
    )
    .force("charge", d3.forceManyBody().strength(force))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const drag = (
    simulation: d3lib.Simulation<
      SimulationNodeDatum,
      SimulationLinkDatum<SimulationNodeDatum>
    >
  ) => {
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const vw = options.vw ?? 600;
  const vh = options.vh ?? 600;
  const width = options.width ?? 600;
  const height = options.height ?? 600;
  const svg = d3
    .create("svg")
    .attr("viewBox", [-vw / 2, -vh / 2, vw, vh])
    .attr("width", width)
    .attr("height", height);

  svg
    .append("defs")
    .selectAll("marker")
    .data(associationNameList)
    .join("marker")
    .attr("id", (d) => `arrow-${d}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", color)
    .attr("d", "M0,-5L10,0L0,5");

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(associationList)
    .join("path")
    .attr("stroke", (d) => color((d as Association).name))
    .attr("marker-end", (d) => `url(#arrow-${d.name})`);

  function linkArc(d: SimulationLinkDatum<SimulationNodeDatum>) {
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

  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(classList)
    .join("g")
    .call(drag(simulation) as any);

  node
    .append("circle")
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .attr("r", 4);

  node
    .append("text")
    .attr("x", 8)
    .attr("y", "0.31em")
    .text((d) => (d as Class).name)
    .clone(true)
    .lower()
    .attr("fill", "none")
    .attr("storke", "white")
    .attr("stroke-width", 3);

  simulation.on("tick", () => {
    link.attr("d", linkArc);
    node.attr(
      "transform",
      (d) =>
        `translate(${(d as SimulationNodeDatum).x},${
          (d as SimulationNodeDatum).y
        })`
    );
  });

  return svg.node();
}
