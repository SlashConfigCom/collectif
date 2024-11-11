import type { APIRoute } from 'astro';
import { authenticate } from '../../../utils/auth';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();

    if (!username || !password) {
      return redirect('/admin/login?error=1');
    }

    const token = await authenticate(username, password);
    if (!token) {
      return redirect('/admin/login?error=1');
    }

    cookies.set('token', token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 // 1 hour
    });

    return redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    return redirect('/admin/login?error=1');
  }
};