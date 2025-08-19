<template>
  <div class="video-chat-container">
    <!-- Local Video -->
    <div class="video-wrapper local" :class="{ 'video-enabled': localStreamActive }">
      <video
        ref="localVideo"
        :class="{ hidden: !localStreamActive }"
        muted
        autoplay
        playsinline
      ></video>
      <div v-if="!localStreamActive" class="placeholder">
        <span class="material-icons">videocam_off</span>
      </div>
      <div class="controls">
        <button 
          @click="toggleLocalVideo"
          :class="{ active: localVideo }"
          class="control-btn"
        >
          <span class="material-icons">
            {{ localVideo ? 'videocam' : 'videocam_off' }}
          </span>
        </button>
        <button 
          @click="toggleLocalAudio"
          :class="{ active: localAudio }"
          class="control-btn"
        >
          <span class="material-icons">
            {{ localAudio ? 'mic' : 'mic_off' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Remote Video -->
    <div class="video-wrapper remote" :class="{ 'video-enabled': remoteStreamActive }">
      <video
        ref="remoteVideo"
        :class="{ hidden: !remoteStreamActive }"
        autoplay
        playsinline
      ></video>
      <div v-if="!remoteStreamActive" class="placeholder">
        <span class="material-icons">person_off</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '../../stores/game'

const gameStore = useGameStore()
const localVideo = ref(null)
const remoteVideo = ref(null)
const localStreamActive = ref(false)
const remoteStreamActive = ref(false)
const localAudio = ref(false)
const localVideoEnabled = ref(false)

// Media stream references
let localStream = null
let remoteStream = null

// Initialize media devices
const initializeMedia = async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    
    if (localVideo.value) {
      localVideo.value.srcObject = localStream
      localStreamActive.value = true
      localAudio.value = true
      localVideoEnabled.value = true
    }

    // Send stream to peer
    gameStore.updateMediaStream(localStream)
  } catch (error) {
    console.error('Media device error:', error)
    showError('无法访问摄像头或麦克风')
  }
}

// Toggle controls
const toggleLocalVideo = async () => {
  if (localStream) {
    const videoTrack = localStream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      localVideoEnabled.value = videoTrack.enabled
      gameStore.updateVideoState(videoTrack.enabled)
    }
  }
}

const toggleLocalAudio = () => {
  if (localStream) {
    const audioTrack = localStream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      localAudio.value = audioTrack.enabled
      gameStore.updateAudioState(audioTrack.enabled)
    }
  }
}

// Handle remote stream
const handleRemoteStream = (stream) => {
  if (remoteVideo.value) {
    remoteVideo.value.srcObject = stream
    remoteStreamActive.value = true
    remoteStream = stream
  }
}

// Clean up
const cleanup = () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop())
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach(track => track.stop())
  }
  localStreamActive.value = false
  remoteStreamActive.value = false
}

// Watch for remote stream changes
watch(() => gameStore.remoteStream, (newStream) => {
  if (newStream) {
    handleRemoteStream(newStream)
  } else {
    remoteStreamActive.value = false
  }
})

onMounted(() => {
  initializeMedia()
})

onUnmounted(() => {
  cleanup()
})

defineExpose({
  handleRemoteStream
})
</script>

<style scoped>
.video-chat-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.video-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  background: #1a1a1a;
  border-radius: 0.5rem;
  overflow: hidden;
}

.video-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
}

.placeholder .material-icons {
  font-size: 2rem;
  color: #666;
}

.controls {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
}

.control-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.control-btn.active {
  background: #4CAF50;
}

.hidden {
  display: none;
}
</style>