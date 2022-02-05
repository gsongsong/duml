import * as d3lib from "d3";
import { DragBehavior, SubjectPosition } from "d3";
import { Node } from "./types";
export declare function addNodes(svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>, classList: Node[], drag: DragBehavior<Element, Node, Node | SubjectPosition>, color: d3lib.ScaleOrdinal<string, string, never>): d3lib.Selection<SVGGElement | d3lib.BaseType, Node, SVGGElement, undefined>;
export declare function nodeTransformFunc(d: Node): string;
//# sourceMappingURL=nodes.d.ts.map