export const formatPrice = (priceInMNT: number, lang: string) => {
  let currency = 'MNT';
  let convertedPrice = priceInMNT;

  switch (lang) {
    case 'en':
      currency = 'USD';
      convertedPrice = priceInMNT / 3450;
      break;
    case 'de':
      currency = 'EUR';
      convertedPrice = priceInMNT / 3700;
      break;
    case 'ko':
      currency = 'KRW';
      convertedPrice = priceInMNT / 2.6;
      break;
    case 'mn':
    default:
      currency = 'MNT';
      convertedPrice = priceInMNT;
      break;
  }

  const roundedPrice = Math.round(convertedPrice);

  const localeMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE',
    ko: 'ko-KR',
    mn: 'mn-MN'
  };

  return new Intl.NumberFormat(localeMap[lang] || 'mn-MN', {
    style: 'currency',
    currency: currency,
    // Ensure deterministic SSR/CSR output across Node vs browser ICU data.
    // Using `code` avoids symbol differences like "₮" vs "MNT" that can cause hydration warnings.
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).formatToParts(roundedPrice);
};
