import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import dbConnect from '@/lib/db/mongodb';
import SystemSettings from '@/lib/models/SystemSettings';

async function getHandler(request) {
  try {
    await dbConnect();

    // Get system settings (only one document should exist)
    let systemSettings = await SystemSettings.findOne();
    if (!systemSettings) {
      systemSettings = await SystemSettings.create({
        maintenanceMode: false,
        registrationPaused: false
      });
    }

    return NextResponse.json({
      success: true,
      systemSettings
    });
  } catch (error) {
    console.error('Admin settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function putHandler(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Update system settings
    if (body.systemSettings) {
      let systemSettings = await SystemSettings.findOne();
      if (!systemSettings) {
        systemSettings = await SystemSettings.create(body.systemSettings);
      } else {
        if (body.systemSettings.maintenanceMode !== undefined) {
          systemSettings.maintenanceMode = body.systemSettings.maintenanceMode;
        }
        if (body.systemSettings.registrationPaused !== undefined) {
          systemSettings.registrationPaused = body.systemSettings.registrationPaused;
        }
        await systemSettings.save();
      }

      return NextResponse.json({
        success: true,
        systemSettings
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No system settings provided'
    });
  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = requireRole(['admin'])(getHandler);
export const PUT = requireRole(['admin'])(putHandler);
