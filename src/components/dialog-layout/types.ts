export interface IDialogLayoutProps {
  onClose: (event?: React.MouseEvent) => void;
  theme: string;
  title: string;
  indent: number;
  children: React.ReactNode;
}
