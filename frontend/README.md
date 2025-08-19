# WebRTC P2P Chess/Go Game

## Project Structure
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
