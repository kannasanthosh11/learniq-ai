import React, { useEffect, useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
} from '@xyflow/react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  Network,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  X,
  Target,
  Sparkles,
} from 'lucide-react';

// Custom Node Component for React Flow
const CustomConceptNode = ({ data, selected }) => {
  const isWeak = data.status === 'weak';
  const isMastered = data.status === 'mastered';
  const isLearning = data.status === 'learning';

  let statusBg = 'bg-slate-800 text-slate-400 border-slate-700';
  let statusIcon = '⚪';
  let statusText = 'Not Started';

  if (isMastered) {
    statusBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
    statusIcon = '🟢';
    statusText = 'Mastered';
  } else if (isLearning) {
    statusBg = 'bg-amber-950/80 text-amber-300 border-amber-500/50';
    statusIcon = '🟡';
    statusText = 'Learning';
  } else if (isWeak) {
    statusBg = 'bg-red-950/90 text-red-300 border-red-500/80 animate-pulse';
    statusIcon = '🔴';
    statusText = 'Weak';
  }

  return (
    <div
      className={`px-4 py-3 rounded-2xl bg-slate-900/95 border-2 min-w-[210px] shadow-2xl transition-all ${
        selected
          ? 'border-indigo-500 ring-4 ring-indigo-500/30'
          : isWeak
          ? 'border-red-500 shadow-red-950/50'
          : isMastered
          ? 'border-emerald-500/60'
          : 'border-slate-800'
      }`}
    >
      <Handle type="target" position={Position.Bottom} className="!bg-indigo-500" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold text-white tracking-tight truncate">
          {data.name}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusBg}`}>
          {statusIcon} {statusText}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-2xl font-black text-white">{data.masteryPercent}%</span>
        <span className="text-[10px] text-slate-400 font-mono">BKT Prior</span>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            isMastered ? 'bg-emerald-500' : isWeak ? 'bg-red-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${data.masteryPercent}%` }}
        />
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span>Level {data.difficulty || 2}</span>
        <span className="text-indigo-400 font-semibold">Click to inspect</span>
      </div>

      <Handle type="source" position={Position.Top} className="!bg-indigo-500" />
    </div>
  );
};

const nodeTypes = {
  conceptNode: CustomConceptNode,
};

export default function KnowledgeGraphPage() {
  const { user } = useAuth();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = user?._id || '6ab0e1e6738c04c7df5f20e4';

  const fetchGraph = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getGraph(studentId);
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
      if (data.nodes && data.nodes.length > 0) {
        // Default select Fractions or Linear Equations
        const defaultNode = data.nodes.find(n => n.data.slug === 'fractions') || data.nodes[0];
        setSelectedNode(defaultNode.data);
      }
    } catch (err) {
      console.error('Error loading graph:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [studentId]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium">
          Generating prerequisite knowledge DAG from MongoDB...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Prerequisite Knowledge Graph
          </h1>
          <p className="text-xs text-slate-400">
            Real-time Directed Acyclic Graph (DAG) powered by Bayesian Knowledge Tracing.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1 font-semibold text-emerald-300">
            <span>🟢</span> Mastered (≥75%)
          </span>
          <span className="flex items-center gap-1 font-semibold text-amber-300">
            <span>🟡</span> Learning (50–74%)
          </span>
          <span className="flex items-center gap-1 font-semibold text-red-300">
            <span>🔴</span> Weak (&lt;50%)
          </span>
        </div>
      </div>

      {/* Graph Area & Details Drawer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Canvas Container (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#090d16] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="!bg-slate-900 !border-slate-800 !text-white !fill-white" />
          </ReactFlow>

          <div className="absolute bottom-4 left-4 text-[11px] text-slate-500 pointer-events-none bg-slate-950/80 px-2 py-1 rounded border border-slate-900">
            Directed Flow: Foundational Bottom → Advanced Top. Animated Red Edges indicate active gap vulnerability.
          </div>
        </div>

        {/* Node Inspection Drawer (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl overflow-y-auto">
          {selectedNode ? (
            <div className="space-y-5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Concept Details
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">{selectedNode.name}</h3>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    selectedNode.status === 'mastered'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : selectedNode.status === 'weak'
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {selectedNode.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>

              {/* Mastery Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Mastery Probability</span>
                  <span className="text-xl font-black text-white">{selectedNode.masteryPercent}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Current Difficulty</span>
                  <span className="text-xl font-black text-indigo-400">Level {selectedNode.currentDifficulty || 2}</span>
                </div>
              </div>

              {/* Direct Prerequisites */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">Direct Prerequisites:</span>
                {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedNode.prerequisites.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        <span className="text-[10px] text-slate-400">Strength: {p.strength * 100}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">None (Foundational Root Skill)</span>
                )}
              </div>

              {/* Dependent Concepts */}
              <div>
                <span className="text-xs font-bold text-slate-300 block mb-2">Unlocks Dependent Concepts:</span>
                {selectedNode.dependents && selectedNode.dependents.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedNode.dependents.map((d) => (
                      <div
                        key={d.id}
                        className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 font-semibold"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">Terminal curriculum node</span>
                )}
              </div>

              {/* Recent Accuracy */}
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-slate-300">
                <span className="block font-bold text-indigo-300 mb-0.5">Recent Performance:</span>
                {selectedNode.recentAccuracy !== null ? (
                  <span>Recent Accuracy: {selectedNode.recentAccuracy}% ({selectedNode.totalAttempts} attempts logged)</span>
                ) : (
                  <span>No recent quiz attempts logged in session.</span>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={`/practice?concept=${selectedNode.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
                >
                  <Target className="h-4 w-4" />
                  <span>Practice {selectedNode.name}</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Click any concept node to inspect prerequisite dependencies and BKT parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
