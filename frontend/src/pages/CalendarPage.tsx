// =============================================================================
// CHE·NU - CALENDAR PAGE
// Calendrier et planification des chantiers avec vue multi-projets
// =============================================================================

import React, { useState, useMemo } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: 'task' | 'meeting' | 'deadline' | 'milestone' | 'inspection' | 'delivery' | 'holiday';
  projectId?: string;
  projectName?: string;
  projectColor?: string;
  assignees?: string[];
  location?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  reminder?: number; // minutes before
}

interface Project {
  id: string;
  name: string;
  color: string;
}

type ViewMode = 'month' | 'week' | 'day' | 'agenda' | 'timeline';

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------

const mockProjects: Project[] = [
  { id: 'PRJ-001', name: 'Tour Montréal-Nord', color: '#3B82F6' },
  { id: 'PRJ-002', name: 'Centre Commercial Brossard', color: '#10B981' },
  { id: 'PRJ-003', name: 'Hôpital Saint-Jean', color: '#8B5CF6' },
  { id: 'PRJ-004', name: 'Condos Longueuil', color: '#F59E0B' },
  { id: 'PRJ-005', name: 'Entrepôt Mirabel', color: '#EF4444' },
];

const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Generate events for current month
  const eventTemplates = [
    { title: 'Réunion de chantier', type: 'meeting' as const, priority: 'high' as const },
    { title: 'Inspection RBQ', type: 'inspection' as const, priority: 'critical' as const },
    { title: 'Livraison béton', type: 'delivery' as const, priority: 'high' as const },
    { title: 'Revue de plans', type: 'meeting' as const, priority: 'medium' as const },
    { title: 'Milestone: Fondations', type: 'milestone' as const, priority: 'high' as const },
    { title: 'Formation sécurité CNESST', type: 'task' as const, priority: 'medium' as const },
    { title: 'Deadline soumission', type: 'deadline' as const, priority: 'critical' as const },
    { title: 'Inspection électrique', type: 'inspection' as const, priority: 'high' as const },
    { title: 'Livraison acier', type: 'delivery' as const, priority: 'medium' as const },
    { title: 'Réunion client', type: 'meeting' as const, priority: 'high' as const },
  ];

  for (let i = 0; i < 30; i++) {
    const template = eventTemplates[Math.floor(Math.random() * eventTemplates.length)];
    const project = mockProjects[Math.floor(Math.random() * mockProjects.length)];
    const dayOffset = Math.floor(Math.random() * 60) - 15;
    const startHour = 7 + Math.floor(Math.random() * 10);
    const duration = 1 + Math.floor(Math.random() * 3);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() + dayOffset);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + duration);

    events.push({
      id: `EVT-${String(i + 1).padStart(3, '0')}`,
      title: `${template.title} - ${project.name}`,
      description: `Événement planifié pour le projet ${project.name}`,
      startDate,
      endDate,
      allDay: template.type === 'milestone' || template.type === 'deadline',
      type: template.type,
      projectId: project.id,
      projectName: project.name,
      projectColor: project.color,
      priority: template.priority,
      status: dayOffset < 0 ? 'completed' : 'scheduled',
      location: 'Chantier principal',
      assignees: ['Jean Tremblay', 'Marie Lavoie'],
    });
  }

  return events;
};

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

const getDaysInMonth = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days: Date[] = [];
  
  // Add days from previous month to fill the first week
  const startDayOfWeek = firstDay.getDay();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push(date);
  }
  
  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  // Add days from next month to complete the last week
  const remainingDays = 42 - days.length; // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }
  
  return days;
};

