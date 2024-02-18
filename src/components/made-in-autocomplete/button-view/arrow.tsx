import { memo } from "react"

function Arrow(props: {
  className?: string
}) {
  return (
    <div className={props.className}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5892 13.0893C15.2638 13.4147 14.7362 13.4147 14.4107 13.0893L9.99998 8.67852L5.58924 13.0893C5.2638 13.4147 4.73616 13.4147 4.41072 13.0893C4.08529 12.7638 4.08529 12.2362 4.41072 11.9108L9.41072 6.91075C9.73616 6.58532 10.2638 6.58532 10.5892 6.91075L15.5892 11.9108C15.9147 12.2362 15.9147 12.7638 15.5892 13.0893Z" fill="black"/>
      </svg>
    </div>
  )
}

export default memo(Arrow)