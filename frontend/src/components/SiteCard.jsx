import { ExternalLink, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getRiskLevel } from '../utils/helpers'

export default function SiteCard({ domain, score, trackerCount, uniqueTrackerCount }) {
  const risk = getRiskLevel(score)

  return (
    <Link
      to={`/site/${domain}`}
      className={`glass p-6 rounded-xl border border-gray-200 card-hover cursor-pointer`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 truncate">
            {domain}
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
          </h3>
          <p className="text-sm text-gray-600 mt-1">Privacy Profile</p>
        </div>
        <div className={`text-3xl font-bold ${risk.color}`}>{Math.round(score)}</div>
      </div>

      {/* Risk Badge */}
      <div className="mb-4">
        <span className={`tracker-badge ${risk.badge}`}>
          {risk.level === 'high' && <AlertTriangle className="w-4 h-4" />}
          {risk.level === 'medium' && <AlertCircle className="w-4 h-4" />}
          {risk.level === 'low' && <CheckCircle className="w-4 h-4" />}
          <span className="capitalize">{risk.level} Risk</span>
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
        <div>
          <p className="text-xs text-gray-600 mb-1">Trackers</p>
          <p className="text-lg font-semibold text-gray-900">{trackerCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Unique Trackers</p>
          <p className="text-lg font-semibold text-gray-900">{uniqueTrackerCount}</p>
        </div>
      </div>
    </Link>
  )
}
