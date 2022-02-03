import * as d3lib from "d3";
import { DragBehavior, SimulationLinkDatum, SimulationNodeDatum } from "d3";

type Attribute = {
  visibility: "public" | "private";
  name: string;
  type: string;
};

type Class = {
  name: string;
  attributes: Attribute[];
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
  const nodeList = [
    ...classes.map(classToNode),
    ...associations.map(associationToNode),
  ];
  const edgeList = associations.map(splitAssociation).flat();
  const svg = initCanvas(d3, options);
  const simulation = initSimulation(d3, nodeList, edgeList, options);
  addDefinitions(svg);
  const link = addLinks(svg, edgeList);
  const node = addNodes(svg, nodeList, dragFunc(d3, simulation));

  simulation.on("tick", () => {
    link.attr("d", linkArcFunc);
    node.attr(
      "transform",
      (d) =>
        `translate(${((d as SimulationNodeDatum).x ?? 0) - (d.width + 2) * 4},${
          (d as SimulationNodeDatum).y
        })`
    );
  });

  return svg.node();
}

function addDefinitions(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>
) {
  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -0.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5");
}

function addLinks(
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

function addNodes(
  svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>,
  classList: any[],
  drag: DragBehavior<Element, unknown, unknown>
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
    .attr("width", (d) => (d.width + 2) * 8)
    .attr("height", "1em");

  node
    .append("text")
    .text((d) => (d as Class).name)
    .style("font-family", "monospace")
    .attr("x", "1em")
    .attr("y", "1em");

  // Node attributes
  node
    .append("rect")
    .attr("y", "1em")
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("width", (d) => (d.width + 2) * 8)
    .attr("height", (d) => `${d.attributes?.length ?? 0}em`);

  node
    .append("text")
    .attr("y", "2em")
    .style("font-family", "monospace")
    .selectAll("tspan")
    .data((d) => d.attributes ?? [])
    .join("tspan")
    .text((d) => attributeToStr(d as Attribute))
    .attr("x", "1em")
    .attr("dy", (_, index) => `${index}em`);

  return node;
}

function attributeToStr(attribute: Attribute) {
  const { visibility, name, type } = attribute;
  const visibilityMark = visibility === "private" ? "-" : "+";
  return `${visibilityMark} ${name}: ${type}`;
}

function associationToNode(association: Association) {
  const { source, name, target } = association;
  const width = estimateWidth(association);
  return Object.create({
    id: `${source}-${name}-${target}`,
    width,
    edge: true,
    ...association,
  });
}

function classToNode(cls: Class) {
  const { name } = cls;
  const width = estimateWidth(cls);
  return Object.create({ id: name, width, ...cls });
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

function estimateWidth(node: unknown) {
  const { name } = node as Class & Association;
  const { attributes } = node as Partial<Class>;
  const { source, target } = node as Partial<Association>;
  return Math.max(
    name.length,
    ...(attributes?.map((attribute) => attributeToStr(attribute).length) ?? [0])
  );
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
      d3.forceLink(associationList).id((d) => (d as any).id)
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

function splitAssociation(association: Association) {
  const { source, name, target } = association;
  return [
    {
      source,
      target: `${source}-${name}-${target}`,
    },
    {
      source: `${source}-${name}-${target}`,
      target,
      arrow: true,
    },
  ];
}
