'use client'

import { EducationEntry } from '@/lib/resume-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface EducationFormProps {
  education: EducationEntry[]
  onChange: (education: EducationEntry[]) => void
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const addEducation = () => {
    const newEntry: EducationEntry = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }
    onChange([...education, newEntry])
  }

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    onChange(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id))
  }

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <Card key={edu.id} className="bg-secondary/30 border-border animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>Education {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Field>
              <FieldLabel className="text-xs">Institution</FieldLabel>
              <Input
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                placeholder="University of California, Berkeley"
                className="bg-input"
              />
            </Field>

            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel className="text-xs">Degree</FieldLabel>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">Field of Study</FieldLabel>
                <Input
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                  className="bg-input"
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel className="text-xs">Start Date</FieldLabel>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">End Date</FieldLabel>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">GPA (Optional)</FieldLabel>
                <Input
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  placeholder="3.8"
                  className="bg-input"
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full gap-2 border-dashed hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Education
      </Button>
    </div>
  )
}
