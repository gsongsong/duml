import * as d3lib from "d3";
import { DragBehavior, SimulationLinkDatum, SimulationNodeDatum } from "d3";
import { initCanvas } from "./canvas";
import { dragFunc } from "./dragFunc";
import { linkArcFunc } from "./linkArcFunc";
import { initSimulation } from "./simulation";
import { Class, Association, Options, Attribute } from "./types";
import { associationToNode, attributeToStr, classToNode, estimateWidth, splitAssociation } from "./utils";

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
