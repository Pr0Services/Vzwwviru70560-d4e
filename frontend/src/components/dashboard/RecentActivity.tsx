import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

const activities = [
  { id: '1', type: 'agent', title: 'Agent Estimateur activé', description: 'Calcul pour Résidence Laval', time: 'il y a 5 min' },
  { id: '2', type: 'project', title: 'Nouveau projet créé', description: 'Commercial Plaza Brossard', time: 'il y a 30 min' },
  { id: '3', type: 'integration', title: 'QuickBooks synchronisé', description: '15 factures importées', time: 'il y a 1h' },
  { id: '4', type: 'alert', title: 'Licence RBQ vérifiée', description: 'Projet #2847 validé', time: 'il y a 2h' },
]

const typeColors: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  agent: 'info', project: 'success', integration: 'warning', alert: 'error',
}

export function RecentActivity() {
  return (
    <Card variant="glass">
      <h3 className="text-lg font-semibold text-white mb-4">Activité Récente</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/30">
            <Badge variant={typeColors[activity.type]} size="sm">{activity.type}</Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.description}</p>
            </div>
            <span className="text-xs text-gray-600">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
