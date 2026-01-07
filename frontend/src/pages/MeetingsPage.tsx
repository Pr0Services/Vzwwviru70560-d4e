/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ V55 — Meetings Page                               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';
import { logger } from '@/utils/logger';
import { useMeetings, useCreateMeeting } from '../hooks/useEngineAPIs';
import { MeetingCard } from '../components/engines';
import { useMeetingStore } from '../stores';
import type { CreateMeetingInput, MeetingFilters } from '../types';

const MeetingsPage: React.FC = () => {
  const [filters, setFilters] = useState<MeetingFilters>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const { data: meetings, isLoading, error } = useMeetings(filters);
  const createMutation = useCreateMeeting();
  const { setCurrentMeeting } = useMeetingStore();

  const handleJoin = (meetingId: string) => {
    const meeting = meetings?.find((m) => m.id === meetingId);
    if (meeting) {
      setCurrentMeeting(meeting);
      // Navigate to meeting room
      window.location.href = `/meetings/${meetingId}`;
    }
  };

  const handleCreate = async (data: CreateMeetingInput) => {
    try {
      await createMutation.mutateAsync(data);
      setShowCreateModal(false);
    } catch (err) {
      logger.error('Failed to create meeting:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Erreur: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ui-slate">Réunions</h1>
          <p className="text-gray-500">Gérez vos réunions en temps réel</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cenote-turquoise text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
        >
          + Nouvelle réunion
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as any || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cenote-turquoise"
        >
          <option value="">Tous les statuts</option>
          <option value="scheduled">Planifiées</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminées</option>
        </select>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings?.map((meeting) => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            onJoin={handleJoin}
            onEdit={(id) => logger.debug('Edit:', id)}
            onDelete={(id) => logger.debug('Delete:', id)}
          />
        ))}
      </div>

      {meetings?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <span className="text-4xl mb-4 block">📅</span>
          Aucune réunion trouvée
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
