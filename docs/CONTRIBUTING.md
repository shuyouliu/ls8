# 贡献指南

感谢您对 LS8 项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 开发规范

### 代码风格

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 Vue 3 组合式 API 的最佳实践
- 组件命名使用 PascalCase
- Props 命名使用 camelCase

### 提交规范

提交信息格式：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建过程或辅助工具的变动

### 分支策略

- main: 主分支，保持稳定
- develop: 开发分支
- feature/*: 特性分支
- fix/*: 修复分支

## 问题反馈

请使用 GitHub Issues 提交问题，并尽可能提供：

- 复现步骤
- 截图或录屏
- 错误信息
- 期望行为