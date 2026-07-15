const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('.');

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Example: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/medicos`
  // becomes `${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}/api/v1/medicos`
  if (c.includes('"http://localhost:8080/api/v1"}')) {
    c = c.replace(/"http:\/\/localhost:8080\/api\/v1"\}/g, '"https://backend-smartsalud-a8ep.onrender.com"}/api/v1');
    modified = true;
  }
  if (c.includes('`http://localhost:8080/api/v1`}')) {
    c = c.replace(/`http:\/\/localhost:8080\/api\/v1`\}/g, '"https://backend-smartsalud-a8ep.onrender.com"}/api/v1');
    modified = true;
  }

  // Handle the weird nested one found in app/admin/page.tsx:
  // `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}`}/medicos
  if (c.includes('`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}`}/')) {
    c = c.replace(/\`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "http:\/\/localhost:8080\/api\/v1"\}\`\}\//g, '`${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}/api/v1/');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, c);
    console.log(`Modified ${file}`);
  }
});
console.log('Replaced local URL fallbacks');
