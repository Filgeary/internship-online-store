import { Spin } from "antd";
import { memo } from "react";
import s from './styles.module.css'

function CmsSpinner() {
  return (
    <div className={s.Wrapper}>
      <Spin size="large" tip="Загрузка...">
        <div className={s.Content}/>
      </Spin>
    </div>
  )
}


export default memo(CmsSpinner);
