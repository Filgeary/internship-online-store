/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useCallback, useMemo, useState } from 'react';
import useKeyPressed from '@src/hooks/use-key-pressed';
import usePosition from '@src/hooks/use-position';
import useNode from '@src/hooks/use-node';
import SelectCustomView from '@src/components/select-custom-view';
import { ESelectCustomViewMenuPlacement as ShowMenu } from '@src/components/select-custom-view/types';
import useStore from '@src/hooks/use-store';
import useSelector from '@src/hooks/use-selector';
import useInitOnUserAction from '@src/hooks/use-init-on-user-action';

function SelectCustom() {
  const store = useStore();

  // Обновит компонент, когда нода с `ref={checkNode}` действительно будет существовать
  const [node, checkNode] = useNode();

  // Состояние меню: открыто/закрыто
  const [menuOpen, setMenuOpen] = useState(false);

  // Измеряет расстояние от ноды (элемента) до края Viewport (вычитая толщину скролла)
  // Если установить `scrollendListener` и `resizeListener` в `false`, то меню будет
  // менять свое положение только при обновлении компонента
  const { bottom } = usePosition(node, { scrollendListener: true, resizeListener: true });

  // Загрузка данных произойдёт один раз только после вызова `setActive()` в колбэке или ещё где-то
  const setActive = useInitOnUserAction(async () => {
    // TODO: сделать ленивую загрузку
    await store.actions.countries.load();
  });

  const select = useSelector((state) => ({
    countries: state.countries.list,
    selected: state.countries.selected,
  }));

  const callbacks = {
    toggleMenu: useCallback(() => {
      setMenuOpen((prev) => !prev);
      // Один раз выполнится загрузка данных с сервера из `useInitOnUserAction(...)`
      setActive();
    }, [setActive]),
  };

  // Слушает все нажатия перечисленных клавиш на выбранной ноде
  /* eslint-disable */
  useKeyPressed(node, {
    keys: [
      { key: 'Enter', callback: callbacks.toggleMenu, onKeyDown: true },
      { key: 'ArrowDown' }, // TODO
      { key: 'ArrowUp' }, // TODO
      { key: 'Escape' }, // TODO
    ],
    depends: [callbacks.toggleMenu]
  });
  /* eslint-enable */

  const menuMaxHeight = 90;
  const isMenuFit = bottom - menuMaxHeight > 0;

  const options = useMemo(
    () => ({
      menuMaxHeight,
      menuPlacement: isMenuFit ? ShowMenu.bottom : ShowMenu.top,
    }),
    [isMenuFit]
  );

  return (
    <SelectCustomView
      checkNode={checkNode}
      menuPlacement={options.menuPlacement}
      menuMaxHeight={options.menuMaxHeight}
      selectedItem={select.selected}
      onSelectClick={callbacks.toggleMenu}
      menuOpen={menuOpen}
    />
  );
}

export default memo(SelectCustom);
