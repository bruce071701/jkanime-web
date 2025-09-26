import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    const apiUrl = `${API_BASE_URL}/api/v1/anime/genres`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'JKAnime-Web/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'API request failed', 
          status: response.status,
          statusText: response.statusText,
          url: apiUrl
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Network error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        apiUrl: `${API_BASE_URL}/api/v1/anime/genres`
      },
      { status: 500 }
    );
  }
}