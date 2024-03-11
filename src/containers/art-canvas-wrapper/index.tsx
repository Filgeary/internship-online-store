import { memo } from 'react';

import ArtCanvas from '@src/components/art-canvas';
import useTranslate from '@src/hooks/use-translate';

function ArtCanvasWrapper() {
  const { t } = useTranslate();

  return (
    <div>
      <ArtCanvas.Root>
        <ArtCanvas.Title>{t('title.art')}</ArtCanvas.Title>
        <ArtCanvas.Inner />
        <hr />
        <ArtCanvas.Options />
        <hr />
        <ArtCanvas.Additional />
      </ArtCanvas.Root>
    </div>
  );
}

export default memo(ArtCanvasWrapper);
