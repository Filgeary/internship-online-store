import { cn as bem } from '@bem-react/classname';
import { ZoomIn, ZoomOut } from 'react-feather';

import './style.css';

const zoomPanelIconsMap = {
  zoomOut: ZoomOut,
  value: () => null,
  zoomIn: ZoomIn,
} as const;

type TCanvasZoomModes = keyof typeof zoomPanelIconsMap;

type Props = {
  currentZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  resetScale: () => void;
};

const CanvasZoomPanel = ({ currentZoom, onZoomIn, onZoomOut, resetScale }: Props) => {
  const cn = bem('CanvasZoomPanel');

  return (
    <div className={cn()}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {Object.entries(zoomPanelIconsMap).map(item => {
          const [zoomMode, Icon] = item as [
            TCanvasZoomModes,
            (typeof zoomPanelIconsMap)[TCanvasZoomModes],
          ];

          if (zoomMode === 'value') {
            return (
              <button
                key={zoomMode}
                className={cn('control', { value: zoomMode === 'value' })}
                type='button'
                onClick={resetScale}
                title='Reset zoom'
              >
                {new Intl.NumberFormat(undefined, { style: 'percent' }).format(currentZoom)}
              </button>
            );
          }

          return (
            <button
              key={zoomMode}
              className={cn('control')}
              type='button'
              onClick={() => (zoomMode === 'zoomOut' ? onZoomOut() : onZoomIn())}
            >
              <Icon
                size={24}
                color='hsl(0, 0%, 80%)'
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CanvasZoomPanel;
