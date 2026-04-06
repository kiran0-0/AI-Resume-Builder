'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { getSkillGapAnalysis } from '@/lib/ats-analyzer'

interface JobDescriptionMatcherProps {
  skills: string[]
  onJobDescriptionChange: (description: string) => void
}

export function JobDescriptionMatcher({ skills, onJobDescriptionChange }: JobDescriptionMatcherProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [analysis, setAnalysis] = useState<{
    matching: string[]
    missing: string[]
    suggested: string[]
  } | null>(null)

  const handleAnalyze = () => {
    if (jobDescription.trim()) {
      const result = getSkillGapAnalysis(skills, jobDescription)
      setAnalysis(result)
      onJobDescriptionChange(jobDescription)
    }
  }

  const handleClear = () => {
    setJobDescription('')
    setAnalysis(null)
    onJobDescriptionChange('')
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Job Description Matcher
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to analyze skill gaps and get tailored suggestions..."
              rows={4}
              className="bg-input resize-none"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleAnalyze}
                disabled={!jobDescription.trim()}
                className="flex-1"
              >
                Analyze Match
              </Button>
              {analysis && (
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {analysis && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
              {/* Matching Skills */}
              {analysis.matching.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Matching Skills ({analysis.matching.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.matching.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-success/20 text-success"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {analysis.missing.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.missing.map((keyword, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs border-destructive/50 text-destructive"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Skills */}
              {analysis.suggested.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-primary">
                    <Lightbulb className="h-4 w-4" />
                    Consider Adding
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.suggested.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.matching.length === 0 && analysis.missing.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Add some skills to your resume to see how they match the job description.
                </p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
