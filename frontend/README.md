# LS8 - Love Son Platform 前端

## 项目简介
LS8 (Love Son) 是一款为「亲子 / 亲友间深度互动」打造的跨终端平台，让相隔千里的家人、朋友能像在身边一样轻松连接。本仓库包含LS8平台的前端代码实现。

## 核心价值
- 促进亲子关系 - 让家长与孩子即使分离也能共同参与有意义的活动
- 连接亲友情感 - 跨越地理距离的社交互动平台
- 安全可靠 - 端到端加密保障用户隐私和数据安全

## 主要功能
- 支持多种棋类游戏（象棋、围棋、五子棋等）
- 实时音视频聊天
- 文字聊天
- 游戏邀请与对战
- 棋局回放
- 好友系统
- 排行榜

## 技术栈
- 前端框架：Vue 3
- 状态管理：Pinia
- 路由：Vue Router
- UI组件：自定义组件 + Tailwind CSS
- 实时通信：WebRTC + PeerJS
- 构建工具：Vite
- 测试：Vitest
- 代码规范：ESLint + Prettier

## 项目结构
```
src/
├── components/          # 共用组件
│   ├── Board/          # 棋盘相关组件
│   ├── Chat/           # 聊天相关组件
│   └── Media/          # 音视频相关组件
├── views/              # 页面组件
│   ├── Home.vue        # 首页
│   └── Room.vue        # 房间页面
├── stores/             # Pinia 状态管理
│   ├── game.js         # 游戏状态
│   └── peer.js         # 连接状态
├── services/           # 服务层
│   ├── peer.js         # PeerJS 服务
│   └── game.js         # 游戏逻辑服务
└── utils/              # 工具函数
    └── constants.js    # 常量定义
```
