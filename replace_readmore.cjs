const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (file.endsWith('.jsx')) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src', 'admin', 'pages'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let modified = false;

  // Add ReadMore import if missing and we are about to use it
  const importStatement = "import ReadMore from '../../components/ReadMore';"; // Needs logic for relative path based on file depth
  let depth = file.split(path.sep).length - path.join(__dirname, 'src', 'admin', 'pages').split(path.sep).length;
  let relativePath = '../'.repeat(depth) + 'components/ReadMore';
  const newImport = `import ReadMore from '${relativePath}';`;

  // We want to replace {p.propertyName}, {p.location}, {p.aboutProperty} inside <td> tags.
  // We can just use a regex like: >\{?p\.(propertyName|location|aboutProperty)\}?<
  
  // Actually, we can just replace >{p.propertyName}< with ><ReadMore maxWords={2}>{p.propertyName}</ReadMore><
  // Same for `r`, `item`, `row`, etc.
  
  // It's safer to use a regex that looks for <td>...</td> containing exactly `{var.prop}`
  const regex = /<td[^>]*>(.*?)<\/td>/gs;
  content = content.replace(regex, (match, inner) => {
    // Only wrap if inner is exactly {p.propertyName} or {p.location} or {p.aboutProperty} or {p.about} or {p.address} or {p.full_address}
    if (inner.match(/^\{[a-zA-Z]+\.(propertyName|location|aboutProperty|about|address|full_address|description)\}/) || inner.match(/^\{[a-zA-Z]+\.(propertyName|location|aboutProperty|about|address|full_address|description) \|\| '[^']*'\}/)) {
      if (!inner.includes('<ReadMore')) {
         return match.replace(inner, `<ReadMore maxWords={2}>${inner}</ReadMore>`);
      }
    }
    // Handle cases where inner has some formatting, like:
    // <td ... onClick={...}>{p.propertyName}</td> -> The inner is `{p.propertyName}`
    return match;
  });

  if (content !== originalContent) {
    if (!content.includes('import ReadMore')) {
      content = newImport + '\n' + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
