import { memo, useCallback, useEffect, useMemo, useState } from "react"
import useStore from "@src/hooks/use-store"
import useSelector from "@src/hooks/use-selector"
import useTranslate from "@src/hooks/use-translate"
import { useDispatch } from "react-redux"
import generateUniqueId from "@src/utils/unicque_id"
import { StoreState } from "@src/store/types"
import Spinner from "@src/components/spinner"
import SelectLayout from "@src/components/select-layout"
import Input from "@src/components/input"

function SelectCustom() {
  const store = useStore()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const [transform, setTransform] = useState(false)
  const [value, setValue] = useState('Все')
  const [code, setCode] = useState('  ')

  const select = useSelector((state: StoreState) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
  }))

  const callbacks = {
    // Поиск
    onSearch: useCallback((query: string) => store.actions.countries.search(query), [store]),
    // Фильтр по странам
    onCountry: useCallback((_id: string) => store.actions.catalog.setParams({madeIn: _id, page: 1}, false, false), [store]),
    // Открыть, закрыть список стран
    onSelect: useCallback(() => {
      store.actions.countries.load()
      setIsOpen(!isOpen)
      setTransform(!transform)
      let listener = (e: KeyboardEvent) => {
        console.log('e', e)
        if(e.key === 'Enter') {}
      }
      if(isOpen) document.removeEventListener('keydown', listener)

      if(!isOpen) document.addEventListener('keydown', listener)
    }, [isOpen]),
  }

  // Функция для локализации текстов
  const { t } = useTranslate()

  const renders = {
    input: useCallback(() => (
      <Input
        value = '' 
        onChange = {callbacks.onSearch}
        placeholder = 'Поиск'
        theme = 'transparent'
        />
    ), [store]),
  }

  return (
    <>
      <Spinner active={select.waiting}>
        <SelectLayout
          onChange={() => {}}
          openOrCloseSelect={callbacks.onSelect}
          onCountry={callbacks.onCountry}
          value={value}
          options={select.countries}
          statusOpen={isOpen}
          input={renders.input}
          code={code}
          transform={transform}
          setValue={setValue}
          setCode={setCode}
        ></SelectLayout>
      </Spinner>
    </>
  );
}

export default memo(SelectCustom);
