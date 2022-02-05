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
  const associationNodeGroupList = associations.map(associationToNode);
  const nodeList = [
    ...classes.map(classToNode),
    ...associationNodeGroupList.flat(),
  ];
  const associationLinkGroupList = associations.map(splitAssociation);
  const linkList = associationLinkGroupList.flat();
  const color = d3.scaleOrdinal(
    linkList.map((edge) => edge.type),
    d3.schemeCategory10
  );

  const svg = initCanvas(d3, options);
  const simulation = initSimulation(d3, nodeList, linkList, options);
  // At this point each link in `linkList` get updated to have source and target objects
  const bezierLinkList = associationLinkGroupList.map(
    (associationLinkGroup) => {
      const [node0, node1, node2, node3] = associationLinkGroup;
      return {
        type: node0.type,
        source: node0.source,
        intermediate1: node1.source,
        associationNode: node2.source,
        intermediate2: node3.source,
        target: node3.target,
      };
    }
  );

  addDefinitions(svg, bezierLinkList, color);
  const link = addLinks(svg, bezierLinkList, color);
  const node = addNodes(svg, nodeList, dragFunc(d3, simulation), color);

  simulation.on("tick", () => {
    link.attr("d", linkFunc);
    node.attr("transform", nodeTransformFunc);
  });

  return svg.node();
}
