import {memo} from 'react'
import useTranslate from "@src/hooks/use-translate"
import PageLayout from "@src/components/page-layout"
import Head from "@src/components/head"
import Navigation from "@src/containers/navigation"
import LocaleSelect from "@src/containers/locale-select"
import TopHead from "@src/containers/top-head"
import DrawLeaf from '@src/components/draw-leaf'

function LeafFall() {

  const {t} = useTranslate();

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('menu.leaf')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <DrawLeaf/>
    </PageLayout>
  );
}

export default memo(LeafFall)