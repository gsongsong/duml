import * as d3lib from "d3";
declare type Class = {
    name: string;
};
declare type Association = {
    name: string;
    from: string;
    to: string;
};
declare type Options = {
    width?: number;
    height?: number;
    vw?: number;
    vh?: number;
    force?: number;
};
export declare function ClassDiagram(d3: typeof d3lib, { classes, associations }: {
    classes: Class[];
    associations: Association[];
}, options?: Options): SVGSVGElement | null;
export {};
//# sourceMappingURL=classDiagram.d.ts.map