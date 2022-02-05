import * as d3lib from "d3";
import { initCanvas } from "./canvas";
import { addDefinitions } from "./definitions";
import { dragFunc } from "./dragFunc";
import { addLinks, linkFunc } from "./links";
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
    ...(associations.map(associationToNode).flat()),
  ];
  const linkList = associations.map(splitAssociation).flat();
  const color = d3.scaleOrdinal(
    linkList.map((edge) => edge.type),
    d3.schemeCategory10
  );

  const svg = initCanvas(d3, options);
  const simulation = initSimulation(d3, nodeList, linkList, options);
  // At this point each link in `linkList` get updated to have source and target objects

  addDefinitions(svg, linkList, color);
  const link = addLinks(svg, linkList, color);
  const node = addNodes(svg, nodeList, dragFunc(d3, simulation), color);

  simulation.on("tick", () => {
    link.attr("d", linkFunc);
    node.attr("transform", nodeTransformFunc);
  });

  return svg.node();
}
