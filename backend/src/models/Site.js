import mongoose from 'mongoose'

const siteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    trackerCount: {
      type: Number,
      default: 0,
    },
    uniqueTrackerCount: {
      type: Number,
      default: 0,
    },
    thirdPartyCount: {
      type: Number,
      default: 0,
    },
    cookieCount: {
      type: Number,
      default: 0,
    },
    summary: String,
    trackers: [mongoose.Schema.Types.ObjectId],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    lastScanned: Date,
    // Compound unique index: userId + domain (user can have their own copy of global sites)
    // This is handled via index in the schema options
    scanCount: {
      type: Number,
      default: 0,
    },
    // CRITICAL: Historical tracking for "when did behavior change?"
    scoreHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        score: Number,
        trackerCount: Number,
        uniqueTrackerCount: Number,
        thirdPartyCount: Number,
        trackersAdded: [String], // New tracker domains detected
        trackersRemoved: [String], // Tracker domains no longer seen
        changeReason: {
          type: String,
          enum: ['new_tracker', 'tracker_removed', 'increased_frequency', 'decreased_frequency', 'first_scan', 'periodic_snapshot'],
          default: 'periodic_snapshot',
        },
        changeDescription: String, // Human-readable explanation
      },
    ],
  },
  { timestamps: true }
)

// Index for efficient history queries
siteSchema.index({ 'scoreHistory.date': -1 })

export const Site = mongoose.model('Site', siteSchema)
