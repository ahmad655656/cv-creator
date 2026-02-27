'use client';

import { TemplateConfig } from '@/lib/templates/template-types';
import { CVData } from '../cvs/CVEditor';

interface TemplateRendererProps {
  config: TemplateConfig;
  data: CVData;
}

export function TemplateRenderer({ config, data }: TemplateRendererProps) {
  const getLayoutStyle = () => {
    switch (config.layout) {
      case 'left-sidebar':
        return { display: 'grid', gridTemplateColumns: '280px 1fr', gap: config.spacing.sectionGap };
      case 'right-sidebar':
        return { display: 'grid', gridTemplateColumns: '1fr 280px', gap: config.spacing.sectionGap };
      case 'two-column':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: config.spacing.sectionGap };
      case 'three-column':
        return { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: config.spacing.sectionGap };
      default:
        return { display: 'block' };
    }
  };

  return (
    <div 
      className="template-container"
      style={{
        fontFamily: config.fonts.body,
        color: config.colors.text,
        backgroundColor: config.colors.background,
        padding: config.spacing.padding,
      }}
    >
      {/* Header */}
      {config.layout === 'top-header' && (
        <div 
          className="template-header"
          style={{
            backgroundColor: config.colors.primary,
            color: 'white',
            padding: config.spacing.padding,
            marginBottom: config.spacing.sectionGap,
            borderRadius: '8px',
          }}
        >
          <h1 style={{ fontFamily: config.fonts.heading, margin: 0 }}>
            {data.personalInfo.fullName}
          </h1>
          <p style={{ margin: '8px 0 0', opacity: 0.9 }}>
            {data.personalInfo.jobTitle}
          </p>
        </div>
      )}

      {/* Main Layout */}
      <div style={getLayoutStyle()}>
        {/* Render enabled sections in order */}
        {config.sections
          .filter(s => s.enabled)
          .sort((a, b) => a.order - b.order)
          .map(section => {
            switch (section.id) {
              case 'profile':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    {config.showProfileImage && (
                      <div className="profile-image">
                        {/* Profile image component */}
                      </div>
                    )}
                    <p>{data.personalInfo.summary}</p>
                    
                    {/* Contact Info */}
                    <div className="contact-info" style={{ marginTop: config.spacing.itemGap }}>
                      {data.personalInfo.email && (
                        <div>📧 {data.personalInfo.email}</div>
                      )}
                      {data.personalInfo.phone && (
                        <div>📱 {data.personalInfo.phone}</div>
                      )}
                      {data.personalInfo.address && (
                        <div>📍 {data.personalInfo.address}</div>
                      )}
                    </div>

                    {/* Social Links */}
                    {config.showSocialLinks && (
                      <div className="social-links" style={{ marginTop: config.spacing.itemGap }}>
                        {data.personalInfo.linkedin && (
                          <a href={data.personalInfo.linkedin} target="_blank">LinkedIn</a>
                        )}
                        {data.personalInfo.github && (
                          <a href={data.personalInfo.github} target="_blank">GitHub</a>
                        )}
                      </div>
                    )}
                  </div>
                );

              case 'experience':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    {data.experiences.map((exp, i) => (
                      <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                        <h3 style={{ color: config.colors.primary }}>{exp.position}</h3>
                        <p><strong>{exp.company}</strong> | {exp.location}</p>
                        <p style={{ color: config.colors.secondary }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        <ul>
                          {exp.description.filter(d => d).map((desc, j) => (
                            <li key={j}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );

              case 'education':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    {data.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                        <h3>{edu.degree} in {edu.field}</h3>
                        <p><strong>{edu.institution}</strong></p>
                        <p>{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                        {edu.grade && <p>Grade: {edu.grade}</p>}
                      </div>
                    ))}
                  </div>
                );

              case 'skills':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {data.skills.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: config.colors.secondary + '20',
                            color: config.colors.secondary,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                          }}
                        >
                          {skill.name} ({skill.level}/5)
                        </span>
                      ))}
                    </div>
                  </div>
                );

              case 'languages':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {data.languages.map((lang, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{lang.name}</span>
                          <span style={{ color: config.colors.primary }}>{lang.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );

              case 'certifications':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    {data.certifications.map((cert, i) => (
                      <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                        <h3 style={{ color: config.colors.primary }}>{cert.name}</h3>
                        <p>{cert.issuer}</p>
                        <p>{cert.date}</p>
                      </div>
                    ))}
                  </div>
                );

              case 'projects':
                return (
                  <div key={section.id} className="section" style={{ marginBottom: config.spacing.sectionGap }}>
                    <h2 style={{ fontFamily: config.fonts.heading, color: config.colors.heading }}>
                      {section.name}
                    </h2>
                    {data.projects.map((project, i) => (
                      <div key={i} style={{ marginBottom: config.spacing.itemGap }}>
                        <h3>{project.name}</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {project.technologies.map((tech, j) => (
                            <span key={j} style={{ color: config.colors.secondary }}>#{tech}</span>
                          ))}
                        </div>
                        <p>{project.startDate} - {project.current ? 'Present' : project.endDate}</p>
                        <ul>
                          {project.description.filter(d => d).map((desc, j) => (
                            <li key={j}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                );

              default:
                return null;
            }
          })}
      </div>
    </div>
  );
}