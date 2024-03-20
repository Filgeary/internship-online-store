import React from 'react';
import useTranslate from "@src/shared/hooks/use-translate";
import PageLayout from "@src/shared/ui/layout/page-layout";
import TopHead from "@src/feature/top-head";
import Head from "@src/shared/ui/layout/head";
import LocaleSelect from "@src/feature/locale-select";
import Navigation from "@src/feature/navigation";
import CanvasComponentTest from "@src/pages/canvas/components/canvas";

function Canvas() {

    const {t} = useTranslate();

    return (
        <PageLayout>
            <TopHead/>
            <Head title={t('title.canvas')}>
                <LocaleSelect/>
            </Head>
            <Navigation/>
            <CanvasComponentTest/>
        </PageLayout>
    );
}

export default Canvas;
