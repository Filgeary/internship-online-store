export interface CountItemFormProps {
  labelCount: string;
  labelCancel: string;
  onSubmit: (count: string) => void;
  onCancel: () => void;
}
