import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://javedch.com/wp-json/wp/v2';

// Helper function to replace brand names in text content
function replaceBrandNames(text: string): string {
  if (!text) return text;
  
  return text
    // Replace English variations
    .replace(/JavedCh/gi, 'HasniTube')
    .replace(/Javed Chaudhry/gi, 'Hasni Tube')
    // Replace Urdu variations
    .replace(/جاوید چودھری/g, 'HasniTube')
    .replace(/زیرو پوائنٹ/g, 'HasniTube')
    .replace(/مانیٹرنگ ڈیسک/g, 'ٹیم حسنی');
}

// Helper function to process category and replace brand names
function processCategory(category: any): any {
  return {
    ...category,
    name: replaceBrandNames(category.name),
    description: replaceBrandNames(category.description)
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '100';

  try {
    const response = await fetch(`${WP_API_BASE}/categories?per_page=${perPage}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    
    // Process each category to replace brand names
    const processedCategories = categories.map((category: any) => processCategory(category));
    
    return NextResponse.json({ 
      categories: processedCategories,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ 
      categories: [],
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 });
  }
}