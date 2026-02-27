// components/editor/hooks/useCVData.ts
import { useState, useCallback } from 'react';
import { CVData, PersonalInfo, Experience, Education, Skill, Language, Certification, Project } from '../types';

const initialCVData: CVData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    summary: ''
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: []
};

export const useCVData = () => {
  const [cvData, setCVData] = useState<CVData>(initialCVData);

  // Personal Info
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setCVData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  }, []);

  // Experiences
  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ['']
    };
    setCVData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience]
    }));
  }, []);

  const updateExperience = useCallback((id: string, field: keyof Experience, value: any) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  }, []);

  const updateExperienceDescription = useCallback((id: string, index: number, value: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === id) {
          const newDescription = [...exp.description];
          newDescription[index] = value;
          return { ...exp, description: newDescription };
        }
        return exp;
      })
    }));
  }, []);

  const addExperienceDescription = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === id) {
          return { ...exp, description: [...exp.description, ''] };
        }
        return exp;
      })
    }));
  }, []);

  const removeExperienceDescription = useCallback((id: string, index: number) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => {
        if (exp.id === id) {
          const newDescription = exp.description.filter((_, i) => i !== index);
          return { ...exp, description: newDescription };
        }
        return exp;
      })
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  }, []);

  // Education
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      field: '',
      institution: '',
      startDate: '',
      endDate: '',
      current: false
    };
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: any) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, []);

  // Skills
  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: '',
      level: 3,
      category: 'تقنية'
    };
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  }, []);

  const updateSkill = useCallback((id: string, field: keyof Skill, value: any) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  }, []);

  // Languages
  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: 'basic'
    };
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  }, []);

  const updateLanguage = useCallback((id: string, field: keyof Language, value: any) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  }, []);

  const removeLanguage = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  }, []);

  // Certifications
  const addCertification = useCallback(() => {
    const newCertification: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      doesNotExpire: false
    };
    setCVData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  }, []);

  const updateCertification = useCallback((id: string, field: keyof Certification, value: any) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  }, []);

  const removeCertification = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  }, []);

  // Projects
  const addProject = useCallback(() => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      description: [''],
      technologies: [],
      startDate: '',
      endDate: '',
      current: false
    };
    setCVData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: any) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }));
  }, []);

  const updateProjectDescription = useCallback((id: string, index: number, value: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => {
        if (proj.id === id) {
          const newDescription = [...proj.description];
          newDescription[index] = value;
          return { ...proj, description: newDescription };
        }
        return proj;
      })
    }));
  }, []);

  const addProjectDescription = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => {
        if (proj.id === id) {
          return { ...proj, description: [...proj.description, ''] };
        }
        return proj;
      })
    }));
  }, []);

  const removeProjectDescription = useCallback((id: string, index: number) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => {
        if (proj.id === id) {
          const newDescription = proj.description.filter((_, i) => i !== index);
          return { ...proj, description: newDescription };
        }
        return proj;
      })
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setCVData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  }, []);

  return {
    cvData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    updateExperienceDescription,
    addExperienceDescription,
    removeExperienceDescription,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addCertification,
    updateCertification,
    removeCertification,
    addProject,
    updateProject,
    updateProjectDescription,
    addProjectDescription,
    removeProjectDescription,
    removeProject,
  };
};
