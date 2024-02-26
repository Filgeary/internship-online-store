export interface AddMessageFormProps {
  labelSend: string;
  labelPlaceholder: string;
  onSubmit: (message: string) => void;
  connection: boolean
}
