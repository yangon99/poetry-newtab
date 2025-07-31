# 浏览器扩展构建指南

## 🚀 快速开始

### 开发模式
```bash
npm run dev
```
监听文件变化，自动重新构建

### 构建生产版本
```bash
npm run build
```
构建压缩后的生产版本到 `dist/` 目录

## 📦 扩展打包

### Chrome 扩展
```bash
npm run build:chrome
```
生成: `build/poetry-newtab-chrome.zip`

### Firefox 扩展
```bash
npm run build:firefox
```
生成: `build/poetry-newtab-firefox.zip`

### 同时构建两个版本
```bash
npm run build:all
```

## 🔧 维护命令

### 重新生成图标
```bash
npm run create-icons
```

### 检查构建结果
```bash
npm run check
```

### 清理构建文件
```bash
npm run clean
```

## 📋 发布流程

### Chrome Web Store
1. 运行 `npm run build:chrome`
2. 上传 `build/poetry-newtab-chrome.zip` 到 Chrome Web Store 开发者控制台

### Firefox Add-ons
1. 运行 `npm run build:firefox`
2. 上传 `build/poetry-newtab-firefox.zip` 到 Firefox Add-ons 开发者中心
3. 通过 Firefox 插件管理中心进行自动签名

## 📁 项目结构
```
├── src/                 # 源代码
│   ├── newtab.html     # 主页面
│   ├── newtab.css      # 样式文件
│   └── newtab.js       # 主逻辑
├── assets/             # 资源文件
│   ├── icons/          # 图标文件
│   └── fonts/          # 字体文件 (Git LFS)
├── scripts/            # 构建脚本
├── dist/               # 构建输出
└── build/              # 扩展包输出
```

## 🎯 注意事项
- 字体文件使用 Git LFS 管理
- 小图标文件（<5KB）不使用 LFS
- Firefox 签名通过官方管理中心进行
