import { AlertTriangle, Eye, Globe } from 'lucide-react'

export default function TrackerList({ trackers = [] }) {
  if (!trackers || trackers.length === 0) {
    return (
      <div className="glass p-8 rounded-xl border border-gray-200 text-center">
        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">No trackers detected</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-privacy-50 to-transparent">
        <h3 className="font-semibold text-gray-900">Detected Trackers</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {trackers.map((tracker, idx) => (
          <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3 flex-1">
                <Globe className="w-5 h-5 text-privacy-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{tracker.domain}</h4>
                  <p className="text-sm text-gray-600 capitalize">{tracker.category}</p>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                  {tracker.type}
                </span>
              </div>
            </div>

            {tracker.risk && (
              <div className="ml-8 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-red-600">{tracker.risk}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
