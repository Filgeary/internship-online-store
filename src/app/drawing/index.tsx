import {memo} from 'react'
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

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('menu.drawing')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <DrawingLayout>
        <Toolbar/>
        <SettingBar/>
        <Canvas/>
      </DrawingLayout>
    </PageLayout>
  );
}

export default memo(Drawing)