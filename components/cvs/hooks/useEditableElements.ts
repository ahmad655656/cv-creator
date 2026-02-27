import { useState, useMemo, useCallback } from 'react';
import { CVData } from '../types';

interface EditableElement {
  id: string;
  type: 'heading' | 'paragraph' | 'text' | 'list';
  content: string;
  section: string;
  style: Record<string, string | number>;
}

type UpdatePayload =
  | { type: 'personal'; data: Record<string, string> }
  | { type: 'experience'; id: string; field: string; value: string | boolean }
  | { type: 'experienceBatch'; id: string; data: Record<string, string | boolean> }
  | { type: 'experienceDescription'; id: string; index: number; value: string }
  | { type: 'education'; id: string; field: string; value: string | boolean }
  | { type: 'educationBatch'; id: string; data: Record<string, string | boolean> };

const parseExpIdentifier = (elementId: string) => {
  const body = elementId.replace(/^exp-/, '');
  const descToken = '-desc-';
  if (body.includes(descToken)) {
    const idxPos = body.lastIndexOf(descToken);
    return {
      id: body.slice(0, idxPos),
      field: 'desc',
      index: Number(body.slice(idxPos + descToken.length))
    };
  }
  const lastDash = body.lastIndexOf('-');
  if (lastDash === -1) return null;
  return {
    id: body.slice(0, lastDash),
    field: body.slice(lastDash + 1),
    index: undefined
  };
};

const parseEduIdentifier = (elementId: string) => {
  const body = elementId.replace(/^edu-/, '');
  const lastDash = body.lastIndexOf('-');
  if (lastDash === -1) return null;
  return {
    id: body.slice(0, lastDash),
    field: body.slice(lastDash + 1)
  };
};

