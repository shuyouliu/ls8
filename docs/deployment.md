# 部署指南

## 环境要求

- Node.js 16+
- Docker
- Nginx
- SSL 证书（推荐）

## Docker 部署

### PeerJS Server

```bash
cd docker/peerjs-server
docker-compose up -d
```

### TURN Server（可选）

```bash
cd docker/turn-server
docker-compose up -d
```

## Nginx 配置

```nginx
server {
    listen 80;
    server_name ls8.top;

    location /peerjs-server/ {
        proxy_pass http://127.0.0.1:9000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        root /path/to/ls8/frontend/dist;
        try_files $file $file/ /index.html;
    }
}
```

## 前端构建

```bash
cd frontend
npm install
npm run build
```

## 安全配置

1. 启用 HTTPS
2. 配置 CSP
3. 启用 HSTS
4. 配置跨域策略