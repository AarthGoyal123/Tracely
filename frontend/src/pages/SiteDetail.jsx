import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, FileText } from 'lucide-react'
import PrivacyScore from '../components/PrivacyScore'
import TrackerList from '../components/TrackerList'
import { TrendChart } from '../components/Charts'
import { useSiteDetail } from '../hooks/useApi'

export default function SiteDetail() {
  const { domain } = useParams()
  const { site, loading } = useSiteDetail(domain)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-privacy-600 hover:text-privacy-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
      </div>

      {/* Site Header */}
      <div className="glass p-8 rounded-xl border border-gray-200 bg-gradient-to-br from-privacy-50 to-transparent">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{site?.domain || domain}</h1>
        <p className="text-gray-700 text-lg">{site?.summary || 'Privacy profile for this website'}</p>
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">First Seen:</span> {site?.firstSeen ? new Date(site.firstSeen).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Last Updated:</span> {site?.lastUpdated ? new Date(site.lastUpdated).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      </div>

      {/* Researcher Mode CTA */}
      <Link
        to={`/site/${domain}/researcher`}
        className="relative overflow-hidden rounded-2xl border-2 border-privacy-400 bg-gradient-to-r from-privacy-50 via-blue-50 to-privacy-50 p-8 hover:shadow-lg transition-all duration-300 group my-8"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-privacy-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-between gap-8">
          <div className="flex items-start gap-5">
            <div className="rounded-lg bg-privacy-600 p-3 group-hover:scale-110 transition-transform flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <p className="text-2xl font-bold text-gray-900">Full Research Report</p>
                <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded">NEW</span>
              </div>
              <p className="text-base text-gray-700 leading-relaxed">Reproducible analysis with methodology, evidence timeline, and exportable data.</p>
              <p className="text-sm text-privacy-600 font-semibold">→ Perfect for audits, compliance reviews, and sharing findings</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center text-privacy-600 group-hover:text-privacy-700 flex-shrink-0">
            <div className="text-5xl font-bold leading-none">→</div>
          </div>
        </div>
      </Link>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Privacy Score */}
        <div>
          <PrivacyScore
            score={site?.score || 0}
            trackerCount={site?.trackerCount || 0}
            uniqueTrackerCount={site?.uniqueTrackerCount || 0}
          />
        </div>

        {/* Right Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trend Chart */}
          <TrendChart data={site?.riskTrend || []} />

          {/* Key Findings */}
          <div className="glass p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Key Privacy Findings
            </h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">
                  Extensive cross-domain tracking with 8 third-party connections
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-600 font-bold">•</span>
                <span className="text-gray-700">
                  Multiple tracking pixels and cookies storing persistent identifiers
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-600 font-bold">•</span>
                <span className="text-gray-700">
                  Risk score increasing over time - new trackers added recently
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-600 font-bold">•</span>
                <span className="text-gray-700">
                  Integration with Google Analytics and other profiling services
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tracker List */}
      <div>
        <TrackerList trackers={site?.trackers || []} />
      </div>

      {/* Recommendations */}
      <div className="glass p-8 rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-transparent">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <input type="checkbox" className="mt-1" defaultChecked />
            <span className="text-gray-700">Export an audit report for compliance review</span>
          </li>
          <li className="flex gap-3">
            <input type="checkbox" className="mt-1" />
            <span className="text-gray-700">Monitor this site for new tracker additions</span>
          </li>
          <li className="flex gap-3">
            <input type="checkbox" className="mt-1" />
            <span className="text-gray-700">Review cross-site tracker relationships in Analytics</span>
          </li>
          <li className="flex gap-3">
            <input type="checkbox" className="mt-1" />
            <span className="text-gray-700">Share findings with your compliance or research team</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
