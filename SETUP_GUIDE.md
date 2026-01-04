# Pulse Dashboard - Full Stack Application

A modern, full-stack dashboard application built with Next.js 14, MongoDB, and JWT authentication with refresh tokens.

## Features

✨ **Authentication System**
- Secure JWT-based authentication with access and refresh tokens
- HTTP-only cookies for token storage
- Automatic token refresh mechanism
- Password hashing with bcrypt
- Role-based access control (Admin/User)

📊 **Dashboard Analytics**
- Real-time statistics and metrics
- Interactive charts (Line, Bar, Doughnut) using Chart.js
- Revenue tracking and user demographics
- Order management system

🎨 **Modern UI**
- Clean and responsive design with Tailwind CSS
- Lucide React icons
- Mobile-friendly interface
- Smooth animations and transitions

🔐 **Security**
- HTTP-only cookies
- CSRF protection via SameSite cookies
- Password validation
- Protected API routes with middleware

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT (jsonwebtoken), bcryptjs
- **Charts**: Chart.js, react-chartjs-2
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- MongoDB installed and running locally, or a MongoDB Atlas account
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd pulse-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env.local` file has been created with default values. Update it if needed:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pulse-dashboard
   JWT_ACCESS_SECRET=your-super-secret-access-token-key-change-this-in-production
   JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
   JWT_ACCESS_EXPIRY=15m
   JWT_REFRESH_EXPIRY=7d
   NODE_ENV=development
   ```

   **⚠️ Important**: Change the JWT secrets in production!

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   # Windows
   mongod

   # Mac/Linux
   sudo systemctl start mongod
   ```

   Or use MongoDB Atlas and update the `MONGODB_URI` in `.env.local`

5. **Seed the database**
   ```bash
   npm run seed
   ```

   This will create:
   - 1 Admin account
   - 5 Regular user accounts
   - Sample orders
   - Analytics data

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Test Accounts

After seeding the database, you can login with:

### Admin Account
- **Email**: admin@pulse.com
- **Password**: admin123
- **Access**: Full admin dashboard with user management

### User Account
- **Email**: john@example.com
- **Password**: password123
- **Access**: User dashboard with personal analytics

## Project Structure

```
pulse-dashboard/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── login/         # POST /api/auth/login
│   │   │   ├── signup/        # POST /api/auth/signup
│   │   │   ├── logout/        # POST /api/auth/logout
│   │   │   ├── refresh/       # POST /api/auth/refresh
│   │   │   └── me/            # GET /api/auth/me
│   │   ├── admin/             # Admin endpoints
│   │   │   ├── stats/         # GET /api/admin/stats
│   │   │   ├── users/         # GET /api/admin/users
│   │   │   ├── orders/        # GET /api/admin/orders
│   │   │   ├── revenue-chart/ # GET /api/admin/revenue-chart
│   │   │   └── demographics-chart/
│   │   └── user/              # User endpoints
│   │       ├── stats/         # GET /api/user/stats
│   │       ├── orders/        # GET /api/user/orders
│   │       └── spending-chart/# GET /api/user/spending-chart
│   ├── admin/                 # Admin dashboard page
│   ├── user/                  # User dashboard page
│   ├── auth/                  # Authentication page
│   ├── layout.jsx             # Root layout
│   ├── page.jsx               # Home page
│   └── globals.css            # Global styles
├── lib/
│   ├── db/
│   │   └── mongodb.js         # MongoDB connection
│   ├── models/                # Mongoose models
│   │   ├── User.js           # User model
│   │   ├── Order.js          # Order model
│   │   ├── Analytics.js      # Analytics model
│   │   └── Stats.js          # Stats model
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── utils/
│   │   ├── jwt.js            # JWT utilities
│   │   └── cookies.js        # Cookie utilities
│   └── data/                 # Static data/config
│       ├── adminData.js
│       ├── userData.js
│       └── authData.js
├── scripts/
│   └── seed.js               # Database seeding script
├── .env.local                # Environment variables
├── next.config.mjs           # Next.js configuration
├── tailwind.config.cjs       # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## API Routes

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/logout` - Logout and clear tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Admin (Requires Admin Role)
- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/revenue-chart` - Get revenue chart data
- `GET /api/admin/demographics-chart` - Get user demographics
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/orders` - List all orders (paginated)

### User (Requires Authentication)
- `GET /api/user/stats` - Get user dashboard statistics
- `GET /api/user/spending-chart` - Get spending trend data
- `GET /api/user/orders` - Get user's orders (paginated)

## Authentication Flow

1. **Login**: User submits credentials → Server validates → Generates access & refresh tokens → Sets HTTP-only cookies
2. **Protected Routes**: Access token validated on each request → Auto-refresh if expired but refresh token valid
3. **Logout**: Clears tokens from database and cookies

## Database Models

### User
- fullName, email, password (hashed)
- role (admin/user)
- plan (Free Tier/Pro Plan/Enterprise)
- company, avatar
- refreshToken (for authentication)

### Order
- userId (reference to User)
- orderId, amount, status
- items array
- timestamps

### Analytics
- userId, type, label, value
- date, metadata
- For tracking usage and revenue data

## Key Features Implementation

### Double Token Authentication
- **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie and database
- Automatic refresh when access token expires

### Protected Routes
- Middleware validates tokens before accessing protected pages
- Role-based access control for admin-only routes
- Automatic redirect to auth page if unauthorized

### Real-time Data
- All dashboard data fetched from MongoDB
- No mocked/static data
- Dynamic charts and statistics

## Development Notes

### Adding New API Routes
1. Create route file in `app/api/[route-name]/route.js`
2. Use `requireAuth` or `requireRole` middleware
3. Connect to database with `dbConnect()`
4. Return JSON responses with NextResponse

### Adding New Models
1. Create model in `lib/models/[ModelName].js`
2. Define schema with mongoose
3. Add timestamps and indexes as needed
4. Export with: `export default mongoose.models.ModelName || mongoose.model('ModelName', schema)`

### Environment Variables
Always keep secrets in `.env.local` and never commit this file to version control.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check Atlas connection
- Verify MONGODB_URI in `.env.local`
- Check firewall settings

### Authentication Not Working
- Clear browser cookies
- Check JWT secrets are set in `.env.local`
- Verify tokens haven't expired

### Charts Not Displaying
- Run seed script to populate data: `npm run seed`
- Check browser console for errors
- Verify API endpoints are returning data

## Security Considerations

- JWT secrets should be strong and unique in production
- Use HTTPS in production
- Keep dependencies updated
- Implement rate limiting for API routes
- Add CSRF protection for production
- Validate and sanitize all user inputs

## Future Enhancements

- Email verification
- Password reset functionality
- Two-factor authentication
- Real-time notifications
- Advanced analytics and reporting
- Export data functionality
- Admin user management features
- Audit logs

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
