import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiShare2, FiChevronRight, FiChevronDown, FiUsers } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { fetchOrgChart } from '../store/orgChartThunks'

function flattenMatches(nodes, query, depth = 0) {
  const q = query.toLowerCase()
  const result = []
  for (const node of nodes || []) {
    const name = `${node.firstName} ${node.lastName}`
    const selfMatch = name.toLowerCase().includes(q)
    const childResults = node.children?.length
      ? flattenMatches(node.children, query, depth + 1)
      : []
    if (selfMatch || childResults.length > 0) {
      result.push({ node, depth, hasMatch: selfMatch })
      result.push(...childResults)
    }
  }
  return result
}

function OrgNodeCard({ node, depth, isRoot, highlight, hasChildren, isCollapsed, onToggle }) {
  const name = `${node.firstName} ${node.lastName}`
  const initials = `${node.firstName?.[0] || ''}${node.lastName?.[0] || ''}`.toUpperCase()

  const highlightName = () => {
    if (!highlight) return name
    const idx = name.toLowerCase().indexOf(highlight.toLowerCase())
    if (idx === -1) return name
    return (
      <>
        {name.slice(0, idx)}
        <span className="bg-blue-500/25 text-blue-300 rounded px-0.5">{name.slice(idx, idx + highlight.length)}</span>
        {name.slice(idx + highlight.length)}
      </>
    )
  }

  return (
    <div
      className="relative"
      style={{ marginLeft: depth > 0 ? `${Math.min(depth, 6) * 28}px` : 0 }}
    >
      {depth > 0 && (
        <div
          className="absolute left-3 top-0 bottom-0 w-px bg-white/[0.08]"
          aria-hidden
        />
      )}
      <div
        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 mb-2 ${
          isRoot
            ? 'bg-blue-500/[0.06] border-blue-500/20'
            : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]'
        }`}
        style={{ marginLeft: depth > 0 ? '8px' : 0 }}
      >
        {isRoot && <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-blue-500" />}
        {hasChildren ? (
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all cursor-pointer shrink-0"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>
        ) : (
          <div className="w-6 shrink-0" />
        )}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isRoot ? 'bg-gradient-to-br from-blue-500/25 to-violet-500/15 border-blue-400/30' : 'bg-gradient-to-br from-blue-500/15 to-violet-500/10 border-white/10'}`}>
          <span className={`text-xs font-bold ${isRoot ? 'text-blue-300' : 'text-blue-400'}`}>{initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-semibold truncate ${highlight ? 'text-white' : 'text-white'}`}>
            {highlightName()}
          </p>
          <p className="text-[11px] text-gray-500 truncate">{node.jobTitle}</p>
        </div>
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="text-[11px] text-gray-400 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">{node.departmentName || '-'}</span>
          {node.managerName && <span className="text-[10px] text-gray-600 mt-1">→ {node.managerName}</span>}
        </div>
      </div>
    </div>
  )
}

function OrgChart() {
  const dispatch = useDispatch()
  const { nodes, loading } = useSelector((s) => s.orgChart)
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState(() => new Set())

  useEffect(() => { dispatch(fetchOrgChart()) }, [dispatch])

  const toggle = (id) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const query = search.trim()
  const flatMatches = useMemo(
    () => (query ? flattenMatches(nodes, query) : []),
    [nodes, query]
  )

  const renderTree = (list, depth = 0) =>
    (list || []).map((node) => {
      const hasChildren = !!node.children?.length
      const isCollapsed = collapsed.has(node.id)
      return (
        <div key={node.id}>
          <OrgNodeCard
            node={node}
            depth={depth}
            isRoot={depth === 0}
            highlight={query || null}
            hasChildren={hasChildren}
            isCollapsed={isCollapsed}
            onToggle={() => toggle(node.id)}
          />
          {hasChildren && !isCollapsed && renderTree(node.children, depth + 1)}
        </div>
      )
    })

  return (
    <div>
      <PageHeader title="Org Chart" subtitle="Company reporting structure" icon={FiShare2} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-md">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name..." />
        </div>
        {query && (
          <span className="text-xs text-gray-500 bg-white/[0.04] border border-white/[0.06] px-3 py-2 rounded-xl">
            {flatMatches.length} match{flatMatches.length === 1 ? '' : 'es'}
          </span>
        )}
      </div>

      {loading && nodes.length === 0 ? (
        <LoadingSpinner />
      ) : nodes.length === 0 ? (
        <EmptyState icon={FiUsers} title="No org chart data" description="Employee reporting structure will appear here." />
      ) : query ? (
        flatMatches.length === 0 ? (
          <EmptyState title="No matches found" description={`No employees match "${query}".`} />
        ) : (
          <div className="glass rounded-2xl p-6 animate-fade-in">
            {flatMatches.map(({ node, depth }) => (
              <OrgNodeCard
                key={node.id}
                node={node}
                depth={depth}
                isRoot={depth === 0 && node.managerId == null}
                highlight={query}
                hasChildren={false}
                isCollapsed={false}
                onToggle={() => {}}
              />
            ))}
            {flatMatches.length > 0 && hasMatchAncestorsNote(flatMatches) && (
              <p className="text-[11px] text-gray-600 mt-4 pl-1">Ancestors of matches are shown to preserve hierarchy context.</p>
            )}
          </div>
        )
      ) : (
        <div className="glass rounded-2xl p-6 animate-fade-in">
          {renderTree(nodes, 0)}
        </div>
      )}
    </div>
  )
}

function hasMatchAncestorsNote(flatMatches) {
  return flatMatches.some((m) => !m.hasMatch)
}

export default OrgChart
