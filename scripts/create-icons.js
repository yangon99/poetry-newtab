const fs = require('fs');
const path = require('path');

// 首先尝试使用简单的方法创建基本图标
const createBasicPNG = () => {
  // 这是一个最小的有效PNG文件（16x16像素，蓝色背景）
  const pngData = Buffer.from([
    // PNG signature
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    // IHDR chunk
    0x00, 0x00, 0x00, 0x0D, // length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x10, // width = 16
    0x00, 0x00, 0x00, 0x10, // height = 16
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth=8, color type=2 (RGB), compression=0, filter=0, interlace=0
    0x90, 0x91, 0x68, 0x36, // CRC
    // IDAT chunk with minimal image data
    0x00, 0x00, 0x00, 0x0E, // length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x1D, 0x01, 0x03, 0x00, 0xFC, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0xE2, 0x21, 0xBC, 0x33, // CRC
    // IEND chunk
    0x00, 0x00, 0x00, 0x00, // length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  return pngData;
};

// 尝试使用 Canvas 创建更好的图标
const createCanvasIcon = (size) => {
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // 设置背景
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, size, size);
    
    // 添加圆角
    const radius = size / 8;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.clip();
    ctx.fillRect(0, 0, size, size);
    
    // 绘制文字 "诗"
    ctx.fillStyle = '#ecf0f1';
    ctx.font = `bold ${size * 0.6}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('诗', size / 2, size / 2);
    
    return canvas.toBuffer('image/png');
  } catch (error) {
    console.log(`⚠️  Canvas 不可用，使用基本图标: ${error.message}`);
    return createBasicPNG();
  }
};

const assetsDir = path.join(__dirname, '..', 'assets', 'icons');

// 确保目录存在
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 创建图标文件
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const filename = `icon${size}.png`;
  const filepath = path.join(assetsDir, filename);
  
  // 为所有尺寸都使用 Canvas 创建图标
  const iconData = createCanvasIcon(size);
  
  fs.writeFileSync(filepath, iconData);
  console.log(`✅ 创建图标: ${filename} (${iconData.length} bytes)`);
});

console.log('🎨 图标文件创建完成！');
