import { NextResponse } from 'next/server';
import { buildManifest } from '@/lib/miniapp';

export async function GET() {
  return NextResponse.json(buildManifest(), {
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
}
