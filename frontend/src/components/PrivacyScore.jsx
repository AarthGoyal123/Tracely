import { AlertCircle, TrendingUp, Eye, Lock } from 'lucide-react'
import { getRiskLevel } from '../utils/helpers'

export default function PrivacyScore({ score = 0, trackerCount = 0, uniqueTrackerCount = 0 }) {
  const risk = getRiskLevel(score)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className={`glass p-8 rounded-xl border border-gray-200 ${risk.bgColor}`}>
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-lg font-semibold text-gray-800">Privacy Risk Score</h3>

        {/* Circular Progress */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-300"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={risk.color}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${risk.color}`}>{Math.round(score)}</div>
              <div className="text-xs text-gray-600">out of 100</div>
            </div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className={`tracker-badge ${risk.badge}`}>
          {risk.level === 'high' && <AlertCircle className="w-4 h-4" />}
          {risk.level === 'medium' && <TrendingUp className="w-4 h-4" />}
          {risk.level === 'low' && <Lock className="w-4 h-4" />}
          <span className="capitalize">{risk.level} Risk</span>
        </div>

        {/* Stats */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-privacy-600" />
              <span className="text-sm text-gray-700">Trackers Found</span>
            </div>
            <span className="font-semibold text-gray-900">{trackerCount}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-privacy-600" />
              <span className="text-sm text-gray-700">Unique Trackers</span>
            </div>
            <span className="font-semibold text-gray-900">{uniqueTrackerCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
