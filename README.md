# Стажировка

## Модальные окна (`/modals`)

1. Создать модальное окно для добавления товара в корзину. В окне числовое поле ввода - количество товара. И две кнопки - Отмена и Ок. Открывать окно по кнопке добавления товара в корзину в каталоге. Диалоговое окно само не выполняет действие добавления. Необходимо вызвать открытие окна и “дождаться” его результата со страницы каталога.

   - Доработать логику отображения окон. Возможно, вынести из App существующую логику рендера в отдельный контейнер.
   - Нужна доработка, чтобы “ждать” результат от окна. В теории результат передается в метод закрытия окна.

2. Создать модальное окно со списком товара и фильтрами. По сути повторить логику каталога с главной страницы (применить контейнер фильтра и списка).

   - Модалка со списком товара открывается из модалки корзины, чтобы выбрать и добавить дополнительный товар в корзину. Для этого в корзине внизу нужна кнопка “Выбрать ещё товар”. По нажатию и открывается модалка со списком товара. Корзина при этом не закрывается.

   - Доработать список товара, чтобы можно было выделить желаемый товар. Или несколько. Выделенные товары будут результатом модалки. По закрытию модалки можно передать идентификаторы выделенных товаров. Добавление выбранных товаров в корзину нужно реализовывать в модалке корзины, а не в модалке списка товара.

   - Модалка со списком товара может теоретически применяться для разных задач. Значит не должно быть жесткой связи с корзиной. Открывается выбор товара, ждем закрытие модалки, получаем идентификаторы выбранных товаров и добавляем их в корзину.

   - Нужно доработать логику открытия модалок - реализовать многооконность (стек открытых окон). Последнее открытое окно перекрывает все предыдущие окна. При этом рендерятся все открытые окна.

   - (\*) По умолчанию список с фильтрами на главной странице будет синхронизироваться со списком и фильтром в модалке выбора товара. Подумать, как их состояние разделить, при этом не дублировать контейнеры каталога и не дублировать вручную стейт каталога.

## TypeScript (`/typescript`)

- Подключить typescript с опциями, разрешающие js и типы any (не строгая типизация)
- Типизировать
  - Глупые компоненты - описать их пропсы
  - Какой-либо callback на клик по кнопке/ссылке
  - Хук useSelector
  - Оптимальное решение для типизации Store (можно начать с жесткого описания всех типов с дублированием, но постепенно сделать так, чтобы создание нового модуля состояния требовало описать только тип его состояния (минимум рутины)).
  - Типизировать словари и функции i18n, чтобы работали подсказки доступных ключей при использовании функции t(text).

## Custom Select (`/custom-select`)

- Кастомный компонент выбора варианта из выпадающего списка.
- Применить для фильтра товаров по стране производителя.
- Список стран подгружается во время раскрытия выпадающего списка.
- Реализовать фильтр списка при вводе текста в поле. Само поле фильтра зафиксировано и не скроллится вместе со списком.
- Реализовать управление через клавиатур - раскрытие списка, переход в поле фильтра, выбор варианта в списке, сам выбор.
- Предусмотреть вариант, когда выпадающий список отображается где-то внизу окна браузера - тогда этот список должен раскрываться вверх.
- Реализовать версию списка с множественным выбором. Продумать свой вариант, как отображать выбранное множество опций, как отменять их выбор.

## Chat WebSockets (`/chat`)

### Соединение

`const url = ws://example.front.ylab.io/chat`

`const socket = new WebSocket(url);`

Нужно будет подписаться на событие открытия сокета, только после его обработки можно слать сообщения серверу. Чтобы принимать ответы от сервера, нужно подписаться на событие message. Метод send только отправляет сообщение на сервер, все ответы нужно ожидать в обработчике message.

### Аутентификация

После установки соединения нужно будет отправить токен авторизации.

```js
socket.send(
  JSON.stringify({
    method: 'auth',
    payload: {
      token: '5c78262cf7ad6812fa74b6c8e99aac2e30babf2387e15156b6794125c46cb5fc',
    },
  }),
);
```

Сервер ответит успехом или ошибкой авторизации

### Новое сообщение

Нужно указать текст и уникальный код сообщения. Этот код используется, чтобы в ответе найти свои сообщения, чтобы своим сообщениям проставить статус доставки. Сервер пришлет уже полный объект сообщения.

```js
socket.send(
  JSON.stringify({
    method: 'post',
    payload: {
      _key: uuid(), // любым способом генерируем уникальный ключ
      text: 'Сообщение',
    },
  }),
);
```

Сервер пришлет

```json
{
  "method": "post",
  "payload": {
    "_id": "6221e2424553082494536196",
    "_key": "455a4547-3587-4f27-a11e-d09a67f3dbe8",
    "text": "Сообщение",
    "author": {
      "_id": "61fa80956b4d1f5df08548b0",
      "username": "test",
      "profile": { "name": "AdminName", "avatar": { "url": "..." } }
    },
    "dateCreate": "2022-03-04T09:56:18.109Z"
  }
}
```

### Запрос свежих сообщений (используется при коннекте)

```js
socket.send(
  JSON.stringify({
    method: 'last',
    payload: {
      fromDate: '2022-03-04T09:25:17.146Z',
    },
  }),
);
```

fromDate не обязателен, если не указан то загрузятся 10 самых свежих. Если указан, то все свежие начиная с даты.

### Запрос старых сообщений

```js
socket.send(
  JSON.stringify({
    method: 'old',
    payload: {
      fromId: '6221dce42670710fdc9168c5',
    },
  }),
);
```

Обязательно указывается \_id сообщения, начиная с которого подгружаются 10 более старых, причем в ответе окажется и указанный_id сообщения.

### Вспомогательный метод - удалить ВСЕ сообщения

Сообщения удаляются из базы данных и всем клиентам приходит сообщение об этом.

```js
socket.send(
  JSON.stringify({
    method: 'clear',
    payload: {},
  }),
);
```

Ответ от сервера такой же как и запрос.

## Vite (`/vite`)

Rewrite from `webpack` to `vite`.

### Performance (about 100 modules)

- _webpack_: start 3100ms / build 5800ms
- _vite_: start 120ms / build 1100ms

## Canvas (`/canvas`)

### Подготовка

- Ознакомиться с canvas на React
- Создать несколько фигур по запросу (кнопка, клик мыши на холсте)
- Поиграться с фигурами, цветами
