import React, { useState } from 'react'

// ─── Placeholder Data ──────────────────────────────────────────────────────

const SLABS = [
  { id: 1, name: 'Charizard Base Set', set: 'Base Set', year: 1999, grade: 9, grader: 'PSA', value: 8500, variant: 'Holo Rare' },
  { id: 2, name: 'Blastoise Base Set', set: 'Base Set', year: 1999, grade: 8, grader: 'PSA', value: 1200, variant: 'Holo Rare' },
  { id: 3, name: 'Venusaur Base Set', set: 'Base Set', year: 1999, grade: 9, grader: 'BGS', value: 950, variant: 'Holo Rare' },
  { id: 4, name: 'Pikachu Illustrator', set: 'Promo', year: 1998, grade: 9, grader: 'PSA', value: 250000, variant: 'Promo' },
  { id: 5, name: 'Mewtwo Base Set', set: 'Base Set', year: 1999, grade: 10, grader: 'CGC', value: 3200, variant: 'Holo Rare' },
  { id: 6, name: 'Lugia Neo Genesis', set: 'Neo Genesis', year: 2000, grade: 8, grader: 'BGS', value: 4500, variant: 'Holo Rare' },
]

const TAG_ORDERS = [
  { id: 1, name: 'Umbreon Gold Star', set: 'POP Series 5', submitted: '2024-01-15', status: 'Grading', estReturn: '2024-03-15', grade: null },
  { id: 2, name: 'Espeon Gold Star', set: 'POP Series 5', submitted: '2024-01-15', status: 'Received', estReturn: '2024-03-15', grade: null },
  { id: 3, name: 'Rayquaza Gold Star', set: 'Team Rocket Returns', submitted: '2023-12-01', status: 'Returned', estReturn: '2024-02-01', grade: 10 },
]

const RAWS = [
  { id: 1, name: 'Dark Charizard', set: 'Team Rocket', year: 2000, condition: 'NM', value: 180, variant: 'Holo Rare' },
  { id: 2, name: 'Shining Magikarp', set: 'Neo Revelation', year: 2001, condition: 'EX', value: 120, variant: 'Shining' },
  { id: 3, name: 'Crystal Charizard', set: 'Aquapolis', year: 2003, condition: 'NM', value: 450, variant: 'Crystal' },
  { id: 4, name: 'Tropical Wind', set: 'Promo', year: 1999, condition: 'LP', value: 8500, variant: 'Trophy' },
]

const WISHLIST = [
  { id: 1, name: 'Charizard 1st Edition', set: 'Base Set', grader: 'PSA', targetGrade: 10, estPrice: 400000, priority: 'High', ebaySearch: 'PSA 10 Charizard 1st Edition Base Set' },
  { id: 2, name: 'Kangaskhan Family Event', set: 'Promo', grader: 'PSA', targetGrade: 9, estPrice: 25000, priority: 'Medium', ebaySearch: 'PSA 9 Kangaskhan Family Event Trophy' },
  { id: 3, name: 'Tropical Mega Battle', set: 'Promo', grader: 'PSA', targetGrade: 8, estPrice: 12000, priority: 'Low', ebaySearch: 'PSA 8 Tropical Mega Battle Trophy' },
]

const GOALS = [
  { id: 1, title: 'Complete Base Set Shadowless PSA 9+', progress: 14, total: 102, category: 'Set Completion' },
  { id: 2, title: 'All Gold Stars PSA 10', progress: 3, total: 27, category: 'Grade Goals' },
  { id: 3, title: 'Vintage Trophy Cards Collection', progress: 2, total: 8, category: 'Trophy Cards' },
  { id: 4, title: 'Reach $500k Portfolio Value', progress: 268450, total: 500000, category: 'Value Goals', isCurrency: true },
]

// ─── Style Constants ────────────────────────────────────────────────────────

const GRADER_COLORS = {
  PSA: '#0070cc',
  BGS: '#b8860b',
  CGC: '#6a0dad',
  TAG: '#00aa66',
  SGC: '#cc2200',
}

const gradeColor = (g) => {
  if (g === 10) return '#ffd700'
  if (g >= 9)   return '#00cc66'
  if (g >= 8)   return '#66aaff'
  if (g >= 7)   return '#ffaa00'
  return '#ff4444'
}

