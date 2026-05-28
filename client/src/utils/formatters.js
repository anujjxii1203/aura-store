const fallbackSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600">
  <rect width="480" height="600" fill="#f4f4f4"/>
  <rect x="110" y="120" width="260" height="330" rx="24" fill="#ffffff" stroke="#dedede" stroke-width="10"/>
  <path d="M180 200h120l34 58-38 24-18-30v138H202V252l-18 30-38-24 34-58z" fill="#d9d9d9"/>
  <text x="240" y="505" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="#777">AURA STORE</text>
</svg>`;

export const FALLBACK_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(fallbackSvg)}`;

export function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(toNumber(value)));
}

export function getOriginalPrice(price, discountPercent = 30) {
  const discountMultiplier = 1 - discountPercent / 100;
  return Math.round(toNumber(price) / discountMultiplier);
}
