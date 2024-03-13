import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import './style.css';
import Arrow from './arrow.svg?react'
import {cn as bem} from "@bem-react/classname";
import {TranslateFunction} from "@src/ww-old-i18n-postponed/context";
import Spinner from "@src/ww-old-components-postponed/spinner";

type Country = {
  _id: string;
  title: string;
  code: string;
  selected?: boolean;
};

type TCustomSelectProps = {
  expandList: boolean;
  preparedList: Country[];
  autocomplete: JSX.Element;
  changeVisibility: () => void;
  onSelected: (_id: string) => void;
  t: TranslateFunction;
  waiting: boolean;
};

function CustomSelectList({
                            expandList = true,
                            preparedList = [],
                            autocomplete,
                            changeVisibility,
                            t,
                            onSelected,
                            waiting
                          }: TCustomSelectProps) {
  const cn = bem('customSelectList');

  function removeCountry(e: React.MouseEvent<HTMLDivElement, MouseEvent>, _id: string) {
    e.stopPropagation()
    onSelected(_id)
  }

  const listCountriesRendering = useMemo(() => {
    return preparedList.map((el) => <div onClick={e => removeCountry(e, el._id)} className={cn('title')} key={el._id}>
      {el.code}
      <div className={cn('card')}>{el.title}</div>
    </div>);
  }, [preparedList]);

  const [isBottom, setIsBottom] = useState<boolean>(true);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectRef.current) {
      const {top, bottom} = selectRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setIsBottom(bottom + 200 < windowHeight);
    }
  }, [expandList, preparedList]);

  return (
    <div className={cn()} onClick={(e) => e.stopPropagation()}>
      <div className={cn('currentSelect')} onClick={changeVisibility}>
        <div className={cn('textContainer')}>
          {listCountriesRendering.length <= 3 ? <span className={cn('name')}>{!listCountriesRendering.length ? 'Все' : 'Выбраны:'}</span> : <></>}
          {!listCountriesRendering.length
            ? <div className={cn('title') + ' all'}></div>
            : <div className={cn('listCountries')}>{listCountriesRendering.slice(0, 3)}</div>}

          {listCountriesRendering.length <= 3
            ? <></>
            : <span className={cn('name')}>{`и еще ${listCountriesRendering.length - 3} ${t('select.countries', listCountriesRendering.length - 3)}`}</span>}
        </div>
        <div className={cn('openingArrow') + (expandList ? ' open' : '') + (isBottom ? ' bottom' : ' top')}>
          <Arrow/>
        </div>
      </div>
      <Spinner active={waiting}>
        <div className={cn('listContainers') + (expandList ? ' open' : '') + (isBottom ? ' bottom' : ' top')}
             ref={selectRef}>
          {autocomplete}
        </div>
      </Spinner>

    </div>
  );
}

export default memo(CustomSelectList);

