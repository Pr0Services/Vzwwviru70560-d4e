import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { clsx } from 'clsx'

interface LLMProviderCardProps {
  name: string
  models: string[]
  isAvailable: boolean
}

const providerIcons: Record<string, string> = {
  anthropic: '🧠', openai: '🤖', google: '🔮', xai: '⚡', deepseek: '🔍',
  mistral: '💨', groq: '🚀', perplexity: '🌐', cohere: '💎', together: '🤝',
  huggingface: '🤗', ollama: '🦙', lmstudio: '💻',
}

export function LLMProviderCard({ name, models, isAvailable }: LLMProviderCardProps) {
  return (
    <Card variant="glass" padding="sm" className={clsx('hover:border-gray-700 transition-all cursor-pointer', !isAvailable && 'opacity-50')}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{providerIcons[name.toLowerCase()] || '🔌'}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white capitalize">{name}</h4>
            <Badge variant={isAvailable ? 'success' : 'error'} size="sm">{isAvailable ? 'Actif' : 'Inactif'}</Badge>
          </div>
          <p className="text-xs text-gray-500">{models.length} modèle{models.length > 1 ? 's' : ''}</p>
        </div>
      </div>
    </Card>
  )
}
