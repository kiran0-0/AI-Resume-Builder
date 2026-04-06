import { ResumeData, ATSScore, ATSSuggestion, COMMON_ATS_KEYWORDS, HIGH_VALUE_KEYWORDS } from './resume-types'

export function analyzeResume(data: ResumeData, jobDescription?: string): ATSScore {
  const suggestions: ATSSuggestion[] = []
  let score = 0
  const matchedKeywords: string[] = []
  const skillGaps: string[] = []

  // Convert all content to lowercase for comparison
  const allContent = [
    data.name,
    data.summary,
    ...data.skills,
    ...data.experience.map(e => `${e.position} ${e.description}`),
    ...data.projects.map(p => `${p.name} ${p.description} ${p.technologies.join(' ')}`),
    ...data.education.map(e => `${e.degree} ${e.field}`)
  ].join(' ').toLowerCase()

  // Check for contact information (15 points)
  if (data.name.trim()) {
    score += 5
    suggestions.push({ type: 'success', message: 'Name is present', category: 'Contact' })
  } else {
    suggestions.push({ type: 'warning', message: 'Add your full name', category: 'Contact' })
  }

  if (data.email.trim() && data.email.includes('@')) {
    score += 5
    suggestions.push({ type: 'success', message: 'Email is valid', category: 'Contact' })
  } else {
    suggestions.push({ type: 'warning', message: 'Add a valid email address', category: 'Contact' })
  }

  if (data.phone.trim() && data.phone.replace(/\D/g, '').length >= 10) {
    score += 5
    suggestions.push({ type: 'success', message: 'Phone number is present', category: 'Contact' })
  } else {
    suggestions.push({ type: 'improvement', message: 'Add a valid phone number', category: 'Contact' })
  }

  // Check for professional summary (15 points)
  if (data.summary.trim()) {
    const wordCount = data.summary.split(/\s+/).length
    if (wordCount >= 30) {
      score += 15
      suggestions.push({ type: 'success', message: 'Strong professional summary', category: 'Summary' })
    } else if (wordCount >= 15) {
      score += 10
      suggestions.push({ type: 'improvement', message: 'Expand your summary to 30+ words for better impact', category: 'Summary' })
    } else {
      score += 5
      suggestions.push({ type: 'improvement', message: 'Summary is too short. Aim for 30-50 words', category: 'Summary' })
    }
  } else {
    suggestions.push({ type: 'warning', message: 'Add a professional summary', category: 'Summary' })
  }

  // Check for skills (20 points)
  if (data.skills.length >= 8) {
    score += 20
    suggestions.push({ type: 'success', message: 'Excellent skill variety', category: 'Skills' })
  } else if (data.skills.length >= 5) {
    score += 15
    suggestions.push({ type: 'improvement', message: 'Add more skills (aim for 8-12)', category: 'Skills' })
  } else if (data.skills.length >= 1) {
    score += 8
    suggestions.push({ type: 'improvement', message: 'Add more relevant skills', category: 'Skills' })
  } else {
    suggestions.push({ type: 'warning', message: 'Add technical and soft skills', category: 'Skills' })
  }

  // Check for experience (20 points)
  if (data.experience.length >= 2) {
    score += 15
    const hasDescriptions = data.experience.every(e => e.description.trim().length >= 50)
    if (hasDescriptions) {
      score += 5
      suggestions.push({ type: 'success', message: 'Well-documented work experience', category: 'Experience' })
    } else {
      suggestions.push({ type: 'improvement', message: 'Add more detail to experience descriptions', category: 'Experience' })
    }
  } else if (data.experience.length === 1) {
    score += 10
    suggestions.push({ type: 'improvement', message: 'Add more work experience if available', category: 'Experience' })
  } else {
    suggestions.push({ type: 'warning', message: 'Add your work experience', category: 'Experience' })
  }

  // Check for education (10 points)
  if (data.education.length >= 1) {
    score += 10
    suggestions.push({ type: 'success', message: 'Education section complete', category: 'Education' })
  } else {
    suggestions.push({ type: 'warning', message: 'Add your educational background', category: 'Education' })
  }

  // Check for projects (10 points)
  if (data.projects.length >= 2) {
    score += 10
    suggestions.push({ type: 'success', message: 'Projects showcase your practical skills', category: 'Projects' })
  } else if (data.projects.length === 1) {
    score += 5
    suggestions.push({ type: 'improvement', message: 'Add more projects to demonstrate expertise', category: 'Projects' })
  } else {
    suggestions.push({ type: 'improvement', message: 'Consider adding relevant projects', category: 'Projects' })
  }

  // Keyword matching (15 points total)
  let highValueMatched = 0
  
  COMMON_ATS_KEYWORDS.forEach(keyword => {
    // Case-insensitive matching with word boundaries
    const keywordLower = keyword.toLowerCase()
    const keywordRegex = new RegExp(`\\b${keywordLower.replace(/[+.]/g, '\\$&')}\\b`, 'i')
    
    if (keywordRegex.test(allContent) || allContent.includes(keywordLower)) {
      matchedKeywords.push(keyword)
      // Extra points for high-value keywords like Python, SQL, Machine Learning, Data Analysis
      if (HIGH_VALUE_KEYWORDS.map(k => k.toLowerCase()).includes(keywordLower)) {
        highValueMatched++
      }
    } else {
      skillGaps.push(keyword)
    }
  })

  // Base keyword score (up to 10 points)
  const baseKeywordScore = Math.min(10, Math.floor(matchedKeywords.length / 2))
  // Bonus for high-value keywords (up to 5 points)
  const highValueBonus = Math.min(5, highValueMatched)
  score += baseKeywordScore + highValueBonus

  if (matchedKeywords.length >= 12) {
    suggestions.push({ type: 'success', message: `${matchedKeywords.length} industry keywords detected`, category: 'Keywords' })
  } else if (matchedKeywords.length >= 6) {
    suggestions.push({ type: 'improvement', message: `${matchedKeywords.length} keywords found - add more for better ATS ranking`, category: 'Keywords' })
  } else if (matchedKeywords.length >= 1) {
    suggestions.push({ type: 'improvement', message: 'Add more industry-relevant keywords (Python, SQL, Data Analysis, etc.)', category: 'Keywords' })
  } else {
    suggestions.push({ type: 'warning', message: 'Include ATS-friendly keywords like Python, SQL, Machine Learning, Data Analysis', category: 'Keywords' })
  }
  
  // Prioritize high-value keywords in skill gaps
  const missingHighValue = HIGH_VALUE_KEYWORDS.filter(kw => 
    !matchedKeywords.map(m => m.toLowerCase()).includes(kw.toLowerCase())
  )
  
  // Build final skill gaps with high-value first, then others, deduped
  const prioritizedGaps = [...missingHighValue, ...skillGaps.filter(
    gap => !missingHighValue.map(h => h.toLowerCase()).includes(gap.toLowerCase())
  )]
  
  // Remove duplicates keeping order
  const uniqueGaps = [...new Set(prioritizedGaps)]

  // Job description matching if provided
  if (jobDescription && jobDescription.trim()) {
    const jobKeywords = extractKeywords(jobDescription)
    const matchedJobKeywords = jobKeywords.filter(kw => 
      allContent.includes(kw.toLowerCase())
    )
    const matchPercentage = jobKeywords.length > 0 
      ? Math.round((matchedJobKeywords.length / jobKeywords.length) * 100)
      : 0
    
    if (matchPercentage >= 60) {
      suggestions.push({ type: 'success', message: `${matchPercentage}% match with job description`, category: 'Job Match' })
    } else if (matchPercentage >= 30) {
      suggestions.push({ type: 'improvement', message: `${matchPercentage}% match - add more relevant keywords`, category: 'Job Match' })
    } else {
      suggestions.push({ type: 'warning', message: `Low match (${matchPercentage}%) - tailor resume to job`, category: 'Job Match' })
    }
  }

  return {
    score: Math.min(100, score),
    suggestions,
    skillGaps: uniqueGaps.slice(0, 10),
    matchedKeywords
  }
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'able', 'we', 'you', 'they', 'it', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'any', 'as', 'if', 'from', 'about', 'into', 'over', 'after', 'before', 'between', 'under', 'above', 'up', 'down', 'out', 'off', 'through', 'during', 'against', 'among'])
  
  return [...new Set(words.filter(word => 
    word.length > 2 && !commonWords.has(word)
  ))]
}

export function getSkillGapAnalysis(skills: string[], jobDescription: string): {
  matching: string[]
  missing: string[]
  suggested: string[]
} {
  const jobKeywords = extractKeywords(jobDescription)
  const userSkills = skills.map(s => s.toLowerCase())
  
  const matching = skills.filter(skill => 
    jobKeywords.some(kw => skill.toLowerCase().includes(kw) || kw.includes(skill.toLowerCase()))
  )
  
  const missing = jobKeywords.filter(kw => 
    !userSkills.some(skill => skill.includes(kw) || kw.includes(skill))
  ).slice(0, 8)

  const suggested = COMMON_ATS_KEYWORDS.filter(kw => 
    !userSkills.some(skill => skill.toLowerCase() === kw.toLowerCase()) &&
    jobKeywords.some(jkw => kw.toLowerCase().includes(jkw) || jkw.includes(kw.toLowerCase()))
  ).slice(0, 5)

  return { matching, missing, suggested }
}
