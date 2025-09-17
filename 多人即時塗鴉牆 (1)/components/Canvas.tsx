
import React, { forwardRef } from 'react';
// Fix: Explicitly add the file extension to the import paths.
import type { DrawOptions } from '../types.ts';
import { useDraw } from '../hooks/useDraw.ts';

interface CanvasProps {
  drawOptions: DrawOptions;
}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({ drawOptions }, ref) => {
  useDraw(ref as React.RefObject<HTMLCanvasElement>, drawOptions);
  
  return (
    <canvas
      ref={ref}
      className="absolute top-0 left-0 w-full h-full bg-white border-4 border-black shadow-brutalist"
    />
  );
});

Canvas.displayName = 'Canvas';
