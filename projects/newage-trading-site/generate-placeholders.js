// 生成 SVG 占位图片
// 用法: node generate-placeholders.js

import { mkdirSync, writeFileSync } from 'fs';

const CARS = [
  { id: 'byd-atto3', brand: 'BYD', model: 'Atto 3', color: '#1e3a5f' },
  { id: 'byd-dolphin', brand: 'BYD', model: 'Dolphin', color: '#1e4a8e' },
  { id: 'byd-han', brand: 'BYD', model: 'Han', color: '#1a1a2e' },
  { id: 'byd-qin-plus', brand: 'BYD', model: 'Qin Plus', color: '#0f3460' },
  { id: 'byd-seagull', brand: 'BYD', model: 'Seagull', color: '#16213e' },
  { id: 'byd-seal', brand: 'BYD', model: 'Seal', color: '#1b2a4a' },
  { id: 'byd-song-plus', brand: 'BYD', model: 'Song Plus', color: '#2c3e6b' },
  { id: 'changan-deepal-s7', brand: 'Changan', model: 'Deepal S7', color: '#1e3a5f' },
  { id: 'chery-omoda5', brand: 'Chery', model: 'Omoda 5', color: '#253550' },
  { id: 'geely-monjaro', brand: 'Geely', model: 'Monjaro', color: '#1a2744' },
  { id: 'geely-starray', brand: 'Geely', model: 'Starray', color: '#1e3a5f' },
  { id: 'gwm-p300', brand: 'GWM', model: 'Tank 300', color: '#2d2d2d' },
  { id: 'li-auto-l9', brand: 'Li Auto', model: 'L9', color: '#1a1a1a' },
  { id: 'mg4-ev', brand: 'MG', model: 'MG4 EV', color: '#1e3a5f' },
  { id: 'mg5-ev', brand: 'MG', model: 'MG5 EV', color: '#0f3460' },
  { id: 'nio-et5', brand: 'NIO', model: 'ET5', color: '#2c3e50' },
  { id: 'ora-funky-cat', brand: 'ORA', model: 'Funky Cat', color: '#4a235a' },
  { id: 'xpeng-p7', brand: 'XPeng', model: 'P7', color: '#1a1a3e' },
];

const SECURITY = [
  'access-control', 'alarm-system', 'dahua-dome', 'dahua-nvr',
  'dahua-ptz', 'dahua-wizsense', 'dahua-xvr', 'hikvision-colorvu',
  'hikvision-darkfighter', 'hikvision-dome', 'hikvision-nvr', 'hikvision-ptz',
  'tiandy-bullet', 'uniview-bullet'
];

function carSVG(car) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${car.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="800" height="450" fill="url(#bg)"/>
  
  <!-- Grid pattern -->
  <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
    ${Array.from({length: 12}, (_, i) => `<line x1="${i*70}" y1="0" x2="${i*70}" y2="450"/>`).join('')}
    ${Array.from({length: 8}, (_, i) => `<line x1="0" y1="${i*60}" x2="800" y2="${i*60}"/>`).join('')}
  </g>
  
  <!-- Car silhouette -->
  <g transform="translate(150, 120)" filter="url(#shadow)">
    <path d="M50,180 L80,180 L100,140 L140,100 L200,80 L260,75 L320,80 L380,100 L420,140 L440,160 L470,180 L500,180" 
          fill="none" stroke="rgba(196,163,90,0.6)" stroke-width="3" stroke-linecap="round"/>
    <!-- Wheels -->
    <circle cx="140" cy="195" r="30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <circle cx="140" cy="195" r="15" fill="none" stroke="rgba(196,163,90,0.4)" stroke-width="2"/>
    <circle cx="390" cy="195" r="30" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>
    <circle cx="390" cy="195" r="15" fill="none" stroke="rgba(196,163,90,0.4)" stroke-width="2"/>
    <!-- Body line -->
    <path d="M30,180 L500,180" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  </g>
  
  <!-- Brand badge -->
  <rect x="620" y="40" width="140" height="40" rx="20" fill="rgba(196,163,90,0.2)" stroke="rgba(196,163,90,0.5)" stroke-width="1"/>
  <text x="690" y="65" text-anchor="middle" fill="#c4a35a" font-family="Arial,sans-serif" font-size="16" font-weight="bold">${car.brand}</text>
  
  <!-- Model text -->
  <text x="400" y="380" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="32" font-weight="bold">${car.model}</text>
  <text x="400" y="410" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" font-size="16">${car.brand} ${car.model}</text>
</svg>`;
}

function securitySVG(name) {
  const isHik = name.includes('hik');
  const isDahua = name.includes('dahua');
  const brand = isHik ? 'Hikvision' : isDahua ? 'Dahua' : name.split('-')[0].toUpperCase();
  const product = name.replace(/hikvision-|dahua-|tiandy-|uniview-/g, '').replace(/-/g, ' ');
  const icons = {
    'dome': '🔴', 'ptz': '📹', 'nvr': '🖥️', 'bullet': '📷',
    'access-control': '🔐', 'alarm-system': '🚨', 'colorvu': '🌈',
    'darkfighter': '🌙', 'wizsense': '🧠', 'xvr': '📼'
  };
  const icon = icons[product] || '📷';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="secbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a2744;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#secbg)"/>
  <circle cx="300" cy="160" r="80" fill="rgba(196,163,90,0.08)" stroke="rgba(196,163,90,0.2)" stroke-width="2"/>
  <text x="300" y="175" text-anchor="middle" font-size="48">${icon}</text>
  <text x="300" y="300" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="24" font-weight="bold">${product.charAt(0).toUpperCase() + product.slice(1)}</text>
  <text x="300" y="335" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" font-size="14">${brand}</text>
  <rect x="230" y="355" width="140" height="28" rx="14" fill="rgba(196,163,90,0.15)" stroke="rgba(196,163,90,0.3)" stroke-width="1"/>
  <text x="300" y="374" text-anchor="middle" fill="#c4a35a" font-family="Arial,sans-serif" font-size="11" font-weight="bold">${brand}</text>
</svg>`;
}

