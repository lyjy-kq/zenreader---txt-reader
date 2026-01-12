# Edge 浏览器插件说明

## 如何构建和安装

### 方式 1: 使用构建脚本（推荐）
```bash
./build-extension.sh
```

### 方式 2: 手动构建
```bash
npm run build
cp manifest.json dist/
# 添加图标文件到 dist 文件夹
```

## 安装到 Edge 浏览器

1. 打开 Edge 浏览器
2. 访问 `edge://extensions/`
3. 打开右下角的"开发人员模式"
4. 点击"加载解压缩的扩展"
5. 选择项目中的 `dist` 文件夹

## 图标文件

需要在 `dist` 文件夹中添加以下尺寸的图标：
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

建议使用红色 (#bf2c24) 背景搭配书籍图标。

## 主要改动

1. **manifest.json** - Chrome/Edge 扩展配置文件
2. **Tailwind CSS** - 替换了 CDN 引入，改为本地打包
3. **构建配置** - 优化 Vite 配置用于浏览器插件
4. **弹窗尺寸** - 设置为 600x800px 适合阅读器界面
