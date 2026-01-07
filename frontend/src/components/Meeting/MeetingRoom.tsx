/**
 * CHE·NU™ Meeting System
 * Complete meeting management with agents, notes, tasks, and XR support
 * 
 * @module meeting
 * @version 33.0
 */

import React, { useState, useEffect } from 'react';

// Types
interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'presenter' | 'participant' | 'observer';
  rsvpStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
  avatar?: string;
  isAgent?: boolean;
}

interface AgendaItem {
  id: string;
  title: string;
  duration: number; // minutes
  presenter?: string;
  notes?: string;
  completed: boolean;
}

interface MeetingNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  type: 'note' | 'decision' | 'action' | 'question';
}

interface MeetingTask {
  id: string;
  title: string;
  assignee: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  type: 'standard' | 'standup' | 'brainstorm' | 'review' | 'planning' | 'xr';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  isXrMeeting: boolean;
  participants: MeetingParticipant[];
  agenda: AgendaItem[];
  notes: MeetingNote[];
  tasks: MeetingTask[];
  sphereId: string;
  dataspaceId?: string;
}

interface MeetingRoomProps {
  meetingId: string;
  onLeave?: () => void;
  onEnd?: () => void;
}

// Mock data
const mockMeeting: Meeting = {
  id: 'mtg-001',
  title: 'Revue de Projet Q1 2025',
  description: 'Révision des objectifs et planification du premier trimestre',
  type: 'review',
  status: 'in_progress',
  scheduledStart: '2025-01-15T10:00:00',
  scheduledEnd: '2025-01-15T11:30:00',
  location: 'Salle Virtuelle A',
  isXrMeeting: false,
  sphereId: 'business',
  participants: [
    { id: 'p1', name: 'Jo Rodrigue', email: 'jo@chenu.ai', role: 'organizer', rsvpStatus: 'accepted' },
    { id: 'p2', name: 'Marie Tremblay', email: 'marie@company.com', role: 'presenter', rsvpStatus: 'accepted' },
    { id: 'p3', name: 'Jean Lavoie', email: 'jean@company.com', role: 'participant', rsvpStatus: 'accepted' },
    { id: 'a1', name: 'Nova', email: 'nova@chenu.ai', role: 'observer', rsvpStatus: 'accepted', isAgent: true },
    { id: 'a2', name: 'Agent Finance', email: 'finance@chenu.ai', role: 'participant', rsvpStatus: 'accepted', isAgent: true },
  ],
  agenda: [
    { id: 'ag1', title: 'Introduction et objectifs', duration: 10, presenter: 'Jo Rodrigue', completed: true },
    { id: 'ag2', title: 'Revue des résultats Q4 2024', duration: 20, presenter: 'Marie Tremblay', completed: true },
    { id: 'ag3', title: 'Planification Q1 2025', duration: 30, presenter: 'Jean Lavoie', completed: false },
    { id: 'ag4', title: 'Budget et ressources', duration: 15, presenter: 'Agent Finance', completed: false },
    { id: 'ag5', title: 'Questions et discussion', duration: 15, completed: false },
  ],
  notes: [
    { id: 'n1', content: 'Objectif principal: augmenter les revenus de 15%', author: 'Nova', timestamp: '10:05', type: 'note' },
    { id: 'n2', content: 'Décision: Reporter le lancement du produit B au T2', author: 'Jo Rodrigue', timestamp: '10:25', type: 'decision' },
    { id: 'n3', content: 'Revoir les projections avec les nouvelles données', author: 'Marie Tremblay', timestamp: '10:30', type: 'action' },
  ],
  tasks: [
    { id: 't1', title: 'Préparer rapport financier détaillé', assignee: 'Agent Finance', priority: 'high', status: 'pending' },
    { id: 't2', title: 'Mettre à jour le roadmap produit', assignee: 'Jean Lavoie', dueDate: '2025-01-20', priority: 'medium', status: 'pending' },
  ]
};

// Role colors
const roleColors: Record<string, string> = {
  organizer: 'bg-amber-500',
  presenter: 'bg-blue-500',
  participant: 'bg-slate-500',
  observer: 'bg-slate-600'
};

