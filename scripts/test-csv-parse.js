import { parse } from 'csv-parse/sync';
import fs from 'fs';

const csvData = fs.readFileSync('Medicine_Details.csv', 'utf-8');
const records = parse(csvData, {
    columns: true,
    relax_quotes: true,
    skip_empty_lines: true,
});

console.log('First 3 records:');
records.slice(0, 3).forEach((record, index) => {
    console.log(`\n=== Record ${index + 1} ===`);
    console.log(`Medicine Name: ${record['Medicine Name']}`);
    console.log(`Image URL (raw): "${record['Image URL']}"`);
    console.log(`Image URL char codes: ${record['Image URL'].split('').map(c => c.charCodeAt(0)).join(',')}`);
});
