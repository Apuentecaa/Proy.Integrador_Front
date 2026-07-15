const fs = require('fs');
const path = require('path');

const filesToFix = ['app/admin/page.tsx', 'app/reservar/page.tsx'];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace `${process.env.NEXT_PUBLIC_API_URL || `${API_BASE_URL}`}` with `${API_BASE_URL}`
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*`\$\{API_BASE_URL\}`\}/g, '${API_BASE_URL}');
  
  // Replace `${process.env.NEXT_PUBLIC_API_URL || API_BASE_URL}` with `${API_BASE_URL}` (just in case)
  content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*API_BASE_URL\}/g, '${API_BASE_URL}');

  fs.writeFileSync(filePath, content);
  console.log('Cleaned', file);
});
