import express from 'express'
import { Event } from '../models/Event.js'
import { Site } from '../models/Site.js'
import { Tracker } from '../models/Tracker.js'
import { extractDomain, isThirdParty, calculatePrivacyScore } from '../utils/helpers.js'
import { getTrackerInfo, detectFingerprinting } from '../utils/trackers.js'
import { recordScoreSnapshot } from '../utils/change-detection.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { domain, requestUrl, trackerDomain, metadata } = req.body

    console.log('[Events API] Received tracker report:', { domain, trackerDomain, requestUrl })

    if (!domain) {
      console.error('[Events API] Missing domain in request body')
      return res.status(400).json({ error: 'Domain is required' })
    }

    const trackerInfo = getTrackerInfo(trackerDomain)
    const isThirdPartyRequest = isThirdParty(trackerDomain, domain)

    const event = new Event({
      domain: domain.toLowerCase(),
      requestUrl,
      trackerDomain: trackerDomain.toLowerCase(),
      ...trackerInfo,
      metadata: {
        ...metadata,
        isThirdParty: isThirdPartyRequest,
        isFingerprinting: detectFingerprinting(metadata),
      },
    })

    await event.save()

    // Update site counts using aggregation (memory-efficient)
    const aggregationResult = await Event.aggregate([
      { $match: { domain: domain.toLowerCase() } },
      {
        $group: {
          _id: null,
          trackerCount: { $sum: 1 },
          uniqueTrackerCount: { $addToSet: '$trackerDomain' },
          thirdPartyCount: { $sum: { $cond: ['$metadata.isThirdParty', 1, 0] } },
          cookieCount: { $sum: { $cond: [{ $eq: ['$trackerType', 'cookie'] }, 1, 0] } },
        },
      },
    ])

    const aggregated = aggregationResult[0] || { trackerCount: 0, uniqueTrackerCount: [], thirdPartyCount: 0, cookieCount: 0 }
    const trackerCount = aggregated.trackerCount
    const thirdPartyCount = aggregated.thirdPartyCount
    const cookieCount = aggregated.cookieCount
    const uniqueTrackerDomains = new Set(aggregated.uniqueTrackerCount || [])
    
    const uniqueTrackerCount = Math.max(uniqueTrackerDomains.size, trackerCount > 0 ? 1 : 0)
    const score = calculatePrivacyScore(trackerCount, thirdPartyCount, cookieCount)
    
    console.log(`[Events API] Updated ${domain.toLowerCase()}: score=${score}, trackers=${trackerCount}, 3rdParty=${thirdPartyCount}`)
    
   
    let riskLevel = 'low'
    if (score >= 81) riskLevel = 'high'
    else if (score >= 61) riskLevel = 'medium'

    const site = await Site.findOneAndUpdate(
      { domain: domain.toLowerCase() },
      {
        $set: {
          trackerCount,
          uniqueTrackerCount,
          thirdPartyCount,
          cookieCount,
          score,
          riskLevel,
          lastScanned: new Date(),
        },
        $inc: { scanCount: 1 },
        $setOnInsert: {
          domain: domain.toLowerCase(),
          createdAt: new Date(),
        }
      },
      { upsert: true, new: true }
    )

    const currentTrackerDomains = [...uniqueTrackerDomains]
    const { snapshot, changeDetection } = recordScoreSnapshot(site, currentTrackerDomains)
    
    await Site.updateOne(
      { _id: site._id },
      {
        $push: {
          scoreHistory: {
            $each: [snapshot],
            $slice: -30,
          },
        },
      }
    )
    
    if (changeDetection.hasChanges) {
      console.log(`[Change Detection] ${domain}: ${changeDetection.changeDescription}`)
    }

    await Tracker.findOneAndUpdate(
      { domain: trackerDomain.toLowerCase() },
      {
        $set: {
          ...trackerInfo,
        },
        $inc: { sightingCount: 1 },
        $setOnInsert: {
          domain: trackerDomain.toLowerCase(),
          firstSeen: new Date(),
        }
      },
      { upsert: true, new: true }
    )

    res.status(201).json({
      success: true,
      data: { 
        event,
        changeDetection: changeDetection.hasChanges ? changeDetection : undefined,
      },
    })
  } catch (err) {
    console.error('Error creating event:', err)
    res.status(500).json({ error: 'Failed to create event' })
  }
})

export default router
