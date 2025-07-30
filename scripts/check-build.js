#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 检查构建结果...\n');

// 检查必要的文件是否存在
const checkFiles = [
  'dist/newtab.html',
  'dist/newtab.css', 
  'dist/newtab.js',
  'dist/fonts/ZhuqueFangsong-Regular.ttf',
  'dist/icons/icon16.png',
  'dist/icons/icon48.png',
  'dist/icons/icon128.png',
  'build/chrome/manifest.json',
  'build/firefox/manifest.json',
  'build/poetry-newtab-chrome.zip',
  'build/poetry-newtab-firefox.zip'
];

let allExists = true;

checkFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allExists = false;
  }
});

console.log('\n📊 构建统计:');

// 检查文件大小
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir, { withFileTypes: true });
  files.forEach(file => {
    if (file.isFile()) {
      const stat = fs.statSync(path.join(distDir, file.name));
      const sizeKB = (stat.size / 1024).toFixed(2);
      console.log(`📄 ${file.name}: ${sizeKB} KB`);
    }
  });
}

// 检查 ZIP 包大小
const zipFiles = ['build/poetry-newtab-chrome.zip', 'build/poetry-newtab-firefox.zip'];
zipFiles.forEach(zipFile => {
  const fullPath = path.join(__dirname, '..', zipFile);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`📦 ${zipFile}: ${sizeMB} MB`);
  }
});

console.log('\n' + (allExists ? '🎉 构建检查通过！' : '⚠️  构建检查发现问题'));

// 检查 manifest.json 格式
function checkManifest(manifestPath, browserName) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', manifestPath), 'utf8');
    const manifest = JSON.parse(content);
    console.log(`\n📋 ${browserName} Manifest:`, {
      name: manifest.name,
      version: manifest.version,
      manifest_version: manifest.manifest_version
    });
  } catch (error) {
    console.log(`❌ ${browserName} manifest.json 格式错误:`, error.message);
  }
}

checkManifest('build/chrome/manifest.json', 'Chrome');
checkManifest('build/firefox/manifest.json', 'Firefox');
