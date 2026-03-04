import type { CVData } from '@/components/cvs/types';

export const TEMPLATE_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'Maya Al-Khatib',
    jobTitle: 'Senior Product Strategy Lead',
    email: 'maya.khatib@portfolio.dev',
    phone: '+1 (415) 555-0187',
    address: 'San Francisco, CA, USA',
    profileImage: '/julianaSilva.png',
    summary: 'Product strategy leader with experience in market expansion and digital transformation.'
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
      description: ['Led product portfolio strategy and increased enterprise ARR by 38%.']
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
      current: false,
      description: ''
    }
  ],
  skills: [
    { id: 'skill-1', name: 'Product Strategy', level: 5 },
    { id: 'skill-2', name: 'Roadmapping', level: 5 }
  ],
  languages: [
    { id: 'lang-1', name: 'Arabic', proficiency: 'Native' },
    { id: 'lang-2', name: 'English', proficiency: 'Fluent' }
  ],
  certifications: [{ id: 'cert-1', name: 'PMP', issuer: 'PMI', date: '2023', doesNotExpire: true }],
  projects: [
    {
      id: 'proj-1',
      name: 'Enterprise Insights Platform',
      description: ['Designed strategic roadmap and launch plan for analytics platform.'],
      technologies: ['React', 'Next.js'],
      startDate: '2023',
      endDate: '',
      current: true
    }
  ]
};

export const MINIMAL_NORDIC_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'Olivia Wilson',
    jobTitle: 'Marketing Manager',
    email: 'hello@reallygreatsite.com',
    phone: '+123-456-7890',
    address: '123 Anywhere St., Any City',
    profileImage: '/julianaSilva.png',
    summary: 'Strategic marketing leader with experience in brand growth and digital campaigns.'
  },
  experiences: [
    {
      id: 'mn-exp-1',
      company: 'Borcelle Studio',
      position: 'Marketing Manager',
      location: 'New York, NY',
      startDate: '2020',
      endDate: '',
      current: true,
      description: ['Developed and implemented yearly marketing plans and campaigns.']
    }
  ],
  education: [
    {
      id: 'mn-edu-1',
      institution: 'Wardiere University',
      degree: 'Master of Business Management',
      field: 'Marketing',
      startDate: '2020',
      endDate: '2023',
      current: false,
      description: ''
    }
  ],
  skills: [
    { id: 'mn-skill-1', name: 'Market Strategy', level: 5 },
    { id: 'mn-skill-2', name: 'SEO Optimization', level: 4 }
  ],
  languages: [
    { id: 'mn-lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'mn-lang-2', name: 'French', proficiency: 'Professional' }
  ],
  certifications: [],
  projects: []
};

export const SALES_STAR_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'RICHARD SANCHEZ',
    nameLine1: 'RICHARD',
    nameLine2: 'SANCHEZ',
    jobTitle: 'Product Designer',
    email: 'hello@reallygreatsite.com',
    phone: '+123-456-7890',
    address: '123 Anywhere St., Any City',
    profileImage:
      'https://media.istockphoto.com/id/1830126474/photo/portrait-of-a-business-man-sitting-in-an-office.jpg?b=1&s=612x612&w=0&k=20&c=n1T_DyOqWIG7aTwPkjy5mP0kabIN-YaZsuJV5GniyPM=',
    summary: 'A compassionate counselor with a strong background in supporting families.'
  },
  experiences: [
    {
      id: 'ss-exp-1',
      company: 'Studio Showde Canberra - Australia',
      position: 'Product Designer',
      location: '',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.']
    }
  ],
  education: [
    {
      id: 'ss-edu-1',
      institution: 'Borcelle University',
      degree: 'Bachelor of Business Management',
      field: '',
      startDate: '2014',
      endDate: '2023',
      current: false
    }
  ],
  skills: [
    { id: 'ss-skill-1', name: 'Management Skills', level: 4 },
    { id: 'ss-skill-2', name: 'Creativity', level: 4 }
  ],
  languages: [
    { id: 'ss-lang-1', name: 'English', proficiency: '' },
    { id: 'ss-lang-2', name: 'Germany', proficiency: 'basic' }
  ],
  certifications: [],
  projects: []
};

