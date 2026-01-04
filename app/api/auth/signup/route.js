import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { generateTokens } from '@/lib/utils/jwt';
import { setAuthCookies } from '@/lib/utils/cookies';

export async function POST(request) {
  try {
    await dbConnect();

    const { fullName, email, password, confirmPassword } = await request.json();

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      role: 'user',
      plan: 'Free Tier'
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookies
    const [accessCookie, refreshCookie] = setAuthCookies(accessToken, refreshToken);

    // Return user data without sensitive information
    const userData = user.toJSON();

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: userData
    });

    response.headers.append('Set-Cookie', accessCookie);
    response.headers.append('Set-Cookie', refreshCookie);

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
