import type { MiddlewareResponseHandler } from 'astro';
import { isAuthenticated } from '../utils/auth';

export const authMiddleware: MiddlewareResponseHandler = async ({ request, cookies, redirect }, next) => {
  const url = new URL(request.url);
  
  // Protected routes
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!isAuthenticated({ cookies } as any)) {
      return redirect('/admin/login');
    }
  }

  // CSRF Protection
  if (request.method === 'POST') {
    const referer = request.headers.get('referer');
    if (!referer || !referer.startsWith(url.origin)) {
      return new Response('Invalid request origin', { status: 403 });
    }
  }

  return next();
};