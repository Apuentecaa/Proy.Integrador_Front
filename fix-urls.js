const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/admin/page.tsx',
  'app/reservar/page.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Insert the helper at the top (after imports) if not there
  if (!content.includes('const API_BASE_URL')) {
    content = content.replace(
      /(import .*?\n)+/,
      match => match + `\nconst baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com";\nconst API_BASE_URL = baseUrl.endsWith('/api/v1') ? baseUrl : \`\${baseUrl}/api/v1\`;\n`
    );
  }

  // Replace variations
  // Variation 1: `${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}/api/v1
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "https:\/\/backend-smartsalud-a8ep\.onrender\.com"\}\/api\/v1/g, '${API_BASE_URL}');
  
  // Variation 2: `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}/api/v1`}`
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| `\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| "https:\/\/backend-smartsalud-a8ep\.onrender\.com"\}\/api\/v1`\}/g, '${API_BASE_URL}');
  
  // Variation 3 (newline or spaces inside template literal)
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \n?"https:\/\/backend-smartsalud-a8ep\.onrender\.com"\}\/api\/v1/g, '${API_BASE_URL}');

  // Variation 4: nested with newlines
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \n?`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| \n?"https:\/\/backend-smartsalud-a8ep\.onrender\.com"\}\/api\/v1`\}/g, '${API_BASE_URL}');
  
  // Actually, let's just do a blanket regex for any process.env.../api/v1 pattern
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]*\}\/api\/v1/g, '${API_BASE_URL}');
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL[^}]*`\$\{process[^`]*`\}/g, '${API_BASE_URL}');

  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
