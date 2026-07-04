import React, { useRef, useState, useEffect } from 'react';
import { Move } from 'lucide-react';

interface DraggableFocalPointProps {
  imageUrl: string;
  focusX: number;
  focusY: number;
  onFocusChange: (x: number, y: number) => void;
}

export const DraggableFocalPoint: React.FC<DraggableFocalPointProps> = ({
  imageUrl,
  focusX,
  focusY,
  onFocusChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageAspect, setImageAspect] = useState<number | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageAspect(img.width / img.height);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const updateFocalPoint = (clientX: number, clientY: number) => {
    if (!containerRef.current || imageAspect === null) return;

    const rect = containerRef.current.getBoundingClientRect();
    const containerAspect = rect.width / rect.height;

    let x = ((clientX - rect.left) / rect.width) * 100;
    let y = ((clientY - rect.top) / rect.height) * 100;

    if (imageAspect > containerAspect) {
      const visibleWidth = (containerAspect / imageAspect) * 100;
      const minX = (100 - visibleWidth) / 2;
      const maxX = 100 - minX;
      x = Math.max(minX, Math.min(maxX, x));
    } else {
      const visibleHeight = (imageAspect / containerAspect) * 100;
      const minY = (100 - visibleHeight) / 2;
      const maxY = 100 - minY;
      y = Math.max(minY, Math.min(maxY, y));
    }

    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    onFocusChange(Math.round(x * 100) / 100, Math.round(y * 100) / 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateFocalPoint(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateFocalPoint(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updateFocalPoint(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    updateFocalPoint(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFocusChange(50, 50);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-corporate-400 uppercase tracking-widest">
          Cover Image Position
        </label>
        {(focusX !== 50 || focusY !== 50) && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-corporate-500 hover:text-corporate-900 font-medium transition-colors"
          >
            Reset to Center
          </button>
        )}
      </div>

      <div
        ref={containerRef}
        className="relative w-full aspect-[2/1] rounded-lg overflow-hidden border-2 border-corporate-300 cursor-move select-none group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageUrl}
          alt="Blog cover image — drag to set focal point"
          className="w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: `${focusX}% ${focusY}%`,
          }}
          draggable={false}
        />

        <div
          className="absolute w-10 h-10 -ml-5 -mt-5 pointer-events-none transition-opacity"
          style={{
            left: `${focusX}%`,
            top: `${focusY}%`,
            opacity: isDragging ? 1 : 0.7,
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-white shadow-lg flex items-center justify-center">
              <Move size={20} className="text-corporate-900" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-corporate-900 animate-ping" style={{ animationDuration: '2s' }} />
          </div>
        </div>

        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {focusX.toFixed(0)}%, {focusY.toFixed(0)}%
        </div>
      </div>

      <p className="text-[10px] text-corporate-400">
        Click or drag on the image to adjust which part shows in the 2:1 frame. The crosshair marks your focal point.
      </p>
    </div>
  );
};
