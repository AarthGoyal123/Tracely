// Privacy score color coding
export const getRiskLevel = (score) => {
  if (score >= 70) return { level: 'high', color: 'text-red-600', bgColor: 'bg-red-50', badge: 'risk-high' }
  if (score >= 40) return { level: 'medium', color: 'text-yellow-600', bgColor: 'bg-yellow-50', badge: 'risk-medium' }
  return { level: 'low', color: 'text-green-600', bgColor: 'bg-green-50', badge: 'risk-low' }
}

export const formatDomain = (domain) => {
  try {
    const url = new URL(`https://${domain}`)
    return url.hostname.replace('www.', '')
  } catch {
    return domain
  }
}

export const getCategoryIcon = (category) => {
  const icons = {
    analytics: '📊',
    advertising: '📢',
    social: '👥',
    cdn: '🌐',
    payment: '💳',
    tracking: '👁️',
    data: '📁',
  }
  return icons[category] || '🔗'
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const calculateRiskScore = (trackerCount, thirdPartyCount, cookieCount) => {
  // Formula: logarithmic scaling with interaction term for cross-site tracking
  const score = 
    (Math.log(trackerCount + 1) * 40) +
    (Math.log(thirdPartyCount + 1) * 30) +
    (Math.log(cookieCount + 1) * 20) +
    ((trackerCount * thirdPartyCount) / 100)
  
  // Cap at 100 for display
  return Math.min(Math.round(score), 100)
}
