import { memo } from "react"

type Props = {
  size?: number
  fill?: string
}

function Checkmark({size = 10, fill = '#fff'}: Props) {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill}>
    <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
  </svg>
  )
}

export default memo(Checkmark)