// Интерфейс для определения объектов перевода
interface Translation {
    [key: string]: string | { [pluralKey: string]: string };
}
// Тип переведенных экспортируемых объектов
type Translations = {
    en: Translation;
    ru: Translation;
};

import en from './en.json';
import ru from './ru.json';

// Определяю тип ключей в функции переводчика
export type TranslationKeys = keyof typeof en | keyof typeof ru;

const translations: Translations = { en, ru };

export default translations;
