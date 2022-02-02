import * as d3lib from "d3";
import { DragBehavior, SimulationLinkDatum, SimulationNodeDatum } from "d3";

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
  const color = getColorSchema(d3, associationNameList);
  const svg = initCanvas(d3, options);
  const simulation = initSimulation(d3, classList, associationList, options);
  addDefinitions(svg, associationNameList, color);
  const link = addLinks(svg, associationList, color);
  const node = addNodes(svg, classList, dragFunc(d3, simulation));

  simulation.on("tick", () => {
    link.attr("d", linkArcFunc);
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

function addDefinitions(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  associationNameList: string[],
  color: d3lib.ScaleOrdinal<any, string, never>
) {
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
}

function addLinks(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  associationList: any[],
  color: d3lib.ScaleOrdinal<any, string, never>
) {
  return svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(associationList)
    .join("path")
    .attr("stroke", (d) => color((d as Association).name))
    .attr("marker-end", (d) => `url(#arrow-${d.name})`);
}

function addNodes(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  classList: any[],
  drag: DragBehavior<Element, unknown, unknown>
) {
  const node = svg
    .append("g")
    .attr("fill", "currentColor")
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .selectAll("g")
    .data(classList)
    .join("g")
    .call(drag as any);

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

  return node;
}

function dragFunc(
  d3: typeof d3lib,
  simulation: d3lib.Simulation<
    SimulationNodeDatum,
    SimulationLinkDatum<SimulationNodeDatum>
  >
) {
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
}

// TODO: User input as color schema preference
function getColorSchema(d3: typeof d3lib, associationNameList: string[]) {
  const colorSchema = d3.schemeCategory10;
  return d3.scaleOrdinal(associationNameList, colorSchema);
}

function initCanvas(d3: typeof d3lib, options: Options = {}) {
  const vw = options.vw ?? 600;
  const vh = options.vh ?? 600;
  const width = options.width ?? 600;
  const height = options.height ?? 600;
  return d3
    .create("svg")
    .attr("viewBox", [-vw / 2, -vh / 2, vw, vh])
    .attr("width", width)
    .attr("height", height);
}

function initSimulation(
  d3: typeof d3lib,
  classList: any[],
  associationList: any[],
  options: Options = {}
) {
  const force = options.force ?? -400;
  return d3
    .forceSimulation(classList)
    .force(
      "link",
      d3.forceLink(associationList).id((d) => (d as Class).name)
    )
    .force("charge", d3.forceManyBody().strength(force))
    .force("x", d3.forceX())
    .force("y", d3.forceY());
}

function linkArcFunc(d: SimulationLinkDatum<SimulationNodeDatum>) {
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
