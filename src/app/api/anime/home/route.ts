import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';

export async function GET() {
  try {
    console.log('API Proxy: Fetching home data from', `${API_BASE_URL}/api/v1/anime/home`);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/anime/home`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Disable caching for development
    });

    if (!response.ok) {
      console.error('API Proxy Error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch data', status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Proxy: Successfully fetched data');

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}