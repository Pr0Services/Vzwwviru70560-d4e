/**
 * CHE·NU Cross-Sphere UI Components — CANONICAL
 * Version: 1.0
 * Status: PRODUCTION READY
 * 
 * React components for cross-sphere interactions with:
 * - Human approval dialogs (explicit)
 * - Content preview before publishing
 * - Undo buttons (reversibility)
 * - Audit trail display (transparency)
 * 
 * CRITICAL: No automation. Every action requires explicit human click.
 * 
 * Author: CHE·NU Project
 * Date: 21 December 2025
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, X, Undo, Eye, Send, Trash2 } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

interface CrossSphereRequest {
  id: string;
  connection_type: string;
  source_sphere: string;
  target_sphere: string;
  action_type: string;
  status: string;
  requested_by: string;
  requested_at: string;
  action_details: Record<string, any>;
}

interface StagedContent {
  id: string;
  status: string;
  source_sphere: string;
  content_type: string;
  prepared_content: Record<string, any>;
  preview_url?: string;
  requires_validation: boolean;
  prepared_at: string;
}

interface CrossSphereAction {
  id: string;
  action_type: string;
  performed_by: string;
  source_sphere: string;
  target_sphere: string;
  timestamp: string;
  is_reversible: boolean;
  undo_performed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════
// 1. CREATE SOCIAL PAGE CONFIRMATION DIALOG
// ═══════════════════════════════════════════════════════════════════════

export const CreateSocialPageDialog: React.FC<{
  groupName: string;
  groupDescription: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}> = ({ groupName, groupDescription, onConfirm, onCancel, isOpen }) => {
  const [loading, setLoading] = useState(false);
  const [reasoning, setReasoning] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    // CANONICAL: Explicit human confirmation required
    if (!confirm(
      `⚠️ HUMAN CONFIRMATION REQUIRED\n\n` +
      `You are about to create a public social page for "${groupName}".\n\n` +
      `This action will:\n` +
      `• Create a public page visible to everyone\n` +
      `• Link your community group to Social & Media sphere\n` +
      `• Allow non-members to discover your group\n\n` +
      `This action is REVERSIBLE (you can undo it).\n\n` +
      `Proceed?`
    )) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold">Create Public Social Page?</h2>
        </div>

        {/* Preview */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">Preview</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Page Name:</span>
              <p className="font-medium">{groupName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Description:</span>
              <p className="text-gray-800">{groupDescription}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Visibility:</span>
              <p className="font-medium text-green-600">Public (everyone can see)</p>
            </div>
          </div>
        </div>

        {/* What will happen */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">What will happen:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>✅ Page created in Social & Media sphere</li>
            <li>✅ Link established: Community → Social</li>
            <li>✅ You can share events on this page (with approval per-event)</li>
            <li>✅ Non-members can discover and request to join</li>
            <li>✅ You can undo this at any time</li>
          </ul>
        </div>

        {/* Reasoning (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why create this page? (optional)
          </label>
          <textarea
            className="w-full border rounded-lg p-3 text-sm"
            rows={3}
            placeholder="E.g., Want to reach more cyclists in Montreal..."
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
          />
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Human action required:</strong> This creates a connection between
            Community and Social & Media spheres. You are making this decision explicitly.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Creating...
              </>
            ) : (
              <>
                <Check size={16} />
                Create Social Page
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 2. STAGED CONTENT REVIEW & PUBLISH
// ═══════════════════════════════════════════════════════════════════════

export const StagedContentReview: React.FC<{
  staged: StagedContent;
  onPublish: (notes?: string) => Promise<void>;
  onModify: (newContent: Record<string, any>) => Promise<void>;
  onReject: (reason: string) => Promise<void>;
}> = ({ staged, onPublish, onModify, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(staged.prepared_content);

  const handlePublish = async () => {
    // CANONICAL: Explicit confirmation
    if (!confirm(
      `⚠️ PUBLISH CONFIRMATION\n\n` +
      `You are about to publish this content publicly.\n\n` +
      `Source: ${staged.source_sphere}\n` +
      `Type: ${staged.content_type}\n\n` +
      `This action is REVERSIBLE (you can undo).\n\n` +
      `Publish now?`
    )) {
      return;
    }

    setLoading(true);
    try {
      await onPublish(notes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg shadow-lg bg-white p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Review Content Before Publishing</h2>
          <p className="text-sm text-gray-600">
            From {staged.source_sphere} • {staged.content_type}
          </p>
        </div>
        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          {staged.status}
        </div>
      </div>

      {/* Content Preview */}
      <div className="border rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={20} />
          <h3 className="font-semibold">Preview (as it will appear)</h3>
        </div>
        
        {!editing ? (
          <div className="space-y-2">
            {Object.entries(staged.prepared_content).map(([key, value]) => (
              <div key={key}>
                <span className="text-sm text-gray-600 capitalize">{key}:</span>
                <p className="font-medium">{String(value)}</p>
              </div>
            ))}
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline mt-2"
            >
              Edit content
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              className="w-full border rounded-lg p-3"
              rows={6}
              value={JSON.stringify(editedContent, null, 2)}
              onChange={(e) => {
                try {
                  setEditedContent(JSON.parse(e.target.value));
                } catch {}
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await onModify(editedContent);
                  setEditing(false);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setEditedContent(staged.prepared_content);
                  setEditing(false);
                }}
                className="px-3 py-1 border rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Validation Notes */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Validation Notes (optional)
        </label>
        <textarea
          className="w-full border rounded-lg p-3 text-sm"
          rows={2}
          placeholder="Add any notes about this publication..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Warning */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          ℹ️ <strong>Human validation required:</strong> Review the content carefully.
          Once published, it will be visible publicly. You can undo if needed.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => {
            const reason = prompt('Why reject this content?');
            if (reason) onReject(reason);
          }}
          disabled={loading}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center gap-2"
        >
          <X size={16} />
          Reject
        </button>
        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Publishing...
            </>
          ) : (
            <>
              <Send size={16} />
              Publish Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 3. UNDO BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export const UndoActionButton: React.FC<{
  action: CrossSphereAction;
  onUndo: (actionId: string, reasoning: string) => Promise<void>;
}> = ({ action, onUndo }) => {
  const [loading, setLoading] = useState(false);

  const handleUndo = async () => {
    // CANONICAL: Explicit confirmation with reasoning
    const reasoning = prompt(
      `⚠️ UNDO ACTION\n\n` +
      `You are about to undo: ${action.action_type}\n` +
      `From: ${action.source_sphere} → ${action.target_sphere}\n\n` +
      `Why do you want to undo this action?\n` +
      `(This will be logged in the audit trail)`
    );

    if (!reasoning || reasoning.trim().length === 0) {
      alert('Reasoning required to undo action');
      return;
    }

    if (!confirm(
      `Confirm undo?\n\n` +
      `This will reverse the action and log your reasoning.\n\n` +
      `Proceed?`
    )) {
      return;
    }

    setLoading(true);
    try {
      await onUndo(action.id, reasoning);
    } finally {
      setLoading(false);
    }
  };

  if (action.undo_performed) {
    return (
      <span className="text-sm text-gray-500 italic">
        Already undone
      </span>
    );
  }

  if (!action.is_reversible) {
    return (
      <span className="text-sm text-gray-500 italic">
        Not reversible
      </span>
    );
  }

  return (
    <button
      onClick={handleUndo}
      disabled={loading}
      className="px-3 py-1 border border-orange-300 text-orange-600 rounded hover:bg-orange-50 disabled:opacity-50 flex items-center gap-2 text-sm"
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span>
          Undoing...
        </>
      ) : (
        <>
          <Undo size={14} />
          Undo Action
        </>
      )}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 4. AUDIT TRAIL DISPLAY
// ═══════════════════════════════════════════════════════════════════════

export const AuditTrailDisplay: React.FC<{
  actions: CrossSphereAction[];
  onUndo?: (actionId: string, reasoning: string) => Promise<void>;
}> = ({ actions, onUndo }) => {
  return (
    <div className="border rounded-lg bg-white shadow-lg">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold">Cross-Sphere Audit Trail</h2>
        <p className="text-sm text-gray-600">
          Complete history of cross-sphere actions (who, what, when, where)
        </p>
      </div>

      <div className="divide-y">
        {actions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No cross-sphere actions yet
          </div>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {action.action_type}
                    </span>
                    {action.undo_performed && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        Undone
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="text-gray-600">Route:</span>{' '}
                      <span className="font-medium">
                        {action.source_sphere} → {action.target_sphere}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">By:</span>{' '}
                      <span className="font-medium">{action.performed_by}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">When:</span>{' '}
                      <span className="text-gray-700">
                        {new Date(action.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {onUndo && (
                  <div>
                    <UndoActionButton action={action} onUndo={onUndo} />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// 5. PENDING REQUESTS LIST
// ═══════════════════════════════════════════════════════════════════════

export const PendingRequestsList: React.FC<{
  requests: CrossSphereRequest[];
  onApprove: (requestId: string, notes?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
}> = ({ requests, onApprove, onReject }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (request: CrossSphereRequest) => {
    const notes = prompt(
      `Approve request?\n\n` +
      `Action: ${request.action_type}\n` +
      `From: ${request.source_sphere} → ${request.target_sphere}\n\n` +
      `Optional notes:`
    );

    if (notes === null) return; // Cancelled

    if (!confirm(`Confirm approval? This action will be executed.`)) {
      return;
    }

    setLoading(request.id);
    try {
      await onApprove(request.id, notes || undefined);
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (request: CrossSphereRequest) => {
    const reason = prompt(
      `Reject request?\n\n` +
      `Action: ${request.action_type}\n\n` +
      `Reason for rejection (required):`
    );

    if (!reason || reason.trim().length === 0) {
      alert('Reason required to reject');
      return;
    }

    setLoading(request.id);
    try {
      await onReject(request.id, reason);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="border rounded-lg bg-white shadow-lg">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold">Pending Cross-Sphere Requests</h2>
        <p className="text-sm text-gray-600">
          Requests waiting for human approval
        </p>
      </div>

      <div className="divide-y">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No pending requests
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-semibold mb-1">{request.action_type}</div>
                  <div className="text-sm space-y-1 text-gray-600">
                    <div>
                      {request.source_sphere} → {request.target_sphere}
                    </div>
                    <div>
                      Requested: {new Date(request.requested_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(request)}
                    disabled={loading === request.id}
                    className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 text-sm"
                  >
                    <X size={14} className="inline mr-1" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(request)}
                    disabled={loading === request.id}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                  >
                    {loading === request.id ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <>
                        <Check size={14} className="inline mr-1" />
                        Approve
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

export default {
  CreateSocialPageDialog,
  StagedContentReview,
  UndoActionButton,
  AuditTrailDisplay,
  PendingRequestsList,
};
