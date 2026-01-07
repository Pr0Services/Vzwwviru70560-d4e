import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { integrationsService } from '@/services'
import { 
  Brain, Mic, Palette, DollarSign, Megaphone, Users, 
  CheckSquare, MessageSquare, Cloud, BarChart3, Building2 
} from 'lucide-react'

const categoryIcons: Record<string, React.ReactNode> = {
  llm: <Brain size={20} />,
  voice: <Mic size={20} />,
  creative: <Palette size={20} />,
  finance: <DollarSign size={20} />,
  marketing: <Megaphone size={20} />,
  sales: <Users size={20} />,
  hr: <Users size={20} />,
  productivity: <CheckSquare size={20} />,
  communication: <MessageSquare size={20} />,
  storage: <Cloud size={20} />,
  analytics: <BarChart3 size={20} />,
  construction: <Building2 size={20} />,
}

const categoryLabels: Record<string, string> = {
  llm: 'LLM / IA',
  voice: 'Voice & Audio',
  creative: 'Creative Studio',
  finance: 'Finance',
  marketing: 'Marketing',
  sales: 'Sales & CRM',
  hr: 'Ressources Humaines',
  productivity: 'Productivity',
  communication: 'Communication',
  storage: 'Storage',
  analytics: 'Analytics',
  construction: 'Construction QC',
}

export function Integrations() {
  const { data: summary } = useQuery({
    queryKey: ['integrations-summary'],
    queryFn: () => integrationsService.getSummary(),
  })

  const { data: status } = useQuery({
    queryKey: ['integrations-status'],
    queryFn: () => integrationsService.getStatus(),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Intégrations</h1>
        <p className="text-gray-400 mt-1">94+ APIs et services connectés</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{summary?.total_integrations || 94}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{summary?.configured || 0}</p>
            <p className="text-sm text-gray-400">Configurées</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">{summary?.not_configured || 0}</p>
            <p className="text-sm text-gray-400">Non configurées</p>
          </div>
        </Card>
        <Card variant="glass" padding="sm">
          <div className="text-center">
            <p className="text-3xl font-bold text-chenu-400">{summary?.overall_percentage || 0}%</p>
            <p className="text-sm text-gray-400">Complétude</p>
          </div>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary?.by_category && Object.entries(summary.by_category).map(([category, data]) => (
          <Card key={category} variant="glass" className="hover:border-gray-700 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chenu-500/20 text-chenu-400">
                {categoryIcons[category] || <CheckSquare size={20} />}
              </div>
              <div>
                <h3 className="font-semibold text-white">{categoryLabels[category] || category}</h3>
                <p className="text-sm text-gray-500">{data.configured}/{data.total} actives</p>
              </div>
            </div>
            
            <Progress value={data.percentage} size="sm" showValue={false} />
            
            {/* Integration list */}
            <div className="mt-4 flex flex-wrap gap-2">
              {status?.[category]?.slice(0, 5).map((integration: any) => (
                <Badge 
                  key={integration.name}
                  variant={integration.is_configured ? 'success' : 'default'}
                  size="sm"
                >
                  {integration.name}
                </Badge>
              ))}
              {status?.[category]?.length > 5 && (
                <Badge variant="default" size="sm">
                  +{status[category].length - 5}
                </Badge>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
