/**
 * CHEÂ·NU V5.0 - PUNCH LIST (Liste de dÃ©ficiences)
 */
import React, { useState, useMemo } from 'react';

const colors = { gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2', moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217', card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)', red: '#E54D4D', blue: '#4D8BE5', orange: '#F97316' };

interface PunchItem { id: string; title: string; location: string; description: string; category: string; priority: 'low' | 'medium' | 'high'; status: 'open' | 'in-progress' | 'completed' | 'verified'; assignee: string; dueDate: string; photos: string[]; createdAt: string; }

const mockItems: PunchItem[] = [
  { id: 'p1', title: 'Fissure au plafond salon', location: 'UnitÃ© 101 - Salon', description: 'Fissure visible au joint entre mur et plafond', category: 'Finition', priority: 'medium', status: 'open', assignee: 'Jean Gagnon', dueDate: '2024-12-10', photos: ['ðŸ“·'], createdAt: '2024-12-01' },
  { id: 'p2', title: 'Robinet cuisine qui fuit', location: 'UnitÃ© 103 - Cuisine', description: 'LÃ©gÃ¨re fuite au niveau de la base', category: 'Plomberie', priority: 'high', status: 'in-progress', assignee: 'Marc Dubois', dueDate: '2024-12-08', photos: ['ðŸ“·', 'ðŸ“·'], createdAt: '2024-12-02' },
  { id: 'p3', title: 'Prise Ã©lectrique non fonctionnelle', location: 'UnitÃ© 102 - Chambre 2', description: 'Prise double prÃ¨s de la fenÃªtre ne fonctionne pas', category: 'Ã‰lectricitÃ©', priority: 'high', status: 'completed', assignee: 'Pierre Roy', dueDate: '2024-12-05', photos: ['ðŸ“·'], createdAt: '2024-11-28' },
  { id: 'p4', title: 'Peinture Ã©caillÃ©e', location: 'Corridor 2e Ã©tage', description: 'Peinture Ã©caillÃ©e prÃ¨s de l\'ascenseur', category: 'Finition', priority: 'low', status: 'open', assignee: '', dueDate: '2024-12-15', photos: [], createdAt: '2024-12-03' },
  { id: 'p5', title: 'Porte qui grince', location: 'UnitÃ© 105 - EntrÃ©e', description: 'Porte d\'entrÃ©e grince Ã  l\'ouverture', category: 'Menuiserie', priority: 'low', status: 'verified', assignee: 'Luc Tremblay', dueDate: '2024-12-01', photos: ['ðŸ“·'], createdAt: '2024-11-25' },
  { id: 'p6', title: 'Carreau fissurÃ©', location: 'UnitÃ© 101 - Salle de bain', description: 'Carreau de cÃ©ramique fissurÃ© prÃ¨s de la douche', category: 'Finition', priority: 'medium', status: 'in-progress', assignee: 'Jean Gagnon', dueDate: '2024-12-12', photos: ['ðŸ“·', 'ðŸ“·'], createdAt: '2024-12-04' },
];

const categories = ['Tous', 'Finition', 'Plomberie', 'Ã‰lectricitÃ©', 'Menuiserie', 'HVAC', 'Autre'];
const assignees = ['Tous', 'Jean Gagnon', 'Marc Dubois', 'Pierre Roy', 'Luc Tremblay', 'Non assignÃ©'];

const StatusBadge = ({ status }: { status: PunchItem['status'] }) => {
  const cfg = { open: { l: 'ðŸ”´ Ouvert', c: colors.red }, 'in-progress': { l: 'ðŸŸ¡ En cours', c: colors.orange }, completed: { l: 'ðŸŸ¢ ComplÃ©tÃ©', c: colors.emerald }, verified: { l: 'âœ… VÃ©rifiÃ©', c: colors.turquoise } }[status];
  return <span style={{ padding: '4px 10px', background: `${cfg.c}20`, color: cfg.c, borderRadius: 20, fontSize: 11 }}>{cfg.l}</span>;
};

const PriorityBadge = ({ priority }: { priority: PunchItem['priority'] }) => {
  const cfg = { low: { l: 'Basse', c: colors.emerald }, medium: { l: 'Moyenne', c: colors.gold }, high: { l: 'Haute', c: colors.red } }[priority];
  return <span style={{ padding: '2px 8px', background: `${cfg.c}20`, color: cfg.c, borderRadius: 6, fontSize: 10 }}>{cfg.l}</span>;
};

