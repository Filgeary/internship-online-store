import './style.css';
import { memo } from 'react';
import { cn as bem } from '@bem-react/classname';

import { FaArrowAltCircleLeft, FaArrowAltCircleRight, FaTrash, FaEraser } from 'react-icons/fa';

type ArtCanvasUtilsProps = {
  undoAction: () => void;
  isUndoDisabled: boolean;
  redoAction: () => void;
  isRedoDisabled: boolean;
  clearImages: () => void;
  isClearImagesDisabled: boolean;
  eraserToggle: () => void;
  isEraserActive: boolean;
  activeToolChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  clearCanvas: () => void;
  clearCanvasPicture: () => void;
  downloadAction: () => void;
  isCanSave: boolean;
};

function ArtCanvasUtils(props: ArtCanvasUtilsProps) {
  const cn = bem('ArtCanvasUtils');

  return (
    <div className={cn()}>
      <div className={cn('row')}>
        <div className={cn('left')}>
          <button
            onClick={props.undoAction}
            disabled={props.isUndoDisabled}
            className={cn('btn')}
            title={'Назад'}
          >
            <FaArrowAltCircleLeft size={20} />
          </button>
          <button
            onClick={props.redoAction}
            disabled={props.isRedoDisabled}
            className={cn('btn')}
            title={'Вперёд'}
          >
            <FaArrowAltCircleRight size={20} />
          </button>
          <button
            onClick={props.clearImages}
            disabled={props.isClearImagesDisabled}
            className={cn('btn')}
            title={'Удалить шаги'}
          >
            <FaTrash size={20} />
          </button>

          <div className={cn('separate-util')}>
            <button title={'Стёрка'} onClick={props.eraserToggle} className={cn('btn')}>
              <FaEraser color={props.isEraserActive ? 'green' : 'black'} size={20} />
            </button>
          </div>
        </div>

        <div className={cn('center')}>
          <select onChange={props.activeToolChangeAction} className={cn('select')}>
            <option value={'brush'}>Кисть</option>
            <option value={'square'}>Прямоугольник</option>
            <option value={'circle'}>Круг</option>
            <option value={'triangle'}>Треугольник</option>
          </select>
        </div>

        <div className={cn('right')}>
          <button className={cn('btn')} onClick={props.clearCanvas}>
            Сбросить всё
          </button>
          <button className={cn('btn')} onClick={props.clearCanvasPicture}>
            Очистить рисунок
          </button>
          <button disabled={!props.isCanSave} className={cn('btn')} onClick={props.downloadAction}>
            Скачать
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ArtCanvasUtils);
