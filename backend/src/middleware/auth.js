import { verifyToken } from '../utils/helpers.js'

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      // Allow unauthenticated access for now (demo mode)
      return next()
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (decoded) {
      req.userId = decoded.userId
    }

    next()
  } catch (err) {
    next()
  }
}