export const RICHARD_PREVIEW_DATA: CVData = {
  personalInfo: {
    ...SALES_STAR_PREVIEW_DATA.personalInfo,
    fullName: 'RICHARD SANCHEZ',
    profileImage: '/richard.jpg'
  },
  experiences: SALES_STAR_PREVIEW_DATA.experiences,
  education: SALES_STAR_PREVIEW_DATA.education,
  skills: SALES_STAR_PREVIEW_DATA.skills,
  languages: SALES_STAR_PREVIEW_DATA.languages,
  certifications: SALES_STAR_PREVIEW_DATA.certifications,
  projects: SALES_STAR_PREVIEW_DATA.projects
};

export const ANDREEMAAS_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'ANDRE MAAS',
    jobTitle: 'ROBOTICA-INGENIEUR',
    email: 'hallo@geweldigewebsite.nl',
    phone: '0275-565600',
    address: 'Overalstraat 123, 1234 AB Beekstad',
    website: 'www.geweldigewebsite.nl',
    profileImage: '/ander.png',
    summary:
      'Ik ben een robotica-ingenieur met kennis in computerwetenschap en elektrotechniek. Ik heb zowel in academische als zakelijke omgevingen gewerkt.'
  },
  experiences: [
    {
      id: 'am-exp-1',
      company: 'Gritters en bedrijf',
      position: 'Hoofd Robotica-ingenieur',
      location: '',
      startDate: 'Dec 2015',
      endDate: '',
      current: true,
      description: [
        "Ontwerpen en integreren van robots die naadloos aansluiten op de klantprocessen.",
        'Werkt nauw samen met andere ingenieurs, ontwikkelaars en managers.'
      ]
    },
    {
      id: 'am-exp-2',
      company: 'ODK Global Systems',
      position: 'Robotica-ingenieur',
      location: '',
      startDate: 'Jan 2014',
      endDate: 'Nov 2015',
      current: false,
      description: [
        "Ontwikkelde efficiënte oplossingen voor robotica-programma's die door klanten worden gebruikt.",
        "Onderhoud van elektrische schema's na de initiële installatie."
      ]
    }
  ],
  education: [
    {
      id: 'am-edu-1',
      institution: 'Beekstad College',
      degree: 'Master of Science',
      field: 'Master in Robotica en Mechatronics',
      startDate: 'Jan 2010',
      endDate: 'Dec 2013',
      current: false
    },
    {
      id: 'am-edu-2',
      institution: 'Beekstad Universiteit',
      degree: 'Bachelor of Science',
      field: 'BS Elektrotechniek',
      startDate: 'Jan 2006',
      endDate: 'Dec 2009',
      current: false
    }
  ],
  skills: [
    { id: 'am-s-1', name: 'Installatie en debugging', level: 4 },
    { id: 'am-s-2', name: 'Technologieontwerp', level: 4 },
    { id: 'am-s-3', name: 'Systeemanalyse en -evaluatie', level: 4 },
    { id: 'am-s-4', name: 'Machine learning', level: 4 },
    { id: 'am-s-5', name: 'Kunstmatige intelligentie', level: 4 },
    { id: 'am-s-6', name: 'Computerprogrammering', level: 4 }
  ],
  languages: [],
  certifications: [
    { id: 'am-r-1', name: 'Amir Stulberg', issuer: 'Robotica Beekstad Universiteit', date: 'hallo@geweldigewebsite.nl', doesNotExpire: true },
    { id: 'am-r-2', name: 'Jessica Swart', issuer: 'ODK Global Systems', date: 'hallo@geweldigewebsite.nl', doesNotExpire: true }
  ],
  projects: []
};