const CONDITION_COLORS = {
  M:  '#ffd700',
  NM: '#00cc66',
  EX: '#66aaff',
  VG: '#ffaa00',
  LP: '#ff8800',
  PL: '#ff4444',
  P:  '#880000',
}

const PRIORITY_COLORS = {
  High:   '#ff4444',
  Medium: '#ffaa00',
  Low:    '#66aaff',
}

const STATUS_COLORS = {
  Received: '#66aaff',
  Grading:  '#ffaa00',
  QC:       '#ff8800',
  Shipped:  '#00cc66',
  Returned: '#ffd700',
}

// ─── SVG Icons ──────────────────────────────────────────────────────────────

const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Slabs: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  TAG: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Raws: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="18" rx="2" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="11" x2="15" y2="11" />
    </svg>
  ),
  Wishlist: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  Goals: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
}

// ─── Shared Components ──────────────────────────────────────────────────────

function CardThumb({ name, grader, grade, condition }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const barColor = grader
    ? (GRADER_COLORS[grader] || '#555')
    : (CONDITION_COLORS[condition] || '#555')
  const barLabel = grader ? `${grader} ${grade ?? '?'}` : (condition || '?')

  return (
    <div style={{
      width: 52,
      height: 68,
      borderRadius: 6,
      background: '#1a1a2e',
      border: '1px solid #252540',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        fontWeight: 700,
        color: '#ccc',
        letterSpacing: 1,
      }}>
        {initials}
      </div>
      <div style={{
        background: barColor,
        padding: '2px 4px',
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: 0.5,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {barLabel}
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#111120',
      border: '1px solid #1e1e32',
      borderRadius: 10,
      padding: '14px 18px',
    }}>
      <div style={{ fontSize: 11, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#444', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function FilterBar({ filters, active, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            border: `1px solid ${active === f ? '#5555ee' : '#252535'}`,
            background: active === f ? '#5555ee22' : 'transparent',
            color: active === f ? '#aaaaff' : '#555',
            cursor: 'pointer',
            fontSize: 12,
            transition: 'all 0.15s',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

function SortBtn({ label, active, dir, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: 6,
        border: `1px solid ${active ? '#5555ee' : '#252535'}`,
        background: active ? '#5555ee22' : 'transparent',
        color: active ? '#aaaaff' : '#555',
        cursor: 'pointer',
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        transition: 'all 0.15s',
      }}
    >
      {label}{active ? (dir === 'asc' ? ' ↑' : ' ↓') : ''}
    </button>
  )
}

function CardRow({ left, center, right }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      background: '#111120',
      border: '1px solid #1e1e32',
      borderRadius: 8,
      padding: '10px 14px',
    }}>
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>{center}</div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>{right}</div>
    </div>
  )
}

function Badge({ label, color }) {
  return (
    <span style={{
      display: 'inline-block',
      background: color + '28',
      color,
      border: `1px solid ${color}44`,
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 4,
      letterSpacing: 0.3,
    }}>
      {label}
    </span>
  )
}

function GraderBadge({ grader, grade }) {
  const color = GRADER_COLORS[grader] || '#555'
  return (
    <span style={{
      display: 'inline-block',
      background: color,
      color: '#fff',
      fontSize: 10,
      fontWeight: 700,
      padding: '2px 8px',
      borderRadius: 4,
      letterSpacing: 0.3,
    }}>
      {grader} {grade}
    </span>
  )
}

