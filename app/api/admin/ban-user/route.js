import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import Analytics from '@/lib/models/Analytics';
import Billing from '@/lib/models/Billing';
import Settings from '@/lib/models/Settings';

async function handler(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found with this email' },
        { status: 404 }
      );
    }

    // Prevent admin from banning admin users
    if (user.role === 'admin') {
      return NextResponse.json(
        { success: false, message: 'Cannot ban admin users' },
        { status: 403 }
      );
    }

    const userId = user._id;

    // Delete all related data
    await Promise.all([
      Order.deleteMany({ userId }),
      Analytics.deleteMany({ userId }),
      Billing.deleteMany({ userId }),
      Settings.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    return NextResponse.json({
      success: true,
      message: 'User banned and all data deleted successfully'
    });
  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const DELETE = requireRole(['admin'])(handler);
