import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(
  request: Request,
  { params }: { params: { animeId: string } }
) {
  try {
    const animeId = params.animeId;
    
    const response = await fetch(`${API_BASE_URL}/api/v1/anime/detail/${animeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch anime detail', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch anime detail', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}