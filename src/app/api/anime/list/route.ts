import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  try {
    console.log('API Proxy: Handling anime list request');
    
    // Get search parameters from the request
    const { searchParams } = new URL(request.url);
    
    // Handle the type parameter mapping
    const modifiedParams = new URLSearchParams();
    const hasGenreFilter = searchParams.has('genre');
    
    for (const [key, value] of searchParams.entries()) {
      if (key === 'type') {
        // If we have a genre filter, skip type parameter as it may cause conflicts
        if (hasGenreFilter) {
          console.log('API Proxy: Skipping type parameter due to genre filter conflict');
          continue;
        }
        
        if (value === 'series') {
          // For series, we want type='Serie'
          console.log('API Proxy: Requesting series (type=Serie)');
          modifiedParams.append(key, 'Serie');
          continue;
        } else if (value === 'movie') {
          // For movies, we want type='movie'
          console.log('API Proxy: Requesting movies (type=movie)');
          modifiedParams.append(key, 'movie');
          continue;
        }
      }
      modifiedParams.append(key, value);
    }
    
    const queryString = modifiedParams.toString();
    const apiUrl = `${API_BASE_URL}/api/v1/anime/list${queryString ? `?${queryString}` : ''}`;
    console.log('API Proxy: Fetching list data from', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 minutes cache
    });

    if (!response.ok) {
      console.error('API Proxy: Backend API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `Backend API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('API Proxy: Successfully fetched list data');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy: Error fetching list data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch anime list' },
      { status: 500 }
    );
  }
}