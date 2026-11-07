/**
 * Converts a number to words in Indian Rupee format (Lakhs, Crores)
 * e.g., 125000 -> "Rupees One Lakh Twenty Five Thousand Only"
 */

const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ones[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ones[n] + ' ';
  }
  return str.trim();
}

export function numberToWordsIndian(num: number | string): string {
  const numeric = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  if (isNaN(numeric) || numeric === 0) {
    return 'Rupees Zero Only';
  }

  const integerPart = Math.floor(Math.abs(numeric));
  const decimalPart = Math.round((Math.abs(numeric) - integerPart) * 100);

  let remaining = integerPart;
  let words = '';

  // Crores (>= 1,00,00,000)
  const crore = Math.floor(remaining / 10000000);
  if (crore > 0) {
    words += convertBelowThousand(crore) + ' Crore ';
    remaining %= 10000000;
  }

  // Lakhs (>= 1,00,000)
  const lakh = Math.floor(remaining / 100000);
  if (lakh > 0) {
    words += convertBelowThousand(lakh) + ' Lakh ';
    remaining %= 100000;
  }

  // Thousands (>= 1,000)
  const thousand = Math.floor(remaining / 1000);
  if (thousand > 0) {
    words += convertBelowThousand(thousand) + ' Thousand ';
    remaining %= 1000;
  }

  // Hundreds & Below
  if (remaining > 0) {
    words += convertBelowThousand(remaining);
  }

  words = words.trim();

  let result = `Rupees ${words}`;
  if (decimalPart > 0) {
    result += ` and ${convertBelowThousand(decimalPart)} Paise`;
  }
  result += ' Only';

  return result.replace(/\s+/g, ' ');
}
