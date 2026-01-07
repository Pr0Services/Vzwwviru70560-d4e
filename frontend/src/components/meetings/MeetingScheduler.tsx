/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V68 — MEETING SCHEDULER                           ║
 * ║                    Planification de Réunions                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Features:
 * - Titre et description
 * - Date et heure
 * - Durée prédéfinie ou personnalisée
 * - Ajout de participants (users + agents)
 * - Récurrence optionnelle
 * - Lien vers thread/dataspace
 */

import React, { useState, useMemo } from 'react';
import { Meeting, MeetingParticipant } from './MeetingCard';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface MeetingSchedulerProps {
  sphereId: string;
  onSchedule: (meeting: Partial<Meeting>) => void;
  onClose: () => void;
  initialDate?: Date;
  availableParticipants?: MeetingParticipant[];
}

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 heures' },
];

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Pas de récurrence' },
  { value: 'daily', label: 'Tous les jours' },
  { value: 'weekly', label: 'Toutes les semaines' },
  { value: 'biweekly', label: 'Toutes les 2 semaines' },
  { value: 'monthly', label: 'Tous les mois' },
];

// Default available agents
const DEFAULT_AGENTS: MeetingParticipant[] = [
  { id: 'nova', name: 'Nova', type: 'nova' },
  { id: 'agent-notes', name: 'Agent Notes', type: 'agent' },
  { id: 'agent-summary', name: 'Agent Résumé', type: 'agent' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MEETING SCHEDULER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function MeetingScheduler({
  sphereId,
  onSchedule,
  onClose,
  initialDate,
  availableParticipants = DEFAULT_AGENTS,
}: MeetingSchedulerProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(
    initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(30);
  const [customDuration, setCustomDuration] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [inviteNova, setInviteNova] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // Computed Values
  // ─────────────────────────────────────────────────────────────────────────────

  const scheduledDateTime = useMemo(() => {
    return new Date(`${date}T${time}`);
  }, [date, time]);

  const endDateTime = useMemo(() => {
    const end = new Date(scheduledDateTime);
    end.setMinutes(end.getMinutes() + duration);
    return end;
  }, [scheduledDateTime, duration]);

  const participants = useMemo(() => {
    const result: MeetingParticipant[] = [];
    
    // Add Nova if invited
    if (inviteNova) {
      result.push({ id: 'nova', name: 'Nova', type: 'nova' });
    }
    
    // Add selected participants
    selectedParticipants.forEach(id => {
      const participant = availableParticipants.find(p => p.id === id);
      if (participant && participant.id !== 'nova') {
        result.push(participant);
      }
    });
    
    return result;
  }, [selectedParticipants, inviteNova, availableParticipants]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────

  const toggleParticipant = (id: string) => {
    setSelectedParticipants(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSchedule = async () => {
    if (!title.trim()) {
      setError('Le titre est requis');
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      const meeting: Partial<Meeting> = {
        title: title.trim(),
        description: description.trim() || undefined,
        sphereId,
        status: 'scheduled',
        scheduledAt: scheduledDateTime.toISOString(),
        duration,
        participants,
      };

      await onSchedule(meeting);
      onClose();
    } catch (err) {
      setError('Erreur lors de la planification');
    } finally {
      setIsScheduling(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center"
      data-testid="meeting-scheduler"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-[#141517] border border-[#2A2B2E] rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#2A2B2E] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <h2 className="text-base font-medium text-[#E9E4D6]">Planifier une réunion</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#2A2B2E] rounded transition-colors"
          >
            <span className="text-[#5A5B5E]">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm text-[#8D8371] mb-2">
              Titre de la réunion *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Réunion de projet"
              className="w-full px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] placeholder-[#5A5B5E] focus:border-[#D8B26A] focus:outline-none transition-colors"
              data-testid="meeting-title-input"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-[#8D8371] mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ordre du jour, notes..."
              rows={2}
              className="w-full px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] placeholder-[#5A5B5E] focus:border-[#D8B26A] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#8D8371] mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] focus:border-[#D8B26A] focus:outline-none transition-colors"
                data-testid="meeting-date-input"
              />
            </div>
            <div>
              <label className="block text-sm text-[#8D8371] mb-2">
                Heure
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] focus:border-[#D8B26A] focus:outline-none transition-colors"
                data-testid="meeting-time-input"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-[#8D8371] mb-2">
              Durée
            </label>
            {!customDuration ? (
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setDuration(option.value)}
                    className={`
                      px-3 py-1.5 text-xs rounded-lg transition-colors
                      ${duration === option.value 
                        ? 'bg-[#D8B26A]/20 text-[#D8B26A] border border-[#D8B26A]/30' 
                        : 'bg-[#1E1F22] text-[#8D8371] border border-[#2A2B2E] hover:bg-[#2A2B2E]'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
                <button
                  onClick={() => setCustomDuration(true)}
                  className="px-3 py-1.5 text-xs text-[#5A5B5E] hover:text-[#8D8371]"
                >
                  Autre...
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={duration}
                  onChange={e => setDuration(parseInt(e.target.value) || 30)}
                  min={5}
                  max={480}
                  className="w-20 px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] focus:border-[#D8B26A] focus:outline-none transition-colors"
                />
                <span className="text-sm text-[#8D8371]">minutes</span>
                <button
                  onClick={() => setCustomDuration(false)}
                  className="px-2 py-1 text-xs text-[#5A5B5E] hover:text-[#8D8371]"
                >
                  Présets
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="p-3 bg-[#1A1B1E] rounded-lg">
            <p className="text-xs text-[#5A5B5E] mb-1">Aperçu</p>
            <p className="text-sm text-[#E9E4D6]">
              {scheduledDateTime.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
            <p className="text-sm text-[#8D8371]">
              {time} → {endDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {' '}({duration} min)
            </p>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm text-[#8D8371] mb-2">
              Participants
            </label>
            
            {/* Nova toggle */}
            <label className="flex items-center gap-3 p-3 bg-[#1E1F22] rounded-lg mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inviteNova}
                onChange={e => setInviteNova(e.target.checked)}
                className="w-4 h-4 rounded border-[#3A3B3E] bg-[#1E1F22] text-[#D8B26A] focus:ring-[#D8B26A] focus:ring-offset-0"
              />
              <span className="text-xl">✨</span>
              <div>
                <p className="text-sm text-[#E9E4D6]">Nova</p>
                <p className="text-xs text-[#5A5B5E]">Assistant IA pour notes et résumés</p>
              </div>
            </label>
            
            {/* Other agents */}
            <div className="space-y-2">
              {availableParticipants.filter(p => p.id !== 'nova').map(participant => (
                <label
                  key={participant.id}
                  className="flex items-center gap-3 p-2 hover:bg-[#1E1F22] rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedParticipants.includes(participant.id)}
                    onChange={() => toggleParticipant(participant.id)}
                    className="w-4 h-4 rounded border-[#3A3B3E] bg-[#1E1F22] text-[#3EB4A2] focus:ring-[#3EB4A2] focus:ring-offset-0"
                  />
                  <span className="text-sm">🤖</span>
                  <span className="text-sm text-[#E9E4D6]">{participant.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="block text-sm text-[#8D8371] mb-2">
              Récurrence
            </label>
            <select
              value={recurrence}
              onChange={e => setRecurrence(e.target.value as RecurrenceType)}
              className="w-full px-3 py-2 bg-[#1E1F22] border border-[#2A2B2E] rounded-lg text-[#E9E4D6] focus:border-[#D8B26A] focus:outline-none transition-colors"
            >
              {RECURRENCE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#2A2B2E] bg-[#1A1B1E] flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={isScheduling}
            className="px-4 py-2 text-sm text-[#8D8371] hover:text-[#E9E4D6] transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSchedule}
            disabled={isScheduling || !title.trim()}
            className="px-5 py-2 text-sm font-medium bg-[#D8B26A] text-[#0D0E10] rounded-lg hover:bg-[#E9C87B] disabled:opacity-50 transition-colors flex items-center gap-2"
            data-testid="schedule-meeting-button"
          >
            {isScheduling ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0D0E10] border-t-transparent rounded-full animate-spin" />
                Planification...
              </>
            ) : (
              <>
                📅 Planifier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MeetingScheduler;
