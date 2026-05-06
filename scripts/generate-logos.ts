import fs from 'fs';
import path from 'path';

const players = [
  { slug: 'wetail', name: 'Wetail', color: '#14b8a6' }, // teal-500
  { slug: 'nyehandel', name: 'Nyehandel', color: '#06b6d4' }, // cyan-500
  { slug: 'fraktjakt', name: 'Fraktjakt', color: '#f59e0b' }, // amber-500
  { slug: 'shipmondo', name: 'Shipmondo', color: '#84cc16' }, // lime-500
  { slug: 'postnord', name: 'PostNord', color: '#eab308' }, // yellow-500
  { slug: 'dhl', name: 'DHL', color: '#ef4444' }, // red-500
  { slug: 'bring', name: 'Bring', color: '#22c55e' }, // green-500
  { slug: 'e37', name: 'E37', color: '#a855f7' }, // purple-500
  { slug: 'askas', name: 'Askås', color: '#2563eb' }, // blue-600
  { slug: 'shopify', name: 'Shopify', color: '#059669' }, // emerald-600
  { slug: 'norce', name: 'Norce', color: '#4f46e5' }, // indigo-600
  { slug: 'abicart', name: 'Abicart', color: '#ea580c' }, // orange-600
  { slug: 'webshipper', name: 'Webshipper', color: '#f97316' }, // orange-500
  { slug: 'shipit', name: 'Shipit', color: '#6366f1' }, // indigo-500
];

const logosDir = path.join(process.cwd(), 'public', 'logos');

function generateSVG(name: string, color: string): string {
  return `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}" rx="20"/>
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${name}</text>
</svg>`;
}

players.forEach((player) => {
  const svg = generateSVG(player.name, player.color);
  const filePath = path.join(logosDir, `${player.slug}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${player.slug}.svg`);
});

console.log('All logos generated!');
