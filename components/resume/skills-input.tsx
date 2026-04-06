'use client'

import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SkillsInputProps {
  skills: string[]
  onChange: (skills: string[]) => void
  suggestions?: string[]
}

export function SkillsInput({ skills, onChange, suggestions = [] }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed])
      setInputValue('')
    }
  }

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1)
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => !skills.some(skill => skill.toLowerCase() === s.toLowerCase())
  ).slice(0, 6)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 p-3 min-h-[60px] bg-input border border-border rounded-md focus-within:ring-2 focus-within:ring-ring transition-all">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="gap-1 pr-1 bg-primary/20 text-primary hover:bg-primary/30 transition-colors animate-in fade-in-0 zoom-in-95 duration-200"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="ml-1 rounded-full p-0.5 hover:bg-primary/40 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
          className="flex-1 min-w-[120px] border-0 bg-transparent p-0 h-7 focus-visible:ring-0 placeholder:text-muted-foreground/50"
        />
      </div>
      
      {filteredSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Suggested skills:</p>
          <div className="flex flex-wrap gap-2">
            {filteredSuggestions.map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(suggestion)}
                className="h-7 text-xs gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
              >
                <Plus className="h-3 w-3" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
