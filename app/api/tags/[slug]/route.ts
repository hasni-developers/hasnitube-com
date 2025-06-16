import { replaceBrandNames } from '@/lib/replaceBrandNames';
import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://javedch.com/wp-json/wp/v2';


// Helper function to process tag and replace brand names
function processTag(tag: any): any {
  return {
    ...tag,
    name: replaceBrandNames(tag.name),
    description: replaceBrandNames(tag.description)
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const response = await fetch(`${WP_API_BASE}/tags?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tags = await response.json();

    if (tags.length === 0) {
      return NextResponse.json({
        tag: null,
        success: false,
        error: 'Tag not found'
      }, { status: 404 });
    }

    // Process the tag to replace brand names
    const processedTag = processTag(tags[0]);

    return NextResponse.json({
      tag: processedTag,
      success: true
    });
  } catch (error) {
    console.error('Error fetching tag:', error);
    return NextResponse.json({
      tag: null,
      success: false,
      error: 'Failed to fetch tag'
    }, { status: 500 });
  }
}