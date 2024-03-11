import React, { memo } from "react"
import {cn as bem} from '@bem-react/classname'
import './style.css'

const SettingBar: React.FC = () => {
  const cn = bem('Setting_bar')
  return (
    <div className={cn()}>
        SettingBar
    </div>
  )
}

export default memo(SettingBar)