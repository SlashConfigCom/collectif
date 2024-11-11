import jwt from 'jsonwebtoken';
import type { AstroGlobal } from 'astro';

// Move these to environment variables in production
const JWT_SECRET = 'your-secret-key-change-this-in-production';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456';

export function isAuthenticated(Astro: AstroGlobal): boolean {
  const token = Astro.cookies.get('token')?.value;
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && decoded.exp && decoded.exp < Date.now() / 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function authenticate(username: string, password: string): Promise<string | null> {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return null;
  }

  return jwt.sign(
    { 
      username,
      iat: Date.now() / 1000,
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    },
    JWT_SECRET
  );
}