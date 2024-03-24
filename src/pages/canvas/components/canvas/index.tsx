import React, {useEffect, useRef, useState} from 'react';
import CanvasManager from '@src/pages/canvas/components/canvas/core';
import './style.css'
import Select from "@src/shared/ui/elements/select";
import {keysShape, TShapesOptions} from "@src/pages/canvas/components/canvas/core/shapes/types";
import Controls from "@src/shared/ui/elements/controls";
import InputRange from "@src/shared/ui/elements/input-range";


const CanvasComponentTest = () => {
  const canvasContainerRef = useRef(null);
  const canvasManager = useRef<CanvasManager | null>(null);

  const [selectedShape, setSelectedShape] = useState<keysShape>('CurvedLine')
  const [filling, setFilling] = useState(false)
  const [permissionUseFill, setPermissionUseFill] = useState(false)
  const [fillColor, setFillColor] = useState<Color>('#000000')
  const [numberGeneratedFigures, setNumberGeneratedFigures] = useState(10)

  useEffect(() => {
    if (canvasContainerRef.current) {

      canvasManager.current = new CanvasManager(canvasContainerRef.current);
      // Удалить обработчики событий при размонтировании компонента
      return () => {
        if (canvasManager.current) canvasManager.current.removeEventListeners();
      };
    }
  }, []);

  const selectedColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (canvasManager.current) {
      canvasManager.current?.setSelectedColor(e.target.value as Color)
    }
  }
  const selectShape = (shape: keysShape) => {
    setSelectedShape(shape)
    if (shape !== 'CurvedLine') {
      setPermissionUseFill(true)
    } else {
      setPermissionUseFill(false)
      setFilling(false)
    }
    if (canvasManager.current) {
      canvasManager.current.setSelectedShape(shape)
    }
  }
  const selectWidthLine = (shape: keysShape) => {
    if (canvasManager.current) {
      canvasManager.current.setSelectedShape(shape)
    }
  }
  const changeFilling = () => {
    if (canvasManager.current) {
      setFilling(prev => !prev)
      canvasManager.current?.setFillingShapes()
    }
  }
  const changeFillingColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (canvasManager.current) {
      setFillColor(e.target.value as Color)
      canvasManager.current?.setFillingColor(e.target.value as Color)
    }
  }
  const changeWidthLine = (width: number) => {
    if (canvasManager.current) {
      canvasManager.current?.setLineWidth(width)
    }
  }

  const changeNumberGeneratedFigures = (figures: number) => {
    setNumberGeneratedFigures(figures)
  }

  const createFigures = () => {
    canvasManager.current?.generateRandomShapes(numberGeneratedFigures)
  }

  const shapes: TShapesOptions[] = [
    {value: 'StraightLine', title: 'Straight Line'},
    {value: 'CurvedLine', title: 'Curved Line'},
    {value: 'Rectangle', title: 'Rectangle'},
    {value: 'Circle', title: 'Circuit'},
    {value: 'Triangle', title: 'Triangle'}
  ]
  return (
    <div className={'CanvasComponent'}>
      <input type={"color"} className={'CanvasColorSelect'} onChange={selectedColor}/>
      <div className={'CanvasCheckbox'}>
        <label className={'CanvasCheckbox-text'}>Заливка</label>
        <input className={'CanvasCheckbox-input'} type={'checkbox'} onChange={changeFilling}
               disabled={!permissionUseFill} checked={filling}/>
        <label className={'CanvasCheckbox-text'}>Цвет:</label>
        <input type={"color"} className={'CanvasColorSelect' + (!permissionUseFill ? ' disable' : '')}
               onChange={changeFillingColor} value={fillColor}/>
      </div>
      <div className={'CanvasGenerate'}>
        <InputRange min={10} max={10000} changeValues={changeNumberGeneratedFigures}/>
        <Controls onAdd={createFigures} title={'Добавить фигуры'}/>
      </div>
      <InputRange min={1} max={18} changeValues={changeWidthLine}/>
      <Select onChange={selectShape} value={selectedShape} options={shapes}/>
      <div className="CanvasContainer" ref={canvasContainerRef}></div>
      <Controls padding={'none'} title={'Очистить холст'} onAdd={() => canvasManager.current?.clearCanvas()}/>

    </div>
  );
};

export default CanvasComponentTest;
