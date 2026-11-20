import { useEffect, useState } from 'react'

/*
 * Roadmap view, same shape as the one in @asafarim/navigation's demo:
 * a changelog of what shipped and a roadmap of what is next, each future
 * item linked to a GitHub issue where people can discuss and vote (+1).
 */

type RoadmapStatus = 'released' | 'current' | 'planned' | 'ideation'
type Category = 'feature' | 'fix' | 'improvement' | 'security' | 'breaking' | 'docs'

interface RoadmapItem {
  version: string
  date: string
  isoDate: string
  status: RoadmapStatus
  title: string
  details: string[]
  icon: string
  category: Category
  tags: string[]
  proposedApi?: string
  issueNumber?: number
}

const REPO = 'AliSafari-IT/react-privacy-consent'

export const roadmapItems: RoadmapItem[] = [
  {
    version: '1.0.0',
    date: 'June 24, 2025',
    isoDate: '2025-06-24',
    status: 'released',
    title: 'Initial release',
    details: [
      'ConsentProvider, ConsentBanner and ConsentModal',
      'Necessary, analytics, marketing and preference categories',
      'Consent records with timestamps, stored in localStorage',
    ],
    icon: '✅',
    category: 'feature',
    tags: ['gdpr', 'ccpa', 'banner'],
  },
  {
    version: '1.5.0',
    date: 'June 25, 2025',
    isoDate: '2025-06-25',
    status: 'released',
    title: 'Theming and live demo',
    details: [
      'applyConsentTheme and a ready-made dark theme',
      'Interactive demo with live consent status',
    ],
    icon: '🎨',
    category: 'improvement',
    tags: ['themes', 'dark-mode', 'demo'],
  },
  {
    version: '1.7.0',
    date: 'June 25, 2025',
    isoDate: '2025-06-25',
    status: 'released',
    title: 'Consent that survives reloads',
    details: [
      'Policy version and storage key keep choices across reloads and pages',
      'Changing the policy version asks visitors again',
    ],
    icon: '💾',
    category: 'fix',
    tags: ['persistence', 'versioning'],
  },
  {
    version: '1.7.2',
    date: 'August 8, 2025',
    isoDate: '2025-08-08',
    status: 'current',
    title: 'Current release',
    details: [
      'Packaging and homepage updates',
      'Demo follows the theme toggle and fits on phones (November 2026)',
    ],
    icon: '🚀',
    category: 'improvement',
    tags: ['packaging', 'demo'],
  },
  {
    version: '1.8.0',
    date: 'Next',
    isoDate: '2027-01-01',
    status: 'planned',
    title: 'Block scripts until consent',
    details: [
      '<ConsentGate> shows content only after consent',
      'Third-party scripts wait for consent, then load',
      'Google Consent Mode v2 and Global Privacy Control',
    ],
    icon: '🛡️',
    category: 'feature',
    tags: ['script-gating', 'consent-mode', 'gpc'],
    proposedApi: `<ConsentGate category="analytics" fallback={<p>Enable analytics to see this.</p>}>
  <AnalyticsChart />
</ConsentGate>`,
    issueNumber: 4,
  },
  {
    version: '1.9.0',
    date: 'After that',
    isoDate: '2027-03-01',
    status: 'planned',
    title: 'AI consent and AI disclosures',
    details: [
      'Opt-in categories: AI features, AI training on my content, AI profiling',
      'Per category: provider, where data is processed, how long it is kept',
      '<AiDisclosure /> label for the EU AI Act transparency duty',
    ],
    icon: '🤖',
    category: 'feature',
    tags: ['ai', 'eu-ai-act', 'gdpr-art-22'],
    proposedApi: `categories: [
  aiCategory('ai-features', { provider: 'OpenAI', region: 'EU', retentionDays: 30 }),
  aiCategory('ai-training', { provider: 'OpenAI', defaultEnabled: false }),
]

if (hasConsent('ai-features')) askAssistant(question)`,
    issueNumber: 5,
  },
  {
    version: '2.0.0',
    date: '2027',
    isoDate: '2027-06-01',
    status: 'planned',
    title: 'Consent receipts and server sync',
    details: [
      'A downloadable receipt for every consent change',
      'onConsentChange hook to store proof on your server',
      'Ask again when the policy changes or after 12 months',
    ],
    icon: '🧾',
    category: 'breaking',
    tags: ['receipts', 'audit', 'expiry'],
    proposedApi: `<ConsentProvider
  config={config}
  onConsentChange={(receipt) => saveReceipt(receipt)}
/>`,
    issueNumber: 6,
  },
  {
    version: '2.x',
    date: 'Idea',
    isoDate: '2027-09-01',
    status: 'ideation',
    title: 'Ad-tech standards and ready-made texts',
    details: [
      'IAB TCF v2.2 and GPP strings',
      'Reviewed banner texts in Dutch, French, German and English',
    ],
    icon: '💡',
    category: 'docs',
    tags: ['tcf', 'gpp', 'i18n'],
    issueNumber: 7,
  },
]

