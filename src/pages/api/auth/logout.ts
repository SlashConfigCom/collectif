import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete('token', { 
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict'
  });
  return redirect('/admin/login');
};