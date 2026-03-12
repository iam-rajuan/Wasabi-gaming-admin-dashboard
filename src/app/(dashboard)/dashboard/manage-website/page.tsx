'use client'

import { useEffect, useState } from 'react'
import { SECTION_CONFIG } from './sectionConfig'
import { SectionCard } from './components/SectionCard'
import { WebsiteSection } from './types'
import { websiteApi } from './services/website.api'
import { Loader2 } from 'lucide-react'

// import { HeroCTAManagement } from './actions/HeroCTA/HeroCTAManagement'
import { TeamManagement } from './actions/Team/TeamManagement'
import { AchievementManagement } from './actions/RecentAchievement/AchievementManagement'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PsychometricTestManager from './actions/psychometric/_components/psychometricTestManager'
import { LaunchCareerManagement } from './actions/LaunchCareer/LaunchCareerManagement'

export default function ManageWebsitePage() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  const activeConfig = SECTION_CONFIG.find(c => c.key === selectedSection)

  const renderSelectedSection = () => {
    if (!selectedSection) return null

    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedSection(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Sections
        </Button>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          {selectedSection === 'psychometric' && <PsychometricTestManager />}
          {selectedSection === 'launch-career' && <LaunchCareerManagement />}
          {/* {selectedSection === 'hero' && <HeroCTAManagement />} */}
          {selectedSection === 'team' && <TeamManagement />}
          {selectedSection === 'achievements' && <AchievementManagement />}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 space-y-6">
      <div className="mb-5">
        <h1 className="text-2xl font-medium tracking-tight">Manage Website</h1>
        <p className="text-muted-foreground">
          Manage the content for various sections of the website
        </p>
      </div>

      {/* <Separator /> */}

      {!selectedSection ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTION_CONFIG.map(section => (
            <SectionCard
              key={section.key}
              title={section.title}
              description={section.description}
              Icon={section.icon}
              onClick={() => setSelectedSection(section.key)}
            />
          ))}
        </div>
      ) : (
        renderSelectedSection()
      )}
    </div>
  )
}
