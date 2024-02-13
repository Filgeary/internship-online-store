export interface IAddProductCardProps {
  item: {
    _id: string;
    title: string;
    price: number;
    [prop: string]: any;
  };
  onCloseAll: (event?: React.MouseEvent) => void;
  updateValue: (value: string, name?: string) => void;
  onCancel: (event?: React.MouseEvent) => void;
  onOk: (event?: React.MouseEvent) => void;
  value: string;
  pcsSumm: number;
}
