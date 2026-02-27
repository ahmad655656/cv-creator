// components/editor/hooks/useResizeHandler.ts
import { useState, useCallback, useRef } from 'react';

export const useResizeHandler = (
  initialWidth: number,
  minWidth: number,
  maxWidth: number,
  onResize?: (width: number) => void
) => {
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(initialWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    startWidthRef.current = initialWidth;
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + diff));
      onResize?.(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [initialWidth, minWidth, maxWidth, onResize]);

  return { isResizing, handleMouseDown };
};