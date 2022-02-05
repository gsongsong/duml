import * as d3lib from "d3";
import { SimulationLinkDatum } from "d3";
import { Node } from "./types";
/**
 * Drag function
 */
export declare function dragFunc(d3: typeof d3lib, simulation: d3lib.Simulation<Node, SimulationLinkDatum<Node>>): d3lib.DragBehavior<Element, Node, Node | d3lib.SubjectPosition>;
//# sourceMappingURL=dragFunc.d.ts.map