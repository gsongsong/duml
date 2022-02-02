import * as d3lib from "d3";
declare type Class = {
    name: string;
};
declare type Association = {
    name: string;
    from: string;
    to: string;
};
export declare class ClassDiagram {
    private WIDTH;
    private HEIGHT;
    svg: SVGSVGElement | null;
    constructor(d3: typeof d3lib, { classes, associations }: {
        classes: Class[];
        associations: Association[];
    });
}
export {};
//# sourceMappingURL=classDiagram.d.ts.map