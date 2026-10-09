import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Crosshair,
  Database,
  ExternalLink,
  Eye,
  Fingerprint,
  GitBranch,
  Globe,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  Monitor,
  Network,
  Plus,
  Radar,
  Search,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X,
  Zap,
} from 'lucide-react'
import './App.css'
const navigation = [
  { section: 'WORKSPACE', items: [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Attack Graph', icon: GitBranch },
    { name: 'Asset Inventory', icon: Monitor },
    { name: 'Services', icon: Network },
  ] },
  { section: 'SECURITY', items: [
    { name: 'Vulnerabilities', icon: ShieldAlert },
    { name: 'Scan History', icon: Clock3 },
  ] },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [target, setTarget] = useState('127.0.0.1')
  const [scanning, setScanning] = useState(false)
  const [assets, setAssets] = useState([])
  const [notice, setNotice] = useState('')
  const [apiStatus, setApiStatus] = useState('Checking')

  const filteredAssets = assets.filter((asset) =>
    `${asset.ip} ${asset.name} ${asset.os}`.toLowerCase().includes(search.toLowerCase())
  )

  async function runScan(event) {
    event.preventDefault()
    if (!target.trim() || scanning) return

    setScanning(true)
    setNotice('Connecting to AttackPath API...')

    try {
      const response = await fetch('http://127.0.0.1:8000/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: target.trim() }),
      })

      if (!response.ok) throw new Error(`API returned ${response.status}`)

      const data = await response.json()
      setNotice(`Scan completed successfully for ${data.target || target}.`)

      const assetResponse = await fetch('http://127.0.0.1:8000/assets')
      if (assetResponse.ok) {
        const assetData = await assetResponse.json()
        const rows = assetData.assets || []
        setAssets(rows.map((asset) => ({
          ip: asset.ip,
          name: asset.hostname || asset.ip,
          os: asset.os || 'Unknown',
          services: asset.services_count ?? 0,
          status: 'Discovered',
          risk: 'Unassessed',
        })))
      }
    } catch (error) {
      setNotice(`Scan failed: ${error.message}. Check that the backend is running and CORS is configured.`)
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Crosshair size={23} /></div>
          <div>
            <div className="brand-name">attack<span>path</span></div>
            <div className="brand-caption">ATTACK SURFACE INTELLIGENCE</div>
          </div>
          <button className="mobile-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={18} /></button>
        </div>

        <button className="workspace-switch">
          <div className="workspace-avatar"><Shield size={17} /></div>
          <div className="workspace-copy"><strong>Personal workspace</strong><span>Local environment</span></div>
          <ChevronDown size={15} />
        </button>

        {navigation.map((group) => (
          <div className="nav-group" key={group.section}>
            <div className="nav-label">{group.section}</div>
            {group.items.map(({ name, icon: Icon }) => (
              <button key={name} onClick={() => { setActivePage(name); setSidebarOpen(false) }} className={`nav-item ${activePage === name ? 'nav-active' : ''}`}>
                <Icon size={17} strokeWidth={1.8} />
                <span>{name}</span>
                {name === 'Vulnerabilities' && <span className="nav-dot" />}
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="connection-card">
            <div className="connection-top"><span className="live-dot" /> LOCAL ENGINE</div>
            <div className="connection-title">Security engine</div>
            <div className="connection-description">Connect your local API to start analyzing your environment.</div>
            <div className="connection-footer"><span>API status</span><span className="status-pending">Check required</span></div>
          </div>
          <button className="nav-item"><Settings2 size={17} /><span>Settings</span></button>
          <div className="user-profile">
            <div className="user-avatar">AP</div>
            <div className="user-info"><strong>Security Analyst</strong><span>Local operator</span></div>
            <CircleHelp size={17} className="help-icon" />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs">
            <button className="mobile-menu icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <span>Workspace</span><span className="crumb-slash">/</span><strong>{activePage}</strong>
          </div>
          <div className="topbar-actions">
            <div className="environment-badge"><span className="live-dot" /> LOCAL ENVIRONMENT</div>
            <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <div className="topbar-divider" />
            <div className="top-avatar">SA</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> SECURITY OPERATIONS CENTER</div>
              <h1>{activePage === 'Overview' ? 'Attack surface overview' : activePage}</h1>
              <p>Discover your infrastructure. Understand your exposure. Map the path.</p>
            </div>
            <div className="heading-actions">
              <button className="button-secondary" onClick={() => { setNotice(''); setActivePage('Overview') }}><Clock3 size={16} /> Overview</button>
              <button className="button-primary" onClick={() => document.getElementById('scan-target')?.focus()}><Plus size={17} /> New scan</button>
            </div>
          </div>

          {notice && <div className="notice-banner"><Activity size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button></div>}

          <section className="scan-banner">
            <div className="scan-banner-icon"><Radar size={23} /></div>
            <div className="scan-banner-copy"><h2>Start a network discovery</h2><p>Scan an authorized target to populate your asset inventory.</p></div>
            <form className="scan-form" onSubmit={runScan}>
              <div className="target-input"><Terminal size={16} /><input id="scan-target" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="127.0.0.1" aria-label="Scan target" /></div>
              <button className="button-primary scan-button" type="submit" disabled={scanning}>{scanning ? <Activity className="spin" size={16} /> : <Zap size={16} />}{scanning ? 'Scanning...' : 'Run scan'}</button>
            </form>
          </section>

          <section className="metrics-grid">
            <MetricCard title="Discovered assets" value={assets.length} detail="Tracked in this view" icon={Monitor} color="mint" />
            <MetricCard title="Exposed services" value={assets.reduce((sum, asset) => sum + Number(asset.services || 0), 0)} detail="Across displayed assets" icon={Network} color="blue" />
            <MetricCard title="Verified CVEs" value="—" detail="Requires verified CVE data" icon={ShieldCheck} color="amber" />
            <MetricCard title="Attack paths" value="—" detail="Path analysis not yet enabled" icon={GitBranch} color="purple" />
          </section>

          <section className="content-grid">
            <div className="panel graph-panel">
              <div className="panel-heading">
                <div><div className="panel-kicker">VISUAL ANALYSIS</div><h2>Attack graph</h2><p>Infrastructure relationships</p></div>
                <button className="small-icon-button" onClick={() => setActivePage('Attack Graph')} aria-label="Open attack graph"><ExternalLink size={16} /></button>
              </div>
              <div className="graph-preview">
                <div className="graph-grid" />
                <svg className="graph-lines" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                  <defs><linearGradient id="edgeGradient"><stop stopColor="#45E0B0" /><stop offset="1" stopColor="#5476E8" /></linearGradient></defs>
                  <path d="M250 42 L250 90 M250 90 L110 150 M250 90 L390 150 M110 150 L110 210 M390 150 L390 210" stroke="url(#edgeGradient)" strokeWidth="1.5" fill="none" strokeDasharray="5 5" />
                  <path d="M250 42 L250 90 M250 90 L110 150 M250 90 L390 150 M110 150 L110 210 M390 150 L390 210" stroke="#45E0B0" strokeWidth="1" fill="none" opacity=".24" />
                </svg>
                <div className="graph-node attacker-node"><Crosshair size={19} /><span>Attacker</span><small>ENTRY POINT</small></div>
                <div className="graph-node host-node"><Monitor size={18} /><span>Host</span><small>DISCOVERED</small></div>
                <div className="graph-node host-node host-right"><Globe size={18} /><span>Host</span><small>DISCOVERED</small></div>
                <div className="graph-node service-node service-left"><Database size={17} /><span>Service</span></div>
                <div className="graph-node service-node service-right"><LockKeyhole size={17} /><span>Service</span></div>
                <div className="graph-legend"><span><i className="legend-mint" /> Entry point</span><span><i className="legend-blue" /> Infrastructure</span></div>
                <div className="graph-disclaimer">ILLUSTRATIVE GRAPH · NOT LIVE DATA</div>
              </div>
              <div className="panel-footer"><span><span className="live-dot" /> Graph engine foundation</span><button onClick={() => setActivePage('Attack Graph')}>Explore graph <ArrowUpRight size={15} /></button></div>
            </div>

            <div className="panel activity-panel">
              <div className="panel-heading"><div><div className="panel-kicker">SYSTEM MONITOR</div><h2>Analysis activity</h2><p>Current workspace status</p></div><Activity size={18} className="muted-icon" /></div>
              <div className="activity-list">
                <ActivityRow icon={ShieldCheck} title="API integration" description="FastAPI endpoint connection" status="Pending" color="mint" />
                <ActivityRow icon={Radar} title="Network discovery" description="Nmap service detection" status="Ready" color="blue" />
                <ActivityRow icon={Fingerprint} title="Vulnerability mapping" description="CPE and CVE correlation" status="In progress" color="amber" />
                <ActivityRow icon={GitBranch} title="Attack graph" description="Host and service relationships" status="Foundation" color="purple" />
              </div>
              <div className="activity-note"><ShieldAlert size={17} /><p>Service discovery does not prove a vulnerability exists. Findings must be verified before risk is assigned.</p></div>
            </div>
          </section>

          <section className="panel assets-panel">
            <div className="assets-heading">
              <div><div className="panel-kicker">DISCOVERED INFRASTRUCTURE</div><h2>Asset inventory</h2><p>Hosts visible in your current workspace</p></div>
              <div className="asset-actions"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets..." /></label><button className="button-secondary compact-button" onClick={() => setActivePage('Asset Inventory')}>View inventory <ArrowUpRight size={15} /></button></div>
            </div>
            <div className="table-scroll"><table><thead><tr><th>ASSET</th><th>IP ADDRESS</th><th>OPERATING SYSTEM</th><th>SERVICES</th><th>STATUS</th><th>ASSESSMENT</th></tr></thead>
              <tbody>{filteredAssets.map((asset) => <tr key={asset.ip}><td><div className="asset-name"><div className="asset-icon"><Monitor size={16} /></div><strong>{asset.name}</strong></div></td><td><code>{asset.ip}</code></td><td>{asset.os}</td><td><span className="service-count"><Network size={14} />{asset.services}</span></td><td><span className="table-status"><i />{asset.status}</span></td><td><span className={`risk-pill ${asset.risk === 'Review' ? 'risk-review' : 'risk-neutral'}`}>{asset.risk}</span></td></tr>)}
              {filteredAssets.length === 0 && <tr><td colSpan="6" className="empty-state">No matching assets found.</td></tr>}</tbody>
            </table></div>
            <div className="panel-footer"><span>Showing {filteredAssets.length} assets · Demo data until API sync</span><button onClick={() => setActivePage('Asset Inventory')}>All assets <ArrowUpRight size={15} /></button></div>
          </section>

          <footer className="page-footer"><span><Shield size={14} /> ATTACKPATH <span className="footer-divider">/</span> DEFENSIVE SECURITY TOOLING</span><span><span className="live-dot" /> Local development build <span className="footer-divider">·</span> v0.1.0</span></footer>
        </div>
      </main>
    </div>
  )
}

function MetricCard({ title, value, detail, icon: Icon, color }) {
  return <div className="metric-card"><div className={`metric-icon ${color}`}><Icon size={19} /></div><div className="metric-label">{title}</div><div className="metric-value">{value}</div><div className="metric-detail"><span className="detail-indicator"><ArrowDownRight size={13} /></span>{detail}</div><div className={`metric-glow ${color}`} /></div>
}

function ActivityRow({ icon: Icon, title, description, status, color }) {
  return <div className="activity-row"><div className={`activity-icon ${color}`}><Icon size={17} /></div><div className="activity-copy"><strong>{title}</strong><span>{description}</span></div><span className={`activity-status ${color}`}>{status}</span></div>
}

export default App