// Helper function to replace brand names in text content
export function replaceBrandNames(text: string): string {
  if (!text) return text;
  
  return text
    // Replace English variations
    .replace(/JavedCh/gi, 'HasniTube')
    .replace(/Javed Chaudhry/gi, 'Hasni Tube')
    // Replace Urdu variations
    .replace(/جاوید چودھری/g, 'Hasni Tube')
    .replace(/زیرو پوائنٹ/g, 'Hasni Tube')
    .replace(/نیوز ڈیسک/g, 'Hasni Tube')
    .replace(/مانیٹرنگ ڈیسک/g, 'Hasni Tube');
}