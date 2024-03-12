import { cn as bem } from '@bem-react/classname';
import { Circle, Edit2, Italic, RefreshCw, Square, Triangle, Type, X } from 'react-feather';

import './style.css';

const iconsMap = {
  type: Type,
  circle: Circle,
  rect: Square,
  triangle: Triangle,
  line: Italic,
  draw: Edit2,
  clear: X,
  random: RefreshCw,
};

export type TCanvasActions = keyof typeof iconsMap;

type Props = {
  onAction: (action: TCanvasActions) => void;
};

const CanvasPanel = ({ onAction }: Props) => {
  const cn = bem('CanvasPanel');

  return (
    <div className={cn()}>
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(iconsMap).map(item => {
          const [action, Icon] = item as [TCanvasActions, (typeof iconsMap)[TCanvasActions]];

          return (
            <button
              key={action}
              className={cn('control')}
              type='button'
              title={action}
              onClick={() => onAction(action)}
            >
              <Icon
                size={28}
                color='white'
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CanvasPanel;
