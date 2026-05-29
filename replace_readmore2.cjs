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

  // Replace <ReadMore> and <ReadMore maxWords={X}> with <ReadMore maxWords={2}>
  // Be careful not to replace <ReadMore maxWords={2}> again
  content = content.replace(/<ReadMore(?:\s+maxWords=\{[0-9]+\})?>/g, '<ReadMore maxWords={2}>');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated maxWords to 2 in', file);
  }
});