export const useEditableElements = (cvData: CVData, onUpdate: (data: UpdatePayload) => void) => {
  const createElementsFromData = useCallback((): EditableElement[] => {
    const elements: EditableElement[] = [];

    if (cvData.personalInfo) {
      elements.push({
        id: 'fullName',
        type: 'heading',
        content: cvData.personalInfo.fullName || 'الاسم الكامل',
        section: 'personal',
        style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', color: '#000' }
      });

      elements.push({
        id: 'jobTitle',
        type: 'paragraph',
        content: cvData.personalInfo.jobTitle || 'المسمى الوظيفي',
        section: 'personal',
        style: { fontSize: '18px', textAlign: 'center', color: '#666' }
      });

      ['email', 'phone', 'address'].forEach((field) => {
        const value = cvData.personalInfo[field as 'email' | 'phone' | 'address'];
        if (!value) return;
        elements.push({
          id: field,
          type: 'text',
          content: value,
          section: 'personal',
          style: { fontSize: '14px' }
        });
      });

      if (cvData.personalInfo.summary) {
        elements.push({
          id: 'summary',
          type: 'paragraph',
          content: cvData.personalInfo.summary,
          section: 'personal',
          style: { fontSize: '14px', lineHeight: '1.6' }
        });
      }
    }

    cvData.experiences?.forEach((exp) => {
      elements.push(
        {
          id: `exp-${exp.id}-position`,
          type: 'heading',
          content: exp.position,
          section: 'experience',
          style: { fontSize: '18px', fontWeight: 'bold', color: '#000' }
        },
        {
          id: `exp-${exp.id}-company`,
          type: 'paragraph',
          content: `${exp.company}${exp.location ? ` - ${exp.location}` : ''}`,
          section: 'experience',
          style: { fontSize: '14px', color: '#666' }
        },
        {
          id: `exp-${exp.id}-date`,
          type: 'text',
          content: `${exp.startDate} - ${exp.current ? 'حالياً' : exp.endDate}`,
          section: 'experience',
          style: { fontSize: '12px', color: '#999' }
        }
      );

      exp.description?.forEach((desc, i) => {
        if (!desc) return;
        elements.push({
          id: `exp-${exp.id}-desc-${i}`,
          type: 'list',
          content: `- ${desc}`,
          section: 'experience',
          style: { fontSize: '13px' }
        });
      });
    });

    cvData.education?.forEach((edu) => {
      elements.push(
        {
          id: `edu-${edu.id}-degree`,
          type: 'heading',
          content: `${edu.degree}${edu.field ? ` في ${edu.field}` : ''}`,
          section: 'education',
          style: { fontSize: '18px', fontWeight: 'bold', color: '#000' }
        },
        {
          id: `edu-${edu.id}-institution`,
          type: 'paragraph',
          content: edu.institution,
          section: 'education',
          style: { fontSize: '14px', color: '#666' }
        },
        {
          id: `edu-${edu.id}-date`,
          type: 'text',
          content: `${edu.startDate} - ${edu.current ? 'حالياً' : edu.endDate}`,
          section: 'education',
          style: { fontSize: '12px', color: '#999' }
        }
      );
    });

    return elements;
  }, [cvData]);

  const [styleOverrides, setStyleOverrides] = useState<
    Record<string, Record<string, string | number>>
  >({});

  const elements = useMemo(() => {
    const baseElements = createElementsFromData();
    return baseElements.map((el) =>
      styleOverrides[el.id] ? { ...el, style: { ...el.style, ...styleOverrides[el.id] } } : el
    );
  }, [createElementsFromData, styleOverrides]);

  const updateElementContent = useCallback(
    (elementId: string, content: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      if (element.section === 'personal') {
        const updates: Record<string, string> = {};
        if (['fullName', 'jobTitle', 'email', 'phone', 'address', 'summary'].includes(elementId)) {
          updates[elementId] = content.trim();
        }
        if (Object.keys(updates).length) {
          onUpdate({ type: 'personal', data: updates });
        }
        return;
      }

      if (element.section === 'experience') {
        const parsed = parseExpIdentifier(elementId);
        if (!parsed) return;

        if (parsed.field === 'position') {
          onUpdate({ type: 'experience', id: parsed.id, field: 'position', value: content });
          return;
        }

        if (parsed.field === 'company') {
          const [company, ...rest] = content.split(' - ');
          onUpdate({
            type: 'experienceBatch',
            id: parsed.id,
            data: { company: company?.trim() || '', location: rest.join(' - ').trim() }
          });
          return;
        }

        if (parsed.field === 'date') {
          const [startDate, endRaw] = content.split(' - ');
          const endNormalized = (endRaw || '').trim();
          const current = ['حالياً', 'present', 'current'].includes(endNormalized.toLowerCase());
          onUpdate({
            type: 'experienceBatch',
            id: parsed.id,
            data: {
              startDate: (startDate || '').trim(),
              endDate: current ? '' : endNormalized,
              current
            }
          });
          return;
        }

        if (parsed.field === 'desc' && parsed.index !== undefined) {
          onUpdate({
            type: 'experienceDescription',
            id: parsed.id,
            index: parsed.index,
            value: content.replace(/^-+\s*/, '')
          });
        }
        return;
      }

      if (element.section === 'education') {
        const parsed = parseEduIdentifier(elementId);
        if (!parsed) return;

        if (parsed.field === 'degree') {
          const [degree, ...fieldParts] = content.split(' في ');
          onUpdate({
            type: 'educationBatch',
            id: parsed.id,
            data: { degree: degree?.trim() || '', field: fieldParts.join(' في ').trim() }
          });
          return;
        }

        if (parsed.field === 'institution') {
          onUpdate({ type: 'education', id: parsed.id, field: 'institution', value: content.trim() });
          return;
        }

        if (parsed.field === 'date') {
          const [startDate, endRaw] = content.split(' - ');
          const endNormalized = (endRaw || '').trim();
          const current = ['حالياً', 'present', 'current'].includes(endNormalized.toLowerCase());
          onUpdate({
            type: 'educationBatch',
            id: parsed.id,
            data: {
              startDate: (startDate || '').trim(),
              endDate: current ? '' : endNormalized,
              current
            }
          });
        }
      }
    },
    [elements, onUpdate]
  );

  const updateElementStyle = useCallback(
    (elementId: string, style: Record<string, string | number>) => {
      setStyleOverrides((prev) => ({
        ...prev,
        [elementId]: { ...(prev[elementId] || {}), ...style }
      }));
    },
    []
  );

  return {
    elements,
    styleOverrides,
    updateElementContent,
    updateElementStyle,
    getSectionElements: useCallback(
      (sectionId: string) => elements.filter((el) => el.section === sectionId),
      [elements]
    )
  };
};
