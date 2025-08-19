FROM node:18-alpine
RUN npm install -g peer
WORKDIR /app
EXPOSE 9000
CMD ["peer", "--port", "9000", "--path", "/peerjs-server", "--allow_discovery", "true"]