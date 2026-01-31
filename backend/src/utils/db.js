import mongoose from 'mongoose'

let connected = false

export const connectDB = async () => {
  if (connected) {
    console.log('✅ Already connected to MongoDB')
    return
  }

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privacy-lens'
    await mongoose.connect(mongoURI)
    connected = true
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  }
}

export const disconnectDB = async () => {
  if (connected) {
    await mongoose.disconnect()
    connected = false
    console.log('Disconnected from MongoDB')
  }
}
