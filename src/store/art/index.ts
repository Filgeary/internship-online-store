import StoreModule from '../module';

import { TArtState, TTools, TArtImage } from './types';

class ArtStore extends StoreModule<TArtState> {
  initState(): TArtState {
    return {
      bgColor: '#ffffff',
      brushWidth: 5,
      brushColor: '#000000',
      images: [],
      activeTool: 'brush',
      fillColor: false,
    };
  }

  setImages(imagesVal: TArtImage[]) {
    this.setState({
      ...this.getState(),
      images: imagesVal,
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
}

export default ArtStore;
