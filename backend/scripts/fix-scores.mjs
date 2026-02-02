import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const siteSchema = new mongoose.Schema({
  domain: String,
  score: Number,
  trackerCount: Number,
  uniqueTrackerCount: Number,
  thirdPartyCount: Number,
  cookieCount: Number,
}, { collection: 'sites' });

const Site = mongoose.model('Site', siteSchema);

const calculateScore = (trackerCount, thirdPartyCount, cookieCount) => {
  // New formula: square root scaling for better distribution
  const score = 
    (Math.sqrt(trackerCount) * 5) +
    (Math.log(Math.max(thirdPartyCount, 1)) * 4) +
    (Math.sqrt(Math.max(cookieCount, 0)) * 1.5);
  return Math.min(Math.round(score), 100);
};

(async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/privacy-lens';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    
    const sites = await Site.find({ score: 0, trackerCount: { $gt: 0 } });
    console.log(`Found ${sites.length} sites with score=0 but trackerCount > 0`);
    
    for (const site of sites) {
      const newScore = calculateScore(site.trackerCount, site.thirdPartyCount || 0, site.cookieCount || 0);
      const riskLevel = newScore >= 81 ? 'high' : newScore >= 61 ? 'medium' : 'low';
      
      await Site.updateOne(
        { _id: site._id },
        { $set: { score: newScore, riskLevel } }
      );
      
      console.log(`✓ ${site.domain}: score 0 → ${newScore}`);
    }
    
    console.log(`\n✅ Fixed ${sites.length} sites`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
