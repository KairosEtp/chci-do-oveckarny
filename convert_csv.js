const fs = require('fs');
const path = require('path');

function parseCSV(content) {
    const lines = content.trim().split(/\r?\n/);
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        let line = lines[i];
        const row = {};
        let currentVal = '';
        let insideQuotes = false;
        let colIndex = 0;

        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
                insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
                if (colIndex < headers.length) {
                   row[headers[colIndex]] = currentVal.trim();
                }
                currentVal = '';
                colIndex++;
            } else {
                currentVal += char;
            }
        }
        // Last value
        if (colIndex < headers.length) {
            row[headers[colIndex]] = currentVal.trim();
        }

        // Cleanup quotes
        for(let key in row) {
             if (row[key].startsWith('"') && row[key].endsWith('"')) {
                 row[key] = row[key].substring(1, row[key].length - 1).replace(/""/g, '"');
             }
        }
        
        if (Object.keys(row).length > 0) result.push(row);
    }
    return result;
}

const skillsContent = fs.readFileSync('Skills.csv', 'utf8');
const techStackContent = fs.readFileSync('Tech Stack.csv', 'utf8');

const skills = parseCSV(skillsContent);
const techStack = parseCSV(techStackContent);

const jsContent = `window.cvData = {
    skills: ${JSON.stringify(skills, null, 2)},
    techStack: ${JSON.stringify(techStack, null, 2)}
};`;

fs.writeFileSync(path.join('js', 'data.js'), jsContent);
console.log('js/data.js created successfully.');
