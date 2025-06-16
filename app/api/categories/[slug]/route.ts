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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const response = await fetch(`${WP_API_BASE}/categories?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    
    if (categories.length === 0) {
      return NextResponse.json({ 
        category: null,
        success: false,
        error: 'Category not found'
      }, { status: 404 });
    }
    
    // Process the category to replace brand names
    const processedCategory = processCategory(categories[0]);
    
    return NextResponse.json({ 
      category: processedCategory,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ 
      category: null,
      success: false,
      error: 'Failed to fetch category'
    }, { status: 500 });
  }
}