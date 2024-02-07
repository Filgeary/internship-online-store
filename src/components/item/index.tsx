import {memo, FC} from "react"
import {cn as bem} from '@bem-react/classname'
import numberFormat from "@src/utils/number-format"
import './style.css'
import {Link} from "react-router-dom"

interface IItemProps {
  item: {
    _id: string | number
    title: string
    price: number
    selectedGoods: boolean
  };
  link?: string
  onOpenModal: (id: string | number) => void
  labelCurr?: string
  labelAdd?: string
  hideLink?: boolean
  handleClickButton: (id: string | number) => void
  disabled?: boolean
}

const Item: FC<IItemProps> = ({
  item,
  link,
  onOpenModal,
  labelCurr = '₽',
  labelAdd = 'Добавить',
  hideLink = true,
  handleClickButton,
  disabled = false,
}) => {

  const cn = bem('Item')

  const callbacks = {
    onOpenModal: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation()
      onOpenModal(item._id)
    },
    handleClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation()
      handleClickButton(item._id)
    }
  }
  
  return (
    <div className={cn({ selected: item.selectedGoods })} onClick={(event) => callbacks.handleClick(event)}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        {hideLink ? (
          <Link to={link || ''}>{item.title}</Link>
        ) : (
          <span>{item.title}</span>
        )}
      </div>
      <div className={cn('actions')}>
        <div className={cn('price')}>{numberFormat(item.price)} {labelCurr}</div>
        <button onClick={(event) => callbacks.onOpenModal(event)} disabled={disabled}>{labelAdd}</button>
      </div>
    </div>
  );
}

export default memo(Item)
