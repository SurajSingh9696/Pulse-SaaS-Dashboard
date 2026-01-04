// Test MongoDB Connection
// Run with: node scripts/test-db.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function testConnection() {
  console.log('Testing MongoDB connection...\n');
  console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@') || 'Not set');
  console.log('');

  try {
    console.log('Connecting...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!\n');

    // Get database stats
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    console.log('Database Information:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Database Name:', db.databaseName);
    console.log('Collections:', stats.collections);
    console.log('Data Size:', (stats.dataSize / 1024 / 1024).toFixed(2), 'MB');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // List collections
    const collections = await db.listCollections().toArray();
    if (collections.length > 0) {
      console.log('Available Collections:');
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`  - ${collection.name}: ${count} documents`);
      }
    } else {
      console.log('⚠️  No collections found. Run "npm run seed" to populate the database.');
    }

    console.log('\n✅ Connection test successful!');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure MongoDB is running (run "mongod" in terminal)');
    console.error('2. Check your MONGODB_URI in .env.local');
    console.error('3. For MongoDB Atlas, ensure IP whitelist is configured');
    console.error('4. Verify network connection\n');
    process.exit(1);
  }
}

testConnection();
