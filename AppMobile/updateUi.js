const fs = require('fs');
const path = require('path');

const dirs = ['screens', 'components', 'app'];

function processDir(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update Colors
      content = content.replace(/#0066ff/gi, '#16a34a'); // Primary blue -> Primary green
      content = content.replace(/#eef4ff/gi, '#dcfce7'); // Light blue bg -> Light green
      content = content.replace(/#dbeafe/gi, '#dcfce7'); // Another light blue
      content = content.replace(/#1e3a8a/gi, '#14532d'); // Dark blue -> Dark green
      content = content.replace(/#f8fbff/gi, '#f0fdf4'); // Super light blue
      
      // Update Border Radii (making things square/slightly rounded)
      content = content.replace(/borderRadius:\s*12/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*16/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*18/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*20/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*24/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*30/g, 'borderRadius: 4');
      content = content.replace(/borderRadius:\s*32/g, 'borderRadius: 4');

      fs.writeFileSync(fullPath, content);
    }
  }
}

dirs.forEach(d => {
  const p = path.join(__dirname, d);
  if (fs.existsSync(p)) processDir(p);
});

console.log("UI updated!");
