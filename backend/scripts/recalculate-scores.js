#!/usr/bin/env node

import mongoose from 'mongoose'
import { Site } from '../src/models/Site.js'
import { Event } from '../src/models/Event.js'
import { calculatePrivacyScore } from '../src/utils/helpers.js'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privacy-lens'

async function recalculateScores() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Get all sites
    const sites = await Site.find({})
    console.log(`Found ${sites.length} sites to process`)

    let updated = 0
    let skipped = 0

    for (const site of sites) {
      try {
        // Get all events for this site
        const events = await Event.find({ domain: site.domain.toLowerCase() })

        // Recalculate counts from events
        let trackerCount = 0
        let thirdPartyCount = 0
        let cookieCount = 0
        const uniqueTrackerDomains = new Set()

        events.forEach((evt) => {
          trackerCount++ // Count every event
          if (evt.trackerDomain) {
            uniqueTrackerDomains.add(evt.trackerDomain)
          }
          if (evt.metadata?.isThirdParty) thirdPartyCount++
          if (evt.trackerType === 'cookie') cookieCount++
        })

        const uniqueTrackerCount = Math.max(
          uniqueTrackerDomains.size,
          trackerCount > 0 ? 1 : 0
        )

        // Calculate new score
        const newScore = calculatePrivacyScore(trackerCount, thirdPartyCount, cookieCount)

        // Determine risk level
        let riskLevel = 'low'
        if (newScore >= 70) riskLevel = 'high'
        else if (newScore >= 40) riskLevel = 'medium'

        // Check if anything changed
        const changed =
          site.trackerCount !== trackerCount ||
          site.uniqueTrackerCount !== uniqueTrackerCount ||
          site.thirdPartyCount !== thirdPartyCount ||
          site.cookieCount !== cookieCount ||
          site.score !== newScore ||
          site.riskLevel !== riskLevel

        if (changed) {
          await Site.updateOne(
            { _id: site._id },
            {
              $set: {
                trackerCount,
                uniqueTrackerCount,
                thirdPartyCount,
                cookieCount,
                score: newScore,
                riskLevel,
                lastScanned: new Date(),
              },
            }
          )

          console.log(
            `✓ Updated ${site.domain}: score ${site.score} → ${newScore}, trackers: ${site.trackerCount} → ${trackerCount}, 3rdParty: ${site.thirdPartyCount} → ${thirdPartyCount}`
          )
          updated++
        } else {
          skipped++
        }
      } catch (err) {
        console.error(`✗ Error processing ${site.domain}:`, err.message)
      }
    }

    console.log(`\n✅ Migration complete: ${updated} sites updated, ${skipped} sites unchanged`)
  } catch (err) {
    console.error('Fatal error:', err)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

recalculateScores()
