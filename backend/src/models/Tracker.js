import mongoose from 'mongoose'

const trackerSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['analytics', 'advertising', 'social', 'cdn', 'payment', 'tracking', 'data', 'other'],
      default: 'other',
    },
    type: {
      type: String,
      enum: ['cookie', 'pixel', 'script', 'api_call', 'fingerprint', 'other'],
      default: 'other',
    },
    risk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    description: String,
    riskFactors: [String],
    firstSeen: Date,
    sightingCount: {
      type: Number,
      default: 0,
    },
    affectedSites: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export const Tracker = mongoose.model('Tracker', trackerSchema)
