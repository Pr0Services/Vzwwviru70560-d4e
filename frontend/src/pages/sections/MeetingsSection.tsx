/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — MEETINGS SECTION                                ║
 * ║                    📅 Réunions — Gestion des réunions                       ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  Interface pour gérer les réunions:                                          ║
 * ║  • Calendrier                                                                ║
 * ║  • Planification                                                             ║
 * ║  • Notes de réunion                                                          ║
 * ║  • Suivi des actions                                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState } from 'react';

interface MeetingsSectionProps {
  sphereId: string;
  sphereName: string;
  sphereColor: string;
}

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  participants: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  hasNotes: boolean;
  actionItems: number;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({
  sphereId,
  sphereName,
  sphereColor,
}) => {
  const [view, setView] = useState<'agenda' | 'calendar'>('agenda');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Revue de sprint hebdomadaire',
      description: 'Revue des accomplissements de la semaine',
      startTime: new Date(new Date().setHours(10, 0)),
      endTime: new Date(new Date().setHours(11, 0)),
      isVirtual: true,
      meetingLink: 'https://meet.chenu.app/sprint-review',
      participants: ['Marie', 'Pierre', 'Sophie', 'Nova'],
      status: 'scheduled',
      hasNotes: false,
      actionItems: 0,
    },
    {
      id: '2',
      title: 'Présentation Client XYZ',
      description: 'Démonstration de la nouvelle fonctionnalité',
      startTime: new Date(new Date().setHours(14, 0)),
      endTime: new Date(new Date().setHours(15, 30)),
      location: 'Salle Einstein',
      isVirtual: false,
      participants: ['Client XYZ', 'Équipe Ventes'],
      status: 'scheduled',
      hasNotes: false,
      actionItems: 0,
    },
    {
      id: '3',
      title: 'Stand-up quotidien',
      startTime: new Date(new Date().setHours(9, 0)),
      endTime: new Date(new Date().setHours(9, 15)),
      isVirtual: true,
      meetingLink: 'https://meet.chenu.app/standup',
      participants: ['Équipe Dev'],
      status: 'completed',
      hasNotes: true,
      actionItems: 3,
    },
    {
      id: '4',
      title: 'Planification Q1 2026',
      description: 'Définition des objectifs et roadmap',
      startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
      isVirtual: true,
      participants: ['Comité Direction'],
      status: 'scheduled',
      hasNotes: false,
      actionItems: 0,
    },
  ]);

  const todayMeetings = meetings.filter(m => 
    m.startTime.toDateString() === new Date().toDateString()
  ).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const upcomingMeetings = meetings.filter(m => 
    m.startTime > new Date() && m.startTime.toDateString() !== new Date().toDateString()
  ).slice(0, 5);

  const getStatusStyle = (status: Meeting['status']) => {
    switch (status) {
      case 'ongoing': return { bg: '#4ade80', label: 'En cours' };
      case 'scheduled': return { bg: '#3b82f6', label: 'Planifié' };
      case 'completed': return { bg: '#6b6560', label: 'Terminé' };
      case 'cancelled': return { bg: '#ef4444', label: 'Annulé' };
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}` : `${hours}h`;
  };

  return (
    <div className="meetings-section">
      {/* Header */}
      <div className="section-header">
        <div className="header-title">
          <span className="header-icon">📅</span>
          <h2>Réunions</h2>
          <span className="sphere-badge" style={{ background: sphereColor }}>
            {sphereName}
          </span>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={view === 'agenda' ? 'active' : ''} 
              onClick={() => setView('agenda')}
            >
              📋 Agenda
            </button>
            <button 
              className={view === 'calendar' ? 'active' : ''} 
              onClick={() => setView('calendar')}
            >
              📆 Calendrier
            </button>
          </div>
          <button className="new-meeting-btn" style={{ background: sphereColor }}>
            + Nouvelle réunion
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-value">{todayMeetings.length}</span>
          <span className="stat-label">Aujourd'hui</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{upcomingMeetings.length}</span>
          <span className="stat-label">Cette semaine</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{meetings.filter(m => m.hasNotes).length}</span>
          <span className="stat-label">Avec notes</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{meetings.reduce((s, m) => s + m.actionItems, 0)}</span>
          <span className="stat-label">Actions à suivre</span>
        </div>
      </div>

      {view === 'agenda' ? (
        <div className="agenda-view">
          {/* Today's Meetings */}
          <div className="day-section">
            <div className="day-header">
              <h3>Aujourd'hui</h3>
              <span className="day-date">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>

            {todayMeetings.length === 0 ? (
              <div className="no-meetings">
                <span>🎉</span>
                <p>Aucune réunion aujourd'hui</p>
              </div>
            ) : (
              <div className="meetings-timeline">
                {todayMeetings.map(meeting => {
                  const status = getStatusStyle(meeting.status);
                  return (
                    <div 
                      key={meeting.id} 
                      className={`meeting-card ${meeting.status}`}
                      style={{ '--accent': sphereColor } as React.CSSProperties}
                    >
                      <div className="time-column">
                        <span className="time-start">{formatTime(meeting.startTime)}</span>
                        <span className="time-duration">{formatDuration(meeting.startTime, meeting.endTime)}</span>
                      </div>
                      
                      <div className="meeting-content">
                        <div className="meeting-header">
                          <h4 className="meeting-title">{meeting.title}</h4>
                          <span className="meeting-status" style={{ background: status.bg }}>
                            {status.label}
                          </span>
                        </div>
                        
                        {meeting.description && (
                          <p className="meeting-description">{meeting.description}</p>
                        )}
                        
                        <div className="meeting-meta">
                          {meeting.isVirtual ? (
                            <span className="meta-item virtual">🎥 Virtuel</span>
                          ) : (
                            <span className="meta-item location">📍 {meeting.location}</span>
                          )}
                          <span className="meta-item participants">
                            👥 {meeting.participants.length} participants
                          </span>
                        </div>
                        
                        <div className="meeting-actions">
                          {meeting.isVirtual && meeting.meetingLink && (
                            <button className="action-btn primary" style={{ background: sphereColor }}>
                              🎥 Rejoindre
                            </button>
                          )}
                          <button className="action-btn secondary">📝 Notes</button>
                          <button className="action-btn secondary">⋮</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Meetings */}
          <div className="day-section upcoming">
            <div className="day-header">
              <h3>À venir</h3>
            </div>

            <div className="upcoming-list">
              {upcomingMeetings.map(meeting => (
                <div key={meeting.id} className="upcoming-item">
                  <div className="upcoming-date">
                    <span className="date-day">{meeting.startTime.getDate()}</span>
                    <span className="date-month">
                      {meeting.startTime.toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                  </div>
                  <div className="upcoming-info">
                    <span className="upcoming-title">{meeting.title}</span>
                    <span className="upcoming-time">
                      {formatTime(meeting.startTime)} • {meeting.participants.length} participants
                    </span>
                  </div>
                  <button className="upcoming-action">→</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="calendar-view">
          <MiniCalendar 
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            meetings={meetings}
            sphereColor={sphereColor}
          />
        </div>
      )}

      {/* Quick Create */}
      <div className="quick-create" style={{ borderColor: sphereColor }}>
        <span className="create-icon">⚡</span>
        <input 
          type="text" 
          placeholder="Créer rapidement une réunion... (ex: 'Standup demain 9h avec équipe dev')"
        />
        <button style={{ background: sphereColor }}>Créer</button>
      </div>

      <style>{`
        .meetings-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-icon { font-size: 28px; }

        .header-title h2 {
          font-size: 24px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .sphere-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          color: #000;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .view-toggle {
          display: flex;
          background: #1e2420;
          border-radius: 8px;
          overflow: hidden;
        }

        .view-toggle button {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #6b6560;
          cursor: pointer;
          font-size: 13px;
        }

        .view-toggle button.active {
          background: #2a2a2a;
          color: #e8e4dc;
        }

        .new-meeting-btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        .stats-row {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          padding: 20px;
          background: #1e2420;
          border-radius: 12px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 28px;
          font-weight: 700;
          color: #e8e4dc;
        }

        .stat-label {
          font-size: 13px;
          color: #6b6560;
        }

        .day-section {
          margin-bottom: 32px;
        }

        .day-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .day-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .day-date {
          font-size: 14px;
          color: #6b6560;
        }

        .no-meetings {
          text-align: center;
          padding: 40px;
          background: #1e2420;
          border-radius: 12px;
          color: #6b6560;
        }

        .no-meetings span {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }

        .meetings-timeline {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .meeting-card {
          display: flex;
          gap: 20px;
          background: #1e2420;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid var(--accent);
          transition: all 0.2s;
        }

        .meeting-card:hover {
          background: #252a27;
        }

        .meeting-card.ongoing {
          background: rgba(74, 222, 128, 0.1);
        }

        .meeting-card.completed {
          opacity: 0.7;
        }

        .time-column {
          min-width: 70px;
          text-align: center;
        }

        .time-start {
          display: block;
          font-size: 18px;
          font-weight: 600;
          color: #e8e4dc;
        }

        .time-duration {
          font-size: 12px;
          color: #6b6560;
        }

        .meeting-content {
          flex: 1;
        }

        .meeting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .meeting-title {
          font-size: 16px;
          font-weight: 600;
          color: #e8e4dc;
          margin: 0;
        }

        .meeting-status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          color: #000;
        }

        .meeting-description {
          font-size: 14px;
          color: #a8a29e;
          margin: 0 0 12px;
        }

        .meeting-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .meta-item {
          font-size: 13px;
          color: #6b6560;
        }

        .meeting-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .action-btn.primary {
          color: #000;
        }

        .action-btn.secondary {
          background: #2a2a2a;
          color: #a8a29e;
        }

        .upcoming-list {
          background: #1e2420;
          border-radius: 12px;
          overflow: hidden;
        }

        .upcoming-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #252a27;
          transition: background 0.2s;
        }

        .upcoming-item:last-child { border-bottom: none; }

        .upcoming-item:hover { background: #252a27; }

        .upcoming-date {
          width: 50px;
          text-align: center;
        }

        .date-day {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #e8e4dc;
        }

        .date-month {
          font-size: 12px;
          color: #6b6560;
          text-transform: uppercase;
        }

        .upcoming-info {
          flex: 1;
        }

        .upcoming-title {
          display: block;
          font-weight: 500;
          color: #e8e4dc;
          margin-bottom: 4px;
        }

        .upcoming-time {
          font-size: 13px;
          color: #6b6560;
        }

        .upcoming-action {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #6b6560;
          cursor: pointer;
        }

        .calendar-view {
          background: #1e2420;
          border-radius: 12px;
          padding: 20px;
        }

        .quick-create {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1e2420;
          border-radius: 12px;
          border: 1px dashed;
          margin-top: 24px;
        }

        .create-icon { font-size: 20px; }

        .quick-create input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e8e4dc;
          font-size: 14px;
          outline: none;
        }

        .quick-create input::placeholder { color: #6b6560; }

        .quick-create button {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          color: #000;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .meeting-card {
            flex-direction: column;
          }
          .time-column {
            text-align: left;
            display: flex;
            gap: 8px;
          }
          .stats-row {
            flex-wrap: wrap;
          }
          .stat-item {
            flex: 1 1 45%;
          }
        }
      `}</style>
    </div>
  );
};

// Mini Calendar Component
const MiniCalendar: React.FC<{
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  meetings: Meeting[];
  sphereColor: string;
}> = ({ selectedDate, onSelectDate, meetings, sphereColor }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const hasMeeting = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return meetings.some(m => m.startTime.toDateString() === date.toDateString());
  };

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
          ←
        </button>
        <span>
          {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
          →
        </button>
      </div>
      
      <div className="calendar-grid">
        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
          <div key={i} className="calendar-day-name">{d}</div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`calendar-day ${day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() ? 'selected' : ''} ${day && hasMeeting(day) ? 'has-meeting' : ''}`}
            onClick={() => day && onSelectDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
            style={{ '--accent': sphereColor } as React.CSSProperties}
          >
            {day}
            {day && hasMeeting(day) && <span className="meeting-dot" style={{ background: sphereColor }} />}
          </div>
        ))}
      </div>
      
      <style>{`
        .mini-calendar {
          max-width: 350px;
          margin: 0 auto;
        }
        
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .calendar-header button {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #2a2a2a;
          color: #e8e4dc;
          cursor: pointer;
        }
        
        .calendar-header span {
          font-weight: 600;
          color: #e8e4dc;
          text-transform: capitalize;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        
        .calendar-day-name {
          text-align: center;
          font-size: 12px;
          color: #6b6560;
          padding: 8px;
        }
        
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          color: #a8a29e;
          font-size: 14px;
          position: relative;
          transition: all 0.2s;
        }
        
        .calendar-day:hover {
          background: #2a2a2a;
        }
        
        .calendar-day.selected {
          background: var(--accent);
          color: #000;
        }
        
        .meeting-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          bottom: 4px;
        }
      `}</style>
    </div>
  );
};

interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  participants: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  hasNotes: boolean;
  actionItems: number;
}

export default MeetingsSection;
