const fs = require('fs');
const content = fs.readFileSync('src/components/Admin.tsx', 'utf8');

let tags = 0;
let inString = null;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  
  if (inString) {
    if (char === inString && content[i-1] !== '\\') inString = null;
    continue;
  }
  
  if (char === '"' || char === "'" || char === '`') {
    inString = char;
    continue;
  }
  
  if (char === '<' && content[i+1] !== ' ' && content[i+1] !== '=') {
    tags++;
  }
  if (char === '>' && content[i-1] !== '=') {
    tags--;
  }
  
  if (tags < 0) {
    console.log(`Negative tag count at char ${i}`);
    console.log(`Context: ${content.substring(i-20, i+20)}`);
  }
}

console.log(`Final tag count: ${tags}`);
