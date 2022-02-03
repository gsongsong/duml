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
};

export type Options = {
  width?: number;
  height?: number;
  vw?: number;
  vh?: number;
  force?: number;
};
