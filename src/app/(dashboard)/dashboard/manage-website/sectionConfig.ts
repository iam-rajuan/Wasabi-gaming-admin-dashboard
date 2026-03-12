import {
  LayoutTemplate,
  Image,
  Users,
  Trophy,
  BrainCircuit,
  WalletCards,
  ImagePlus,
  MonitorPlay,
  PanelTop,
} from 'lucide-react'
import { WebsiteSection } from './types'

export const SECTION_CONFIG = [
  // {
  //   key: 'hero',
  //   type: 'hero',
  //   title: 'Hero / CTA Section',
  //   description: 'Edit the main hero section title, subtitle, and CTA buttons.',
  //   icon: LayoutTemplate,
  // },
  {
    key: 'team',
    type: 'team',
    title: 'Team Photos',
    description: 'Add or remove team member photos.',
    icon: Users,
  },
  {
    key: 'achievements',
    type: 'achievements',
    title: 'Recent Achievements',
    description: 'Update the recent achievement cards.',
    icon: Trophy,
  },
  {
    key: 'psychometric',
    type: 'psychometric',
    title: 'Psychometric Test',
    description: 'Preview and edit psychometric test questions.',
    icon: BrainCircuit,
  },
  {
    key: 'launch-career',
    type: 'launch-career',
    title: 'Launch Your Career',
    description: 'Manage Student and School career launch items.',
    icon: MonitorPlay,
  },
] as const
