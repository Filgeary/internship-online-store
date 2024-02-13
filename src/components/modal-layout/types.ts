export interface IModalLayoutProps {
  onClose: (event?: React.MouseEvent) => void;
  title: string;
  children: React.ReactNode;
  labelClose: string;
}
