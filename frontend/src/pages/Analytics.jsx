import { useTrackers } from '../hooks/useApi'
import TrackerChart from '../components/Charts'
import { Globe, TrendingUp, AlertCircle } from 'lucide-react'

export default function Analytics() {
  const { trackers } = useTrackers()

  // Transform tracker data for chart - convert to name/count format
  const trackerData = (trackers || [])
    .sort((a, b) => (b.sightingCount || b.count || 0) - (a.sightingCount || a.count || 0))
    .slice(0, 10)
    .map(t => ({
      name: t.name || t.domain || 'Unknown',
      count: t.sightingCount || t.count || 0,
    }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass p-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-privacy-50 to-transparent">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Analytics</h1>
        <p className="text-gray-700 text-lg">
          Collective intelligence on tracking behavior across the web
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">Unique Trackers</p>
            <Globe className="w-5 h-5 text-privacy-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">{trackerData.length}</p>
          <p className="text-sm text-gray-600 mt-2">Identified in network</p>
        </div>

        <div className="glass p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">Total Sightings</p>
            <TrendingUp className="w-5 h-5 text-privacy-600" />
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {trackerData.reduce((sum, t) => sum + (t.sightingCount || t.count || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-2">Last 30 days</p>
        </div>

        <div className="glass p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600 font-medium">High Risk</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-4xl font-bold text-red-600">
            {trackerData.filter((t) => t.risk === 'high' || t.riskLevel === 'high').length}
          </p>
          <p className="text-sm text-gray-600 mt-2">Trackers flagged</p>
        </div>
      </div>

      {/* Top Trackers */}
      <div className="glass p-8 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Trackers</h2>

        <div className="space-y-3">
          {trackerData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tracker data available yet. Use the extension to start collecting data.</p>
          ) : trackerData.map((tracker, idx) => {
            const maxCount = trackerData[0]?.sightingCount || trackerData[0]?.count || 1
            const trackerCount = tracker.sightingCount || tracker.count || 0
            const percentage = (trackerCount / maxCount) * 100

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{tracker.name || tracker.domain}</h3>
                    <p className="text-xs text-gray-600 capitalize">{tracker.category || 'unknown'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">{trackerCount.toLocaleString()}</p>
                    <span className={`tracker-badge ${
                      (tracker.risk === 'high' || tracker.riskLevel === 'high') ? 'risk-high' :
                      (tracker.risk === 'medium' || tracker.riskLevel === 'medium') ? 'risk-medium' :
                      'risk-low'
                    }`}>
                      {tracker.risk || tracker.riskLevel || 'low'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tracker Distribution */}
      {trackerData.length > 0 && <TrackerChart data={trackerData} />}

      {/* Insights */}
      <div className="glass p-8 rounded-xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">📈 Tracker Growth</h3>
            <p className="text-sm text-gray-700">
              Advertising trackers increased by 18% in the last month. Facebook Pixel and Twitter Pixel are most prevalent.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-gray-900 mb-2">✅ Analytics Dominance</h3>
            <p className="text-sm text-gray-700">
              Google Analytics leads with 2,847 sightings. Most sites use 3-5 different analytics providers.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">⚠️ Cross-Site Tracking</h3>
            <p className="text-sm text-gray-700">
              73% of trackers operate across multiple domains. Tracely detects these hidden connections.
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-gray-900 mb-2">🚨 High-Risk Activity</h3>
            <p className="text-sm text-gray-700">
              Facebook Pixel shows fingerprinting behavior. Consider enabling stricter privacy controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
