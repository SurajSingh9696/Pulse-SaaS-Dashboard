import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

async function handler(request) {
  try {
    await dbConnect();

    const user = await User.findById(request.user.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
