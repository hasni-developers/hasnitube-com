// Helper function to replace brand names in text content
export function replaceBrandNames(text: string): string {
  if (!text) return text;
  
  return text
    // Replace English variations
    .replace(/JavedCh/gi, 'HasniTube')
    .replace(/Javed Chaudhry/gi, 'Hasni Tube')
    // Replace Urdu variations
    .replace(/جاوید چودھری/g, 'HasniTube')
    .replace(/زیرو پوائنٹ/g, 'HasniTube')
    .replace(/نیوز ڈیسک/g, 'ٹیم حسنی')
    .replace(/مانیٹرنگ ڈیسک/g, 'ٹیم حسنی');
}