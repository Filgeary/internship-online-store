export {};

declare global {
  export type TBranch = { children: TTree } & object;
  export type TTree = TBranch[];

  export type TChild = { parent: { _id: number | string } };
  export type TChildren = TChild[];
}
