import { cn as bem } from '@bem-react/classname';
import { memo } from 'react';

type ArtCanvasTitleProps = {
  children: React.ReactNode;
};

function ArtCanvasTitle(props: ArtCanvasTitleProps) {
  const { children } = props;

  const cn = bem('ArtCanvasTitle');

  return <h3 className={cn()}>{children}</h3>;
}

export default memo(ArtCanvasTitle);
