import {memo, FC} from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

interface IPageLayoutProps {
  head: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}

const PageLayout: FC<IPageLayoutProps> = ({ head, footer, children }) =>{

  const cn = bem('PageLayout')

  return (
    <div className={cn()}>
      <div className={cn('head')}>
        {head}
      </div>
      <div className={cn('center')}>
        {children}
      </div>
      <div className={cn('footer')}>
        {footer}
      </div>
    </div>
  )
}

export default memo(PageLayout)