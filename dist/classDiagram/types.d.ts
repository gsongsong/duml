import { SimulationNodeDatum } from "d3";
export declare type Attribute = {
    visibility: "public" | "private";
    name: string;
    type: string;
};
export declare type Class = {
    name: string;
    attributes: Attribute[];
};
export declare type Association = {
    name: string;
    source: string;
    target: string;
    attributes: Attribute[];
};
export declare type Options = {
    width?: number;
    height?: number;
    vw?: number;
    vh?: number;
    force?: number;
};
/**
 * In *duml*, an association is rendered as two links and one node.
 * Association node describes its attributes.
 * Association links connect source class, association node and target class
 * - `type` indicates a unique association
 * - `arrow` indicates whether arrow head shall be rendered or not
 */
export declare type SegmentedLink = {
    type: string;
    source: string;
    target: string;
};
declare type NodeBase = {
    id: string;
    width: number;
    height: number;
};
export declare type ClassNode = NodeBase & Class & SimulationNodeDatum;
export declare type AssociationNode = NodeBase & Association & SimulationNodeDatum;
export declare type Node = ClassNode | AssociationNode;
export {};
//# sourceMappingURL=types.d.ts.map