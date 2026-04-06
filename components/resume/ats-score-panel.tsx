'use client'

import { ATSScore } from '@/lib/resume-types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ATSScorePanelProps {
  score: ATSScore
}

export function ATSScorePanel({ score }: ATSScorePanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-primary'
    if (score >= 40) return 'text-warning'
    return 'text-destructive'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-success'
    if (score >= 60) return 'bg-primary'
    if (score >= 40) return 'bg-warning'
    return 'bg-destructive'
  }

  const successSuggestions = score.suggestions.filter(s => s.type === 'success')
  const warningSuggestions = score.suggestions.filter(s => s.type === 'warning')
  const improvementSuggestions = score.suggestions.filter(s => s.type === 'improvement')

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          ATS Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score.score / 100) * 352} 352`}
                className={cn('transition-all duration-1000 ease-out', getScoreColor(score.score))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-4xl font-bold', getScoreColor(score.score))}>
                {score.score}
              </span>
              <span className="text-xs text-muted-foreground">out of 100</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className={cn('text-sm font-medium', getScoreColor(score.score))}>
              {getScoreLabel(score.score)}
            </p>
            <Progress 
              value={score.score} 
              className="h-2"
            />
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          {warningSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                Missing Sections
              </h4>
              <div className="space-y-1.5">
                {warningSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm p-2 rounded-md bg-destructive/10 text-destructive animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xs px-1.5 py-0.5 rounded bg-destructive/20 whitespace-nowrap">
                      {suggestion.category}
                    </span>
                    <span>{suggestion.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {improvementSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-warning">
                <Lightbulb className="h-4 w-4" />
                Improvements
              </h4>
              <div className="space-y-1.5">
                {improvementSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm p-2 rounded-md bg-warning/10 text-warning animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xs px-1.5 py-0.5 rounded bg-warning/20 whitespace-nowrap">
                      {suggestion.category}
                    </span>
                    <span>{suggestion.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {successSuggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                What&apos;s Working
              </h4>
              <div className="space-y-1.5">
                {successSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm p-2 rounded-md bg-success/10 text-success animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xs px-1.5 py-0.5 rounded bg-success/20 whitespace-nowrap">
                      {suggestion.category}
                    </span>
                    <span>{suggestion.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skill Gaps */}
        {score.skillGaps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Suggested Keywords to Add
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {score.skillGaps.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors cursor-default"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Matched Keywords */}
        {score.matchedKeywords.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Detected Keywords ({score.matchedKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {score.matchedKeywords.slice(0, 12).map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-success/20 text-success border-success/30"
                >
                  {keyword}
                </Badge>
              ))}
              {score.matchedKeywords.length > 12 && (
                <Badge variant="secondary" className="text-xs">
                  +{score.matchedKeywords.length - 12} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
