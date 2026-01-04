import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Billing from '@/lib/models/Billing';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;
    const billing = await Billing.findOne({ userId }).sort({ createdAt: -1 });

    if (!billing) {
      // Return default billing info if none exists
      return NextResponse.json({
        success: true,
        billing: {
          plan: 'Free Tier',
          billingCycle: 'monthly',
          amount: 0,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    return NextResponse.json({
      success: true,
      billing
    });
  } catch (error) {
    console.error('Get billing error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
