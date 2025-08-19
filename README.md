# LS8 - Love Son Platform

[![License](https://img.shields.io/github/license/shuyouliu/ls8)](https://github.com/shuyouliu/ls8/blob/main/LICENSE)
[![Issues](https://img.shields.io/github/issues/shuyouliu/ls8)](https://github.com/shuyouliu/ls8/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/shuyouliu/ls8/pulls)

LS8 (Love Son) 是一款为「亲子 / 亲友间深度互动」打造的跨终端平台，让相隔千里的家人、朋友能像在身边一样轻松连接。

## 特性

- 🔒 点对点安全连接 - 基于 WebRTC 技术，数据直连，不经过服务器
- 🎮 实时对弈 - 支持象棋、围棋等多种棋类游戏
- 📱 跨平台支持 - PC 端与移动端完美适配
- 🎥 实时音视频 - 高质量音视频通话体验
- 🤖 AI 驱动 - 80% 功能由 AI 辅助开发
- 🔐 注重隐私 - 端到端加密，数据安全可控

## 快速开始

### 在线体验

访问 [https://ls8.top](https://ls8.top) 即可开始使用。

### 本地开发

```bash
# 克隆项目
git clone https://github.com/shuyouliu/ls8.git
cd ls8

# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm run dev

# 启动 PeerJS 服务器
cd ../docker/peerjs-server
docker-compose up -d
```

## 技术栈

- 前端：Vue 3 + Vite
- UI：TailwindCSS
- 通信：PeerJS (WebRTC)
- 容器：Docker
- 服务器：Nginx

## 部署指南

详见 [部署文档](./docs/deployment.md)

## 贡献指南

我们欢迎所有形式的贡献，无论是新功能、bug 修复还是文档改进。详见 [贡献指南](./docs/CONTRIBUTING.md)

## 开源协议

[MIT](./LICENSE)