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
    
    // Handle the type parameter mapping
    const modifiedParams = new URLSearchParams();
    const hasGenreFilter = searchParams.has('genre');
    
    searchParams.forEach((value, key) => {
      if (key === 'type') {
        // If we have a genre filter, skip type parameter as it may cause conflicts
        if (hasGenreFilter) {

          return;
        }
        
        if (value === 'series') {
          // For series, we want type='Serie'

          modifiedParams.append(key, 'Serie');
          return;
        } else if (value === 'movie') {
          // For movies, we want type='movie'

          modifiedParams.append(key, 'movie');
          return;
        }
      }
      modifiedParams.append(key, value);
    });
    
    const queryString = modifiedParams.toString();
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
      { error: 'Failed to fetch anime list' },
      { status: 500 }
    );
  }
}