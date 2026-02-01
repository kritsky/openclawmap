import { useState, useRef, useCallback, useEffect } from 'react'

/* ── Data ────────────────────────────────────────────────── */

const concepts = {
  gateway: {
    title: 'GATEWAY',
    icon: '🦞',
    color: '#ff6b00',
    desc: 'Central entry point — routes every request through the OpenClaw system.',
    points: ['HTTP / WebSocket endpoint', 'Auth & rate-limit middleware', 'Request normalization'],
    tier: 'CORE',
  },
  router: {
    title: 'ROUTER',
    icon: '🔀',
    color: '#00e5ff',
    desc: 'Intelligent request router — selects the optimal processing pipeline.',
    points: ['Intent classification', 'Model selection logic', 'Fallback chains'],
    tier: 'PROC',
  },
  llm: {
    title: 'LLM PROVIDER',
    icon: '🧠',
    color: '#a855f7',
    desc: 'Abstraction layer over multiple LLM backends.',
    points: ['OpenAI / Anthropic / local models', 'Streaming support', 'Token accounting'],
    tier: 'EXEC',
  },
  memory: {
    title: 'MEMORY',
    icon: '💾',
    color: '#22c55e',
    desc: 'Conversation context & long-term knowledge store.',
    points: ['Short-term chat buffer', 'Vector embeddings (RAG)', 'Persistent user prefs'],
    tier: 'DATA',
  },
  tools: {
    title: 'TOOLS',
    icon: '🔧',
    color: '#eab308',
    desc: 'Plugin system for executing real-world actions.',
    points: ['Web search', 'Code execution sandbox', 'File I/O helpers'],
    tier: 'EXEC',
  },
  auth: {
    title: 'AUTH',
    icon: '🔐',
    color: '#ef4444',
    desc: 'Authentication & authorization layer.',
    points: ['API key management', 'JWT / session tokens', 'Role-based access'],
    tier: 'PROC',
  },
  config: {
    title: 'CONFIG',
    icon: '⚙️',
    color: '#64748b',
    desc: 'Runtime configuration & feature flags.',
    points: ['Model parameters', 'System prompts', 'Rate limit rules'],
    tier: 'DATA',
  },
  input: {
    title: 'USER INPUT',
    icon: '💬',
    color: '#06b6d4',
    desc: 'Front-end interface capturing user messages.',
    points: ['Text / voice / image input', 'Markdown rendering', 'Streaming output display'],
    tier: 'INPUT',
  },
}

const layout = {
  input:   { x: 100, y: 100 },
  auth:    { x: 350, y: 60  },
  gateway: { x: 350, y: 260 },
  config:  { x: 100, y: 400 },
  router:  { x: 600, y: 260 },
  memory:  { x: 600, y: 450 },
  llm:     { x: 850, y: 160 },
  tools:   { x: 850, y: 370 },
}

const links = [
  ['input', 'gateway'],
  ['auth', 'gateway'],
  ['gateway', 'router'],
  ['router', 'llm'],
  ['router', 'tools'],
  ['router', 'memory'],
  ['config', 'gateway'],
  ['memory', 'llm'],
]

const tierColors = {
  CORE: '#ff6b00',
  INPUT: '#06b6d4',
  PROC: '#00e5ff',
  DATA: '#22c55e',
  EXEC: '#a855f7',
}

/* ── Helpers ─────────────────────────────────────────────── */

const NODE_W = 160
const NODE_H = 64

function center(id, positions) {
  const p = positions[id]
  return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 }
}

/* ── Components ──────────────────────────────────────────── */

function Link({ from, to, positions }) {
  const a = center(from, positions)
  const b = center(to, positions)
  const mx = (a.x + b.x) / 2
  return (
    <g>
      <path
        d={`M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`}
        fill="none"
        stroke="rgba(0,229,255,0.15)"
        strokeWidth={2}
      />
      <path
        d={`M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`}
        fill="none"
        stroke="rgba(0,229,255,0.5)"
        strokeWidth={1.5}
        className="link-animated"
      />
    </g>
  )
}

