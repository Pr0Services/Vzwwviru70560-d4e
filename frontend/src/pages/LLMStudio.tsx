import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Send, Brain, Zap, DollarSign, 
  Sparkles, Code, Eye, MessageSquare,
  ChevronDown, Copy, Check
} from 'lucide-react';
import { llmService } from '@/services/api';
import type { ChatMessage, LLMModel } from '@/types';
import clsx from 'clsx';

const tierColors = {
  premium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  standard: 'bg-chenu-500/20 text-chenu-400 border-chenu-500/30',
  budget: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  free: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const providerLogos: Record<string, string> = {
  anthropic: '🤖',
  openai: '🟢',
  google: '🔵',
  xai: '⚡',
  deepseek: '🌊',
  mistral: '🌬️',
  groq: '⚡',
  perplexity: '🔮',
  cohere: '🔷',
  together: '🤝',
  huggingface: '🤗',
  ollama: '🦙',
  lmstudio: '💻',
};

function ModelCard({ model, isSelected, onSelect }: { 
  model: LLMModel; 
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full text-left p-4 rounded-xl border transition-all',
        isSelected
          ? 'bg-chenu-600/20 border-chenu-500/50 ring-2 ring-chenu-500/30'
          : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{providerLogos[model.provider] || '🤖'}</span>
          <div>
            <h3 className="font-medium text-sm">{model.name}</h3>
            <p className="text-xs text-gray-500 capitalize">{model.provider}</p>
          </div>
        </div>
        <span className={clsx('badge text-xs border', tierColors[model.tier])}>
          {model.tier}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {model.capabilities.slice(0, 3).map((cap) => (
          <span key={cap} className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{(model.context_length / 1000).toFixed(0)}K ctx</span>
        <span>${model.input_cost}/1K in</span>
      </div>
    </button>
  );
}

export default function LLMStudio() {
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-5-sonnet-20241022');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [showModels, setShowModels] = useState(true);
  const [copied, setCopied] = useState(false);

  const { data: modelsData, isLoading } = useQuery({
    queryKey: ['llm-models'],
    queryFn: llmService.getModels,
  });

  const chatMutation = useMutation({
    mutationFn: (newMessages: ChatMessage[]) => 
      llmService.chat(newMessages, selectedModel, temperature),
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');
    chatMutation.mutate(newMessages);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentModel = modelsData?.models.find(m => m.id === selectedModel);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Models Sidebar */}
      <div className={clsx(
        'transition-all duration-300 overflow-hidden',
        showModels ? 'w-80' : 'w-0'
      )}>
        <div className="card h-full overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Brain className="w-5 h-5 text-chenu-400" />
              Modèles LLM
            </h2>
            <span className="badge badge-info">{modelsData?.models.length || 0}</span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-chenu-500" />
            </div>
          ) : (
            <div className="space-y-2">
              {modelsData?.models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  isSelected={selectedModel === model.id}
                  onSelect={() => setSelectedModel(model.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="card mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModels(!showModels)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronDown className={clsx(
                'w-5 h-5 transition-transform',
                showModels ? 'rotate-0' : '-rotate-90'
              )} />
            </button>
            
            {currentModel && (
              <div className="flex items-center gap-2">
                <span className="text-xl">{providerLogos[currentModel.provider]}</span>
                <div>
                  <h3 className="font-medium">{currentModel.name}</h3>
                  <p className="text-xs text-gray-500">{currentModel.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-sm text-gray-400 w-8">{temperature}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 card overflow-auto mb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <Brain className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg">Commencez une conversation</p>
              <p className="text-sm">Sélectionnez un modèle et envoyez un message</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={clsx(
                    'flex gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div className={clsx(
                    'max-w-[80%] p-4 rounded-xl',
                    msg.role === 'user'
                      ? 'bg-chenu-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  )}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copié!' : 'Copier'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex gap-3">
                  <div className="bg-gray-800 p-4 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-chenu-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-chenu-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-chenu-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="card">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Tapez votre message..."
              className="input flex-1"
              disabled={chatMutation.isPending}
            />
            <button
              onClick={handleSend}
              disabled={chatMutation.isPending || !input.trim()}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
