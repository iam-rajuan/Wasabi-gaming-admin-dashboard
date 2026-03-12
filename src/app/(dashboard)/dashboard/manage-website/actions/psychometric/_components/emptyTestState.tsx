// ============================================================================
// Components - EmptyTestState (components/EmptyTestState.tsx)
// ============================================================================
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'

interface EmptyTestStateProps {
  onCreateTest: () => void
  saving: boolean
}

export function EmptyTestState({ onCreateTest, saving }: EmptyTestStateProps) {
  return (
    <Card className="p-8 text-center border-dashed">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
          <Plus className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium mb-1">No test created yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create a test for this category to get started
          </p>
        </div>
        <Button onClick={onCreateTest} disabled={saving} className="bg-[#FFFF00] text-black hover:bg-[#E6E600] rounded-full px-8 font-bold h-12">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create Section
        </Button>
      </div>
    </Card>
  )
}
