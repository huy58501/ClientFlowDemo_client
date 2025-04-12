import { NextResponse } from "next/server";
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    // Parse cookies from the request headers
    // Extract the "auth_token" from cookies to verify user authentication
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    const token = cookies.auth_token;

    // Decode the token to retrieve user details
    const decodedToken = jwt.decode(token);
    let usernameFromCookie: string | undefined;

    // If the token is not a string and contains a valid username, assign it to usernameFromCookie
    if (typeof decodedToken !== 'string' && decodedToken && 'username' in decodedToken) {
      usernameFromCookie = decodedToken.username;
    }

    // Define the admin username
    const admin = 'admin';

    // Extract username from query parameters (e.g., ?username=username_value)
    const url = new URL(req.url);
    const requestedUsername = url.searchParams.get('username');

    // Check if the token is missing, and return unauthorized if it is
    if (!token) {
      console.log('Error: Token not found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // If the user is an admin, bypass the username mismatch check
    if (usernameFromCookie === admin) {
      const secretKey = process.env.JWT_SECRET_KEY;
      // If the secret key is missing from environment variables, return an internal server error
      if (!secretKey) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
      }
      // Verify the token using the secret key to ensure its validity
      const decoded = jwt.verify(token, secretKey);
      return NextResponse.json({ message: 'Admin Authorized', user: decoded });
    }

    // For non-admin users, check if the requested username matches the username in the cookie
    if (requestedUsername !== usernameFromCookie) {
      return NextResponse.json({ error: 'Forbidden: Username mismatch' }, { status: 403 });
    }

    // Decode and verify the token for normal users (non-admins)
    const secretKey = process.env.JWT_SECRET_KEY;
    // If the secret key is missing, return an internal server error
    if (!secretKey) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // Verify the token to ensure it’s valid
    const decoded = jwt.verify(token, secretKey);
    return NextResponse.json({ message: 'User Authorized' });

  } catch (error) {
    // If an error occurs during the token decoding or verification process, return an unauthorized response
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 401 });
  }
}
