const fs = require('fs');
const path = require('path');

const files = [
  'd:/learn/lumen/frontend/packages/uikit/src/components/ui/backdrop.tsx',
  'd:/learn/lumen/frontend/packages/uikit/src/components/ui/scroll-area.tsx'
];

const iconsDir = 'd:/learn/lumen/frontend/packages/uikit/src/icons/svgs';
const iconFiles = fs.readdirSync(iconsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(iconsDir, f));

[...files, ...iconFiles].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/import \* as React from ['"]react['"]\n?/g, '');
    content = content.replace(/import React from ['"]react['"]\n?/g, '');
    fs.writeFileSync(file, content);
  }
});

console.log('done');
