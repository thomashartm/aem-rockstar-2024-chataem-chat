'use server'
import {NextRequest, NextResponse} from 'next/server';

/**
 * Required to make our load balancers happy.
 * @param req
 * @constructor
 */
export async function GET(req: NextRequest) {
  return NextResponse.json({message: 'ok'}, {status: 200});
}

export async function POST(req: NextRequest) {
  return NextResponse.json({message: 'ok'}, {status: 200});
}
