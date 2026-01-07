import { Bell, Search, User } from 'lucide-react'
import { Input } from '../ui/Input'

export function Header() {
  return (
    <header className="h-16 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Input
            placeholder="Rechercher..."
            icon={<Search size={18} />}
            className="bg-gray-800/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-chenu-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Jo</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-construction-orange to-construction-yellow flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
