<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ZenReader - TXT 阅读器浏览器插件

一个美观的 TXT 文件阅读器浏览器插件，采用起点风格界面设计。

## 功能特性

- 📚 本地 TXT 文件阅读
- 📖 自动章节识别
- 💾 阅读进度保存
- 🎨 起点风格界面
- 📱 全屏阅读体验

## 开发

**前置要求：** Node.js

```bash
# 安装依赖
npm install

# 开发模式（本地预览）
npm run dev

# 构建浏览器插件
./build-extension.sh
```

## 安装到 Edge/Chrome 浏览器

### 方式 1: 开发模式（推荐用于测试）
1. 运行 `./build-extension.sh` 构建插件
2. 打开 `edge://extensions/`（Edge）或 `chrome://extensions/`（Chrome）
3. 启用右下角的"开发人员模式"
4. 点击"加载解压缩的扩展"
5. 选择项目中的 `dist` 文件夹

### 方式 2: 分发模式
1. 运行 `./build-extension.sh` 生成 `zenreader-extension.zip`
2. 将 zip 文件分发给用户
3. 用户解压后按方式 1 加载

## 项目结构

```
.
├── App.tsx              # 主应用组件
├── components/          # React 组件
├── services/            # 数据服务（解析、存储）
├── background.ts        # 浏览器插件后台脚本
├── manifest.json        # 插件配置文件
├── index.css           # 样式文件（Tailwind CSS v4）
└── build-extension.sh   # 构建脚本
```

## 图标文件

当前使用的是占位图标。生产环境建议替换为：
- icon16.png (16x16)
- icon32.png (32x32)
- icon48.png (48x48)
- icon128.png (128x128)

建议使用红色 (#bf2c24) 背景搭配书籍图标。

---

View your app in AI Studio: https://ai.studio/apps/temp/1

