# ZenReader - 禅阅读器

一个简洁优雅的 TXT 文件阅读器浏览器插件，采用起点中文网经典风格设计。

## ✨ 功能特性

- 📚 **本地文件阅读** - 支持导入本地 TXT 文件
- 📖 **智能章节识别** - 自动识别并提取小说章节
- 💾 **进度自动保存** - 记录阅读位置，下次打开继续阅读
- 🎨 **起点经典风格** - 还原起点中文网的阅读体验
- 📱 **全屏沉浸阅读** - 点击插件图标在新标签页打开，提供完整阅读体验
- 📚 **书架管理** - 保存多本书籍，随时切换阅读
- 🎯 **章节目录** - 快速跳转到任意章节

## 🚀 快速开始

### 安装到浏览器

#### 方法一：开发者模式安装（推荐）

1. 下载本项目或解压 `zenreader-extension.zip`
2. 打开浏览器扩展页面：
   - **Edge**: 访问 `edge://extensions/`
   - **Chrome**: 访问 `chrome://extensions/`
3. 开启右下角的"**开发人员模式**"开关
4. 点击"**加载已解压的扩展程序**"
5. 选择项目中的 `dist` 文件夹

#### 方法二：从源码构建

```bash
# 克隆项目
git clone <repository-url>
cd zenreader---txt-reader

# 安装依赖
npm install

# 构建插件
./build-extension.sh
```

构建完成后会生成：
- `dist/` 文件夹 - 用于加载到浏览器
- `zenreader-extension.zip` - 可分发的压缩包

### 使用方法

1. **点击插件图标** - 在浏览器工具栏点击 ZenReader 图标
2. **上传 TXT 文件** - 拖拽或点击上传按钮选择 TXT 文件
3. **开始阅读** - 自动识别章节，开始沉浸式阅读
4. **使用目录** - 点击右侧目录图标快速跳转章节
5. **阅读设置** - 调整字体大小、行距等阅读参数

## 🛠️ 开发指南

### 环境要求

- Node.js 16+ 
- npm 或 pnpm

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（预览界面）
npm run dev

# 构建生产版本
npm run build

# 构建并打包浏览器插件
./build-extension.sh
```

开发服务器启动后访问 `http://localhost:3000` 预览界面。

### 项目结构

```
zenreader---txt-reader/
├── components/           # React 组件
│   ├── FileUpload.tsx   # 文件上传和书架
│   ├── Reader.tsx       # 阅读器主界面
│   ├── Catalog.tsx      # 章节目录
│   └── Icons.tsx        # 图标组件
├── services/            # 核心服务
│   ├── parser.ts        # TXT 解析和章节识别
│   └── db.ts           # IndexedDB 数据存储
├── App.tsx              # 应用主组件
├── background.ts        # 插件后台脚本
├── manifest.json        # 浏览器插件配置
├── index.css           # 全局样式（Tailwind CSS v4）
├── index.html          # HTML 入口
├── vite.config.ts      # Vite 构建配置
└── build-extension.sh   # 插件构建脚本
```

## 🎨 技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 样式框架
- **Vite** - 构建工具
- **IndexedDB** - 本地数据存储
- **Chrome Extension API** - 浏览器扩展接口

## 📝 功能详解

### 章节识别算法

自动识别以下格式的章节标题：
- `第一章 标题`
- `第1章 标题`
- `Chapter 1`
- `001 标题`
- 以及其他常见章节格式

### 数据存储

使用 IndexedDB 本地存储：
- 书籍内容和章节信息
- 阅读进度（章节位置）
- 最后阅读时间

所有数据保存在本地，**不会上传到任何服务器**。

## 🔧 自定义图标

当前使用的是占位图标，建议替换为正式图标：

1. 准备以下尺寸的 PNG 图标：
   - `icon16.png` (16×16)
   - `icon32.png` (32×32)
   - `icon48.png` (48×48)
   - `icon128.png` (128×128)

2. 替换 `dist/` 文件夹中的图标文件

3. 重新加载插件

**推荐设计**：红色背景（#bf2c24）+ 书籍图标

## ❓ 常见问题

### 插件安装后图标不显示？

确保 `dist/` 文件夹中包含所有图标文件（icon16.png ~ icon128.png）。

### 样式显示不正常？

1. 确保完整运行了 `./build-extension.sh`
2. 在扩展管理页面点击"重新加载"按钮
3. 关闭并重新打开插件页面

### 无法保存阅读进度？

检查浏览器是否允许插件使用存储权限，插件需要 `storage` 权限。

### 章节识别不准确？

TXT 文件的章节标题格式需要相对规范。如果识别有误，可以在 `services/parser.ts` 中调整正则表达式。

## 📜 开源协议

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 如何贡献

1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📮 联系方式

如有问题或建议，欢迎通过 Issue 反馈。

---

**Enjoy Reading! 享受阅读！** 📖✨
