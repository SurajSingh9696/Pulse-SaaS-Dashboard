import { NextResponse } from 'next/server';
import { parseCookies, setAuthCookies } from '@/lib/utils/cookies';
import { verifyRefreshToken, generateTokens } from '@/lib/utils/jwt';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Refresh token not found' },
        { status: 401 }
      );
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json(
        { success: false, message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new cookies
    const [accessCookie, refreshCookie] = setAuthCookies(accessToken, newRefreshToken);

    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully'
    });

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
