import { memo } from "react"

type Props = {
  size?: number
  stroke?: string
}

function Spinner({size = 10, stroke = '#fff'}: Props) {
  return (
    //@ts-ignore
    <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'block', shapeRendering: 'auto'}} width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" fill="none" stroke={stroke} strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
    </svg>
  )
}

export default memo(Spinner)