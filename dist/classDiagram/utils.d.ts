import { Association, AssociationNode, Attribute, Class, ClassNode, Node, SegmentedLink } from "./types";
/**
 * Converts an Association object into a d3 node
 */
export declare function associationToNode(association: Association): [AssociationNode, AssociationNode, AssociationNode];
/**
 * Format an attribute into a string
 */
export declare function attributeToStr(attribute: Attribute): string;
/**
 * Converts a Class object into a d3 node
 */
export declare function classToNode(cls: Class): ClassNode;
/**
 * Estimates the maximum number of characters to be reserved for a node
 */
export declare function width(node: Class | Association): number;
/**
 * Estimates the maximum number of rows to be reserved for a node
 */
export declare function height(node: Class | Association): number;
export declare function nodeRatio(node: Node): number;
/**
 * Splits 1 association into 4 links:
 * - Source node to the first intermediate node
 * - The first intermediate node to association node
 * - Association node to the second intermediate node
 * - The second node to target node
 */
export declare function splitAssociation(association: Association): [SegmentedLink, SegmentedLink, SegmentedLink, SegmentedLink];
//# sourceMappingURL=utils.d.ts.map