import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB, disconnectDB } from './src/utils/db.js'
import eventRoutes from './src/routes/events.js'
import siteRoutes from './src/routes/sites.js'
import trackerRoutes from './src/routes/trackers.js'
import analyticsRoutes from './src/routes/analytics.js'
import authRoutes from './src/routes/auth.js'

dotenv.config()

const app = express()

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  'https://tracely-phi.vercel.app',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const isAllowedOrigin =
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.startsWith('chrome-extension://')

    return isAllowedOrigin
      ? callback(null, true)
      : callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' })) 

connectDB()

// Routes
app.use('/api/events', eventRoutes)
app.use('/api/site', siteRoutes)
app.use('/api/sites', siteRoutes)
app.use('/api/trackers', trackerRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/auth', authRoutes)


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Tracely Backend is running' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`🔐 Tracely Backend running on http://localhost:${PORT}`)
  console.log(`📊 API endpoints ready at http://localhost:${PORT}/api`)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  server.close(async () => {
    await disconnectDB()
    process.exit(0)
  })
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  server.close(async () => {
    await disconnectDB()
    process.exit(0)
  })
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})
