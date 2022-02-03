import * as d3lib from "d3";
import { SimulationNodeDatum } from "d3";
import { initCanvas } from "./canvas";
import { addDefinitions } from "./definitions";
import { dragFunc } from "./dragFunc";
import { addLinks, linkArcFunc } from "./links";
import { addNodes, nodeTransformFunc } from "./nodes";
import { initSimulation } from "./simulation";
import { Class, Association, Options } from "./types";
import { associationToNode, classToNode, splitAssociation } from "./utils";

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
    node.attr("transform", nodeTransformFunc);
  });

  return svg.node();
}
