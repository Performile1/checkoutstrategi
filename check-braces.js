const fs = require('fs');
const content = fs.readFileSync('app/testcheckout/page.tsx', 'utf8');
const lines = content.split('\n');
let openBraces = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const beforeBraces = openBraces;
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '{') openBraces++;
    if (line[j] === '}') openBraces--;
  }
  if (beforeBraces !== openBraces && i >= 877) {
    console.log(`Line ${i+1}: ${beforeBraces} -> ${openBraces} - ${line.trim().substring(0, 80)}`);
  }
}
console.log(`Total open braces: ${openBraces}`);
