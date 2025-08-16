#!/usr/bin/env node

/**
 * Safe File Move Utility
 * 
 * This script helps you safely move files around your project structure
 * by automatically updating imports to use the new path aliases.
 * 
 * Usage: node scripts/safe-move.js <source> <destination>
 * Example: node scripts/safe-move.js src/old/path/file.ts src/new/path/file.ts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Path alias mappings
const PATH_ALIASES = {
  '@/*': 'src/*',
  '@/core/*': 'src/core/*',
  '@/controllers/*': 'src/controllers/*',
  '@/services/*': 'src/services/*',
  '@/models/*': 'src/models/*',
  '@/types/*': 'src/types/*',
  '@/websocket/*': 'src/websocket/*',
  '@/thesidia/*': 'src/core/thesidia/*',
  '@/thesidia/engines/*': 'src/core/thesidia/engines/*',
  '@/utils/*': 'src/utils/*'
};

function getRelativePath(from, to) {
  const relative = path.relative(path.dirname(from), to);
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function findBestAlias(filePath) {
  const srcPath = path.relative('src', filePath);
  
  for (const [alias, pattern] of Object.entries(PATH_ALIASES)) {
    const aliasPath = pattern.replace('src/', '');
    if (srcPath.startsWith(aliasPath)) {
      const remaining = srcPath.substring(aliasPath.length);
      return `${alias}${remaining}`;
    }
  }
  
  return null;
}

function updateImportsInFile(filePath, oldPath, newPath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Update relative imports
  const oldRelative = getRelativePath(filePath, oldPath);
  const newRelative = getRelativePath(filePath, newPath);
  
  if (content.includes(oldRelative)) {
    content = content.replace(new RegExp(oldRelative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newRelative);
    updated = true;
  }
  
  // Try to convert to path aliases
  const bestAlias = findBestAlias(newPath);
  if (bestAlias && content.includes(newRelative)) {
    content = content.replace(new RegExp(newRelative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), bestAlias);
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated imports in: ${filePath}`);
  }
}

function updateImportsInDirectory(dirPath, oldPath, newPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      updateImportsInDirectory(fullPath, oldPath, newPath);
    } else if (item.endsWith('.ts') || item.endsWith('.js')) {
      updateImportsInDirectory(fullPath, oldPath, newPath);
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.log('Usage: node scripts/safe-move.js <source> <destination>');
    console.log('Example: node scripts/safe-move.js src/old/path/file.ts src/new/path/file.ts');
    process.exit(1);
  }
  
  const [source, destination] = args;
  
  if (!fs.existsSync(source)) {
    console.error(`❌ Source file/directory does not exist: ${source}`);
    process.exit(1);
  }
  
  // Create destination directory if it doesn't exist
  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  try {
    // Move the file/directory
    if (fs.statSync(source).isDirectory()) {
      execSync(`mv "${source}" "${destination}"`);
    } else {
      execSync(`mv "${source}" "${destination}"`);
    }
    
    console.log(`✅ Moved: ${source} → ${destination}`);
    
    // Update all imports in the project
    updateImportsInDirectory('src', source, destination);
    
    console.log('✅ Import updates completed!');
    console.log('💡 Tip: Run "npm run build" to verify everything compiles correctly');
    
  } catch (error) {
    console.error(`❌ Error moving file: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updateImportsInFile, updateImportsInDirectory, findBestAlias };
