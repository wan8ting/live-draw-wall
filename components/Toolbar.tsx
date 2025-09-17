import React from 'react';
import type { DrawOptions } from '../types';
import { EraserIcon, PencilIcon, CrayonIcon, TrashIcon, PaletteIcon, DownloadIcon } from './Icons';

interface ToolbarProps {
  drawOptions: DrawOptions;
  setDrawOptions: React.Dispatch<React.SetStateAction<DrawOptions>>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ drawOptions, setDrawOptions, canvasRef }) => {
  const { color, lineWidth, isErasing, brushType } = drawOptions;

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrawOptions(prev => ({ ...prev, color: e.target.value, isErasing: false }));
  };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrawOptions(prev => ({ ...prev, lineWidth: parseInt(e.target.value, 10) }));
  };
  
  const toggleEraser = () => {
    setDrawOptions(prev => ({...prev, isErasing: !prev.isErasing }));
  };

  const selectPencil = () => {
    setDrawOptions(prev => ({ ...prev, isErasing: false, brushType: 'pencil' }));
  };

  const selectCrayon = () => {
    setDrawOptions(prev => ({ ...prev, isErasing: false, brushType: 'crayon' }));
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      // Draw a white background
      tempCtx.fillStyle = '#FFFFFF';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      // Draw the original canvas content on top
      tempCtx.drawImage(canvas, 0, 0);
      const link = document.createElement('a');
      link.download = 'live-draws.png';
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    }
  };

  const toolButtonClasses = "p-2 sm:p-3 rounded-md border-2 border-black transition-all";
  const activeToolClasses = "bg-yellow-300 shadow-brutalist-sm";
  const inactiveToolClasses = "bg-white hover:bg-gray-200";

  return (
    <div className="bg-white border-4 border-black p-2 rounded-lg shadow-brutalist flex flex-row flex-wrap justify-center items-center gap-2">
      {/* Brush Style Group */}
      <div className="flex border-r-2 border-black pr-2">
        <button
          onClick={selectPencil}
          className={`${toolButtonClasses} ${!isErasing && brushType === 'pencil' ? activeToolClasses : inactiveToolClasses}`}
          title="鉛筆"
        >
          <PencilIcon />
        </button>
        <button
          onClick={selectCrayon}
          className={`${toolButtonClasses} ${!isErasing && brushType === 'crayon' ? activeToolClasses : inactiveToolClasses}`}
          title="蠟筆"
        >
          <CrayonIcon />
        </button>
      </div>

      {/* Color and Width Group */}
      <div className="flex items-center gap-2 border-r-2 border-black pr-2">
         <label htmlFor="color-picker" className={`${toolButtonClasses} ${!isErasing ? 'bg-white hover:bg-gray-200' : 'bg-gray-300 cursor-not-allowed'} relative`}>
            <PaletteIcon />
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isErasing}
            />
        </label>
        <input
          id="line-width"
          type="range"
          min="1"
          max="100"
          value={lineWidth}
          onChange={handleLineWidthChange}
          className="w-20 sm:w-24 md:w-32 cursor-pointer"
        />
      </div>

       {/* Action Group */}
      <div className="flex">
        <button
          onClick={toggleEraser}
          className={`${toolButtonClasses} ${isErasing ? activeToolClasses : inactiveToolClasses}`}
          title="橡皮擦"
        >
          <EraserIcon />
        </button>
        <button
          onClick={handleClear}
          className={`${toolButtonClasses} ${inactiveToolClasses}`}
          title="清除畫布"
        >
          <TrashIcon />
        </button>
         <button
          onClick={handleDownload}
          className={`${toolButtonClasses} ${inactiveToolClasses}`}
          title="下載"
        >
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
};
