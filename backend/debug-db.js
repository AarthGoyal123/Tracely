import mongoose from 'mongoose'
import { Site } from './src/models/Site.js'

async function debug() {
  try {
    await mongoose.connect('mongodb://localhost:27017/privacy-lens')
    console.log('Connected to MongoDB')
    
    const sites = await Site.find().lean()
    console.log('\n=== All Sites in Database ===')
    console.log(`Total: ${sites.length}\n`)
    
    sites.forEach((site, i) => {
      console.log(`${i + 1}. Domain: ${site.domain}`)
      console.log(`   Score: ${site.score}, Trackers: ${site.trackerCount}, 3rdParty: ${site.thirdPartyCount}`)
      console.log()
    })
    
    if (sites.length > 0) {
      console.log('=== Sample Site ===')
      console.log(JSON.stringify(sites[0], null, 2))
    }
    
    await mongoose.disconnect()
  } catch (err) {
    console.error('Error:', err)
  }
}

debug()
