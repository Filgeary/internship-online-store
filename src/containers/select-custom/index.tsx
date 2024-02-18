import { memo, useCallback, useMemo, useState } from "react"
import useStore from "@src/hooks/use-store"
import useSelector from "@src/hooks/use-selector"
import useTranslate from "@src/hooks/use-translate"
import { useDispatch } from "react-redux"
import generateUniqueId from "@src/utils/unicque_id"
import { StoreState } from "@src/store/types"
import Spinner from "@src/components/spinner"
import SelectLayout from "@src/components/select-layout"

function SelectCustom() {
  const store = useStore()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(true)

  const select = useSelector((state: StoreState) => ({
    countries: state.countries.list,
    waiting: state.countries.waiting
  }));

  const id = generateUniqueId()

  const callbacks = {}

  // Функция для локализации текстов
  const { t } = useTranslate()

  return (
    <>
  <Spinner active={select.waiting}>
    <SelectLayout onChange={() => {}} value='Все' options={select.countries} statusOpen={isOpen}></SelectLayout>
  </Spinner>
  </>
  )
}

export default memo(SelectCustom);
