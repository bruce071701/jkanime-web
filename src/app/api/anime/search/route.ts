import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-jk.funnyu.xyz';

// 强制动态渲染
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get search parameters from the request URL
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const query = searchParams.get('q') || searchParams.get('query');
    const page = searchParams.get('page') || '1';
    const size = searchParams.get('size') || '24';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Build API URL for search
    const params = new URLSearchParams();
    params.append('keyword', query);
    params.append('page', page);
    params.append('size', size);
    
    const queryString = params.toString();
    const apiUrl = `${API_BASE_URL}/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search anime' },
      { status: 500 }
    );
  }
}