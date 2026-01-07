/**
 * CHEÂ·NU V5.0 - EQUIPMENT TRACKER (Suivi Ã©quipements chantier)
 */

import React, { useState, useMemo } from 'react';

const colors = {
  gold: '#D8B26A', stone: '#8D8371', emerald: '#3F7249', turquoise: '#3EB4A2',
  moss: '#2F4C39', slate: '#1E1F22', sand: '#E9E4D6', dark: '#0f1217',
  card: 'rgba(22, 27, 34, 0.95)', border: 'rgba(216, 178, 106, 0.15)',
  red: '#E54D4D', blue: '#4D8BE5', orange: '#F97316',
};

interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  assignedTo?: string;
  lastMaintenance: string;
  nextMaintenance: string;
  purchaseDate: string;
  value: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  image: string;
}

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  date: string;
  type: 'routine' | 'repair' | 'inspection';
  description: string;
  cost: number;
  technician: string;
}

const mockEquipment: Equipment[] = [
  { id: 'eq1', name: 'Excavatrice CAT 320', category: 'Machinerie lourde', serialNumber: 'CAT320-2019-4521', status: 'in-use', location: 'Chantier Tremblay', assignedTo: 'Marc Dubois', lastMaintenance: '2024-11-15', nextMaintenance: '2024-12-15', purchaseDate: '2019-06-20', value: 185000, condition: 'good', image: 'ðŸšœ' },
  { id: 'eq2', name: 'Camion-benne 10 roues', category: 'VÃ©hicules', serialNumber: 'MACK-2021-7834', status: 'available', location: 'EntrepÃ´t principal', lastMaintenance: '2024-12-01', nextMaintenance: '2025-01-01', purchaseDate: '2021-03-15', value: 125000, condition: 'excellent', image: 'ðŸšš' },
  { id: 'eq3', name: 'Grue mobile 50T', category: 'Machinerie lourde', serialNumber: 'LIEBH-2020-3345', status: 'in-use', location: 'Chantier Plaza', assignedTo: 'Jean Gagnon', lastMaintenance: '2024-10-20', nextMaintenance: '2024-12-20', purchaseDate: '2020-08-10', value: 450000, condition: 'good', image: 'ðŸ—ï¸' },
  { id: 'eq4', name: 'GÃ©nÃ©ratrice 50kW', category: 'Ã‰lectrique', serialNumber: 'GEN-2022-1122', status: 'maintenance', location: 'Atelier', lastMaintenance: '2024-12-03', nextMaintenance: '2025-03-03', purchaseDate: '2022-01-25', value: 15000, condition: 'fair', image: 'âš¡' },
  { id: 'eq5', name: 'Compresseur 185 CFM', category: 'Pneumatique', serialNumber: 'COMP-2020-5566', status: 'available', location: 'EntrepÃ´t principal', lastMaintenance: '2024-11-28', nextMaintenance: '2025-02-28', purchaseDate: '2020-05-12', value: 8500, condition: 'good', image: 'ðŸ”§' },
  { id: 'eq6', name: 'Chargeuse sur pneus', category: 'Machinerie lourde', serialNumber: 'JD-2018-9988', status: 'retired', location: 'Ã€ vendre', lastMaintenance: '2024-06-15', nextMaintenance: '-', purchaseDate: '2018-02-20', value: 45000, condition: 'poor', image: 'ðŸšœ' },
];

const mockLogs: MaintenanceLog[] = [
  { id: 'log1', equipmentId: 'eq1', date: '2024-11-15', type: 'routine', description: 'Changement huile et filtres', cost: 850, technician: 'Atelier CAT' },
  { id: 'log2', equipmentId: 'eq4', date: '2024-12-03', type: 'repair', description: 'Remplacement alternateur', cost: 2200, technician: 'Ã‰lectro-Gen Inc.' },
  { id: 'log3', equipmentId: 'eq3', date: '2024-10-20', type: 'inspection', description: 'Inspection annuelle SAAQ', cost: 450, technician: 'Grue Inspect QC' },
];

const categories = ['Tous', 'Machinerie lourde', 'VÃ©hicules', 'Ã‰lectrique', 'Pneumatique', 'Outils'];

