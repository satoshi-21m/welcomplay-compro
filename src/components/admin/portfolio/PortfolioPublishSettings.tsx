import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface PortfolioPublishSettingsProps {
  isActive: boolean
  onActiveChange: (active: boolean) => void
}

export function PortfolioPublishSettings({
  isActive,
  onActiveChange
}: PortfolioPublishSettingsProps) {
  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl">
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-2xl">
          <div>
            <label className="text-sm font-medium text-gray-900">Portfolio Aktif</label>
            <p className="text-xs text-gray-500">Tampilkan di landing page</p>
          </div>
          <Switch
            checked={Boolean(isActive)}
            onCheckedChange={onActiveChange}
            variant="green"
          />
        </div>
      </CardContent>
    </Card>
  )
}
