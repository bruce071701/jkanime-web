import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    console.log('API Proxy: Fetching genres data from', `${API_BASE_URL}/api/v1/anime/genres`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/anime/genres`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // 1 hour cache for genres
    });

    if (!response.ok) {
      console.error('API Proxy: Backend API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Proxy: Successfully fetched genres data');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy: Error fetching genres data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    );
  }
}