function Node({ id, data, pos, onSelect, selected }) {
  const [dragging, setDragging] = useState(false)
  const offset = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback((e) => {
    e.stopPropagation()
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    setDragging(true)
    e.target.setPointerCapture(e.pointerId)
  }, [pos])

  const handlePointerMove = useCallback((e) => {
    if (!dragging) return
    const newX = e.clientX - offset.current.x
    const newY = e.clientY - offset.current.y
    onSelect(id, 'move', { x: newX, y: newY })
  }, [dragging, id, onSelect])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  const handleClick = useCallback((e) => {
    if (!dragging) {
      e.stopPropagation()
      onSelect(id, 'click')
    }
  }, [dragging, id, onSelect])

  const isSelected = selected === id

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      style={{ cursor: dragging ? 'grabbing' : 'pointer' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      className="node-glow"
    >
      <rect
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(18,18,26,0.9)'}
        stroke={data.color}
        strokeWidth={isSelected ? 2 : 1}
        style={{ '--glow-color': data.color }}
      />
      <text
        x={14}
        y={28}
        fontSize={18}
        fill="white"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.icon}
      </text>
      <text
        x={40}
        y={30}
        fontFamily="Orbitron, sans-serif"
        fontWeight={700}
        fontSize={11}
        fill={data.color}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.title}
      </text>
      <text
        x={14}
        y={50}
        fontFamily="JetBrains Mono, monospace"
        fontSize={9}
        fill="rgba(255,255,255,0.4)"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {data.tier}
      </text>
    </g>
  )
}

function DetailPanel({ id, data, onClose }) {
  if (!data) return null
  return (
    <div className="slide-in fixed top-4 right-4 w-80 rounded-xl border border-white/10 bg-[#12121a]/95 backdrop-blur-lg p-5 shadow-2xl z-50">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white/40 hover:text-white text-lg leading-none"
      >
        &times;
      </button>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{data.icon}</span>
        <div>
          <h2
            className="font-bold text-sm tracking-wider"
            style={{ fontFamily: 'Orbitron, sans-serif', color: data.color }}
          >
            {data.title}
          </h2>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ background: tierColors[data.tier] + '22', color: tierColors[data.tier] }}
          >
            {data.tier}
          </span>
        </div>
      </div>
      <p className="text-xs text-white/60 mb-4 leading-relaxed">{data.desc}</p>
      <ul className="space-y-2">
        {data.points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-white/80">
            <span style={{ color: data.color }}>&#9654;</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── App ─────────────────────────────────────────────────── */

export default function App() {
  const [positions, setPositions] = useState(layout)
  const [selected, setSelected] = useState(null)

  const handleNodeAction = useCallback((id, action, payload) => {
    if (action === 'move') {
      setPositions((prev) => ({ ...prev, [id]: payload }))
    } else if (action === 'click') {
      setSelected((prev) => (prev === id ? null : id))
    }
  }, [])

  const handleBgClick = useCallback(() => setSelected(null), [])

  /* keyboard shortcut: Escape closes panel */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="grid-bg relative w-screen h-screen overflow-hidden select-none">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-3 bg-[#0a0a0f]/80 backdrop-blur border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦞</span>
          <h1
            className="text-sm font-bold tracking-widest"
            style={{ fontFamily: 'Orbitron, sans-serif', color: '#ff6b00' }}
          >
            OPENCLAW MAP
          </h1>
        </div>
        <span className="text-[10px] text-white/30 hidden sm:block" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          drag nodes &middot; click for details &middot; esc to close
        </span>
      </header>

      {/* Canvas */}
      <svg
        width="100%"
        height="100%"
        className="pt-12"
        onClick={handleBgClick}
      >
        {/* Links */}
        {links.map(([from, to]) => (
          <Link key={`${from}-${to}`} from={from} to={to} positions={positions} />
        ))}

        {/* Nodes */}
        {Object.entries(concepts).map(([id, data]) => (
          <Node
            key={id}
            id={id}
            data={data}
            pos={positions[id]}
            onSelect={handleNodeAction}
            selected={selected}
          />
        ))}
      </svg>

      {/* Detail Panel */}
      {selected && (
        <DetailPanel
          id={selected}
          data={concepts[selected]}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Legend */}
      <div className="fixed bottom-4 left-4 flex flex-wrap gap-3 text-[10px] z-40">
        {Object.entries(tierColors).map(([tier, color]) => (
          <span key={tier} className="flex items-center gap-1.5 opacity-50">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {tier}
          </span>
        ))}
      </div>
    </div>
  )
}
