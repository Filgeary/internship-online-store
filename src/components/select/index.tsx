import {memo, FC} from "react"
import './style.css'

interface IOption {
  value: string | number
  title: string
}

interface ISelectProps {
  options: IOption[]
  value: any
  onChange: (value: string | number) => void
}

const Select: FC<ISelectProps> = ({ options, value, onChange }) => {

  const onSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }

  return (
    <select className="Select" value={value} onChange={(e) => onSelect(e)}>
      {options.map(item => (
        <option key={item.value} value={item.value}>{item.title}</option>
      ))}
    </select>
  )
}

export default memo(Select)
