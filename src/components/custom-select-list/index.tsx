import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import './style.css';
import {cn as bem} from "@bem-react/classname";
import {TranslateFunction} from "@src/i18n/context";
import Spinner from "@src/components/spinner";

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
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08925L6.58928 7.08925C6.26384 7.41468 5.7362 7.41468 5.41077 7.08925L0.410765 2.08925C0.0853278 1.76381 0.0853278 1.23617 0.410765 0.910734Z"
                  fill="black"/>
          </svg>
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

