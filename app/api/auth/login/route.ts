import { NextResponse } from "next/server";
import { API_ROUTES } from "@/src/config/api";

const convertDate = () => {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(now);

  const getPart = (type: string) =>
    parts.find((p) => p.type === type)?.value.padStart(2, "0") ?? "00";

  const rawYear = getPart("year");
  const rawMonth = getPart("month");
  const rawDay = getPart("day");
  const rawHour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  let year = parseInt(rawYear, 10);
  let month = parseInt(rawMonth, 10);
  let day = parseInt(rawDay, 10);
  let hour = rawHour;

  // Fix invalid hour 24
  if (hour === "24") {
    hour = "00";
    const next = new Date(Date.UTC(year, month - 1, day));
    next.setUTCDate(next.getUTCDate() + 1);
    year = next.getUTCFullYear();
    month = next.getUTCMonth() + 1;
    day = next.getUTCDate();
  }

  const formatted = `${year.toString().padStart(4, '0')}-${month
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour}:${minute}:${second}`;

  return formatted;
};

export async function POST(req: Request) {
  try {
    let ip = req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") || // Cloudflare support
      req.headers.get("fastly-client-ip") || // Fastly support
      req.headers.get("x-cluster-client-ip") ||
      req.headers.get("forwarded")?.split(";")[0].split("=")[1] ||
      "Unknown IP";
    // If running locally, override with a placeholder (useful for testing)
    if (ip === "::1" || ip === "127.0.0.1") {
      ip = "Localhost Testing IP";
    }

    const { username, password, userAgent } = await req.json();
    const api_key = process.env.API_KEY;

    // Get current timestamp
    const loginTime = convertDate();

    // Validate the input data
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    console.log("ip: ", ip);
    console.log("loginTime: ", loginTime);
    console.log("userAgent: ", userAgent);

    const response = await fetch(API_ROUTES.LOGIN, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "x-api-key": api_key || '',
      }),
      body: JSON.stringify({
        username,
        password,
        ip,
        loginTime,
        userAgent,
        api_key
      }),
    });

    // Handle non-OK response from backend
    if (!response.ok) {
      throw new Error("Failed to login");
    }

    // Get the response data from PHP backend (which includes success/failure info)
    const data = await response.json();
    console.log("data: ", data);
    // If login is successful, create JWT token
    if (data.success) {
      const token = data.token;

      // Create Next.js Response and set JWT token as HttpOnly cookie
      const nextResponse = NextResponse.json({
        success: true,
        message: data.message,
      });

      nextResponse.cookies.set('auth_token', token, {
        httpOnly: true,  // The cookie can't be accessed via JavaScript
        secure: process.env.NODE_ENV === 'production', // Make secure true in production
        path: '/',  // Accessible on all paths
        sameSite: 'strict',  // Helps prevent CSRF attacks
        maxAge: 3600,  // Expiry time for the token (1 hour)
      });

      return nextResponse;
    }

    return NextResponse.json({ error: "Invalid username or password", details: data.message }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to login", details: (error as Error).message }, { status: 500 });
  }
}
