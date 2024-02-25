import { memo, useCallback, useState, useRef } from "react"
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
  const [valueInput, setValueInput] = useState("")
  const [code, setCode] = useState("  ")
  const [codes, setCodes] = useState<string[]>([])
  const selected = useRef<string[]>([]) as unknown

  const select = useSelector((state: StoreState) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting,
  }))

  const { selectedIndex, selectorRef, setSelectedIndex, handleKeyDown, handleMouseEnter } = useSelectCustom(
    select.countries,
    isOpen,
  )

  const callbacks = {
    // Поиск
    onSearch: useCallback(
      (query: string) => {
        setValueInput(query)
        setCodes([])
        const selectedId = selected as React.MutableRefObject<string[]>
        selectedId.current = []
        if(query === 'все') {
          store.actions.countries.load()
        } else store.actions.countries.search(query)
      },
      [store]
    ),
    // Фильтр по странам
    onCountry: useCallback(
      (_id: string) => {
        const selectedId = selected as React.MutableRefObject<string[]>
         const params = selectedId.current.join('|')
        store.actions.catalog.setParams({ madeIn: params, page: 1 }, false, false)
      },
      [store]
    ),
    // Выбор страны
    onSelected: useCallback((id: string) => store.actions.countries.selectСountry(id), [store]),
    // Перемещение скролла 
    onCodes: useCallback((code: string) =>{
      if(selectorRef.current) {
        const countriesCurrent = selectorRef.current as unknown
        const countriesRef = countriesCurrent as HTMLElement
        const liElements = countriesRef.querySelectorAll('.Select-layout-code');
        liElements.forEach(li => {
          if (li.textContent === code) {
            li.scrollIntoView({ behavior: 'smooth', block: "center" });
          }
        })
      }
    }, [codes]),
    // Во время открытия и закрытия списка стран
    onSelect: useCallback(() => {
      setIsOpen(!isOpen);
      if (isOpen) {
        // store.actions.countries.load()
        document.body.style.overflow = "visible";
      };
      if (!isOpen) {
        document.body.style.overflow = "hidden";
        document.removeEventListener("keydown", handleKeyDown)
        const countriesCurrent = selectorRef.current as unknown
        const countriesRef = countriesCurrent as HTMLElement
        countriesRef && countriesRef.removeEventListener('mouseenter', handleMouseEnter)
      }
    }, [isOpen]),
  }

  const renders = {
    input: useCallback(
      () => (
        <Input
          value={valueInput}
          onChange={callbacks.onSearch}
          placeholder="Поиск"
          theme="transparent"
        />
      ),
      [store, setValueInput, valueInput]
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
        setValueInput={setValueInput}
        setCode={setCode}
        codes={codes} 
        setCodes={setCodes}
        setSelectedIndex={setSelectedIndex}
        selectedIndex={selectedIndex}
        ref={selectorRef}
        selected={selected}
        onCodes={callbacks.onCodes}
      ></SelectLayout>
    </>
  )
}

export default memo(SelectCustom)
