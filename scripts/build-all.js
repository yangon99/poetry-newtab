const { buildChrome, buildFirefox } = require('./build-common');

async function buildAll() {
  console.log('🚀 开始构建所有浏览器插件...\n');
  
  try {
    await buildChrome();
    console.log('');
    await buildFirefox();
    
    console.log('\n🎉 所有插件构建完成！');
    console.log('📁 输出目录: build/');
    console.log('Chrome: build/poetry-newtab-chrome.zip');
    console.log('Firefox: build/poetry-newtab-firefox.zip');
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

buildAll();
