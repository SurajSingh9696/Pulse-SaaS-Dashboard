import { NextResponse } from 'next/server';
import { parseCookies, clearAuthCookies } from '@/lib/utils/cookies';
import { verifyRefreshToken } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      
      if (decoded) {
        // Remove refresh token from database
        await User.findByIdAndUpdate(decoded.userId, {
          refreshToken: null
        });
      }
    }

    // Clear cookies
    const [accessCookie, refreshCookie] = clearAuthCookies();

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
