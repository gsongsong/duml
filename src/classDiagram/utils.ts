import { Association, Attribute, Class } from "./types";

/**
 * Converts an Association object into a d3 node
 */
export function associationToNode(association: Association) {
  const { source, name, target } = association;
  return Object.create({
    id: `${source}-${name}-${target}`,
    maxLength: maxLength(association),
    maxRows: maxRows(association),
    edge: true,
    ...association,
  });
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
export function classToNode(cls: Class) {
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
export function maxLength(node: unknown) {
  const { name } = node as Class & Association;
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
export function maxRows(node: unknown) {
  const { attributes } = node as Partial<Class>;
  const { source, target } = node as Partial<Association>;
  return 1 + (attributes?.length ?? 0);
}

/**
 * Splits 1 association into 2 links:
 * - Source node to association node
 * - Association node to target node
 */
export function splitAssociation(association: Association) {
  const { source, name, target } = association;
  const type = `${source}-${name}-${target}`;
  return [
    {
      type,
      source,
      target: type,
    },
    {
      type,
      source: type,
      target,
      arrow: true,
    },
  ];
}
