import { TShapes } from '@src/components/art-canvas/shapes/types';
import StoreModule from '../module';

import { TArtState, TTools, TArtImage, TArtImagesState, TCoords2D } from './types';

class ArtStore extends StoreModule<TArtState> {
  initState(): TArtState {
    return {
      bgColor: '#ffffff',
      brushWidth: 5,
      brushColor: '#000000',
      images: {
        imagesNodes: [],
        shapes: [],
        shapesHistory: [],
      },
      activeTool: 'brush',
      fillColor: false,
      panOffset: {
        x: 0,
        y: 0,
      },
      scale: 1,
      scaleOffset: {
        x: 0,
        y: 0,
      },
    };
  }

  setImages(imagesVal: TArtImagesState | null) {
    const newImagesState = imagesVal ?? { imagesNodes: [], shapes: [], shapesHistory: [] };

    this.setState({
      ...this.getState(),
      images: newImagesState,
    });
  }

  setImagesNodes(imagesNodesVal: TArtImage[]) {
    this.setState({
      ...this.getState(),
      images: {
        ...this.getState().images,
        imagesNodes: imagesNodesVal,
      },
    });
  }

  setShapes(shapesVal: TShapes[]) {
    this.setState({
      ...this.getState(),
      images: {
        ...this.getState().images,
        shapes: shapesVal,
      },
    });
  }

  setShapesHistory(shapesHistoryVal: TShapes[][]) {
    this.setState({
      ...this.getState(),
      images: {
        ...this.getState().images,
        shapesHistory: shapesHistoryVal,
      },
    });
  }

  setBgColor(bgColorVal: string) {
    this.setState({
      ...this.getState(),
      bgColor: bgColorVal,
    });
  }

  setBrushWidth(brushWidthVal: number) {
    this.setState({
      ...this.getState(),
      brushWidth: brushWidthVal,
    });
  }

  setBrushColor(brushColorVal: string) {
    this.setState({
      ...this.getState(),
      brushColor: brushColorVal,
    });
  }

  setActiveTool(activeToolVal: TTools) {
    this.setState({
      ...this.getState(),
      activeTool: activeToolVal,
    });
  }

  setFillColor(fillColorVal: boolean) {
    this.setState({
      ...this.getState(),
      fillColor: fillColorVal,
    });
  }

  setPanOffset(panOffsetVal: TCoords2D) {
    this.setState({
      ...this.getState(),
      panOffset: panOffsetVal,
    });
  }

  setScale(scaleVal: number) {
    this.setState({
      ...this.getState(),
      scale: scaleVal,
    });
  }

  setScaleOffset(scaleOffsetVal: TCoords2D) {
    this.setState({
      ...this.getState(),
      scaleOffset: scaleOffsetVal,
    });
  }
}

export default ArtStore;
