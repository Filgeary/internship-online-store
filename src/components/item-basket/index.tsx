import {memo, FC} from 'react'
import numberFormat from "@src/utils/number-format"
import {cn as bem} from "@bem-react/classname"
import {Link} from "react-router-dom"
import './style.css'

interface IItemBasketProps {
  item: {
    _id: string | number
    title: string
    price: number
    amount?: number
  }
  link: string
  onLink: () => void
  onRemove: (id: string | number) => void
  labelCurr: string
  labelDelete: string
  labelUnit: string
}

const ItemBasket: FC<IItemBasketProps> = ({
  item,
  link,
  onLink,
  onRemove,
  labelCurr = '₽',
  labelDelete = 'Удалить',
  labelUnit = 'шт',
}) => {

  const cn = bem('ItemBasket')

  const callbacks = {
    onRemove: () => onRemove(item._id)
  }

  return (
    <div className={cn()}>
      {/*<div className={cn('code')}>{props.item._id}</div>*/}
      <div className={cn('title')}>
        {link
          ? <Link to={link} onClick={onLink}>{item.title}</Link>
          : item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('cell')}>{numberFormat(item.price)} {labelCurr}</div>
        <div className={cn('cell')}>{numberFormat(item.amount || 0)} {labelUnit}</div>
        <div className={cn('cell')}><button onClick={callbacks.onRemove}>{labelDelete}</button></div>
      </div>
    </div>
  )
}

export default memo(ItemBasket)
