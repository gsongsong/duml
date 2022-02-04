import {
  Association,
  AssociationNode,
  Attribute,
  Class,
  ClassNode,
  Node,
  SegmentedLink,
} from "./types";

/**
 * Converts an Association object into a d3 node
 */
export function associationToNode(
  association: Association
): [AssociationNode, AssociationNode, AssociationNode] {
  const { source, name, target } = association;
  const associationNode = `${source}-${name}-${target}`;
  const intermediate1 = `${associationNode}-1`;
  const intermediate2 = `${associationNode}-2`;
  return [
    Object.create({
      id: intermediate1,
      maxLength: 0,
      maxRows: 0,
      edge: true,
      ...association,
    }),
    Object.create({
      id: associationNode,
      maxLength: maxLength(association),
      maxRows: maxRows(association),
      edge: true,
      ...association,
    }),
    Object.create({
      id: intermediate2,
      maxLength: 0,
      maxRows: 0,
      edge: true,
      ...association,
    }),
  ];
}

/**
 * Format an attribute into a string
 */
export function attributeToStr(attribute: Attribute) {
  const { visibility, name, type } = attribute;
  const visibilityMark = visibility === "private" ? "-" : "+";
  return `${visibilityMark} ${name}: ${type}`;
}

/**
 * Converts a Class object into a d3 node
 */
export function classToNode(cls: Class): ClassNode {
  const { name } = cls;
  return Object.create({
    id: name,
    maxLength: maxLength(cls),
    maxRows: maxRows(cls),
    ...cls,
  });
}

/**
 * Estimates the maximum number of characters to be reserved for a node
 */
export function maxLength(node: Class | Association) {
  const { name } = node;
  const { attributes } = node as Partial<Class>;
  const { source, target } = node as Partial<Association>;
  return Math.max(
    name.length,
    ...(attributes?.map((attribute) => attributeToStr(attribute).length) ?? [0])
  );
}

/**
 * Estimates the maximum number of rows to be reserved for a node
 */
export function maxRows(node: Class | Association) {
  const { attributes } = node as Partial<Class>;
  const { source, target } = node as Partial<Association>;
  return 1 + (attributes?.length ?? 0);
}

export function nodeRatio(node: Node) {
  return node.maxRows / (node.maxLength + 2);
}

/**
 * Splits 1 association into 4 links:
 * - Source node to the first intermediate node
 * - The first intermediate node to association node
 * - Association node to the second intermediate node
 * - The second node to target node
 */
export function splitAssociation(
  association: Association
): [SegmentedLink, SegmentedLink, SegmentedLink, SegmentedLink] {
  const { source, name, target } = association;
  const associationNode = `${source}-${name}-${target}`;
  const intermediate1 = `${associationNode}-1`;
  const intermediate2 = `${associationNode}-2`;
  return [
    {
      type: associationNode,
      source,
      target: intermediate1,
      arrow: false,
    },
    {
      type: associationNode,
      source: intermediate1,
      target: associationNode,
      arrow: false,
    },
    {
      type: associationNode,
      source: associationNode,
      target: intermediate2,
      arrow: false,
    },
    {
      type: associationNode,
      source: intermediate2,
      target,
      arrow: true,
    },
  ];
}
