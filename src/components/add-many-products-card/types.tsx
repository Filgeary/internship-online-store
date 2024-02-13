export interface IAddManyProductsCardProps {
  children: React.ReactNode;
  buttonActive: boolean;
  onCancel: (event?: React.MouseEvent) => void;
  onAddAll: (event?: React.MouseEvent) => void;
}
