import React from 'react';

export type TArtCanvasContext = {
  bgColor: string;
  setBgColor: React.Dispatch<React.SetStateAction<string>>;

  brushWidth: number;
  setBrushWidth: React.Dispatch<React.SetStateAction<number>>;

  brushColor: string;
  setBrushColor: React.Dispatch<React.SetStateAction<string>>;

  images: TArtImage[];
  setImages: React.Dispatch<React.SetStateAction<TArtImage[]>>;

  activeImage: number;
  setActiveImage: React.Dispatch<React.SetStateAction<number>>;

  canSave: boolean;
};

export type TArtImage = HTMLImageElement & { loaded: boolean };
