const fs = require('fs');
const files = [
  'app/dashboard/citas/page.tsx',
  'app/dashboard/documentos/page.tsx',
  'app/dashboard/historial/page.tsx',
  'app/dashboard/recetas/page.tsx',
  'app/page.tsx',
  'app/patient-dashboard/page.tsx',
  'components/auth-forms.tsx',
  'components/doctor-panel.tsx',
  'components/patient-registration.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  // Replace string literals "https://..." with template literals
  c = c.replace(/"https:\/\/backend-smartsalud-a8ep\.onrender\.com([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}$1`');
  // Replace existing template literals `https://...` with dynamic ones
  c = c.replace(/`https:\/\/backend-smartsalud-a8ep\.onrender\.com([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "https://backend-smartsalud-a8ep.onrender.com"}$1`');
  fs.writeFileSync(file, c);
});
console.log('Replaced all hardcoded URLs successfully.');
