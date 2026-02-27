import type { CVData } from '@/components/cvs/types';

export const TEMPLATE_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'Maya Al-Khatib',
    jobTitle: 'Senior Product Strategy Lead',
    email: 'maya.khatib@portfolio.dev',
    phone: '+1 (415) 555-0187',
    address: 'San Francisco, CA, USA',
    profileImage: '',
    summary:
      'Product strategy leader with 9+ years of experience driving market expansion, revenue growth, and customer-centered digital transformation across global B2B and SaaS products.'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Northstar Cloud',
      position: 'Senior Product Strategy Lead',
      location: 'San Francisco, USA',
      startDate: '2022',
      endDate: '',
      current: true,
      description: [
        'Led multi-region product portfolio strategy and increased enterprise ARR by 38% within 18 months.',
        'Built cross-functional operating cadence across product, engineering, sales, and customer success.',
        'Designed pricing & packaging framework that improved expansion revenue and retention.'
      ]
    },
    {
      id: 'exp-2',
      company: 'Vertex Digital',
      position: 'Product Manager',
      location: 'Dubai, UAE',
      startDate: '2019',
      endDate: '2022',
      current: false,
      description: [
        'Delivered two flagship products from concept to launch with strong user adoption.',
        'Reduced feature delivery cycle time by 27% through roadmap and process optimization.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'M.Sc.',
      field: 'Information Management',
      startDate: '2016',
      endDate: '2018',
      current: false
    },
    {
      id: 'edu-2',
      institution: 'Damascus University',
      degree: 'B.Sc.',
      field: 'Computer Engineering',
      startDate: '2011',
      endDate: '2015',
      current: false
    }
  ],
  skills: [
    { id: 'skill-1', name: 'Product Strategy', level: 5, category: 'Leadership' },
    { id: 'skill-2', name: 'Roadmapping', level: 5, category: 'Product' },
    { id: 'skill-3', name: 'Data Analytics', level: 4, category: 'Data' },
    { id: 'skill-4', name: 'Go-to-Market', level: 4, category: 'Business' },
    { id: 'skill-5', name: 'Stakeholder Management', level: 5, category: 'Leadership' }
  ],
  languages: [
    { id: 'lang-1', name: 'Arabic', proficiency: 'Native' },
    { id: 'lang-2', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-3', name: 'French', proficiency: 'Professional' }
  ],
  certifications: [
    { id: 'cert-1', name: 'PMP', issuer: 'PMI', date: '2023', doesNotExpire: true },
    { id: 'cert-2', name: 'CSPO', issuer: 'Scrum Alliance', date: '2021', doesNotExpire: true }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Enterprise Insights Platform',
      description: [
        'Designed strategic roadmap and launch plan for analytics platform used by 220+ enterprise clients.',
        'Improved executive reporting quality and reduced manual reporting time by 62%.'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Snowflake'],
      startDate: '2023',
      endDate: '',
      current: true
    },
    {
      id: 'proj-2',
      name: 'Growth Experimentation Framework',
      description: [
        'Built scalable experimentation model across product teams and increased activation by 19%.'
      ],
      technologies: ['Amplitude', 'Looker', 'TypeScript'],
      startDate: '2021',
      endDate: '2022',
      current: false
    }
  ]
};
