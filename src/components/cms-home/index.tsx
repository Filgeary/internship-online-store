import { memo } from "react"
import s from './style.module.css'
import Title from "antd/es/typography/Title";
import {  Typography } from 'antd';

const { Text} = Typography;

function CmsHome() {
  return (
    <div className={s.Container}>
      <Title>Это админка</Title>
      <ul>
        <li style={{fontSize: "22px"}}>
          <Text strong={true} style={{fontSize: "22px"}}>Можно админить</Text>
          <Text style={{fontSize: "22px"}}>, делать всякие админские штуки</Text>
        </li>
        <li style={{fontSize: "22px"}}>
          <Text strong={true} style={{fontSize: "22px"}}>Можно не админить</Text>
          <Text style={{fontSize: "22px"}}>, не делать всякие админские штуки</Text>
        </li>
      </ul>
    </div>
  )
}

export default memo(CmsHome)
