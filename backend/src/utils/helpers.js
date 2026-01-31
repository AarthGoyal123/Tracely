import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  })
}

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret')
  } catch (err) {
    return null
  }
}

export const extractDomain = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return url
  }
}

export const isThirdParty = (requestDomain, pageDomain) => {
  const reqDomain = extractDomain(requestDomain)
  const pageDom = extractDomain(pageDomain)
  
  // Remove www prefix for comparison
  const normalizedReq = reqDomain.replace('www.', '')
  const normalizedPage = pageDom.replace('www.', '')
  
  return !normalizedReq.includes(normalizedPage) && !normalizedPage.includes(normalizedReq)
}

export const calculatePrivacyScore = (trackerCount, thirdPartyCount, cookieCount) => {
  // Formula: square root scaling for better score distribution
  // Prevents minor tracker counts (50-100) from reaching score 100
  // Score ranges: 0-30 Low, 31-60 Medium, 61-80 High, 81-100 Critical
  const score = 
    (Math.sqrt(trackerCount) * 5) +
    (Math.log(Math.max(thirdPartyCount, 1)) * 4) +
    (Math.sqrt(Math.max(cookieCount, 0)) * 1.5)
  
  // Cap at 100 for display
  return Math.min(Math.round(score), 100)
}
