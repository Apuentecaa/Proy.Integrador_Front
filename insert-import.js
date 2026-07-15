const fs = require('fs');
const path = require('path');

const filesToFix = ['app/admin/page.tsx', 'app/reservar/page.tsx'];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('import { API_BASE_URL }')) {
    content = content.replace(
      /"use client"\r?\n/,
      `"use client"\n\nimport { API_BASE_URL } from "@/lib/api-client";\n`
    );
    fs.writeFileSync(filePath, content);
    console.log('Inserted import into', file);
  }
});
