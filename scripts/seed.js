// Database Seeder Script
// Run this with: node scripts/seed.js

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Models
const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: String,
  company: String,
  avatar: String,
  refreshToken: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  orderId: String,
  amount: Number,
  status: String,
  items: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const analyticsSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  label: String,
  value: Number,
  date: Date,
  metadata: Object
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);

// Sample Data
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Order.deleteMany({});
    await Analytics.deleteMany({});

    // Create Admin User
    console.log('Creating admin user...');
    const adminPassword = await hashPassword('admin123');
    const admin = await User.create({
      fullName: 'Suraj Singh',
      email: 'admin@pulse.com',
      password: adminPassword,
      role: 'admin',
      plan: 'Enterprise',
      company: 'Pulse Inc',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    console.log('Admin created:', admin.email);

    // Create Regular Users
    console.log('Creating regular users...');
    const userPassword = await hashPassword('password123');
    
    const users = await User.insertMany([
      {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: userPassword,
        role: 'user',
        plan: 'Pro Plan',
        company: 'Acme Corporation'
      },
      {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: userPassword,
        role: 'user',
        plan: 'Free Tier',
        company: 'Tech Startup'
      },
      {
        fullName: 'Bob Wilson',
        email: 'bob@example.com',
        password: userPassword,
        role: 'user',
        plan: 'Enterprise',
        company: 'Global Corp'
      },
      {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        password: userPassword,
        role: 'user',
        plan: 'Pro Plan',
        company: 'Design Studio'
      },
      {
        fullName: 'Charlie Brown',
        email: 'charlie@example.com',
        password: userPassword,
        role: 'user',
        plan: 'Free Tier',
        company: 'Freelance'
      }
    ]);
    console.log(`Created ${users.length} regular users`);

    // Create Orders for each user
    console.log('Creating orders...');
    const statuses = ['Completed', 'Processing', 'Pending', 'Completed', 'Completed'];
    const orderCount = { total: 0 };
    
    for (let user of users) {
      const userOrders = [];
      const numOrders = Math.floor(Math.random() * 10) + 5; // 5-15 orders per user
      
      for (let i = 0; i < numOrders; i++) {
        const daysAgo = Math.floor(Math.random() * 365);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        userOrders.push({
          userId: user._id,
          orderId: `#ORD-${3000 + orderCount.total + i}`,
          amount: Math.floor(Math.random() * 500) + 50,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          items: [
            {
              name: 'Product ' + (i + 1),
              quantity: Math.floor(Math.random() * 3) + 1,
              price: Math.floor(Math.random() * 200) + 20
            }
          ],
          createdAt
        });
      }
      
      await Order.insertMany(userOrders);
      orderCount.total += numOrders;
    }
    console.log(`Created ${orderCount.total} orders`);

    // Create Analytics Data
    console.log('Creating analytics data...');
    const analyticsData = [];
    
    for (let user of users) {
      // Create monthly analytics for the last 12 months
      for (let month = 0; month < 12; month++) {
        const date = new Date();
        date.setMonth(date.getMonth() - month);
        
        analyticsData.push({
          userId: user._id,
          type: 'usage',
          label: `Usage - Month ${month}`,
          value: Math.floor(Math.random() * 100) + 20,
          date,
          metadata: { month: date.getMonth(), year: date.getFullYear() }
        });
        
        analyticsData.push({
          userId: user._id,
          type: 'revenue',
          label: `Revenue - Month ${month}`,
          value: Math.floor(Math.random() * 1000) + 100,
          date,
          metadata: { month: date.getMonth(), year: date.getFullYear() }
        });
      }
    }
    
    await Analytics.insertMany(analyticsData);
    console.log(`Created ${analyticsData.length} analytics records`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Account:');
    console.log('  Email: admin@pulse.com');
    console.log('  Password: admin123');
    console.log('\nUser Account:');
    console.log('  Email: john@example.com');
    console.log('  Password: password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
