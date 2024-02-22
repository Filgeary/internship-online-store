import { memo, useCallback, useState } from "react"
import { StoreState } from "@src/store/types"
import useStore from "@src/hooks/use-store"
import useSelector from "@src/hooks/use-selector"
import SelectLayout from "@src/components/select-layout"
import Input from "@src/components/input"
import useSelectCustom from "@src/hooks/use-select-custom"

function SelectCustom() {
  const store = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState("Все")
  const [code, setCode] = useState("  ")

  const select = useSelector((state: StoreState) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
  }))

  const { selectedIndex, selectorRef, setSelectedIndex } = useSelectCustom(
    select.countries,
    isOpen
  )

  const callbacks = {
    // Поиск
    onSearch: useCallback(
      (query: string) => store.actions.countries.search(query),
      [store]
    ),
    // Фильтр по странам
    onCountry: useCallback(
      (_id: string) =>
        store.actions.catalog.setParams({ madeIn: _id, page: 1 }, false, false),
      [store]
    ),
    // Выбор страны
    onSelected: useCallback((id: string) => store.actions.countries.selectСountry(id), [store]),
    // Во время открытия и закрытия списка стран
    onSelect: useCallback(() => {
      // if (isOpen) store.actions.countries.load();
      setIsOpen(!isOpen);
      if (!isOpen) document.body.style.overflow = "hidden";
      if (isOpen) document.body.style.overflow = "visible";
    }, [isOpen]),
  }

  const renders = {
    input: useCallback(
      () => (
        <Input
          value=""
          onChange={callbacks.onSearch}
          placeholder="Поиск"
          theme="transparent"
        />
      ),
      [store]
    ),
  }

  return (
    <>
      <SelectLayout
        openOrCloseSelect={callbacks.onSelect}
        onSelected={callbacks.onSelected}
        onCountry={callbacks.onCountry}
        value={value}
        options={select.countries}
        statusOpen={isOpen}
        input={renders.input}
        code={code}
        setValue={setValue}
        setCode={setCode}
        setSelectedIndex={setSelectedIndex}
        selectedIndex={selectedIndex}
        ref={selectorRef}
      ></SelectLayout>
    </>
  )
}

export default memo(SelectCustom)