function lingerieSVG(name) {
  const fabrics = {
    'cotton': '🌿', 'modal': '✨', 'bamboo': '🎋', 'lace': '🎀',
    'silk': '🦋', 'microfiber': '💫', 'spandex': '🏋️', 'nylon': '💎',
    'satin': '👑', 'mesh': '🌸'
  };
  const icon = fabrics[name] || '🧵';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="lingbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4a235a;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="600" height="400" fill="url(#lingbg)"/>
  <circle cx="300" cy="160" r="70" fill="rgba(196,163,90,0.08)" stroke="rgba(196,163,90,0.2)" stroke-width="2"/>
  <text x="300" y="175" text-anchor="middle" font-size="44">${icon}</text>
  <text x="300" y="290" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="28" font-weight="bold">${name.charAt(0).toUpperCase() + name.slice(1)}</text>
  <text x="300" y="320" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" font-size="14">Premium Fabric</text>
  <rect x="210" y="345" width="180" height="30" rx="15" fill="rgba(196,163,90,0.15)" stroke="rgba(196,163,90,0.3)" stroke-width="1"/>
  <text x="300" y="365" text-anchor="middle" fill="#c4a35a" font-family="Arial,sans-serif" font-size="12" font-weight="bold">OEM Available</text>
</svg>`;
}

function logoSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="none"/>
  <text x="20" y="38" fill="#c4a35a" font-family="Arial,sans-serif" font-size="22" font-weight="bold">NewAge</text>
  <text x="110" y="38" fill="white" font-family="Arial,sans-serif" font-size="22" font-weight="300">Trading</text>
  <line x1="20" y1="45" x2="180" y2="45" stroke="#c4a35a" stroke-width="1" opacity="0.5"/>
</svg>`;
}

function ogImageSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a5f;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0f2440;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a1628;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogbg)"/>
  <text x="600" y="280" text-anchor="middle" fill="#c4a35a" font-family="Arial,sans-serif" font-size="72" font-weight="bold">NewAge Trading</text>
  <text x="600" y="340" text-anchor="middle" fill="white" font-family="Arial,sans-serif" font-size="28" opacity="0.8">Your Trusted Partner in Global Trade</text>
  <text x="600" y="400" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial,sans-serif" font-size="20">Automobile Export · Lingerie OEM · Security Equipment</text>
  <line x1="400" y1="440" x2="800" y2="440" stroke="#c4a35a" stroke-width="2"/>
  <text x="600" y="480" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Arial,sans-serif" font-size="18">newage-trading.com</text>
</svg>`;
}

// Generate all
mkdirSync('public/images/cars', { recursive: true });
mkdirSync('public/images/security', { recursive: true });
mkdirSync('public/images/lingerie', { recursive: true });

CARS.forEach(car => {
  writeFileSync(`public/images/cars/${car.id}.jpg`, carSVG(car));
  console.log(`✅ ${car.id}`);
});

SECURITY.forEach(name => {
  writeFileSync(`public/images/security/${name}.jpg`, securitySVG(name));
  console.log(`✅ ${name}`);
});

const FABRICS = ['cotton', 'modal', 'bamboo', 'lace', 'silk', 'microfiber', 'spandex', 'nylon', 'satin', 'mesh'];
FABRICS.forEach(name => {
  writeFileSync(`public/images/lingerie/${name}.jpg`, lingerieSVG(name));
  console.log(`✅ fabric/${name}`);
});

writeFileSync('public/images/logo.png', logoSVG());
console.log('✅ logo');
writeFileSync('public/images/og-default.jpg', ogImageSVG());
console.log('✅ og-default');

console.log('\n🎉 All placeholder images generated!');
