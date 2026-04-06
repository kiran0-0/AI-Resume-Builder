'use client'

import { ResumeData, COMMON_ATS_KEYWORDS } from '@/lib/resume-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { SkillsInput } from './skills-input'
import { ExperienceForm } from './experience-form'
import { EducationForm } from './education-form'
import { ProjectsForm } from './projects-form'
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion'
import { User, Briefcase, GraduationCap, FolderGit2, FileText, Wrench } from 'lucide-react'

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ResumeForm({ data, onChange }: ResumeFormProps) {
  const updateField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <Accordion 
        type="multiple" 
        defaultValue={['contact', 'summary', 'skills', 'experience', 'education', 'projects']}
        className="space-y-4"
      >
        {/* Contact Information */}
        <AccordionItem value="contact" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Contact Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <div className="space-y-4">
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  value={data.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John Doe"
                  className="bg-input"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                    className="bg-input"
                  />
                </Field>
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="bg-input"
                  />
                </Field>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Professional Summary</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <Field>
              <FieldLabel>Summary</FieldLabel>
              <Textarea
                value={data.summary}
                onChange={(e) => updateField('summary', e.target.value)}
                placeholder="A brief overview of your professional background, key skills, and career objectives..."
                rows={4}
                className="bg-input resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.summary.split(/\s+/).filter(Boolean).length} words
                {data.summary.split(/\s+/).filter(Boolean).length < 30 && ' (aim for 30-50 words)'}
              </p>
            </Field>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Wrench className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Skills</span>
              {data.skills.length > 0 && (
                <span className="text-xs text-muted-foreground">({data.skills.length})</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <SkillsInput
              skills={data.skills}
              onChange={(skills) => updateField('skills', skills)}
              suggestions={COMMON_ATS_KEYWORDS.slice(0, 12)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Work Experience</span>
              {data.experience.length > 0 && (
                <span className="text-xs text-muted-foreground">({data.experience.length})</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <ExperienceForm
              experiences={data.experience}
              onChange={(experiences) => updateField('experience', experiences)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <FolderGit2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Projects</span>
              {data.projects.length > 0 && (
                <span className="text-xs text-muted-foreground">({data.projects.length})</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <ProjectsForm
              projects={data.projects}
              onChange={(projects) => updateField('projects', projects)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border border-border rounded-lg bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">Education</span>
              {data.education.length > 0 && (
                <span className="text-xs text-muted-foreground">({data.education.length})</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 pt-2">
            <EducationForm
              education={data.education}
              onChange={(education) => updateField('education', education)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