function ProgressBar({ pct }) {
  const color = pct >= 100 ? '#ffd700' : pct >= 60 ? '#00cc66' : '#5555ee'
  return (
    <div style={{ background: '#0a0a0f', borderRadius: 4, height: 5, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.min(100, pct)}%`,
        background: color,
        borderRadius: 4,
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

// ─── Tab: Dashboard ─────────────────────────────────────────────────────────

function Dashboard() {
  const totalValue = [...SLABS, ...RAWS].reduce((s, c) => s + c.value, 0)
  const wishlistValue = WISHLIST.reduce((s, c) => s + c.estPrice, 0)
  const inProgress = TAG_ORDERS.filter((t) => t.status !== 'Returned').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        <StatCard label="Total Cards" value={SLABS.length + RAWS.length} sub={`${SLABS.length} slabs · ${RAWS.length} raws`} />
        <StatCard label="Portfolio Value" value={`$${totalValue.toLocaleString()}`} sub="Slabs + Raws" />
        <StatCard label="Wishlist Est." value={`$${wishlistValue.toLocaleString()}`} sub={`${WISHLIST.length} items`} />
        <StatCard label="TAG In Progress" value={inProgress} sub={`${TAG_ORDERS.length} total orders`} />
      </div>

      <section>
        <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Recent Slabs</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SLABS.slice(0, 4).map((card) => (
            <CardRow
              key={card.id}
              left={<CardThumb name={card.name} grader={card.grader} grade={card.grade} />}
              center={
                <>
                  <div style={{ color: '#eee', fontWeight: 600, fontSize: 14 }}>{card.name}</div>
                  <div style={{ color: '#444', fontSize: 12, marginTop: 3 }}>{card.set} · {card.variant}</div>
                </>
              }
              right={
                <>
                  <GraderBadge grader={card.grader} grade={card.grade} />
                  <div style={{ color: gradeColor(card.grade), fontSize: 12, marginTop: 4 }}>${card.value.toLocaleString()}</div>
                </>
              }
            />
          ))}
        </div>
      </section>

      <section>
        <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Goals Progress</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GOALS.slice(0, 2).map((goal) => {
            const pct = (goal.progress / goal.total) * 100
            return (
              <div key={goal.id} style={{ background: '#111120', border: '1px solid #1e1e32', borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ color: '#ccc', fontSize: 13 }}>{goal.title}</div>
                  <div style={{ color: '#555', fontSize: 12 }}>
                    {goal.isCurrency ? `$${goal.progress.toLocaleString()} / $${goal.total.toLocaleString()}` : `${goal.progress} / ${goal.total}`}
                  </div>
                </div>
                <ProgressBar pct={pct} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

// ─── Tab: Slabs ──────────────────────────────────────────────────────────────

function Slabs() {
  const [filterGrader, setFilterGrader] = useState('All')
  const [sortBy, setSortBy] = useState('value')
  const [sortDir, setSortDir] = useState('desc')

  const graders = ['All', ...new Set(SLABS.map((s) => s.grader))]

  const displayed = SLABS
    .filter((s) => filterGrader === 'All' || s.grader === filterGrader)
    .slice()
    .sort((a, b) => {
      let v = 0
      if (sortBy === 'value') v = b.value - a.value
      else if (sortBy === 'grade') v = b.grade - a.grade
      else if (sortBy === 'name') v = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? -v : v
    })

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortBy(field); setSortDir('desc') }
  }

  const totalValue = displayed.reduce((s, c) => s + c.value, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <FilterBar filters={graders} active={filterGrader} onSelect={setFilterGrader} />
        <div style={{ display: 'flex', gap: 6 }}>
          <SortBtn label="Value" active={sortBy === 'value'} dir={sortDir} onClick={() => toggleSort('value')} />
          <SortBtn label="Grade" active={sortBy === 'grade'} dir={sortDir} onClick={() => toggleSort('grade')} />
          <SortBtn label="Name"  active={sortBy === 'name'}  dir={sortDir} onClick={() => toggleSort('name')} />
        </div>
      </div>

      <div style={{ color: '#444', fontSize: 12 }}>
        {displayed.length} cards · ${totalValue.toLocaleString()} total value
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayed.map((card) => (
          <CardRow
            key={card.id}
            left={<CardThumb name={card.name} grader={card.grader} grade={card.grade} />}
            center={
              <>
                <div style={{ color: '#eee', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                <div style={{ color: '#444', fontSize: 12, marginTop: 3 }}>{card.set} · {card.year} · {card.variant}</div>
              </>
            }
            right={
              <>
                <GraderBadge grader={card.grader} grade={card.grade} />
                <div style={{ color: '#888', fontSize: 12, marginTop: 5 }}>${card.value.toLocaleString()}</div>
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}

// ─── Tab: TAG ────────────────────────────────────────────────────────────────

function TAGOrders() {
  const inProgress = TAG_ORDERS.filter((t) => t.status !== 'Returned')
  const returned   = TAG_ORDERS.filter((t) => t.status === 'Returned')

  const OrderCard = ({ order }) => (
    <CardRow
      left={
        <CardThumb
          name={order.name}
          grader={order.grade != null ? 'TAG' : undefined}
          grade={order.grade}
          condition={order.grade == null ? '?' : undefined}
        />
      }
      center={
        <>
          <div style={{ color: '#eee', fontWeight: 600, fontSize: 14 }}>{order.name}</div>
          <div style={{ color: '#444', fontSize: 12, marginTop: 3 }}>{order.set}</div>
          <div style={{ color: '#333', fontSize: 11, marginTop: 3 }}>
            Submitted {order.submitted} · Est. return {order.estReturn}
          </div>
        </>
      }
      right={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <Badge
            label={order.status}
            color={STATUS_COLORS[order.status] || '#888'}
          />
          {order.grade != null && (
            <div style={{ color: gradeColor(order.grade), fontWeight: 700, fontSize: 13 }}>
              Grade {order.grade}
            </div>
          )}
        </div>
      }
    />
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section>
        <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
          In Progress ({inProgress.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {inProgress.map((o) => <OrderCard key={o.id} order={o} />)}
          {inProgress.length === 0 && <div style={{ color: '#333', fontSize: 13 }}>No active orders.</div>}
        </div>
      </section>

      {returned.length > 0 && (
        <section>
          <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Returned ({returned.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {returned.map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── Tab: Raws ───────────────────────────────────────────────────────────────

function Raws() {
  const [filterCondition, setFilterCondition] = useState('All')
  const [sortBy, setSortBy]   = useState('value')
  const [sortDir, setSortDir] = useState('desc')

  const conditions = ['All', ...new Set(RAWS.map((r) => r.condition))]

  const displayed = RAWS
    .filter((r) => filterCondition === 'All' || r.condition === filterCondition)
    .slice()
    .sort((a, b) => {
      let v = 0
      if (sortBy === 'value') v = b.value - a.value
      else if (sortBy === 'name') v = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? -v : v
    })

  const toggleSort = (field) => {
    if (sortBy === field) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortBy(field); setSortDir('desc') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <FilterBar filters={conditions} active={filterCondition} onSelect={setFilterCondition} />
        <div style={{ display: 'flex', gap: 6 }}>
          <SortBtn label="Value" active={sortBy === 'value'} dir={sortDir} onClick={() => toggleSort('value')} />
          <SortBtn label="Name"  active={sortBy === 'name'}  dir={sortDir} onClick={() => toggleSort('name')} />
        </div>
      </div>

      <div style={{ color: '#444', fontSize: 12 }}>
        {displayed.length} cards · ${displayed.reduce((s, c) => s + c.value, 0).toLocaleString()} total value
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {displayed.map((card) => (
          <CardRow
            key={card.id}
            left={<CardThumb name={card.name} condition={card.condition} />}
            center={
              <>
                <div style={{ color: '#eee', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{card.name}</div>
                <div style={{ color: '#444', fontSize: 12, marginTop: 3 }}>{card.set} · {card.year} · {card.variant}</div>
              </>
            }
            right={
              <>
                <Badge label={card.condition} color={CONDITION_COLORS[card.condition] || '#555'} />
                <div style={{ color: '#888', fontSize: 12, marginTop: 5 }}>${card.value.toLocaleString()}</div>
              </>
            }
          />
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Wishlist ───────────────────────────────────────────────────────────

function Wishlist() {
  const BUDGET  = 50000
  const spent   = 0
  const remaining = BUDGET - spent
  const totalEst  = WISHLIST.reduce((s, c) => s + c.estPrice, 0)
  const spentPct  = Math.min(100, (spent / BUDGET) * 100)
  const overBudget = totalEst > remaining

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Budget Advisor */}
      <div style={{
        background: '#111120',
        border: '1px solid #1e1e32',
        borderRadius: 10,
        padding: '16px 18px',
      }}>
        <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
          Budget Advisor
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ color: '#444', fontSize: 11 }}>Budget</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>${BUDGET.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#444', fontSize: 11 }}>Spent</div>
            <div style={{ color: '#ff5555', fontWeight: 700, fontSize: 20 }}>${spent.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#444', fontSize: 11 }}>Remaining</div>
            <div style={{ color: '#00cc66', fontWeight: 700, fontSize: 20 }}>${remaining.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ background: '#0a0a0f', borderRadius: 4, height: 5, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            height: '100%',
            width: `${spentPct}%`,
            background: 'linear-gradient(90deg, #5555ee, #ff4444)',
            borderRadius: 4,
          }} />
        </div>

        <div style={{ color: '#383848', fontSize: 11 }}>
          Total wishlist est.:&nbsp;
          <span style={{ color: '#555' }}>${totalEst.toLocaleString()}</span>
          {overBudget && (
            <span style={{ color: '#ff6666', marginLeft: 10 }}>
              ⚠ Exceeds remaining budget by ${(totalEst - remaining).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {WISHLIST.map((item) => (
          <CardRow
            key={item.id}
            left={<CardThumb name={item.name} grader={item.grader} grade={item.targetGrade} />}
            center={
              <>
                <div style={{ color: '#eee', fontWeight: 600, fontSize: 14 }}>{item.name}</div>
                <div style={{ color: '#444', fontSize: 12, marginTop: 3 }}>
                  {item.set} · Target: {item.grader} {item.targetGrade}
                </div>
              </>
            }
            right={
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Badge label={item.priority} color={PRIORITY_COLORS[item.priority] || '#555'} />
                  <span style={{ color: '#888', fontSize: 13 }}>${item.estPrice.toLocaleString()}</span>
                </div>
                <a
                  href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(item.ebaySearch)}&_sop=12`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    background: '#e53238',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 4,
                    textDecoration: 'none',
                    letterSpacing: 0.3,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13H5v-2h14v2z" />
                    <path d="M12 20l-7-7 1.41-1.41L12 17.17l5.59-5.58L19 13l-7 7z" />
                  </svg>
                  eBay
                </a>
              </div>
            }
          />
        ))}
      </div>
    </div>
  )
}

