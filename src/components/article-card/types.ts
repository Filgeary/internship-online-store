export interface IArticleCardProps {
  article: {
    _id: string | number;
    description: string;
    madeIn: Record<string, any>;
    category: Record<string, any>;
    edition: string | number;
    price: number;
  };
  onAdd?: (event?: any) => void;
  t?: (text?: string) => string;
  isDialogOpen?: boolean; // Когда открыто диалоговое окно, отображаем спиннер на кнопке
}
