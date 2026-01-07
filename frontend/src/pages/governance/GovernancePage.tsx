/**
 * CHE·NU™ — Governance Page
 * Checkpoints, approvals, and elevation requests management
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Clock,
  Filter, Search, TrendingUp, History
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, Button, Badge, Modal, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import {
  CheckpointCard, CheckpointList, ElevationRequestCard,
  GovernanceStats, RiskLevelBadge
} from '@/components/governance'
import { mockCheckpoints, mockElevationRequests, mockGovernanceStats } from '@/mocks/data'
import type { Checkpoint, ElevationRequest, RiskLevel } from '@/components/governance'

export default function GovernancePage() {
  const [checkpoints, setCheckpoints] = useState(mockCheckpoints)
  const [elevations, setElevations] = useState(mockElevationRequests)
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Calculate stats
  const stats = {
    pending: checkpoints.filter(c => c.status === 'pending').length,
    approved: checkpoints.filter(c => c.status === 'approved').length,
    rejected: checkpoints.filter(c => c.status === 'rejected').length,
    criticalPending: checkpoints.filter(c => c.status === 'pending' && c.riskLevel === 'critical').length,
  }

  // Filter checkpoints
  const pendingCheckpoints = checkpoints.filter(c => {
    const matchesStatus = c.status === 'pending'
    const matchesRisk = filterRisk === 'all' || c.riskLevel === filterRisk
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agentName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesRisk && matchesSearch
  })

  const historyCheckpoints = checkpoints.filter(c => c.status !== 'pending').slice(0, 10)

  // Handlers
  const handleApprove = (checkpoint: Checkpoint, reason?: string) => {
    setCheckpoints(checkpoints.map(c =>
      c.id === checkpoint.id
        ? { ...c, status: 'approved' as const, resolvedAt: new Date().toISOString(), resolvedBy: 'user', reason }
        : c
    ))
  }

  const handleReject = (checkpoint: Checkpoint, reason?: string) => {
    setCheckpoints(checkpoints.map(c =>
      c.id === checkpoint.id
        ? { ...c, status: 'rejected' as const, resolvedAt: new Date().toISOString(), resolvedBy: 'user', reason }
        : c
    ))
  }

  const handleGrantElevation = (elevation: ElevationRequest) => {
    setElevations(elevations.map(e =>
      e.id === elevation.id ? { ...e, status: 'approved' as const } : e
    ))
  }

  const handleDenyElevation = (elevation: ElevationRequest) => {
    setElevations(elevations.map(e =>
      e.id === elevation.id ? { ...e, status: 'rejected' as const } : e
    ))
  }

  const pendingElevations = elevations.filter(e => e.status === 'pending')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Governance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and approve agent actions
          </p>
        </div>
        {stats.criticalPending > 0 && (
          <Badge variant="danger" className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {stats.criticalPending} Critical Pending
          </Badge>
        )}
      </div>

      {/* Stats */}
      <GovernanceStats stats={stats} />

      {/* Main Content */}
      <Tabs defaultValue="checkpoints">
        <TabsList>
          <TabsTrigger value="checkpoints" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Checkpoints
            {stats.pending > 0 && <Badge variant="danger" size="sm">{stats.pending}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="elevations" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Elevations
            {pendingElevations.length > 0 && <Badge variant="warning" size="sm">{pendingElevations.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Checkpoints Tab */}
        <TabsContent value="checkpoints" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search checkpoints..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Risk Level:</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(risk => (
                  <button
                    key={risk}
                    onClick={() => setFilterRisk(risk)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors',
                      filterRisk === risk
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                    )}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Checkpoints */}
          {pendingCheckpoints.length > 0 ? (
            <div className="space-y-4">
              {pendingCheckpoints.map((checkpoint, i) => (
                <motion.div
                  key={checkpoint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <CheckpointCard
                    checkpoint={checkpoint}
                    onApprove={(reason) => handleApprove(checkpoint, reason)}
                    onReject={(reason) => handleReject(checkpoint, reason)}
                    onShowDetails={() => {
                      setSelectedCheckpoint(checkpoint)
                      setShowDetailModal(true)
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500">
                No pending checkpoints to review right now.
              </p>
            </Card>
          )}

          {/* Quick Actions */}
          {pendingCheckpoints.length > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Bulk Actions</h4>
                  <p className="text-sm text-gray-500">
                    {pendingCheckpoints.filter(c => c.riskLevel === 'low' || c.riskLevel === 'minimal').length} low-risk items can be auto-approved
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      pendingCheckpoints
                        .filter(c => c.riskLevel === 'low' || c.riskLevel === 'minimal')
                        .forEach(c => handleApprove(c, 'Bulk approved (low risk)'))
                    }}
                  >
                    Approve Low-Risk
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Elevations Tab */}
        <TabsContent value="elevations" className="space-y-4">
          {pendingElevations.length > 0 ? (
            pendingElevations.map((elevation, i) => (
              <motion.div
                key={elevation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ElevationRequestCard
                  request={elevation}
                  onGrant={() => handleGrantElevation(elevation)}
                  onDeny={() => handleDenyElevation(elevation)}
                />
              </motion.div>
            ))
          ) : (
            <Card className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No elevation requests
              </h3>
              <p className="text-gray-500">
                Agents haven't requested any scope or budget increases.
              </p>
            </Card>
          )}

          {/* Info Card */}
          <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">About Elevations</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Agents may request elevated permissions to perform tasks outside their current scope.
                  Review these requests carefully - elevated access means higher costs and broader capabilities.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="divide-y divide-gray-200 dark:divide-gray-700">
            {historyCheckpoints.map((checkpoint, i) => (
              <motion.div
                key={checkpoint.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {checkpoint.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{checkpoint.title}</p>
                    <p className="text-sm text-gray-500">{checkpoint.agentName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RiskLevelBadge level={checkpoint.riskLevel} size="sm" />
                  <Badge variant={checkpoint.status === 'approved' ? 'success' : 'danger'}>
                    {checkpoint.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {checkpoint.resolvedAt && new Date(checkpoint.resolvedAt).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </Card>

          {historyCheckpoints.length === 0 && (
            <Card className="p-12 text-center">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No history yet
              </h3>
              <p className="text-gray-500">
                Your approval history will appear here.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Modal
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedCheckpoint(null)
        }}
        title="Checkpoint Details"
        size="md"
      >
        {selectedCheckpoint && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{selectedCheckpoint.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedCheckpoint.description}</p>
              </div>
              <RiskLevelBadge level={selectedCheckpoint.riskLevel} />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div>
                <p className="text-xs text-gray-500 uppercase">Agent</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedCheckpoint.agentName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Sphere</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedCheckpoint.sphereId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Created</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(selectedCheckpoint.createdAt).toLocaleString()}
                </p>
              </div>
              {selectedCheckpoint.expiresAt && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Expires</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedCheckpoint.expiresAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {selectedCheckpoint.details && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs text-gray-500 uppercase mb-2">Details</p>
                <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {JSON.stringify(selectedCheckpoint.details, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="danger"
                onClick={() => {
                  handleReject(selectedCheckpoint)
                  setShowDetailModal(false)
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleApprove(selectedCheckpoint)
                  setShowDetailModal(false)
                }}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
