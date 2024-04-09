import {memo, useCallback, useState} from 'react'
import useTranslate from "@src/hooks/use-translate"
import PageLayout from "@src/components/page-layout"
import Head from "@src/components/head"
import Navigation from "@src/containers/navigation"
import LocaleSelect from "@src/containers/locale-select"
import TopHead from "@src/containers/top-head"
import DrawingLayout from './components/drawing-layout'
import Toolbar from './components/toolbar'
import SettingBar from './components/setting-bar'
import Canvas from './components/canvas'

function Drawing() {

  const {t} = useTranslate()

  const [count, setCount] = useState(null)

  let worker: Worker

  if(process.env.IS_SERVER !== 'true') {
    const workerURL = new URL('./worker.ts', import.meta.url)
    worker = new Worker(workerURL)

    // Получаем ответ от Worker
    worker.onmessage = function(event) {
      setCount(event.data)
    console.log('Результат вычисления:', event.data)
  }
}

  const callbacks = {
    // Отправка сообщения в Worker
    onMessage: useCallback(() => {
      worker.postMessage('start')

      // let result = 0
      // for (let i = 0; i < 1000000000; i++) {
      //   result += Math.sqrt(i)
      // }
      // return console.log('Результат вычисления:',result)

    }, [])
  }

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('menu.drawing')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <DrawingLayout onMessage={callbacks.onMessage} result={count}>
        <Toolbar/>
        <SettingBar/>
        <Canvas/>
      </DrawingLayout>
    </PageLayout>
  );
}

export default memo(Drawing)