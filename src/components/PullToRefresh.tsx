import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  pullDistance?: number;
}

/**
 * Komponen Pull-to-Refresh super ringan tanpa library berat.
 * Menggunakan CSS transform dan spinner animasi native, ramah untuk HP entry-level.
 */
export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  className = '',
  pullDistance = 64,
}) => {
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Hanya picu pull jika posisi scroll window/container sedang berada di paling atas (<= 2px)
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    if (scrollTop <= 2 && !isRefreshing) {
      startYRef.current = e.touches[0].clientY;
      isPullingRef.current = true;
    } else {
      isPullingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Terapkan efek redaman (damping)
      const damped = Math.min(pullDistance * 1.5, Math.pow(diff, 0.85));
      setPullY(damped);
    } else {
      setPullY(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || isRefreshing) return;
    isPullingRef.current = false;

    if (pullY >= pullDistance * 0.8) {
      setIsRefreshing(true);
      setPullY(pullDistance);
      try {
        await Promise.resolve(onRefresh());
      } catch (err) {
        console.warn('Pull-to-refresh action failed:', err);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullY(0);
        }, 400);
      }
    } else {
      setPullY(0);
    }
  };

  const progress = Math.min(1, pullY / pullDistance);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative ${className}`}
    >
      {/* Indicator Box */}
      <div
        style={{
          transform: `translateY(${pullY > 0 || isRefreshing ? pullY : 0}px)`,
          transition: isPullingRef.current ? 'none' : 'transform 0.25s ease-out',
        }}
        className="w-full"
      >
        {(pullY > 0 || isRefreshing) && (
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-center pointer-events-none z-30">
            <div className="px-3.5 py-1.5 rounded-full bg-white/95 border border-blue-200/80 shadow-md flex items-center gap-2 text-xs font-heading font-bold text-[#1C5FE0]">
              <div
                className={`w-4 h-4 rounded-full border-2 border-blue-200 border-t-[#1C5FE0] ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                style={{
                  transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
                }}
              />
              <span>{isRefreshing ? 'Memperbarui data...' : 'Tarik untuk refresh'}</span>
            </div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
