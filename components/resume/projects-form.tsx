'use client'

import { ProjectEntry } from '@/lib/resume-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Plus, Trash2, FolderGit2, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useState, KeyboardEvent } from 'react'

interface ProjectsFormProps {
  projects: ProjectEntry[]
  onChange: (projects: ProjectEntry[]) => void
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const [techInputs, setTechInputs] = useState<Record<string, string>>({})

  const addProject = () => {
    const newEntry: ProjectEntry = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    }
    onChange([...projects, newEntry])
  }

  const updateProject = (id: string, field: keyof ProjectEntry, value: string | string[]) => {
    onChange(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ))
  }

  const removeProject = (id: string) => {
    onChange(projects.filter(proj => proj.id !== id))
  }

  const addTechnology = (projectId: string, tech: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project && tech.trim() && !project.technologies.includes(tech.trim())) {
      updateProject(projectId, 'technologies', [...project.technologies, tech.trim()])
      setTechInputs(prev => ({ ...prev, [projectId]: '' }))
    }
  }

  const removeTechnology = (projectId: string, techIndex: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      updateProject(projectId, 'technologies', project.technologies.filter((_, i) => i !== techIndex))
    }
  }

  const handleTechKeyDown = (e: KeyboardEvent<HTMLInputElement>, projectId: string) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTechnology(projectId, techInputs[projectId] || '')
    }
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <Card key={project.id} className="bg-secondary/30 border-border animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderGit2 className="h-4 w-4" />
                <span>Project {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel className="text-xs">Project Name</FieldLabel>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="E-commerce Platform"
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">Link (Optional)</FieldLabel>
                <Input
                  value={project.link || ''}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/..."
                  className="bg-input"
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel className="text-xs">Description</FieldLabel>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="Describe what you built and its impact..."
                rows={2}
                className="bg-input resize-none"
              />
            </Field>

            <Field>
              <FieldLabel className="text-xs">Technologies</FieldLabel>
              <div className="flex flex-wrap gap-2 p-2 min-h-[40px] bg-input border border-border rounded-md">
                {project.technologies.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="gap-1 pr-1 bg-primary/20 text-primary"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(project.id, techIndex)}
                      className="ml-1 rounded-full p-0.5 hover:bg-primary/40 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  type="text"
                  value={techInputs[project.id] || ''}
                  onChange={(e) => setTechInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
                  onKeyDown={(e) => handleTechKeyDown(e, project.id)}
                  placeholder="Add tech..."
                  className="flex-1 min-w-[80px] border-0 bg-transparent p-0 h-6 text-sm focus-visible:ring-0"
                />
              </div>
            </Field>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addProject}
        className="w-full gap-2 border-dashed hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Project
      </Button>
    </div>
  )
}
