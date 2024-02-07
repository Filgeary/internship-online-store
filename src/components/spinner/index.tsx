import {memo, FC} from "react"
import './style.css'

interface ISpinnerProps {
  active: boolean;
  children: React.ReactNode;
}

const Spinner: FC<ISpinnerProps> = ({ active, children }) => {
  if (active) {
    return <div className="Spinner">{children}</div>
  } else {
    return children;
  }
}

export default memo(Spinner)
