import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import Settings from '@/lib/models/Settings';

async function handler(request) {
  try {
    await dbConnect();

    const userId = request.user.userId;

    if (request.method === 'GET') {
      let settings = await Settings.findOne({ userId });

      if (!settings) {
        // Create default settings
        settings = await Settings.create({
          userId,
          notifications: {
            email: true,
            orderUpdates: true,
            newsletter: false
          },
          privacy: {
            profileVisibility: 'private',
            showEmail: false
          },
          preferences: {
            language: 'en',
            timezone: 'UTC',
            currency: 'USD'
          }
        });
      }

      return NextResponse.json({
        success: true,
        settings
      });
    }

    if (request.method === 'PUT') {
      const body = await request.json();
      
      let settings = await Settings.findOne({ userId });

      if (!settings) {
        settings = await Settings.create({
          userId,
          ...body
        });
      } else {
        settings = await Settings.findOneAndUpdate(
          { userId },
          { $set: body },
          { new: true, runValidators: true }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
        settings
      });
    }

    return NextResponse.json(
      { success: false, message: 'Method not allowed' },
      { status: 405 }
    );
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireAuth(handler);
export const PUT = requireAuth(handler);
