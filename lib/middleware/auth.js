import { NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/lib/utils/jwt';
import { parseCookies, setAuthCookies } from '@/lib/utils/cookies';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';

export async function authMiddleware(request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    
    let accessToken = cookies.accessToken;
    const refreshToken = cookies.refreshToken;

    // Try to verify access token
    let decoded = verifyAccessToken(accessToken);

    // If access token is invalid but refresh token exists, try to refresh
    if (!decoded && refreshToken) {
      const refreshDecoded = verifyRefreshToken(refreshToken);
      
      if (refreshDecoded) {
        await dbConnect();
        const user = await User.findById(refreshDecoded.userId).select('+refreshToken');
        
        if (user && user.refreshToken === refreshToken) {
          // Generate new access token
          const payload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role
          };
          accessToken = generateAccessToken(payload);
          decoded = payload;
          
          // Set new access token in response
          request.newAccessToken = accessToken;
        }
      }
    }

    if (!decoded) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      };
    }

    return {
      authenticated: true,
      user: decoded,
      newAccessToken: request.newAccessToken
    };
  } catch (error) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, message: 'Authentication failed' },
        { status: 401 }
      )
    };
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const authResult = await authMiddleware(request);
    
    if (!authResult.authenticated) {
      return authResult.response;
    }

    request.user = authResult.user;
    const response = await handler(request, context);

    // If we generated a new access token, set it in the response
    if (authResult.newAccessToken) {
      response.headers.set(
        'Set-Cookie',
        `accessToken=${authResult.newAccessToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=900; Path=/`
      );
    }

    return response;
  };
}

export function requireRole(roles) {
  return (handler) => {
    return requireAuth(async (request, context) => {
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      if (!allowedRoles.includes(request.user.role)) {
        return NextResponse.json(
          { success: false, message: 'Forbidden' },
          { status: 403 }
        );
      }
      return handler(request, context);
    });
  };
}
