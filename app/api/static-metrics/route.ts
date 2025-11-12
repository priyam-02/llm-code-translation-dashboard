import { NextResponse } from 'next/server';
import { fetchStaticMetrics } from '@/lib/google-sheets';
import { promises as fs } from 'fs';
import path from 'path';

// Enable caching with 1-hour revalidation for better performance
export const revalidate = 3600; // 1 hour in seconds

export async function GET() {
  try {
    // Try to fetch from Google Sheets
    console.log('Attempting to fetch static metrics from Google Sheets...');
    const data = await fetchStaticMetrics();

    console.log(`Successfully fetched ${data.length} records from Google Sheets`);

    return NextResponse.json({
      data: data,
      source: 'google-sheets',
      timestamp: new Date().toISOString(),
      count: data.length,
    });
  } catch (error) {
    // Fallback to local JSON file
    console.error('Google Sheets fetch failed, falling back to local JSON:', error);

    try {
      const filePath = path.join(process.cwd(), 'public', 'static_metrics.json');
      const fileContents = await fs.readFile(filePath, 'utf8');
      const fallbackData = JSON.parse(fileContents);

      console.log(`Successfully loaded ${fallbackData.length} records from fallback JSON`);

      return NextResponse.json({
        data: fallbackData,
        source: 'fallback-json',
        timestamp: new Date().toISOString(),
        count: fallbackData.length,
        warning: 'Using cached data due to Google Sheets API error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } catch (fallbackError) {
      // If even fallback fails, return error
      console.error('Fallback JSON also failed:', fallbackError);

      return NextResponse.json(
        {
          error: 'Failed to fetch data from both Google Sheets and fallback JSON',
          details: {
            googleSheetsError: error instanceof Error ? error.message : 'Unknown error',
            fallbackError: fallbackError instanceof Error ? fallbackError.message : 'Unknown error',
          },
        },
        { status: 500 }
      );
    }
  }
}
