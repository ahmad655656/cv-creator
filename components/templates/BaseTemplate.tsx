'use client';

import React from 'react';
import { CVData, TemplateConfig } from '@/lib/types/template.types';

interface BaseTemplateProps {
  data: CVData;
  config: TemplateConfig;
  children: React.ReactNode;
}

export const BaseTemplate: React.FC<BaseTemplateProps> = ({ data, config, children }) => {
  const style = {
    '--primary-color': config.colors.primary,
    '--secondary-color': config.colors.secondary,
    '--accent-color': config.colors.accent,
    '--text-color': config.colors.text,
    '--background-color': config.colors.background,
    '--heading-font': config.fonts.heading,
    '--body-font': config.fonts.body,
  } as React.CSSProperties;

  return (
    <div 
      className="cv-template"
      style={style}
      dir="rtl"
    >
      {children}
    </div>
  );
};