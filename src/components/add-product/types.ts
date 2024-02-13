export interface IAddProductProps {
  value: string;
  pcsSumm: number;
  item: {
    _id: string;
    title: string;
    price: number;
    [prop: string]: any;
  };
  onCancel: (event?: React.MouseEvent) => void;
  onOk: (event?: React.MouseEvent) => void;
  openTestDialog: (event?: React.MouseEvent) => void;
  updateValue: (value: string, name?: string) => void;
}
