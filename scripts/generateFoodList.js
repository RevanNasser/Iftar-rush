import fs from 'fs';
import path from 'path';

const foodDir = './public/food';
const outputFile = './src/foodList.json';

// Get all SVG files from the food folder
const files = fs.readdirSync(foodDir)
  .filter(file => file.endsWith('.svg'))
  .map(file => `/food/${file}`);

// Save as JSON
fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

console.log(`✓ Found ${files.length} food items`);
