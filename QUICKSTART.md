# Quick Start Guide

## Setup in 5 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
Update `MONGODB_URI` in `.env.local` with your Atlas connection string

### 3. Seed Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Login
Open http://localhost:3000/auth

**Admin Login:**
- Email: `admin@pulse.com`
- Password: `admin123`

**User Login:**
- Email: `john@example.com`
- Password: `password123`

## What's Included

✅ Full authentication system with JWT access & refresh tokens
✅ MongoDB database with Mongoose models
✅ Protected API routes with middleware
✅ Admin dashboard with user & order management
✅ User dashboard with personal analytics
✅ Real-time charts and statistics
✅ HTTP-only cookies for secure token storage
✅ Role-based access control
✅ Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Auth**: JWT with bcrypt password hashing
- **Charts**: Chart.js & react-chartjs-2

## Project Structure

```
pulse-dashboard/
├── app/
│   ├── api/          # API routes (auth, admin, user)
│   ├── admin/        # Admin dashboard
│   ├── user/         # User dashboard
│   └── auth/         # Login/Signup page
├── lib/
│   ├── db/           # MongoDB connection
│   ├── models/       # Mongoose schemas
│   ├── middleware/   # Auth middleware
│   └── utils/        # JWT & cookie utilities
└── scripts/
    └── seed.js       # Database seeder
```

## Troubleshooting

**MongoDB not connecting?**
- Check if MongoDB is running: `mongod --version`
- Verify `.env.local` has correct `MONGODB_URI`

**Can't login?**
- Run seed script: `npm run seed`
- Clear browser cookies
- Check console for errors

**Charts not showing?**
- Ensure seed script completed successfully
- Check API routes are returning data

## Next Steps

1. Explore the admin dashboard at `/admin`
2. Check user dashboard at `/user`
3. Review API routes in `app/api/`
4. Customize UI components
5. Add your own features!

For detailed documentation, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)
