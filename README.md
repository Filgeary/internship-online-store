# 🔥 Задача 2

**Известные проблемы**
- Возник баг из-за которого не срабатывает добавление товара на основной странице. Пока ещё не поправил. При массовом добавлении внутри корзины (и выборе количества как на главной) тот же компонент работает нормально.

**Рефакторинг по задаче 1**
- Логика связанная с конкретными диалоговыми окнами убрана из контейнера `Windows`.
- Теперь в редьюсере `dialogs` только два метода: `.open()` и `.close()`. И мы храним только имена диалоговых окон плюс их айдишники (если `id` не задан, то по дефолту равен имени). Айдишники нужны чтобы в будущем иметь возможность одновременно вызвать две модалки с одним именем, но с разным содержанием (например два стандартных уведомления с разным текстом). Если это вдруг зачем-то потребуется.
- Открытие диалогового окна стало проще, теперь достаточно имени:
```js
dispatch(dialogsActions.open('add-to-basket')); // Открываем диалоговое окно
dispatch(addToBasketActions.setData(item));     // Отправляем ему данные (если требуется)
```
- В диалоговом окне добавления товара в корзину, на инпут добавлен автофокус.

**Сделано по задаче 2**
- Была решена интересная проблема со кастомным стором: при массовом быстром добавлении товаров добавлялся только один товар. Это происходило из-за того, что функция добавления товара является асинхронной и в ней мы создаем новый массив товаров на основе текущего стейта. Когда новый товар добавляется в момент, когда предыдущий ещё ожидает ответа от сервера, то в итоге, массив с новым товаром заменяет массив с предыдущим, потому что в качестве исходного массива у них был один и тот же массив.
- В окне массового добавления в корзину можно задать количество штук каждого товара (открывается ещё одно диалоговое окно), при этом отображается сумма и количество (в диалоговом окне тоже).
- Если попробовать повторно изменить количество штук для товара, то начальное значение будет не `1`, а то, которое было сохранено.
- Выделенные товары отмечаются цветом. Только для выделенных товаров отображается: кнопка `Изменить` (количество штук), количество штук и сумма. Для невыделенных товаров ничего из этого не отображается, только вместо суммы - цена.
- После закрытия и повторного открытия окна выделенные товары сбрасываются.

**Не успел по 2 задаче, доделаю позже**
- Немного улучшить дизайн окна массового добавления товаров, там сейчас слишком скученно отображается текст `147,91 ₽ x 1 шт =`. Поправить поведение кнопки `Изменить` при сжатии экрана (сейчас она наезжает на текст при сжатии экрана, потому что имеет абслолютное позиционирование чтобы всегда быть по центру, планирую использовать медиазапросы на ширину экрана чтобы исправить это).
- Кнопка `Добавить выбранные` не должна быть активна, когда ни один итем не выбран.
- В сторе `add-to-basket` переименовать  в `add-product`, так как используется не только при добавлении в корзину.
- Задачу со звездочкой не успел, неожиданно много времени занял рефакторинг `1` задачи. Сейчас диалоговые окна в контейнере `Windows` в `.map()` отображаются так:
```jsx
{ is('add-to-basket')   && <AddProduct context={'add-to-basket'} indent={index} /> }
{ is('add-to-selected') && <AddProduct context={'add-to-selected'} indent={index} /> }
//                          ^^^^^^^^^^ один компонент для разных контекстов
```
Я планирую просто использовать это имя контекста (например `add-to-selected`) при отправке экшенов в стор, будет что-то вроде метки. И уже в сторе, если он видит что пришла новая метка, то создает новый отдельный стейт, можно его даже в `Map` хранить, используя в качестве ключа имя контекста (например `add-to-selected`).

# 🔥 Задача 1

**Сделано**
- Возможность открыть несколько диалоговых окон одно над другим и над модалкой `Корзина` (чтобы протестировать это добавлены дополнительные кнопки, открывающие дополнительное окно в диалоговом окне и в модалке).
- При надатии на кнопку `Добавить` в списке товаров, на ней крутится спиннер пока диалоговое окно открыто. То же работает и на странице товара (`Article`).
- Валидация инпута `2 шт` при добавлении в корзину (он не позволяет вводить левые символы)
  - `23kj2` -> `232`,
  - `0012`  -> `12`,
  - `0`     -> `1`
- Кнопка `Ок` становится неактивной, если поле `2 шт` пустое.
- Диалоговое окно, в отличие от модалки, закрывается по клику на окружающее пространство (то же, что нажать `Отмена`). В будущем можно добавить опцию для "важных" окон, чтобы их можно было закрыть только нажатием на `Ок` или `Отмена`.
- Дизайн диалогового окна позволяет добавить позже дополнительные платные опции (например `Экспресс доставка` или `Подарочная упаковка`) путём простого добавления этих опций и поля `Итого` внизу.

**Реализация нескольких диалоговых окон одно над другим:**

**Допущения:**
 - Модальное окно может быть только одно, в нём можно реализовать смену контента, если нужно несколько модалок.
 - Диалоговых окон может быть много.
 - Диалоговые окна отображаются всегда выше модальных.
 - Модальное окно и диалоговые окна могут вызывать новые диалоговые окна.
 - Диалоговое окно не должно вызывать модальное окно.
 - Диалоговые окна блокируют экран под собой, так же как и модальное окно (но без затенения),
   поэтому они будут закрыты в том же порядке, что и были открыты (но с конца естественно).
   Порядок важен для диалоговых окон, которые вызвали новые диалоговые окна и ждут их результат.
 - При клике на блокирующую подложку диалогового окна, оно закрывается как если бы была
   нажата кнопка "Отмена". В будущем, можно сделать опцию "Важное диалоговое окно", и такое
   окно будет закрываться исключительно по клику на одну из кнопок.