// Type icons
const meetingTypeIcons: Record<string, string> = {
  standard: '📋',
  standup: '🧍',
  brainstorm: '💡',
  review: '🔍',
  planning: '📅',
  xr: '🥽'
};

// Note type colors
const noteTypeColors: Record<string, string> = {
  note: 'border-slate-500',
  decision: 'border-emerald-500',
  action: 'border-amber-500',
  question: 'border-blue-500'
};

// Components
const ParticipantBadge: React.FC<{ participant: MeetingParticipant }> = ({ participant }) => (
  <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
    <div className={`w-8 h-8 rounded-full ${roleColors[participant.role]} flex items-center justify-center text-white text-sm font-semibold`}>
      {participant.isAgent ? '🤖' : participant.name.charAt(0)}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium truncate">{participant.name}</div>
      <div className="text-xs text-slate-400 capitalize">{participant.role}</div>
    </div>
    {participant.rsvpStatus === 'accepted' && <span className="text-emerald-400">✓</span>}
  </div>
);

const AgendaItemCard: React.FC<{ 
  item: AgendaItem; 
  isActive: boolean;
  onToggle: () => void;
}> = ({ item, isActive, onToggle }) => (
  <div 
    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
      item.completed 
        ? 'bg-emerald-900/20 border-emerald-700/50' 
        : isActive 
          ? 'bg-amber-900/30 border-amber-500' 
          : 'bg-slate-800 border-slate-700 hover:border-slate-600'
    }`}
    onClick={onToggle}
  >
    <div className="flex items-center gap-3">
      <span className={`text-lg ${item.completed ? 'text-emerald-400' : isActive ? 'text-amber-400' : 'text-slate-400'}`}>
        {item.completed ? '✅' : isActive ? '▶️' : '⏳'}
      </span>
      <div className="flex-1">
        <div className={`font-medium ${item.completed ? 'text-emerald-300 line-through' : ''}`}>
          {item.title}
        </div>
        <div className="text-xs text-slate-400">
          {item.presenter && `${item.presenter} • `}{item.duration} min
        </div>
      </div>
    </div>
  </div>
);

const NoteCard: React.FC<{ note: MeetingNote }> = ({ note }) => (
  <div className={`p-3 bg-slate-700/50 rounded-lg border-l-4 ${noteTypeColors[note.type]}`}>
    <div className="flex items-center gap-2 mb-1">
      <span className="text-xs bg-slate-600 px-2 py-0.5 rounded capitalize">{note.type}</span>
      <span className="text-xs text-slate-400">{note.timestamp}</span>
      <span className="text-xs text-slate-400">— {note.author}</span>
    </div>
    <p className="text-sm">{note.content}</p>
  </div>
);

const TaskCard: React.FC<{ task: MeetingTask }> = ({ task }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
    <input type="checkbox" checked={task.status === 'completed'} onChange={() => {}} className="w-4 h-4" />
    <div className="flex-1">
      <div className="font-medium text-sm">{task.title}</div>
      <div className="text-xs text-slate-400">
        Assigné à: {task.assignee}
        {task.dueDate && ` • Échéance: ${new Date(task.dueDate).toLocaleDateString('fr-CA')}`}
      </div>
    </div>
    <span className={`px-2 py-0.5 rounded text-xs ${
      task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
    }`}>
      {task.priority}
    </span>
  </div>
);

// Main Component
const MeetingRoom: React.FC<MeetingRoomProps> = ({
  meetingId,
  onLeave,
  onEnd
}) => {
  const [meeting, setMeeting] = useState<Meeting>(mockMeeting);
  const [activeTab, setActiveTab] = useState<'agenda' | 'notes' | 'tasks' | 'participants'>('agenda');
  const [activeAgendaIndex, setActiveAgendaIndex] = useState(2); // Current item
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'note' | 'decision' | 'action' | 'question'>('note');
  
  // Calculate progress
  const completedItems = meeting.agenda.filter(a => a.completed).length;
  const progress = (completedItems / meeting.agenda.length) * 100;
  const totalDuration = meeting.agenda.reduce((sum, a) => sum + a.duration, 0);
  const elapsedDuration = meeting.agenda.slice(0, activeAgendaIndex + 1).reduce((sum, a) => sum + a.duration, 0);
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note: MeetingNote = {
      id: `n${meeting.notes.length + 1}`,
      content: newNote,
      author: 'Jo Rodrigue',
      timestamp: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      type: noteType
    };
    setMeeting({ ...meeting, notes: [...meeting.notes, note] });
    setNewNote('');
  };
  
  const handleToggleAgenda = (index: number) => {
    const newAgenda = [...meeting.agenda];
    newAgenda[index].completed = !newAgenda[index].completed;
    setMeeting({ ...meeting, agenda: newAgenda });
    if (!newAgenda[index].completed && index === activeAgendaIndex) {
      // Move to next uncompleted
      const nextIndex = newAgenda.findIndex((a, i) => i > index && !a.completed);
      if (nextIndex >= 0) setActiveAgendaIndex(nextIndex);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">{meetingTypeIcons[meeting.type]}</span>
            <div>
              <h1 className="text-xl font-bold">{meeting.title}</h1>
              <p className="text-sm text-slate-400">
                {new Date(meeting.scheduledStart).toLocaleString('fr-CA')} • {meeting.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-600 rounded-full text-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              En cours
            </div>
            <button 
              onClick={onLeave}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
            >
              Quitter
            </button>
            <button 
              onClick={onEnd}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg"
            >
              Terminer
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
            <span>{completedItems}/{meeting.agenda.length} points complétés</span>
            <span>{elapsedDuration}/{totalDuration} min</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex h-[calc(100vh-140px)]">
        {/* Left Panel - Main View */}
        <div className="flex-1 p-4 overflow-auto">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-4">
            {(['agenda', 'notes', 'tasks', 'participants'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  activeTab === tab ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                {tab === 'agenda' && '📋 '}
                {tab === 'notes' && '📝 '}
                {tab === 'tasks' && '✅ '}
                {tab === 'participants' && '👥 '}
                {tab}
                {tab === 'notes' && ` (${meeting.notes.length})`}
                {tab === 'tasks' && ` (${meeting.tasks.length})`}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          {activeTab === 'agenda' && (
            <div className="space-y-2">
              {meeting.agenda.map((item, index) => (
                <AgendaItemCard
                  key={item.id}
                  item={item}
                  isActive={index === activeAgendaIndex && !item.completed}
                  onToggle={() => handleToggleAgenda(index)}
                />
              ))}
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add Note */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  {(['note', 'decision', 'action', 'question'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setNoteType(type)}
                      className={`px-3 py-1 rounded text-sm capitalize ${
                        noteType === type ? 'bg-amber-600' : 'bg-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Ajouter une note..."
                    className="flex-1 bg-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  />
                  <button 
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
              
              {/* Notes List */}
              <div className="space-y-2">
                {meeting.notes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div className="space-y-2">
              {meeting.tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              <button className="w-full p-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                + Ajouter une tâche
              </button>
            </div>
          )}
          
          {activeTab === 'participants' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {meeting.participants.map(p => (
                <ParticipantBadge key={p.id} participant={p} />
              ))}
            </div>
          )}
        </div>
        
        {/* Right Panel - Participants & Agents */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-auto">
          <h3 className="font-semibold mb-4">👥 Participants ({meeting.participants.length})</h3>
          
          {/* Human Participants */}
          <div className="mb-6">
            <h4 className="text-sm text-slate-400 mb-2">Humains</h4>
            <div className="space-y-2">
              {meeting.participants.filter(p => !p.isAgent).map(p => (
                <ParticipantBadge key={p.id} participant={p} />
              ))}
            </div>
          </div>
          
          {/* Agent Participants */}
          <div>
            <h4 className="text-sm text-slate-400 mb-2">Agents IA</h4>
            <div className="space-y-2">
              {meeting.participants.filter(p => p.isAgent).map(p => (
                <ParticipantBadge key={p.id} participant={p} />
              ))}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-sm text-slate-400 mb-2">Actions Rapides</h4>
            <div className="space-y-2">
              <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-left">
                🎙️ Activer transcription
              </button>
              <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-left">
                📹 Démarrer enregistrement
              </button>
              <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-left">
                🥽 Passer en mode XR
              </button>
              <button className="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-left">
                📊 Générer résumé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