const StatusBadge = ({ status }: { status: Equipment['status'] }) => {
  const cfg: Record<string, { label: string; color: string; icon: string }> = {
    'available': { label: 'Disponible', color: colors.emerald, icon: 'âœ…' },
    'in-use': { label: 'En utilisation', color: colors.blue, icon: 'ðŸ”„' },
    'maintenance': { label: 'En maintenance', color: colors.orange, icon: 'ðŸ”§' },
    'retired': { label: 'RetirÃ©', color: colors.stone, icon: 'âŒ' },
  };
  const c = cfg[status];
  return <span style={{ padding: '4px 10px', background: `${c.color}20`, color: c.color, borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{c.icon} {c.label}</span>;
};

const ConditionBadge = ({ condition }: { condition: Equipment['condition'] }) => {
  const cfg: Record<string, { color: string }> = {
    'excellent': { color: colors.emerald },
    'good': { color: colors.turquoise },
    'fair': { color: colors.orange },
    'poor': { color: colors.red },
  };
  return <span style={{ padding: '2px 8px', background: `${cfg[condition].color}20`, color: cfg[condition].color, borderRadius: 6, fontSize: 10, textTransform: 'capitalize' }}>{condition}</span>;
};

const StatCard = ({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) => (
  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 20 }}>
    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
    <div style={{ color, fontSize: 28, fontWeight: 700 }}>{value}</div>
    <div style={{ color: colors.stone, fontSize: 12 }}>{label}</div>
  </div>
);

const EquipmentTracker: React.FC = () => {
  const [equipment, setEquipment] = useState(mockEquipment);
  const [logs] = useState(mockLogs);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = useMemo(() => {
    return equipment.filter(eq => {
      if (selectedCategory !== 'Tous' && eq.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && eq.status !== selectedStatus) return false;
      if (searchQuery && !eq.name.toLowerCase().includes(searchQuery.toLowerCase()) && !eq.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [equipment, selectedCategory, selectedStatus, searchQuery]);

  const stats = useMemo(() => ({
    total: equipment.length,
    available: equipment.filter(e => e.status === 'available').length,
    inUse: equipment.filter(e => e.status === 'in-use').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    totalValue: equipment.filter(e => e.status !== 'retired').reduce((sum, e) => sum + e.value, 0),
    needsMaintenance: equipment.filter(e => new Date(e.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && e.nextMaintenance !== '-').length,
  }), [equipment]);

  const formatCurrency = (n: number) => n.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 });

  return (
    <div style={{ minHeight: '100vh', background: colors.dark, color: colors.sand, fontFamily: 'Inter' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>ðŸšœ Ã‰quipements</h1>
          <p style={{ color: colors.stone, margin: '4px 0 0', fontSize: 13 }}>{stats.total} Ã©quipements â€¢ {formatCurrency(stats.totalValue)} valeur totale</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="ðŸ” Rechercher..." style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 10, color: colors.sand, width: 220 }} />
          <button style={{ padding: '10px 20px', background: colors.gold, border: 'none', borderRadius: 10, color: colors.dark, fontWeight: 600, cursor: 'pointer' }}>+ Ajouter Ã©quipement</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '24px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard icon="ðŸ“¦" value={stats.total} label="Total Ã©quipements" color={colors.sand} />
          <StatCard icon="âœ…" value={stats.available} label="Disponibles" color={colors.emerald} />
          <StatCard icon="ðŸ”„" value={stats.inUse} label="En utilisation" color={colors.blue} />
          <StatCard icon="ðŸ”§" value={stats.maintenance} label="En maintenance" color={colors.orange} />
          <StatCard icon="âš ï¸" value={stats.needsMaintenance} label="Maintenance bientÃ´t" color={stats.needsMaintenance > 0 ? colors.red : colors.emerald} />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand }}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: '10px 16px', background: colors.slate, border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.sand }}>
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="in-use">En utilisation</option>
            <option value="maintenance">En maintenance</option>
            <option value="retired">RetirÃ©</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: colors.slate, borderRadius: 8, padding: 4 }}>
            <button onClick={() => setView('grid')} style={{ padding: '8px 12px', background: view === 'grid' ? colors.gold : 'transparent', border: 'none', borderRadius: 6, color: view === 'grid' ? colors.dark : colors.sand, cursor: 'pointer' }}>â–¦</button>
            <button onClick={() => setView('list')} style={{ padding: '8px 12px', background: view === 'list' ? colors.gold : 'transparent', border: 'none', borderRadius: 6, color: view === 'list' ? colors.dark : colors.sand, cursor: 'pointer' }}>â‰¡</button>
          </div>
        </div>

        {/* Equipment Grid/List */}
        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {filteredEquipment.map(eq => (
              <div key={eq.id} onClick={() => setSelectedEquipment(eq)} style={{
                background: colors.card, border: `1px solid ${selectedEquipment?.id === eq.id ? colors.gold : colors.border}`,
                borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ fontSize: 40 }}>{eq.image}</div>
                  <StatusBadge status={eq.status} />
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 600 }}>{eq.name}</h3>
                <div style={{ color: colors.stone, fontSize: 12, marginBottom: 12 }}>{eq.serialNumber}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: colors.stone, fontSize: 13 }}>ðŸ“ {eq.location}</span>
                  <ConditionBadge condition={eq.condition} />
                </div>
                {eq.assignedTo && <div style={{ color: colors.turquoise, fontSize: 13 }}>ðŸ‘¤ {eq.assignedTo}</div>}
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: colors.stone }}>Prochaine maintenance</span>
                  <span style={{ color: new Date(eq.nextMaintenance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? colors.red : colors.sand }}>{eq.nextMaintenance}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: colors.slate }}>
                  <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>Ã‰QUIPEMENT</th>
                  <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>CATÃ‰GORIE</th>
                  <th style={{ padding: 14, textAlign: 'left', color: colors.stone, fontSize: 12 }}>LOCALISATION</th>
                  <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>STATUT</th>
                  <th style={{ padding: 14, textAlign: 'center', color: colors.stone, fontSize: 12 }}>CONDITION</th>
                  <th style={{ padding: 14, textAlign: 'right', color: colors.stone, fontSize: 12 }}>VALEUR</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map(eq => (
                  <tr key={eq.id} onClick={() => setSelectedEquipment(eq)} style={{ borderBottom: `1px solid ${colors.border}`, cursor: 'pointer' }}>
                    <td style={{ padding: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 24 }}>{eq.image}</span>
                        <div>
                          <div style={{ color: colors.sand, fontWeight: 500 }}>{eq.name}</div>
                          <div style={{ color: colors.stone, fontSize: 12 }}>{eq.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 14, color: colors.stone }}>{eq.category}</td>
                    <td style={{ padding: 14, color: colors.sand }}>{eq.location}</td>
                    <td style={{ padding: 14, textAlign: 'center' }}><StatusBadge status={eq.status} /></td>
                    <td style={{ padding: 14, textAlign: 'center' }}><ConditionBadge condition={eq.condition} /></td>
                    <td style={{ padding: 14, textAlign: 'right', color: colors.gold, fontWeight: 600 }}>{formatCurrency(eq.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedEquipment && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedEquipment(null)}>
          <div style={{ background: colors.dark, border: `1px solid ${colors.border}`, borderRadius: 16, width: 600, maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: 24, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontSize: 48 }}>{selectedEquipment.image}</span>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20 }}>{selectedEquipment.name}</h2>
                  <div style={{ color: colors.stone, fontSize: 13 }}>{selectedEquipment.serialNumber}</div>
                  <div style={{ marginTop: 8 }}><StatusBadge status={selectedEquipment.status} /></div>
                </div>
              </div>
              <button onClick={() => setSelectedEquipment(null)} style={{ background: 'none', border: 'none', color: colors.stone, fontSize: 24, cursor: 'pointer' }}>âœ•</button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div><span style={{ color: colors.stone, fontSize: 12 }}>CatÃ©gorie</span><div style={{ color: colors.sand }}>{selectedEquipment.category}</div></div>
                <div><span style={{ color: colors.stone, fontSize: 12 }}>Localisation</span><div style={{ color: colors.sand }}>{selectedEquipment.location}</div></div>
                <div><span style={{ color: colors.stone, fontSize: 12 }}>Condition</span><div><ConditionBadge condition={selectedEquipment.condition} /></div></div>
                <div><span style={{ color: colors.stone, fontSize: 12 }}>Valeur</span><div style={{ color: colors.gold, fontWeight: 600 }}>{formatCurrency(selectedEquipment.value)}</div></div>
                <div><span style={{ color: colors.stone, fontSize: 12 }}>Date d'achat</span><div style={{ color: colors.sand }}>{selectedEquipment.purchaseDate}</div></div>
                {selectedEquipment.assignedTo && <div><span style={{ color: colors.stone, fontSize: 12 }}>AssignÃ© Ã </span><div style={{ color: colors.turquoise }}>{selectedEquipment.assignedTo}</div></div>}
              </div>

              <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>ðŸ”§ Maintenance</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div><span style={{ color: colors.stone, fontSize: 12 }}>DerniÃ¨re</span><div>{selectedEquipment.lastMaintenance}</div></div>
                  <div><span style={{ color: colors.stone, fontSize: 12 }}>Prochaine</span><div style={{ color: new Date(selectedEquipment.nextMaintenance) <= new Date() ? colors.red : colors.sand }}>{selectedEquipment.nextMaintenance}</div></div>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>ðŸ“œ Historique maintenance</h4>
              {logs.filter(l => l.equipmentId === selectedEquipment.id).map(log => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <div>
                    <div style={{ color: colors.sand, fontSize: 14 }}>{log.description}</div>
                    <div style={{ color: colors.stone, fontSize: 12 }}>{log.date} â€¢ {log.technician}</div>
                  </div>
                  <div style={{ color: colors.gold, fontWeight: 500 }}>{formatCurrency(log.cost)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTracker;