export const PRODUCT_LEAD_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'Ndemloti Eno',
    jobTitle: 'Senior IT Project Manager',
    email: 'ndemloti.eno@portfolio.dev',
    phone: '+44 7700 900123',
    address: 'London, UK',
    profileImage: '',
    summary: 'Results-driven IT Project Manager with 12+ years of experience.'
  },
  experiences: [
    {
      id: 'pl-exp-1',
      company: 'Insight Logistic',
      position: 'Senior IT Project Manager',
      location: 'London, UK',
      startDate: '2021',
      endDate: '',
      current: true,
      description: ['Direct portfolio delivery for 6 parallel initiatives.']
    }
  ],
  education: [
    {
      id: 'pl-edu-1',
      institution: 'University of Cambridge',
      degree: 'Master of Studies',
      field: 'Technology Policy',
      startDate: '2019',
      endDate: '2021',
      current: false,
      description: ''
    }
  ],
  skills: [
    { id: 'pl-skill-1', name: 'Project Management', level: 5 },
    { id: 'pl-skill-2', name: 'Agile Delivery', level: 5 }
  ],
  languages: [
    { id: 'pl-lang-1', name: 'English', proficiency: 'Fluent' },
    { id: 'pl-lang-2', name: 'French', proficiency: 'Professional' }
  ],
  certifications: [
    { id: 'pl-cert-1', name: 'PMP', issuer: 'PMI', date: '2023', doesNotExpire: true },
    { id: 'pl-cert-2', name: 'PRINCE2 Practitioner', issuer: 'AXELOS', date: '2022', doesNotExpire: true }
  ],
  projects: []
};

export const JULIANA_SILVA_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'JULIANA SILVA',
    jobTitle: 'Grafisch vormgever',
    email: 'hello@reallygreatsite.com',
    phone: '+123-456-7890',
    address: '123 Anywhere St., Any City, ST 12345',
    website: 'www.reallygreatsite.com',
    profileImage: '/julianaSilva.png',
    summary: "Het ontwerpen en uitwerken van logo's, flyers en het vormgeven van een huisstijl."
  },
  experiences: [
    {
      id: 'js-exp-1',
      company: 'www.reallygreatsite.com',
      position: 'Grafisch vormgever',
      location: '',
      startDate: '2020',
      endDate: '',
      current: true,
      description: [
        "Het ontwerpen en uitwerken van logo's, flyers en het vormgeven van een huisstijl. Daarnaast heb ik bijgedragen aan de strategie bepaling."
      ]
    },
    {
      id: 'js-exp-2',
      company: 'www.reallygreatsite.com',
      position: 'Stagiaire Vormgeving',
      location: '',
      startDate: '2018',
      endDate: '2019',
      current: false,
      description: [
        'Het vormgeven van huisstijl elementen zoals visitekaartjes. Daarnaast mocht ik de promotie flyers vormgeven en heb ik ervaring opgedaan met webdesign.'
      ]
    }
  ],
  education: [
    {
      id: 'js-edu-1',
      institution: 'www.reallygreatsite.com',
      degree: 'Cursus ondernemingsschap',
      field: 'Om meer assertiever te handelen heb ik de cursus voor ondernemingsschap gevolgd.',
      startDate: '2019',
      endDate: '',
      current: false
    },
    {
      id: 'js-edu-2',
      institution: 'www.reallygreatsite.com',
      degree: 'Mediavormgever',
      field: 'Ik heb geleerd om creatieve oplossingen te bedenken voor complexe vraagstukken.',
      startDate: '2016',
      endDate: '2018',
      current: false
    }
  ],
  skills: [
    { id: 'js-s-1', name: 'Strategie bepaling', level: 5 },
    { id: 'js-s-2', name: 'Visueel ontwerp', level: 5 },
    { id: 'js-s-3', name: 'Leiderschap', level: 4 },
    { id: 'js-s-4', name: 'Web ontwerp', level: 4 }
  ],
  languages: [
    { id: 'js-l-1', name: 'Nederlands', proficiency: 'Moedertaal' },
    { id: 'js-l-2', name: 'Engels', proficiency: 'Vloeiend' },
    { id: 'js-l-3', name: 'Spaans', proficiency: 'Goed' },
    { id: 'js-l-4', name: 'Duits', proficiency: 'Beperkt' }
  ],
  certifications: [],
  projects: []
};

