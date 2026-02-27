// components/editor/hooks/useEditorUI.ts
import { useState, useEffect, useCallback } from 'react';
import type { 
  LayoutMode, SidebarPosition, PreviewDevice, 
  ThemeMode, PreviewBackground, PreviewOrientation 
} from '../constants/editor.constants';

export const useEditorUI = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('full');
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>('left');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [previewWidth, setPreviewWidth] = useState(920);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.94);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [previewOrientation, setPreviewOrientation] = useState<PreviewOrientation>('portrait');
  const [previewBackground, setPreviewBackground] = useState<PreviewBackground>('white');
  const [showPreviewControls, setShowPreviewControls] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarWidth(280);
        setPreviewWidth(window.innerWidth - 40);
        setPreviewZoom(0.76);
      } else {
        setPreviewWidth(920);
        setPreviewZoom(0.94);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleLayoutMode = useCallback(() => {
    const modes: LayoutMode[] = ['full', 'compact', 'minimal'];
    const nextMode = modes[(modes.indexOf(layoutMode) + 1) % modes.length];
    setLayoutMode(nextMode);
    
    const widths = { full: 320, compact: 280, minimal: 240 };
    setSidebarWidth(widths[nextMode]);
    setPreviewWidth(nextMode === 'full' ? 920 : nextMode === 'compact' ? 860 : 780);
  }, [layoutMode]);

  const cycleSidebarPosition = useCallback(() => {
    const positions: SidebarPosition[] = ['left', 'right', 'bottom', 'hidden'];
    setSidebarPosition(prev => positions[(positions.indexOf(prev) + 1) % positions.length]);
  }, []);

  const zoomIn = useCallback(() => setPreviewZoom(prev => Math.min(prev + 0.1, 2)), []);
  const zoomOut = useCallback(() => setPreviewZoom(prev => Math.max(prev - 0.1, 0.5)), []);
  const resetZoom = useCallback(() => setPreviewZoom(1), []);

  const togglePreviewFullscreen = useCallback(() => {
    setIsPreviewFullscreen(prev => !prev);
    if (!isPreviewFullscreen) {
      setPreviewZoom(1);
      setPreviewDevice('desktop');
    }
  }, [isPreviewFullscreen]);

  return {
    // States
    layoutMode,
    sidebarPosition,
    sidebarWidth,
    previewWidth,
    isPreviewFullscreen,
    previewZoom,
    previewDevice,
    previewOrientation,
    previewBackground,
    showPreviewControls,
    showGrid,
    isMobile,
    themeMode,
    
    // Setters
    setSidebarWidth,
    setPreviewWidth,
    setPreviewDevice,
    setPreviewOrientation,
    setPreviewBackground,
    setShowPreviewControls,
    setShowGrid,
    setThemeMode,
    
    // Actions
    toggleLayoutMode,
    cycleSidebarPosition,
    zoomIn,
    zoomOut,
    resetZoom,
    togglePreviewFullscreen,
  };
};
