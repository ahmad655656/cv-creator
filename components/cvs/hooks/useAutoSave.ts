// components/editor/hooks/useAutoSave.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { CVData, Template } from '../types';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveReturn {
  saving: boolean;
  lastSaved: Date | null;
  saveStatus: SaveStatus;
  handleSave: (force?: boolean) => Promise<void>;
}

export const useAutoSave = (
  data: CVData,
  template: Template,
  userId: number
): UseAutoSaveReturn => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousDataRef = useRef<CVData>(data);

  const saveToServer = useCallback(async (dataToSave: CVData) => {
    try {
      setSaving(true);
      setSaveStatus('saving');

      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actual API call would be:
      // await fetch('/api/cvs/save', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId,
      //     templateId: template.id,
      //     data: dataToSave
      //   })
      // });

      setLastSaved(new Date());
      setSaveStatus('saved');
      previousDataRef.current = dataToSave;
    } catch (error) {
      console.error('AutoSave error:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }, [userId, template.id]);

  const handleSave = useCallback(async (force = false) => {
    if (force) {
      await saveToServer(data);
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(async () => {
      // Only save if data has changed
      if (JSON.stringify(previousDataRef.current) !== JSON.stringify(data)) {
        await saveToServer(data);
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, [data, saveToServer]);

  // Auto-save on data changes
  useEffect(() => {
    handleSave();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, handleSave]);

  // Reset saved status after 3 seconds
  useEffect(() => {
    if (saveStatus === 'saved') {
      const timer = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  return {
    saving,
    lastSaved,
    saveStatus,
    handleSave: () => handleSave(true), // Force save
  };
};