const PunchList: React.FC = () => {
  const [items, setItems] = useState(mockItems);
  const [selected, setSelected] = useState<PunchItem | null>(null);
  const [filterCat, setFilterCat] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => items.filter(item => {
    if (filterCat !== 'Tous' && item.category !== filterCat) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (filterAssignee !== 'Tous' && (filterAssignee === 'Non assignÃ©' ? item.assignee !== '' : item.assignee !== filterAssignee)) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [items, filterCat, filterStatus, filterAssignee, searchQuery]);

  const stats = useMemo(() => ({
    total: items.length,
    open: items.filter(i => i.status === 'open').length,
    inProgress: items.filter(i => i.status === 'in-progress').length,
    completed: items.filter(i => i.status === 'completed').length,
    verified: items.filter(i => i.status === 'verified').length,
    highPriority: items.filter(i => i.priority === 'high' && i.status !== 'verified').length,
  }), [items]);

  const updateStatus = (id: string, status: PunchItem['status']) => {
    setItems(items.map(i => i.id === id ? { ...i, status } : i));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter' }}>
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between' }}>
        <div><h1 style={{ fontSize: 24, margin: 0 }}>âœï¸ Liste de dÃ©ficiences</h1><p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 13 }}>{stats.total} items â€¢ {stats.open + stats.inProgress} Ã  corriger</p></div>
        <button style={{ padding: '12px 24px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>+ Ajouter dÃ©ficience</button>
      </div>

      <div style={{ padding: 32 }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 24 }}>
          {[{ l: 'Total', v: stats.total, c: colors.sand, i: 'ðŸ“‹' }, { l: 'Ouverts', v: stats.open, c: colors.red, i: 'ðŸ”´' }, { l: 'En cours', v: stats.inProgress, c: colors.orange, i: 'ðŸŸ¡' }, { l: 'ComplÃ©tÃ©s', v: stats.completed, c: colors.emerald, i: 'ðŸŸ¢' }, { l: 'VÃ©rifiÃ©s', v: stats.verified, c: colors.turquoise, i: 'âœ…' }].map(s => (
            <div key={s.l} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{s.i}</div><div style={{ color: s.c, fontSize: 24, fontWeight: 700 }}>{s.v}</div><div style={{ color: colors.stone, fontSize: 11 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {stats.highPriority > 0 && (
          <div style={{ background: `${colors.red}15`, border: `1px solid ${colors.red}40`, borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>âš ï¸</span>
            <span style={{ color: colors.red }}>{stats.highPriority} dÃ©ficience(s) haute prioritÃ© non rÃ©solue(s)</span>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ðŸ” Rechercher..." style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand, width: 220 }} />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand }}>{categories.map(c => <option key={c}>{c}</option>)}</select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand }}>
            <option value="all">Tous statuts</option><option value="open">Ouvert</option><option value="in-progress">En cours</option><option value="completed">ComplÃ©tÃ©</option><option value="verified">VÃ©rifiÃ©</option>
          </select>
          <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand }}>{assignees.map(a => <option key={a}>{a}</option>)}</select>
        </div>

        {/* List */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 24 }}>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: colors.slate }}>
                <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>DÃ‰FICIENCE</th>
                <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>LOCALISATION</th>
                <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>ASSIGNÃ‰</th>
                <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>PRIORITÃ‰</th>
                <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>STATUT</th>
                <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>Ã‰CHÃ‰ANCE</th>
              </tr></thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.id} onClick={() => setSelected(item)} style={{ borderBottom: `1px solid ${colors.border}`, cursor: 'pointer', background: selected?.id === item.id ? `${colors.gold}10` : 'transparent' }}>
                    <td style={{ padding: 14 }}><div style={{ fontWeight: 500 }}>{item.title}</div><div style={{ color: colors.stone, fontSize: 12 }}>{item.category}</div></td>
                    <td style={{ padding: 14, color: colors.sand }}>{item.location}</td>
                    <td style={{ padding: 14, color: item.assignee ? colors.turquoise : colors.stone }}>{item.assignee || 'Non assignÃ©'}</td>
                    <td style={{ padding: 14, textAlign: 'center' }}><PriorityBadge priority={item.priority} /></td>
                    <td style={{ padding: 14, textAlign: 'center' }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: 14, textAlign: 'center', color: new Date(item.dueDate) < new Date() && item.status !== 'verified' ? colors.red : colors.stone }}>{item.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>{selected.title}</h3>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: colors.stone, cursor: 'pointer' }}>âœ•</button>
              </div>
              <div style={{ marginBottom: 16 }}><StatusBadge status={selected.status} /> <PriorityBadge priority={selected.priority} /></div>
              <div style={{ marginBottom: 16 }}><div style={{ color: colors.stone, fontSize: 12 }}>Localisation</div><div>{selected.location}</div></div>
              <div style={{ marginBottom: 16 }}><div style={{ color: colors.stone, fontSize: 12 }}>Description</div><div>{selected.description}</div></div>
              <div style={{ marginBottom: 16 }}><div style={{ color: colors.stone, fontSize: 12 }}>AssignÃ© Ã </div><div style={{ color: selected.assignee ? colors.turquoise : colors.stone }}>{selected.assignee || 'Non assignÃ©'}</div></div>
              <div style={{ marginBottom: 16 }}><div style={{ color: colors.stone, fontSize: 12 }}>Ã‰chÃ©ance</div><div>{selected.dueDate}</div></div>
              {selected.photos.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ color: colors.stone, fontSize: 12, marginBottom: 8 }}>Photos ({selected.photos.length})</div><div style={{ display: 'flex', gap: 8 }}>{selected.photos.map((p, i) => <div key={i} style={{ width: 60, height: 60, background: colors.slate, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{p}</div>)}</div></div>}
              
              <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
                <div style={{ color: colors.stone, fontSize: 12, marginBottom: 8 }}>Changer statut</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selected.status !== 'in-progress' && selected.status !== 'completed' && selected.status !== 'verified' && <button onClick={() => updateStatus(selected.id, 'in-progress')} style={{ padding: '8px 12px', background: `${colors.orange}20`, border: `1px solid ${colors.orange}`, borderRadius: 8, color: colors.orange, fontSize: 12, cursor: 'pointer' }}>ðŸŸ¡ En cours</button>}
                  {selected.status !== 'completed' && selected.status !== 'verified' && <button onClick={() => updateStatus(selected.id, 'completed')} style={{ padding: '8px 12px', background: `${colors.emerald}20`, border: `1px solid ${colors.emerald}`, borderRadius: 8, color: colors.emerald, fontSize: 12, cursor: 'pointer' }}>ðŸŸ¢ ComplÃ©tÃ©</button>}
                  {selected.status === 'completed' && <button onClick={() => updateStatus(selected.id, 'verified')} style={{ padding: '8px 12px', background: `${colors.turquoise}20`, border: `1px solid ${colors.turquoise}`, borderRadius: 8, color: colors.turquoise, fontSize: 12, cursor: 'pointer' }}>âœ… VÃ©rifier</button>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PunchList;
