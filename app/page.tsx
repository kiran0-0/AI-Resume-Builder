'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { ResumeData, initialResumeData, ATSScore } from '@/lib/resume-types'
import { analyzeResume } from '@/lib/ats-analyzer'
import { ResumeForm } from '@/components/resume/resume-form'
import { ResumePreview } from '@/components/resume/resume-preview'
import { ATSScorePanel } from '@/components/resume/ats-score-panel'
import { JobDescriptionMatcher } from '@/components/resume/job-description-matcher'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileText, BarChart3, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [atsScore, setAtsScore] = useState<ATSScore>(() => analyzeResume(initialResumeData))
  const [jobDescription, setJobDescription] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState('preview')
  const resumeRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Update ATS score when resume data changes
  useEffect(() => {
    const score = analyzeResume(resumeData, jobDescription)
    setAtsScore(score)
  }, [resumeData, jobDescription])

  const handleResumeChange = useCallback((data: ResumeData) => {
    setResumeData(data)
  }, [])

  const handleJobDescriptionChange = useCallback((description: string) => {
    setJobDescription(description)
  }, [])

  const handleExportPDF = async () => {
    if (!resumeRef.current || typeof window === 'undefined') return

    setIsExporting(true)
    
    try {
      // Dynamic imports to avoid SSR issues with jsPDF
      const [html2canvasModule, jspdfModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf')
      ])
      
      const html2canvas = html2canvasModule.default
      const jsPDF = jspdfModule.default

      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      
      const fileName = resumeData.name 
        ? `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf'
      
      pdf.save(fileName)
      
      toast({
        title: 'PDF Downloaded',
        description: 'Your resume has been saved successfully.',
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast({
        title: 'Export Failed',
        description: 'There was an error generating the PDF. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AI Resume Builder</h1>
              <p className="text-xs text-muted-foreground">Create ATS-optimized resumes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
              <div className={`w-2 h-2 rounded-full ${
                atsScore.score >= 80 ? 'bg-success' : 
                atsScore.score >= 60 ? 'bg-primary' : 
                atsScore.score >= 40 ? 'bg-warning' : 'bg-destructive'
              }`} />
              <span className="text-sm font-medium">ATS Score: {atsScore.score}</span>
            </div>
            
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className="space-y-6 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-4 custom-scrollbar">
            <ResumeForm data={resumeData} onChange={handleResumeChange} />
          </div>

          {/* Right Panel - Preview & Analysis */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="analysis" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="mt-0">
                <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto custom-scrollbar rounded-lg">
                  <ResumePreview ref={resumeRef} data={resumeData} />
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="mt-0 space-y-4">
                <ATSScorePanel score={atsScore} />
                <JobDescriptionMatcher 
                  skills={resumeData.skills}
                  onJobDescriptionChange={handleJobDescriptionChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  )
}
