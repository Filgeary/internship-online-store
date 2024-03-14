import { cn as bem } from '@bem-react/classname';
import {
  Circle,
  Edit2,
  Minus,
  MousePointer,
  Move,
  RefreshCw,
  Square,
  Triangle,
  Type,
  X,
} from 'react-feather';

import { TCanvasActions, TCanvasDrawModes, TCanvasModes, TCanvasMoveModes } from './types';

import './style.css';

export const moveModeIconsMap = {
  move: Move,
  drag: MousePointer,
};

export const drawModeIconsMap = {
  draw: Edit2,
  type: Type,
  circle: Circle,
  rect: Square,
  triangle: Triangle,
  line: Minus,
};

export const actionsIconsMap = {
  clear: X,
  refresh: RefreshCw,
};

type Props = {
  onChangeAction: (action: TCanvasActions) => void;
  onChangeMode: (mode: TCanvasModes) => void;
  activeMode: TCanvasModes;
};

const CanvasPanel = ({ onChangeAction, onChangeMode, activeMode }: Props) => {
  const cn = bem('CanvasPanel');

  return (
    <div className={cn()}>
      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(moveModeIconsMap).map(item => {
          const [moveMode, Icon] = item as [
            TCanvasMoveModes,
            (typeof moveModeIconsMap)[TCanvasMoveModes],
          ];

          return (
            <button
              key={moveMode}
              className={cn('control', { active: moveMode === activeMode })}
              type='button'
              onClick={() => onChangeMode(moveMode)}
            >
              <Icon
                size={28}
                color='white'
              />
            </button>
          );
        })}
      </div>

      <div className={cn('separator')}></div>

      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(drawModeIconsMap).map(item => {
          const [drawMode, Icon] = item as [
            TCanvasDrawModes,
            (typeof drawModeIconsMap)[TCanvasDrawModes],
          ];

          return (
            <button
              key={drawMode}
              className={cn('control', { active: drawMode === activeMode })}
              type='button'
              onClick={() => onChangeMode(drawMode)}
            >
              <Icon
                size={28}
                color='white'
              />
            </button>
          );
        })}
      </div>

      <div className={cn('separator')}></div>

      <div style={{ display: 'flex', gap: 12 }}>
        {Object.entries(actionsIconsMap).map(item => {
          const [action, Icon] = item as [TCanvasActions, (typeof actionsIconsMap)[TCanvasActions]];

          return (
            <button
              key={action}
              className={cn('control')}
              type='button'
              onClick={() => onChangeAction(action)}
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
