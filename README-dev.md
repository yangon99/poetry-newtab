# 诗词新标签页 - 浏览器插件

一个优雅的浏览器插件，替换新标签页，展示来自今日诗词的诗词内容。

## ✨ 特性

- 🎨 **简洁设计** - 白色背景，优雅的诗词展示
- 📚 **历史记录** - 保存最近10条诗词，支持快速回顾
- 🔤 **朱雀仿宋字体** - 使用优美的中文字体展示诗词
- ⚡ **打字机效果** - 诗词逐字显示，增强阅读体验
- 🎯 **跨浏览器支持** - 兼容 Chrome 和 Firefox
- ⌨️ **快捷键支持** - 空格键刷新，H键查看历史

## 🛠️ 技术栈

- **构建工具**: Webpack 5
- **JavaScript**: ES6+ with Babel
- **CSS**: 现代 CSS3 特性
- **API**: 今日诗词 npm 包
- **字体**: LXGW ZhuQue Fangsong

## 📦 项目结构

```
├── src/                    # 源代码目录
│   ├── newtab.html        # 主页面模板
│   ├── newtab.css         # 样式文件
│   └── newtab.js          # 主要逻辑
├── assets/                 # 资源文件
│   ├── icons/             # 插件图标
│   └── fonts/             # 字体文件
├── scripts/               # 构建脚本
│   ├── build-common.js    # 通用构建逻辑
│   ├── build-chrome.js    # Chrome 构建脚本
│   ├── build-firefox.js   # Firefox 构建脚本
│   └── build-all.js       # 全平台构建脚本
├── dist/                  # Webpack 构建输出
├── build/                 # 插件包输出目录
├── webpack.config.js      # Webpack 配置
└── package.json           # 项目配置

```

## 🚀 开发

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 构建插件包
```bash
# 构建所有平台
npm run build:all

# 只构建 Chrome
npm run build:chrome

# 只构建 Firefox
npm run build:firefox
```

### 清理构建文件
```bash
npm run clean
```

## 📱 安装插件

### Chrome 安装
1. 打开 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `build/chrome/` 目录或拖拽 `poetry-newtab-chrome.zip`

### Firefox 安装
1. 打开 `about:debugging`
2. 点击"此 Firefox"
3. 点击"临时载入附加组件"
4. 选择 `build/firefox/manifest.json` 文件

## 🎯 使用说明

### 基本操作
- **刷新诗词**: 点击右下角刷新按钮或按空格键
- **查看历史**: 点击左下角时钟图标或按 H 键
- **清空历史**: 在历史面板中点击"清空"按钮

### 快捷键
- `空格键` / `回车键`: 获取新诗词
- `H 键`: 切换历史记录面板

## 🔧 配置说明

### Manifest V3 特性
- 使用最新的 Manifest V3 标准
- 优化的内容安全策略 (CSP)
- 最小权限原则

### 字体配置
- 默认使用朱雀仿宋字体
- 自动降级到系统字体
- 支持自定义字体路径

### API 集成
- 使用今日诗词官方 npm 包
- 自动 token 管理
- 错误处理和重试机制

## 🚦 构建流程

1. **Webpack 打包** - 将源代码打包为浏览器可用的文件
2. **资源复制** - 复制静态资源（图标、字体、CSS）
3. **Manifest 生成** - 为不同浏览器生成对应的 manifest.json
4. **ZIP 打包** - 创建可分发的插件包

## 🔍 文件说明

### 核心文件
- `src/newtab.js` - 主要业务逻辑，包含诗词获取、历史管理、UI 交互
- `src/newtab.css` - 样式定义，包含字体配置、动画效果、响应式布局
- `src/newtab.html` - 页面结构，定义 UI 元素和 SVG 图标

### 配置文件
- `webpack.config.js` - Webpack 构建配置
- `package.json` - 项目依赖和脚本定义
- `manifest.json` - 自动生成的浏览器插件配置

## 📝 开发注意事项

1. **CSP 策略**: 严格的内容安全策略，确保只能加载本地资源
2. **跨域问题**: 使用官方 npm 包避免跨域限制
3. **字体加载**: 字体文件较大，建议优化加载策略
4. **浏览器兼容**: Firefox 使用 Manifest V2，Chrome 使用 V3

## 🐛 问题排查

### 常见问题
1. **字体加载失败** - 检查字体文件路径和 CSP 策略
2. **API 调用失败** - 检查网络连接和 token 配置
3. **插件安装失败** - 确保 manifest.json 格式正确

### 调试方法
1. 打开浏览器开发者工具
2. 查看 Console 面板的错误信息
3. 检查 Network 面板的网络请求
4. 验证 Application/Storage 中的 localStorage

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**今日诗词 API 由 [jinrishici.com](https://www.jinrishici.com) 提供**
