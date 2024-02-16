export interface IRequestProps {
  url: string;
  method: 'GET' | 'POST'; // ... добавить по мере необходимости
  headers: HeadersInit;
  options: Record<string, unknown>;
}
