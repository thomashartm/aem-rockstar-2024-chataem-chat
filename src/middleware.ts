import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  let token = request.headers.get('chataem');
  if(!token || token.length === 0) {
    token = request.nextUrl.searchParams.get('token');
  }

  if(token && token.length > 0) {
    response.headers.set('chataem', token);

    response.cookies.set({
      name: 'chataem',
      value: token,
      path: '/',
      secure: true,
      sameSite: 'none',
    })
  } else {
    console.log('No token present in query parameter: ' +  request.nextUrl.href);
  }

  return response
}