const getWeekDays = (date: Date): Date[] => {
  const days: Date[] = [];
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  
  return days;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
};

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const EventBadge: React.FC<{ event: CalendarEvent; compact?: boolean }> = ({ event, compact = false }) => {
  const getTypeIcon = () => {
    switch (event.type) {
      case 'meeting': return '👥';
      case 'inspection': return '🔍';
      case 'delivery': return '📦';
      case 'milestone': return '🎯';
      case 'deadline': return '⏰';
      case 'holiday': return '🌴';
      default: return '📋';
    }
  };

  if (compact) {
    return (
      <div
        className="event-badge-compact"
        style={{ backgroundColor: event.projectColor || '#3B82F6' }}
        title={event.title}
      >
        <span className="event-time">{formatTime(event.startDate)}</span>
        <span className="event-title">{event.title}</span>
      </div>
    );
  }

  return (
    <div className={`event-badge priority-${event.priority}`} style={{ borderLeftColor: event.projectColor }}>
      <div className="event-header">
        <span className="event-icon">{getTypeIcon()}</span>
        <span className="event-title">{event.title}</span>
      </div>
      <div className="event-meta">
        <span className="event-time">
          {event.allDay ? 'Toute la journée' : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
        </span>
        {event.location && <span className="event-location">📍 {event.location}</span>}
      </div>
      {event.assignees && event.assignees.length > 0 && (
        <div className="event-assignees">
          {event.assignees.slice(0, 3).map((a, i) => (
            <span key={i} className="assignee-avatar">{a.charAt(0)}</span>
          ))}
          {event.assignees.length > 3 && (
            <span className="assignee-more">+{event.assignees.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

const MonthView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  selectedDate: Date | null;
}> = ({ currentDate, events, onDayClick, selectedDate }) => {
  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.startDate, date));
  };

  return (
    <div className="month-view">
      <div className="weekday-header">
        {weekDays.map(day => (
          <div key={day} className="weekday-cell">{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={index}
              className={`day-cell ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <span className="day-number">{day.getDate()}</span>
              <div className="day-events">
                {dayEvents.slice(0, 3).map(event => (
                  <EventBadge key={event.id} event={event} compact />
                ))}
                {dayEvents.length > 3 && (
                  <div className="more-events">+{dayEvents.length - 3} autres</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const WeekView: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}> = ({ currentDate, events, onDayClick }) => {
  const days = getWeekDays(currentDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 6); // 6h to 20h
  const today = new Date();

  const getEventsForDayAndHour = (date: Date, hour: number) => {
    return events.filter(event => {
      if (!isSameDay(event.startDate, date)) return false;
      return event.startDate.getHours() === hour;
    });
  };

  return (
    <div className="week-view">
      <div className="week-header">
        <div className="time-column-header"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-column-header ${isSameDay(day, today) ? 'today' : ''}`}
            onClick={() => onDayClick(day)}
          >
            <span className="day-name">{day.toLocaleDateString('fr-CA', { weekday: 'short' })}</span>
            <span className="day-date">{day.getDate()}</span>
          </div>
        ))}
      </div>
      <div className="week-body">
        {hours.map(hour => (
          <div key={hour} className="hour-row">
            <div className="time-cell">{`${hour}:00`}</div>
            {days.map((day, dayIndex) => {
              const hourEvents = getEventsForDayAndHour(day, hour);
              return (
                <div key={dayIndex} className="hour-cell">
                  {hourEvents.map(event => (
                    <EventBadge key={event.id} event={event} compact />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const AgendaView: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
  const sortedEvents = [...events]
    .filter(e => e.startDate >= new Date())
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 20);

  const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  sortedEvents.forEach(event => {
    const dateKey = event.startDate.toDateString();
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  return (
    <div className="agenda-view">
      {Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
        <div key={dateKey} className="agenda-day">
          <div className="agenda-date">
            <span className="date-day">{new Date(dateKey).getDate()}</span>
            <span className="date-info">
              <span className="date-weekday">
                {new Date(dateKey).toLocaleDateString('fr-CA', { weekday: 'long' })}
              </span>
              <span className="date-month">
                {new Date(dateKey).toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
              </span>
            </span>
          </div>
          <div className="agenda-events">
            {dayEvents.map(event => (
              <EventBadge key={event.id} event={event} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const TimelineView: React.FC<{ projects: Project[]; events: CalendarEvent[] }> = ({ projects, events }) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(1);
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 2);
  
  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return (
    <div className="timeline-view">
      <div className="timeline-header">
        <div className="project-name-header">Projet</div>
        <div className="timeline-dates">
          {days.filter((_, i) => i % 7 === 0).map((day, index) => (
            <div key={index} className="timeline-week">
              {day.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}
            </div>
          ))}
        </div>
      </div>
      <div className="timeline-body">
        {projects.map(project => {
          const projectEvents = events.filter(e => e.projectId === project.id);
          return (
            <div key={project.id} className="timeline-row">
              <div className="project-name">
                <span className="project-dot" style={{ backgroundColor: project.color }} />
                {project.name}
              </div>
              <div className="timeline-track">
                {projectEvents.map(event => {
                  const daysDiff = Math.floor((event.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  const duration = Math.max(1, Math.floor((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60 * 60 * 24)));
                  const position = (daysDiff / days.length) * 100;
                  const width = (duration / days.length) * 100;
                  
                  if (position < 0 || position > 100) return null;
                  
                  return (
                    <div
                      key={event.id}
                      className="timeline-event"
                      style={{
                        left: `${Math.max(0, position)}%`,
                        width: `${Math.min(width, 100 - position)}%`,
                        backgroundColor: project.color,
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EventSidebar: React.FC<{
  selectedDate: Date | null;
  events: CalendarEvent[];
  onClose: () => void;
}> = ({ selectedDate, events, onClose }) => {
  if (!selectedDate) return null;

  const dayEvents = events.filter(e => isSameDay(e.startDate, selectedDate));

  return (
    <div className="event-sidebar">
      <div className="sidebar-header">
        <h3>
          {selectedDate.toLocaleDateString('fr-CA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="sidebar-content">
        {dayEvents.length === 0 ? (
          <div className="no-events">
            <span className="empty-icon">📅</span>
            <p>Aucun événement prévu</p>
            <button className="btn-primary">+ Ajouter un événement</button>
          </div>
        ) : (
          <div className="events-list">
            {dayEvents.map(event => (
              <EventBadge key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
      <div className="sidebar-actions">
        <button className="btn-primary">+ Nouvel événement</button>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>(mockProjects.map(p => p.id));

  const events = useMemo(() => generateMockEvents(), []);

  const filteredEvents = useMemo(() => {
    return events.filter(e => selectedProjects.includes(e.projectId || ''));
  }, [events, selectedProjects]);

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    } else {
      newDate.setDate(newDate.getDate() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="calendar-page">
      <style>{`
        .calendar-page {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #e2e8f0;
        }

        /* Sidebar Filters */
        .calendar-filters {
          width: 280px;
          background: rgba(30, 41, 59, 0.8);
          border-right: 1px solid rgba(148, 163, 184, 0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .filter-section h3 {
          font-size: 14px;
          font-weight: 600;
          color: #94a3b8;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .mini-calendar {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 12px;
          padding: 16px;
        }

        .mini-cal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .mini-cal-title {
          font-weight: 600;
          color: #f1f5f9;
        }

        .mini-cal-nav {
          display: flex;
          gap: 4px;
        }

        .mini-cal-nav button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .mini-cal-nav button:hover {
          background: rgba(148, 163, 184, 0.1);
        }

        .project-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-filter {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .project-filter:hover {
          background: rgba(15, 23, 42, 0.8);
        }

        .project-filter.inactive {
          opacity: 0.5;
        }

        .project-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .project-name-filter {
          flex: 1;
          font-size: 14px;
          color: #e2e8f0;
        }

        .project-count {
          font-size: 12px;
          color: #64748b;
          background: rgba(148, 163, 184, 0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        /* Main Calendar Area */
        .calendar-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .calendar-title {
          font-size: 24px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .nav-btn {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(148, 163, 184, 0.2);
          color: #e2e8f0;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn:hover {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.5);
        }

        .view-tabs {
          display: flex;
          gap: 4px;
          background: rgba(15, 23, 42, 0.5);
          padding: 4px;
          border-radius: 10px;
        }

        .view-tab {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .view-tab:hover {
          color: #e2e8f0;
        }

        .view-tab.active {
          background: #3b82f6;
          color: white;
        }

        .calendar-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Calendar Body */
        .calendar-body {
          flex: 1;
          overflow: auto;
          padding: 24px;
        }

        /* Month View */
        .month-view {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .weekday-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          margin-bottom: 8px;
        }

        .weekday-cell {
          text-align: center;
          padding: 12px;
          font-weight: 600;
          color: #94a3b8;
          font-size: 13px;
        }

        .days-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 1fr);
          gap: 1px;
          background: rgba(148, 163, 184, 0.1);
          border-radius: 12px;
          overflow: hidden;
        }

        .day-cell {
          background: rgba(30, 41, 59, 0.8);
          padding: 8px;
          min-height: 120px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .day-cell:hover {
          background: rgba(30, 41, 59, 1);
        }

        .day-cell.other-month {
          background: rgba(15, 23, 42, 0.5);
        }

        .day-cell.other-month .day-number {
          color: #475569;
        }

        .day-cell.today {
          background: rgba(59, 130, 246, 0.1);
        }

        .day-cell.today .day-number {
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .day-cell.selected {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }

        .day-number {
          font-weight: 600;
          color: #f1f5f9;
          margin-bottom: 8px;
        }

        .day-events {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .event-badge-compact {
          font-size: 11px;
          padding: 3px 6px;
          border-radius: 4px;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-time {
          font-weight: 600;
          margin-right: 4px;
        }

        .more-events {
          font-size: 11px;
          color: #64748b;
          padding: 2px 6px;
        }

        /* Week View */
        .week-view {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .week-header {
          display: grid;
          grid-template-columns: 60px repeat(7, 1fr);
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .time-column-header {
          background: rgba(30, 41, 59, 0.8);
        }

        .day-column-header {
          text-align: center;
          padding: 12px;
          background: rgba(30, 41, 59, 0.8);
          cursor: pointer;
        }

        .day-column-header.today {
          background: rgba(59, 130, 246, 0.2);
        }

        .day-name {
          display: block;
          font-size: 12px;
          color: #94a3b8;
        }

        .day-date {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #f1f5f9;
        }

        .week-body {
          flex: 1;
          overflow-y: auto;
        }

        .hour-row {
          display: grid;
          grid-template-columns: 60px repeat(7, 1fr);
          min-height: 60px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.05);
        }

        .time-cell {
          padding: 8px;
          font-size: 12px;
          color: #64748b;
          text-align: right;
          background: rgba(15, 23, 42, 0.3);
        }

        .hour-cell {
          border-left: 1px solid rgba(148, 163, 184, 0.05);
          padding: 4px;
        }

        /* Agenda View */
        .agenda-view {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .agenda-day {
          display: flex;
          gap: 24px;
        }

        .agenda-date {
          width: 100px;
          flex-shrink: 0;
          text-align: right;
        }

        .date-day {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #f1f5f9;
          line-height: 1;
        }

        .date-info {
          display: flex;
          flex-direction: column;
        }

        .date-weekday {
          font-size: 14px;
          color: #94a3b8;
          text-transform: capitalize;
        }

        .date-month {
          font-size: 12px;
          color: #64748b;
        }

        .agenda-events {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Event Badge */
        .event-badge {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 10px;
          padding: 14px;
          border-left: 4px solid;
          cursor: pointer;
          transition: all 0.2s;
        }

        .event-badge:hover {
          transform: translateX(4px);
          background: rgba(15, 23, 42, 1);
        }

        .event-badge.priority-critical {
          box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
        }

        .event-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .event-icon {
          font-size: 18px;
        }

        .event-badge .event-title {
          font-weight: 600;
          color: #f1f5f9;
        }

        .event-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #94a3b8;
        }

        .event-assignees {
          display: flex;
          gap: -8px;
          margin-top: 10px;
        }

        .assignee-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: white;
          border: 2px solid #1e293b;
          margin-left: -8px;
        }

        .assignee-avatar:first-child {
          margin-left: 0;
        }

        .assignee-more {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #334155;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #94a3b8;
          margin-left: -8px;
        }

        /* Timeline View */
        .timeline-view {
          overflow-x: auto;
        }

        .timeline-header {
          display: flex;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          position: sticky;
          top: 0;
          background: rgba(30, 41, 59, 0.95);
          z-index: 10;
        }

        .project-name-header {
          width: 200px;
          flex-shrink: 0;
          padding: 12px;
          font-weight: 600;
          color: #94a3b8;
        }

        .timeline-dates {
          display: flex;
          flex: 1;
        }

        .timeline-week {
          flex: 1;
          min-width: 100px;
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-left: 1px solid rgba(148, 163, 184, 0.1);
        }

        .timeline-body {
          display: flex;
          flex-direction: column;
        }

        .timeline-row {
          display: flex;
          min-height: 60px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.05);
        }

        .timeline-row .project-name {
          width: 200px;
          flex-shrink: 0;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #e2e8f0;
        }

        .project-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .timeline-track {
          flex: 1;
          position: relative;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent calc(100% / 9 - 1px),
            rgba(148, 163, 184, 0.05) calc(100% / 9)
          );
        }

        .timeline-event {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 30px;
          border-radius: 6px;
          padding: 0 10px;
          font-size: 11px;
          color: white;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        /* Event Sidebar */
        .event-sidebar {
          width: 360px;
          background: rgba(30, 41, 59, 0.95);
          border-left: 1px solid rgba(148, 163, 184, 0.1);
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .sidebar-header h3 {
          font-size: 16px;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
          text-transform: capitalize;
        }

        .close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 18px;
          padding: 4px;
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .no-events {
          text-align: center;
          padding: 40px 20px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sidebar-actions {
          padding: 20px;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
        }

        .sidebar-actions .btn-primary {
          width: 100%;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .calendar-filters {
            width: 240px;
          }
        }

        @media (max-width: 992px) {
          .calendar-page {
            flex-direction: column;
          }

          .calendar-filters {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
            padding: 16px;
          }

          .event-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 100;
            box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
          }
        }
      `}</style>

      {/* Left Sidebar - Filters */}
      <aside className="calendar-filters">
        <div className="filter-section">
          <h3>Mini calendrier</h3>
          <div className="mini-calendar">
            <div className="mini-cal-header">
              <span className="mini-cal-title">
                {currentDate.toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
              </span>
              <div className="mini-cal-nav">
                <button onClick={() => navigateMonth(-1)}>‹</button>
                <button onClick={() => navigateMonth(1)}>›</button>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <h3>Projets</h3>
          <div className="project-list">
            {mockProjects.map(project => {
              const projectEvents = events.filter(e => e.projectId === project.id);
              const isSelected = selectedProjects.includes(project.id);
              return (
                <div
                  key={project.id}
                  className={`project-filter ${!isSelected ? 'inactive' : ''}`}
                  onClick={() => toggleProject(project.id)}
                >
                  <div className="project-color" style={{ backgroundColor: project.color }} />
                  <span className="project-name-filter">{project.name}</span>
                  <span className="project-count">{projectEvents.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Calendar */}
      <main className="calendar-main">
        <header className="calendar-header">
          <div className="calendar-nav">
            <button className="nav-btn" onClick={() => navigateMonth(-1)}>‹ Précédent</button>
            <button className="nav-btn" onClick={goToToday}>Aujourd'hui</button>
            <button className="nav-btn" onClick={() => navigateMonth(1)}>Suivant ›</button>
            <h1 className="calendar-title">
              {currentDate.toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}
            </h1>
          </div>

          <div className="view-tabs">
            {(['month', 'week', 'day', 'agenda', 'timeline'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                className={`view-tab ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}
              >
                {mode === 'month' && 'Mois'}
                {mode === 'week' && 'Semaine'}
                {mode === 'day' && 'Jour'}
                {mode === 'agenda' && 'Agenda'}
                {mode === 'timeline' && 'Timeline'}
              </button>
            ))}
          </div>

          <div className="calendar-actions">
            <button className="btn-primary">+ Nouvel événement</button>
          </div>
        </header>

        <div className="calendar-body">
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              onDayClick={setSelectedDate}
              selectedDate={selectedDate}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              onDayClick={setSelectedDate}
            />
          )}
          {viewMode === 'agenda' && <AgendaView events={filteredEvents} />}
          {viewMode === 'timeline' && (
            <TimelineView projects={mockProjects} events={filteredEvents} />
          )}
        </div>
      </main>

      {/* Right Sidebar - Event Details */}
      {selectedDate && (
        <EventSidebar
          selectedDate={selectedDate}
          events={filteredEvents}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default CalendarPage;
