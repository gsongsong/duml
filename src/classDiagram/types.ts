import { SimulationNodeDatum } from "d3";

export type Attribute = {
  visibility: "public" | "private";
  name: string;
  type: string;
};

export type Class = {
  name: string;
  attributes: Attribute[];
};

export type Association = {
  name: string;
  source: string;
  target: string;
  attributes: Attribute[];
};

export type Options = {
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
export type SegmentedLink = {
  type: string;
  source: string;
  target: string;
  arrow: boolean;
};

type NodeBase = {
  id: string;
  maxLength: number;
  maxRows: number;
};

export type ClassNode = NodeBase & Class & SimulationNodeDatum;

export type AssociationNode = NodeBase & Association & SimulationNodeDatum;

export type Node = ClassNode | AssociationNode;
