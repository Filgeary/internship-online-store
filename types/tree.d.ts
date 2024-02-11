export {};

declare global {
  export type TBranch = {
    _id: number;
    title: string;
    children: TTree;
  } & object;
  export type TTree = (TBranch[] | TChild) & { children?: TTree[] };

  export type TChild = { parent?: { _id: number | string } } & Record<
    string,
    any
  >;
}
