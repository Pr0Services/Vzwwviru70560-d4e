import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ExternalLink, Book, Code, Zap, Shield, Terminal } from 'lucide-react'

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/integrations/status',
    description: 'Statut de toutes les intégrations',
    category: 'Integrations'
  },
  {
    method: 'GET',
    path: '/api/v1/integrations/llm/models',
    description: 'Liste des modèles LLM disponibles',
    category: 'LLM'
  },
  {
    method: 'POST',
    path: '/api/v1/integrations/llm/chat',
    description: 'Chat avec un modèle LLM',
    category: 'LLM'
  },
  {
    method: 'GET',
    path: '/api/v1/integrations/construction/rbq/validate/{licence}',
    description: 'Valide une licence RBQ',
    category: 'Construction'
  },
  {
    method: 'POST',
    path: '/api/v1/integrations/construction/ccq/calculate-cost',
    description: 'Calcule le coût main d\'œuvre CCQ',
    category: 'Construction'
  },
  {
    method: 'GET',
    path: '/api/v1/integrations/construction/cnesst/obligations/{nb}',
    description: 'Obligations CNESST selon nb travailleurs',
    category: 'Construction'
  },
  {
    method: 'POST',
    path: '/api/v1/assistant/chat',
    description: 'Chat avec l\'assistant projet',
    category: 'Assistant'
  },
  {
    method: 'POST',
    path: '/api/v1/assistant/validate-contractor',
    description: 'Validation entrepreneur avec conseils IA',
    category: 'Assistant'
  },
  {
    method: 'POST',
    path: '/api/v1/assistant/estimate-labour-cost',
    description: 'Estimation coûts main d\'œuvre',
    category: 'Assistant'
  },
  {
    method: 'POST',
    path: '/api/v1/assistant/safety-checklist',
    description: 'Génère checklist sécurité',
    category: 'Assistant'
  },
  {
    method: 'POST',
    path: '/api/v1/assistant/find-subsidies',
    description: 'Recherche subventions éligibles',
    category: 'Assistant'
  },
]

const methodColors: Record<string, string> = {
  GET: 'bg-green-500/20 text-green-400',
  POST: 'bg-blue-500/20 text-blue-400',
  PUT: 'bg-yellow-500/20 text-yellow-400',
  DELETE: 'bg-red-500/20 text-red-400',
}

export function Documentation() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Documentation API</h1>
          <p className="text-gray-400 mt-1">CHE·NU API v2.0.0</p>
        </div>
        <Button variant="secondary">
          <ExternalLink size={18} className="mr-2" />
          Swagger UI
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" padding="sm" className="hover:border-chenu-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chenu-500/20 text-chenu-400">
              <Book size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Guide Démarrage</h3>
              <p className="text-xs text-gray-500">Installation & Config</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="hover:border-chenu-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
              <Code size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Exemples Code</h3>
              <p className="text-xs text-gray-500">Python, JS, cURL</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="hover:border-chenu-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Webhooks</h3>
              <p className="text-xs text-gray-500">Events & Callbacks</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" padding="sm" className="hover:border-chenu-500 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="font-medium text-white">Auth & Sécurité</h3>
              <p className="text-xs text-gray-500">JWT, API Keys</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Endpoints */}
      <Card variant="glass">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal size={20} />
          Endpoints API
        </h2>
        <div className="space-y-2">
          {endpoints.map((endpoint, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${methodColors[endpoint.method]}`}>
                {endpoint.method}
              </span>
              <code className="text-sm text-chenu-400 font-mono flex-1">{endpoint.path}</code>
              <Badge variant="default" size="sm">{endpoint.category}</Badge>
              <span className="text-sm text-gray-400">{endpoint.description}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" padding="sm">
          <p className="text-3xl font-bold text-white">94+</p>
          <p className="text-sm text-gray-400">Intégrations API</p>
        </Card>
        <Card variant="glass" padding="sm">
          <p className="text-3xl font-bold text-white">45+</p>
          <p className="text-sm text-gray-400">Endpoints</p>
        </Card>
        <Card variant="glass" padding="sm">
          <p className="text-3xl font-bold text-white">14</p>
          <p className="text-sm text-gray-400">LLM Providers</p>
        </Card>
      </div>
    </div>
  )
}
