import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(
  request: Request,
  { params }: { params: { episodeId: string } }
) {
  try {
    const episodeId = params.episodeId;
    console.log('API Proxy: Fetching episode play data for ID', episodeId);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/anime/play/${episodeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Proxy Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch episode data', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Proxy: Successfully fetched episode data');

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch episode data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}