// ─── Tab: Goals ───────────────────────────────────────────────────────────────

function Goals() {
  const grouped = GOALS.reduce((acc, g) => {
    ;(acc[g.category] = acc[g.category] || []).push(g)
    return acc
  }, {})

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <div style={{ color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            {category}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((goal) => {
              const pct = (goal.progress / goal.total) * 100
              return (
                <div key={goal.id} style={{
                  background: '#111120',
                  border: '1px solid #1e1e32',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ color: '#ddd', fontWeight: 600, fontSize: 14, flex: 1, paddingRight: 12 }}>{goal.title}</div>
                    <div style={{ color: '#555', fontSize: 12, flexShrink: 0 }}>
                      {goal.isCurrency
                        ? `$${goal.progress.toLocaleString()} / $${goal.total.toLocaleString()}`
                        : `${goal.progress} / ${goal.total}`}
                    </div>
                  </div>
                  <ProgressBar pct={pct} />
                  <div style={{ color: '#383848', fontSize: 11, marginTop: 6 }}>{pct.toFixed(0)}% complete</div>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

// ─── Root App ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard, Component: Dashboard },
  { id: 'slabs',     label: 'Slabs',     Icon: Icons.Slabs,     Component: Slabs },
  { id: 'tag',       label: 'TAG',       Icon: Icons.TAG,       Component: TAGOrders },
  { id: 'raws',      label: 'Raws',      Icon: Icons.Raws,      Component: Raws },
  { id: 'wishlist',  label: 'Wishlist',  Icon: Icons.Wishlist,  Component: Wishlist },
  { id: 'goals',     label: 'Goals',     Icon: Icons.Goals,     Component: Goals },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { Component: ActiveComponent } = TABS.find((t) => t.id === activeTab)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#fff',
    }}>
      {/* Header + Tab Bar */}
      <header style={{
        background: '#0a0a0f',
        borderBottom: '1px solid #181828',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ padding: '12px 0 0', color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 0.4 }}>
            <span style={{ color: '#5555ee', marginRight: 8 }}>◆</span>Pokémon Tracker
          </div>
          <nav style={{ display: 'flex', marginTop: 4, overflowX: 'auto' }}>
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '9px 13px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${isActive ? '#5555ee' : 'transparent'}`,
                    color: isActive ? '#aaaaff' : '#444',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                >
                  <Icon />
                  {label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main style={{ flex: 1, maxWidth: 740, width: '100%', margin: '0 auto', padding: '20px 16px 40px' }}>
        <ActiveComponent />
      </main>
    </div>
  )
}