export const ALIDA_PLANET_PREVIEW_DATA: CVData = {
  personalInfo: {
    fullName: 'EMMA JAMES ROBERTSON',
    jobTitle: 'TONEEL- EN FILMACTRICE',
    email: '',
    phone: '0275-565600',
    address: 'Overalstraat 123, 1234 AB Beekstad 020-76347658',
    website: 'www.emmajansen.nl',
    profileImage:
      'https://media.istockphoto.com/id/2172317014/photo/happy-hispanic-man-working-on-laptop-at-home.jpg?b=1&s=612x612&w=0&k=20&c=ukqKyfuXrrr3JQ9JQ_XFPVldwCAyNOAqgthkRiRcbzs=',
    summary:
      'Ik ben actrice en heb in verschillende toneelstukken gespeeld, zoals Rent in Carré en Miss Saigon in de Ahoy. Ik heb in verschillende onafhankelijke films gespeeld en hou me ook bezig met kostuum- en productiewerk.'
  },
  experiences: [
    {
      id: 'ap-exp-1',
      company: 'Foxland Gracie',
      position: '',
      location: '',
      startDate: '2014',
      endDate: '',
      current: false,
      description: []
    },
    {
      id: 'ap-exp-2',
      company: 'De geheimzinnige Huishoudster Stefanie',
      position: '',
      location: '',
      startDate: '2013',
      endDate: '',
      current: false,
      description: []
    },
    {
      id: 'ap-exp-3',
      company: 'Madeline Anja',
      position: '',
      location: '',
      startDate: '2012',
      endDate: '',
      current: false,
      description: []
    },
    {
      id: 'ap-exp-4',
      company: 'Cipres park Maartje',
      position: '',
      location: '',
      startDate: '2010',
      endDate: '',
      current: false,
      description: []
    }
  ],
  education: [
    {
      id: 'ap-edu-1',
      institution: 'Beekstad Theateracademie',
      degree: 'Bachelor Schone Kunsten in Theater Kunst Minor in Toneelproductie',
      field: '',
      startDate: '2013',
      endDate: '',
      current: false,
      description: ''
    },
    {
      id: 'ap-edu-2',
      institution: 'Stanford Toneel- en acteerworkshop',
      degree: 'Certificaat voor Acteren',
      field: '',
      startDate: '2012',
      endDate: '',
      current: false,
      description: ''
    }
  ],
  skills: [
    { id: 'ap-s-1', name: 'Beatboksen', level: 4 },
    { id: 'ap-s-2', name: 'ballet', level: 4 },
    { id: 'ap-s-3', name: 'stijldansen', level: 4 },
    { id: 'ap-s-4', name: 'yoga', level: 4 }
  ],
  languages: [
    { id: 'ap-l-1', name: 'Engels', proficiency: '' },
    { id: 'ap-l-2', name: 'Mandarijn', proficiency: '' },
    { id: 'ap-l-3', name: 'Frans', proficiency: '' }
  ],
  certifications: [
    { id: 'ap-c-1', name: 'Haarkleur', issuer: 'Blond Grijs', date: '', doesNotExpire: true },
    { id: 'ap-c-2', name: 'Ogen', issuer: '', date: '', doesNotExpire: true },
    { id: 'ap-c-3', name: 'Gewicht', issuer: '53 kg', date: '', doesNotExpire: true },
    { id: 'ap-c-4', name: 'Lengte', issuer: '1,65 m', date: '', doesNotExpire: true }
  ],
  projects: [
    {
      id: 'ap-pr-1',
      name: 'Kaarten naar de melkweg',
      description: ['Bijrol | Alexa'],
      technologies: [],
      startDate: '2014',
      endDate: '',
      current: false
    },
    {
      id: 'ap-pr-2',
      name: 'Een vreselijke schoonheid',
      description: ['Ondersteunend | Katrina'],
      technologies: [],
      startDate: '2013',
      endDate: '',
      current: false
    },
    {
      id: 'ap-pr-3',
      name: 'De jager',
      description: ['Hoofdrol | Sam'],
      technologies: [],
      startDate: '2012',
      endDate: '',
      current: false
    }
  ]
};
