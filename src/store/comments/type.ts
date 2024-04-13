export type InitialStateComments = {
  waiting: boolean;
  count: number;
  comments?: {
    _id: string,
    text: string,
    parent: {
      _id: string,
      _type: "comment" | "article",
      _tree: [
        {
          _id: string,
          _type: "comment" | "article"
        }[]
      ]
    }
  }[],
}
