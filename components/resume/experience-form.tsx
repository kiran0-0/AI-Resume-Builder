'use client'

import { ExperienceEntry } from '@/lib/resume-types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ExperienceFormProps {
  experiences: ExperienceEntry[]
  onChange: (experiences: ExperienceEntry[]) => void
}

export function ExperienceForm({ experiences, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    const newEntry: ExperienceEntry = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    onChange([...experiences, newEntry])
  }

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string | boolean) => {
    onChange(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id))
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <Card key={exp.id} className="bg-secondary/30 border-border animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>Experience {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <FieldGroup className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel className="text-xs">Position</FieldLabel>
                <Input
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Software Engineer"
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">Company</FieldLabel>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Acme Inc."
                  className="bg-input"
                />
              </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-3 gap-3">
              <Field>
                <FieldLabel className="text-xs">Location</FieldLabel>
                <Input
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">Start Date</FieldLabel>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="bg-input"
                />
              </Field>
              <Field>
                <FieldLabel className="text-xs">End Date</FieldLabel>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="bg-input disabled:opacity-50"
                />
              </Field>
            </FieldGroup>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked) => updateExperience(exp.id, 'current', checked as boolean)}
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm text-muted-foreground cursor-pointer">
                I currently work here
              </label>
            </div>

            <Field>
              <FieldLabel className="text-xs">Description</FieldLabel>
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                className="bg-input resize-none"
              />
            </Field>
          </CardContent>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full gap-2 border-dashed hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>
    </div>
  )
}
