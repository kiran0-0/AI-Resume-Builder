'use client'

import { ResumeData } from '@/lib/resume-types'
import { Mail, Phone, ExternalLink, MapPin, Calendar } from 'lucide-react'
import { forwardRef } from 'react'

interface ResumePreviewProps {
  data: ResumeData
}

function formatDate(dateString: string): string {
  if (!dateString) return ''
  const [year, month] = dateString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  function ResumePreview({ data }, ref) {
    const hasAnyContent = data.name || data.email || data.phone || data.summary || 
      data.skills.length > 0 || data.education.length > 0 || 
      data.experience.length > 0 || data.projects.length > 0

    // Show sample data when empty to demonstrate the layout
    const displayData = hasAnyContent ? data : {
      name: 'Your Name',
      email: 'email@example.com',
      phone: '(555) 123-4567',
      summary: 'Start typing in the form on the left to see your resume come to life. Add your professional summary, skills, work experience, projects, and education.',
      skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'],
      education: [{
        id: 'sample-edu',
        institution: 'Sample University',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018-09',
        endDate: '2022-05',
        gpa: '3.8'
      }],
      experience: [{
        id: 'sample-exp',
        company: 'Sample Company',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-06',
        endDate: '',
        current: true,
        description: 'Your job responsibilities and achievements will appear here. Use bullet points and action verbs for best results.'
      }],
      projects: []
    }
    
    const isShowingSample = !hasAnyContent

    return (
      <div 
        ref={ref}
        className="bg-white text-gray-900 p-8 min-h-[1056px] w-full max-w-[816px] mx-auto shadow-2xl rounded-lg relative"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {isShowingSample && (
          <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-sans">
            Sample Preview
          </div>
        )}
        <div className={`space-y-5 ${isShowingSample ? 'opacity-60' : ''}`}>
            {/* Header */}
            <header className="text-center border-b-2 border-gray-800 pb-4">
              {displayData.name && (
                <h1 className="text-3xl font-bold text-gray-900 tracking-wide uppercase">
                  {displayData.name}
                </h1>
              )}
              <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                {displayData.email && (
                  <a href={`mailto:${displayData.email}`} className="flex items-center gap-1 hover:text-gray-900 transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                    {displayData.email}
                  </a>
                )}
                {displayData.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    {displayData.phone}
                  </span>
                )}
              </div>
            </header>

            {/* Professional Summary */}
            {displayData.summary && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {displayData.summary}
                </p>
              </section>
            )}

            {/* Skills */}
            {displayData.skills.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {displayData.skills.map((skill, index) => (
                    <span key={index} className="text-sm text-gray-700">
                      {skill}{index < displayData.skills.length - 1 ? ' •' : ''}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Experience */}
            {displayData.experience.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {displayData.experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-sm text-gray-600 italic">{exp.company}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {exp.location && (
                            <p className="flex items-center gap-1 justify-end">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </p>
                          )}
                          <p className="flex items-center gap-1 justify-end">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {displayData.projects.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                  Projects
                </h2>
                <div className="space-y-3">
                  {displayData.projects.map((project) => (
                    <div key={project.id} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-700">{project.description}</p>
                      )}
                      {project.technologies.length > 0 && (
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {displayData.education.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                  Education
                </h2>
                <div className="space-y-3">
                  {displayData.education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                        <p className="text-sm text-gray-600">
                          {edu.degree}{edu.field && ` in ${edu.field}`}
                          {edu.gpa && <span className="ml-2">• GPA: {edu.gpa}</span>}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
      </div>
    )
  }
)
