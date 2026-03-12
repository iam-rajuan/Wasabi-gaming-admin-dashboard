import { LucideIcon } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface SectionCardProps {
  title: string
  description: string
  Icon: LucideIcon
  onClick: () => void
}

export function SectionCard({
  title,
  description,
  Icon,
  onClick,
}: SectionCardProps) {
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary group"
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {/* <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Manage Section</p> */}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
