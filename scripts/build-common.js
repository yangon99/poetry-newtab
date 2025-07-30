const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Chrome 插件构建
function buildChrome() {
  console.log('🔥 构建 Chrome 插件...');
  
  const manifestChrome = {
    "manifest_version": 3,
    "name": "诗词新标签页",
    "version": "1.0.0",
    "description": "替换新标签页，展示一句诗词（jinrishici.com）",
    "chrome_url_overrides": {
      "newtab": "newtab.html"
    },
    "permissions": [],
    "icons": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "action": {
      "default_title": "诗词新标签页"
    },
    "content_security_policy": {
      "extension_pages": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self';"
    }
  };
  
  // 创建 build/chrome 目录
  const buildDir = path.join(__dirname, '../build/chrome');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // 写入 manifest.json
  fs.writeFileSync(
    path.join(buildDir, 'manifest.json'),
    JSON.stringify(manifestChrome, null, 2)
  );
  
  // 复制 dist 文件到 build/chrome
  copyDirectory(path.join(__dirname, '../dist'), buildDir);
  
  // 创建 ZIP 包
  createZip(buildDir, path.join(__dirname, '../build/poetry-newtab-chrome.zip'));
  
  console.log('✅ Chrome 插件构建完成！');
}

// Firefox 插件构建
function buildFirefox() {
  console.log('🦊 构建 Firefox 插件...');
  
  const manifestFirefox = {
    "manifest_version": 2,
    "name": "诗词新标签页",
    "version": "1.0.0",
    "description": "替换新标签页，展示一句诗词（jinrishici.com）",
    "chrome_url_overrides": {
      "newtab": "newtab.html"
    },
    "permissions": [],
    "icons": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    },
    "browser_action": {
      "default_title": "诗词新标签页"
    },
    "content_security_policy": "script-src 'self'; object-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self';",
    "browser_specific_settings": {
      "gecko": {
        "id": "poetry-newtab@example.com",
        "strict_min_version": "109.0"
      }
    }
  };
  
  // 创建 build/firefox 目录
  const buildDir = path.join(__dirname, '../build/firefox');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // 写入 manifest.json
  fs.writeFileSync(
    path.join(buildDir, 'manifest.json'),
    JSON.stringify(manifestFirefox, null, 2)
  );
  
  // 复制 dist 文件到 build/firefox
  copyDirectory(path.join(__dirname, '../dist'), buildDir);
  
  // 创建 ZIP 包
  createZip(buildDir, path.join(__dirname, '../build/poetry-newtab-firefox.zip'));
  
  console.log('✅ Firefox 插件构建完成！');
}

// 复制目录
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// 创建 ZIP 包
function createZip(sourceDir, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(`📦 ZIP 包已创建: ${outputPath} (${archive.pointer()} bytes)`);
      resolve();
    });
    
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

module.exports = { buildChrome, buildFirefox };
