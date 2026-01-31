// Known tracker domains database (simplified)
export const KNOWN_TRACKERS = {
  'google-analytics.com': { category: 'analytics', type: 'script', risk: 'low' },
  'analytics.google.com': { category: 'analytics', type: 'api_call', risk: 'low' },
  'facebook.com': { category: 'advertising', type: 'pixel', risk: 'high' },
  'facebook-pixel.com': { category: 'tracking', type: 'pixel', risk: 'high' },
  'twitter.com': { category: 'social', type: 'script', risk: 'medium' },
  'twitter-pixel.com': { category: 'tracking', type: 'pixel', risk: 'medium' },
  'linkedin.com': { category: 'social', type: 'script', risk: 'medium' },
  'linkedin-insight.com': { category: 'tracking', type: 'pixel', risk: 'medium' },
  'amazon.com': { category: 'advertising', type: 'script', risk: 'low' },
  'doubleclick.net': { category: 'advertising', type: 'script', risk: 'high' },
  'hotjar.com': { category: 'analytics', type: 'script', risk: 'medium' },
  'mixpanel.com': { category: 'analytics', type: 'script', risk: 'low' },
  'segment.com': { category: 'analytics', type: 'script', risk: 'medium' },
  'amplitude.com': { category: 'analytics', type: 'script', risk: 'low' },
  'intercom.io': { category: 'data', type: 'script', risk: 'medium' },
  'zendesk.com': { category: 'data', type: 'script', risk: 'low' },
}

export const getTrackerInfo = (domain) => {
  const normalized = domain.toLowerCase()
  
  // Exact match
  if (KNOWN_TRACKERS[normalized]) {
    return KNOWN_TRACKERS[normalized]
  }
  
  // Partial match
  for (const [trackerDomain, info] of Object.entries(KNOWN_TRACKERS)) {
    if (normalized.includes(trackerDomain) || trackerDomain.includes(normalized)) {
      return info
    }
  }
  
  return { category: 'other', type: 'other', risk: 'low' }
}

export const detectFingerprinting = (metadata) => {
  // Check for canvas fingerprinting indicators
  if (metadata?.canvas || metadata?.webgl) {
    return true
  }
  
  // Check for font enumeration
  if (metadata?.fonts && Array.isArray(metadata.fonts) && metadata.fonts.length > 0) {
    return true
  }
  
  return false
}
