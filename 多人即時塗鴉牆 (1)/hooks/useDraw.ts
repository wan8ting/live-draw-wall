import { useEffect, useRef } from 'react';
import type { DrawOptions, Point } from '../types';

export function useDraw(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  drawOptions: DrawOptions
) {
  const isDrawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const canvasCtx = useRef<CanvasRenderingContext2D | null>(null);

  // Use a ref to hold the latest drawOptions to avoid re-attaching event listeners on every change.
  const optionsRef = useRef(drawOptions);
  optionsRef.current = drawOptions;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    canvasCtx.current = ctx;

    const setCanvasSize = () => {
        if (!canvasCtx.current || !canvas) return;
        // Save the current drawing before resizing
        const currentDrawing = canvasCtx.current.getImageData(0, 0, canvas.width, canvas.height);
        
        // Get the new dimensions from the element's bounding box
        const { width, height } = canvas.getBoundingClientRect();
        
        // Set the canvas rendering dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Restore the drawing after resizing
        canvasCtx.current.putImageData(currentDrawing, 0, 0);
    };
    
    // Initial size setup and event listener for window resize
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Drawing event handlers
    const getPointerPosition = (e: PointerEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e: PointerEvent) => {
      e.preventDefault();
      isDrawing.current = true;
      lastPoint.current = getPointerPosition(e);
    };

    const draw = (e: PointerEvent) => {
      if (!isDrawing.current || !lastPoint.current) return;
      e.preventDefault();

      const currentPoint = getPointerPosition(e);
      // Read the latest options from the ref for better performance
      const currentOptions = optionsRef.current;
      
      ctx.globalCompositeOperation = currentOptions.isErasing ? 'destination-out' : 'source-over';

      if (currentOptions.isErasing) {
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = currentOptions.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      } else if (currentOptions.brushType === 'crayon') {
        // High-performance crayon simulation
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentOptions.color;
        ctx.lineWidth = Math.max(currentOptions.lineWidth / 2, 1);
        ctx.globalAlpha = 0.3;

        const numStrokes = 5;
        const jitter = currentOptions.lineWidth * 0.4;
        
        for (let i = 0; i < numStrokes; i++) {
          const offsetX = (Math.random() - 0.5) * jitter;
          const offsetY = (Math.random() - 0.5) * jitter;
          ctx.beginPath();
          ctx.moveTo(lastPoint.current.x + offsetX, lastPoint.current.y + offsetY);
          ctx.lineTo(currentPoint.x + offsetX, currentPoint.y + offsetY);
          ctx.stroke();
        }
      } else { // Pencil (default)
        ctx.strokeStyle = currentOptions.color;
        ctx.lineWidth = currentOptions.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1.0;
        ctx.beginPath();
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
      }
      
      lastPoint.current = currentPoint;
    };

    const stopDrawing = () => {
      isDrawing.current = false;
      lastPoint.current = null;
      if (ctx) {
        ctx.globalAlpha = 1.0; // Reset alpha after drawing
      }
    };
    
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointerleave', stopDrawing);

    // Cleanup function to remove all listeners
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('pointerdown', startDrawing);
      canvas.removeEventListener('pointermove', draw);
      canvas.removeEventListener('pointerup', stopDrawing);
      canvas.removeEventListener('pointerleave', stopDrawing);
    };
  }, [canvasRef]); // This effect now only runs once when the canvas ref is available.
}