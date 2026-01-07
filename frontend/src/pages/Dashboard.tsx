import { useQuery } from '@tanstack/react-query'
import { Building2, Cpu, Plug, DollarSign, TrendingUp, Users } from 'lucide-react'
import { StatCard, IntegrationChart, LLMProviderCard, RecentActivity } from '@/components/dashboard'
import { Card } from '@/components/ui/Card'
import { Progress } from '@/components/ui/Progress'
import { integrationsService } from '@/services'

export function Dashboard() {
  const { data: summary } = useQuery({
    queryKey: ['integrations-summary'],
    queryFn: () => integrationsService.getSummary(),
  })

  const { data: llmModels } = useQuery({
    queryKey: ['llm-models'],
    queryFn: () => integrationsService.getLLMModels(),
  })

  const chartData = summary?.by_category ? 
    Object.entries(summary.by_category).map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      configured: data.configured,
      total: data.total,
    })) : []

  // Grouper les modèles par provider
  const modelsByProvider = llmModels?.models?.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = []
    acc[model.provider].push(model.id)
    return acc
  }, {} as Record<string, string[]>) || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Bienvenue sur CHE·NU - Vue d'ensemble</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projets Actifs"
          value="12"
          change={8}
          trend="up"
          icon={<Building2 size={24} />}
          color="orange"
        />
        <StatCard
          title="Agents IA"
          value="168"
          icon={<Cpu size={24} />}
          color="blue"
        />
        <StatCard
          title="Intégrations"
          value={`${summary?.configured || 0}/${summary?.total_integrations || 94}`}
          icon={<Plug size={24} />}
          color="green"
        />
        <StatCard
          title="Budget Total"
          value="2.4M $"
          change={12}
          trend="up"
          icon={<DollarSign size={24} />}
          color="purple"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration Chart */}
        <IntegrationChart data={chartData} />

        {/* LLM Providers */}
        <Card variant="glass" className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">
            LLM Providers ({Object.keys(modelsByProvider).length} actifs)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(modelsByProvider).slice(0, 6).map(([provider, models]) => (
              <LLMProviderCard
                key={provider}
                name={provider}
                models={models}
                isAvailable={true}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            {llmModels?.models?.length || 45}+ modèles disponibles
          </p>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity />

        {/* Quick Stats */}
        <Card variant="glass">
          <h3 className="text-lg font-semibold text-white mb-4">Progression</h3>
          <div className="space-y-6">
            <Progress 
              value={summary?.overall_percentage || 0} 
              label="Intégrations configurées" 
              variant="success"
            />
            <Progress 
              value={75} 
              label="Agents opérationnels" 
              variant="default"
            />
            <Progress 
              value={60} 
              label="Projets en cours" 
              variant="warning"
            />
            <Progress 
              value={92} 
              label="Conformité RBQ" 
              variant="success"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
