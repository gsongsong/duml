import * as d3lib from "d3";
import { SegmentedLink } from "./types";
export declare function addLinks(svg: d3lib.Selection<SVGSVGElement, undefined, null, undefined>, linkList: SegmentedLink[], color: d3lib.ScaleOrdinal<string, string, never>): d3lib.Selection<d3lib.BaseType | SVGPathElement, SegmentedLink, SVGGElement, undefined>;
/**
 * Renders an arc link
 */
export declare function linkFunc(d: SegmentedLink): string | null;
//# sourceMappingURL=links.d.ts.map