const categoryIcons: Record<Category, string> = {
  feature: '✨',
  fix: '🐛',
  improvement: '⚡',
  security: '🔒',
  breaking: '⚠️',
  docs: '📚',
}

function Changelog({ items }: { items: RoadmapItem[] }) {
  return (
    <div className="rm-changelog">
      <h2 className="rm-section-title">Changelog</h2>
      <p className="rm-section-sub">Shipped updates for @asafarim/react-privacy-consent</p>
      <ol className="rm-timeline">
        {[...items].reverse().map((item) => (
          <li className="rm-timeline__item" key={item.version}>
            <span className="rm-timeline__dot" aria-hidden="true" />
            <div className="rm-card">
              <div className="rm-card__head">
                <span aria-hidden="true">{categoryIcons[item.category]}</span>
                <h3 className="rm-card__title">{item.title}</h3>
              </div>
              <div className="rm-card__meta">
                <span className={`rm-chip rm-chip--${item.category}`}>{item.category}</span>
                <span>v{item.version}</span>
                <span aria-hidden="true">•</span>
                <span>{item.date}</span>
              </div>
              <ul className="rm-card__details">
                {item.details.map((d) => <li key={d}>{d}</li>)}
              </ul>
              <div className="rm-tags">
                {[item.status, ...item.tags].map((t) => <span className="rm-tag" key={t}>{t}</span>)}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Future({ items }: { items: RoadmapItem[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<string, number>>({})

  // Live 👍 counts from the GitHub issues; the page works without them.
  useEffect(() => {
    let cancelled = false
    Promise.all(
      items.filter((i) => i.issueNumber).map(async (i) => {
        const res = await fetch(`https://api.github.com/repos/${REPO}/issues/${i.issueNumber}`)
        if (!res.ok) throw new Error(String(res.status))
        const issue = (await res.json()) as { reactions?: { '+1'?: number } }
        return [i.version, issue.reactions?.['+1'] ?? 0] as const
      }),
    )
      .then((counts) => { if (!cancelled) setVotes(Object.fromEntries(counts)) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [items])

  return (
    <div>
      <h2 className="rm-section-title">Roadmap</h2>
      <p className="rm-section-sub">Open an item to see the proposed API, then discuss or vote on GitHub.</p>
      <div className="rm-list">
        {items.map((item, index) => {
          const isOpen = open === item.version
          const issueUrl = item.issueNumber ? `https://github.com/${REPO}/issues/${item.issueNumber}` : undefined
          return (
            <div key={item.version} className={`rm-item rm-item--${item.status}`}>
              <div className="rm-item__track">
                <span className="rm-item__dot" aria-hidden="true">{item.icon}</span>
                {index < items.length - 1 && <span className="rm-item__line" aria-hidden="true" />}
              </div>
              <div className="rm-item__body">
                <button
                  type="button"
                  className="rm-item__summary"
                  onClick={() => setOpen(isOpen ? null : item.version)}
                  aria-expanded={isOpen}
                >
                  <span className="rm-item__version">v{item.version}</span>
                  <span className="rm-item__date">{item.date}</span>
                  <span className={`rm-item__status rm-item__status--${item.status}`}>{item.status}</span>
                  <span className="rm-item__title">{item.title}</span>
                </button>
                <ul className="rm-card__details">
                  {item.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
                {isOpen && (
                  <div className="rm-item__preview">
                    {item.proposedApi && <pre className="code-block">{item.proposedApi}</pre>}
                    {issueUrl && (
                      <div className="rm-item__links">
                        <a href={issueUrl} target="_blank" rel="noopener noreferrer">Discuss on GitHub ↗</a>
                        <a href={issueUrl} target="_blank" rel="noopener noreferrer" className="rm-vote">
                          Vote on GitHub (+1) ({votes[item.version] ?? 0})
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type View = 'history' | 'roadmap' | 'all'

export function Roadmap() {
  const [view, setView] = useState<View>('all')
  const history = roadmapItems.filter((i) => i.status === 'released' || i.status === 'current')
  const future = roadmapItems.filter((i) => i.status === 'planned' || i.status === 'ideation')

  return (
    <div className="rm-page">
      <header className="rm-header">
        <h2 className="rm-title">Privacy consent journey</h2>
        <p className="rm-subtitle">
          Where <code>@asafarim/react-privacy-consent</code> has been and where it is heading,
          including consent for AI.
        </p>
      </header>

      <div className="rm-toggle" role="group" aria-label="Timeline view">
        {(['history', 'roadmap', 'all'] as const).map((v) => (
          <button
            key={v}
            type="button"
            className={`rm-toggle__btn${view === v ? ' rm-toggle__btn--active' : ''}`}
            onClick={() => setView(v)}
            aria-pressed={view === v}
          >
            {v === 'history' ? 'History (Changelog)' : v === 'roadmap' ? 'Future (Roadmap)' : 'View all'}
          </button>
        ))}
      </div>

      <div className={`rm-columns rm-columns--${view}`}>
        {view !== 'roadmap' && <section className="demo-section rm-section"><Changelog items={history} /></section>}
        {view !== 'history' && <section className="demo-section rm-section"><Future items={future} /></section>}
      </div>
    </div>
  )
}
