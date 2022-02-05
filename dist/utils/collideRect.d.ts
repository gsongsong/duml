import { SimulationNodeDatum } from "d3";
export default function (dim?: any): {
    (): void;
    initialize(_nodes: SimulationNodeDatum[], _random: Function): void;
    iterations(_: any): number | any;
    strength(_: any): number | any;
    dim(_: any): any;
};
//# sourceMappingURL=collideRect.d.ts.map