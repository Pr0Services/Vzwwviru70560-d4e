/**
 * CHE·NU Relations Explorer
 */

import React, { useState, useMemo } from 'react';
import { CrossDatasetRelation, GlobalMemoryEntry } from './types';

interface Props {
  relations: CrossDatasetRelation[];
  memoryMap: GlobalMemoryEntry[];
}

export const RelationsExplorer: React.FC<Props> = ({ relations, memoryMap }) => {
  const [search, setSearch] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const filteredRelations = useMemo(() => {
    if (!search) return relations;
    const term = search.toLowerCase();
    return relations.filter(
      r => r.source_global_id.toLowerCase().includes(term) ||
           r.target_global_id.toLowerCase().includes(term)
    );
  }, [relations, search]);

  const nodeDetails = useMemo(() => {
    if (!selectedNode) return null;
    return memoryMap.find(m => m.global_id === selectedNode);
  }, [selectedNode, memoryMap]);

  const nodeRelations = useMemo(() => {
    if (!selectedNode) return { outgoing: [], incoming: [] };
    return {
      outgoing: relations.filter(r => r.source_global_id === selectedNode),
      incoming: relations.filter(r => r.target_global_id === selectedNode),
    };
  }, [selectedNode, relations]);

  const handleExport = () => {
    const data = JSON.stringify(filteredRelations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cross_dataset_relations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Relations Explorer</h2>
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Export JSON
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by global_id..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Relations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cross-Dataset Relations ({filteredRelations.length})
            </p>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {filteredRelations.map((rel, i) => (
              <div
                key={i}
                className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm"
              >
                <button
                  onClick={() => setSelectedNode(rel.source_global_id)}
                  className="font-mono text-blue-600 dark:text-blue-400 hover:underline text-left"
                >
                  {rel.source_global_id}
                </button>
                <span className="mx-2 text-gray-400">→</span>
                <button
                  onClick={() => setSelectedNode(rel.target_global_id)}
                  className="font-mono text-blue-600 dark:text-blue-400 hover:underline text-left"
                >
                  {rel.target_global_id}
                </button>
                <span className="ml-2 text-xs text-gray-500">({rel.relation_type})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Node Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Node Details</p>
          </div>
          {selectedNode && nodeDetails ? (
            <div className="p-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Global ID</p>
                <p className="font-mono text-sm text-gray-900 dark:text-white">{nodeDetails.global_id}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Category</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{nodeDetails.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Sphere</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{nodeDetails.sphere}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {nodeDetails.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Outgoing ({nodeRelations.outgoing.length})</p>
                <ul className="mt-1 text-sm space-y-1">
                  {nodeRelations.outgoing.slice(0, 5).map((r, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                      → {r.target_global_id}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Incoming ({nodeRelations.incoming.length})</p>
                <ul className="mt-1 text-sm space-y-1">
                  {nodeRelations.incoming.slice(0, 5).map((r, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                      ← {r.source_global_id}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Select a node to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationsExplorer;
