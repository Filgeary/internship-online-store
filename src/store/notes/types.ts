export type TNotesState = {
  list: TNote[];
  count: number;
  waiting: boolean;
};

export type TNote = {
  _id: string;
  title: string;
  description: string;
};
