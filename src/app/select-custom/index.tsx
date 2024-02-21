/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import useKeyPressed from '@src/hooks/use-key-pressed';
import usePosition from '@src/hooks/use-position';
import useNode from '@src/hooks/use-node';
import SelectCustomView from '@src/components/select-custom-view';
import { ESelectCustomViewMenuPlacement as ShowMenu } from '@src/components/select-custom-view/types';
import useStore from '@src/hooks/use-store';
import useSelector from '@src/hooks/use-selector';
import useInitOnUserAction from '@src/hooks/use-init-on-user-action';
import List from '@src/components/list';
import ItemSelectCustom from '@src/components/item-select-custom';
import { type TListItem } from '@src/components/list/types';
import CircleSpinner from '@src/components/circle-spinner';

function SelectCustom() {
  const store = useStore();

  // Обновит компонент, когда нода с `ref={checkNode}` действительно будет существовать,
  // требуется для хуков `usePosition` и `useKeyPressed`
  const [node, checkNode] = useNode();

  // Состояние меню: открыто/закрыто
  const [menuOpen, setMenuOpen] = useState(false);

  // Перешел ли пользователь в режим перемещения по меню кнопоками со стрелками
  const useArrowKey = useRef<boolean>();

  // TODO: Попробовать перенести это в стор (если не будет приводить к торможению)
  // Какой пункт меню в данный момент выделен (мышкой или стрелками)
  const [hoveredItemId, setHoveredItemId] = useState('');

  // Измеряет расстояние от ноды (элемента) до края Viewport (вычитая толщину скролла)
  // Если установить `scrollendListener` и `resizeListener` в `false`, то меню будет
  // менять свое положение только при обновлении компонента
  const { bottom } = usePosition(node, { scrollendListener: true, resizeListener: true });

  // Загрузка данных произойдёт один раз только после вызова `startСomponentInit()` в колбэке или ещё где-то
  const startСomponentInit = useInitOnUserAction(async () => {
    // TODO: сделать ленивую загрузку
    await store.actions.countries.load();
  });

  const select = useSelector((state) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
    selected: state.countries.selected,
  }));

  // TODO: сделать закрытие выпадающего меню при клике на окружающее пространство.

  const callbacks = {
    onMouseEnter: useCallback((_id: string) => setHoveredItemId(_id), []),
    onMouseLeave: useCallback(() => setHoveredItemId(''), []),
    onEnter: useCallback(() => {
      setMenuOpen((isMenuOpen) => {
        // Если использовали стрелки и меню открыто, то пока (TODO: сделать выбор итема) ничего не делать
        if (useArrowKey.current && isMenuOpen) return isMenuOpen;
        // Если собираемся закрыть меню, то сбросим переключение между итемами
        if (isMenuOpen) useArrowKey.current = false;
        return !isMenuOpen;
      });
      // Один раз выполнится загрузка данных с сервера из 'useInitOnUserAction(...)'
      startСomponentInit();
    }, [startСomponentInit]),
    onArrowUp: () => {
      // TODO: Перемещение по списку через метод `.hoverNext()` в сторе
      useArrowKey.current = true;
    },
    onArrowDown: useCallback(() => {
      // TODO: Перемещение по списку через метод `.hoverPrev()` в сторе
      useArrowKey.current = true;
    }, []),
    onEscape: useCallback(() => {
      useArrowKey.current = false;
      setMenuOpen(false);
    }, []),
    onSelect: useCallback(
      (_id: string | string[]) => {
        // Клик по варианту 'Все'
        if (_id === '0') {
          // снимем все выделения
          store.actions.countries.deselectAll();
          // закроем меню
          setMenuOpen((prev) => !prev);
        } else {
          // Добавим/снимем выделение с итема (при мультивыборе будет использоваться `.select(_id)`)
          store.actions.countries.selectOne(_id);
          // закроем меню (при мультивыборе это не потребуется)
          setMenuOpen((prev) => !prev);
        }
      },
      [store]
    ),
    onDeselectAll: useCallback((_id: string) => store.actions.countries.deselectAll(), [store]),
  };

  // Слушает все нажатия перечисленных клавиш на выбранной ноде
  /* eslint-disable */
  useKeyPressed(node, {
    keys: [
      { key: 'Enter', callback: callbacks.onEnter, onKeyDown: true },
      { key: 'ArrowUp', callback: callbacks.onArrowUp, onKeyDown: true },
      { key: 'ArrowDown', callback: callbacks.onArrowDown, onKeyDown: true },
      { key: 'Escape', callback: callbacks.onEscape, onKeyDown: true },
    ]
  });
  /* eslint-enable */

  const menuMaxHeight = 180;
  const isMenuFit = bottom - menuMaxHeight > 0;

  const options = useMemo(
    () => ({
      menuMaxHeight,
      menuPlacement: isMenuFit ? ShowMenu.bottom : ShowMenu.top,
    }),
    [isMenuFit]
  );

  const renders = {
    item: useCallback(
      (item: TListItem) => (
        <ItemSelectCustom
          item={item}
          onSelect={callbacks.onSelect}
          onDeselectAll={callbacks.onDeselectAll}
          hoveredItemId={hoveredItemId}
          onMouseEnter={callbacks.onMouseEnter}
          onMouseLeave={callbacks.onMouseLeave}
          selectedItem={select.selected}
        />
      ),
      [callbacks.onMouseEnter, callbacks.onMouseLeave, callbacks.onDeselectAll, callbacks.onSelect, hoveredItemId, select.selected]
    ),
  };

  return (
    <SelectCustomView
      checkNode={checkNode}
      menuPlacement={options.menuPlacement}
      menuMaxHeight={options.menuMaxHeight}
      selectedItem={select.selected}
      items={select.countries}
      onSelectClick={callbacks.onEnter}
      menuOpen={menuOpen}
    >
      {/* TODO: сделать компонент Поиск */}
      {/* TODO: сделать компонент-обёртку для круглого спиннера по аналогии с тем как сделано в компоненте Spinner */}
      {select.waiting ? <CircleSpinner /> : <List list={select.countries} renderItem={renders.item} />}
    </SelectCustomView>
  );
}

export default memo(SelectCustom);
