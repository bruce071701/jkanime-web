import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ episodeId: string }> }
) {
  try {
    const resolvedParams = await params;
    const episodeId = resolvedParams.episodeId;

    
    const response = await fetch(`${API_BASE_URL}/api/v1/anime/play/${episodeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {

      return NextResponse.json(
        { error: 'Failed to fetch episode data', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();


    return NextResponse.json(data);
  } catch (error) {

    return NextResponse.json(
      { error: 'Failed to fetch episode data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}