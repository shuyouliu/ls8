import Peer from 'peerjs'

export class PeerService {
  constructor() {
    this.peer = null
    this.connection = null
  }

  init() {
    this.peer = new Peer(undefined, {
      host: 'ls8.top',
      path: '/peerjs-server',
      port: 80,
      secure: false,
      debug: 3
    })

    return new Promise((resolve, reject) => {
      this.peer.on('open', (id) => resolve(id))
      this.peer.on('error', (error) => reject(error))
    })
  }

  connect(peerId) {
    this.connection = this.peer.connect(peerId)
    return new Promise((resolve, reject) => {
      this.connection.on('open', () => resolve(this.connection))
      this.connection.on('error', (error) => reject(error))
    })
  }

  onConnection(callback) {
    this.peer.on('connection', (conn) => {
      this.connection = conn
      callback(conn)
    })
  }
}

export default new PeerService()