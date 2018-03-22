<template>
  <!-- <video autoplay id="video"></video> -->

  <div>
    <video autoplay id="video"></video>

    <!-- <div id="camera-controls" class="text-center q-pt-sm">
      <q-btn color="red" round
        @click="previewing=true"
        size="md"
        wait-for-ripple
        icon="close"
      />

      <q-btn color="primary" round
        @click="captureImage"
        size="xl"
        icon="camera"
      />
    </div>

    <q-modal v-model="previewing">
      <q-modal-layout>
      </q-modal-layout>
    </q-modal> -->

  </div>
</template>

<script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>

<script>
// import Camera from '../components/Camera'

export default {
  data () {
    return {
      previewing: false,
      currentImage: null,
      savedImages: []
    }
  },
  mounted () {
    const video = document.getElementById('video')
    console.log(video)

    navigator.mediaDevices.enumerateDevices().then( devices => {
      devices= devices.filter( v => (v.kind == "videoinput"))
      console.log("Found " + devices.length + " video devices")

      let lastDevice= devices[devices.length-1]
      devices= devices.filter( v => (v.label.indexOf("back") > 0))

      let device= null
      if ( devices.length > 0 ) {
        console.log("Using 'back' camera")
        device = devices[devices.length-1]
      }
      else {
        console.log("Using last camera")
        device = lastDevice
      }

      if ( !device ) {
        console.log("No devices found!")
        return
      }

      let constraints = {
        audio: false,
        video: {
          deviceId: { ideal: device.deviceId },
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        }
      }

      navigator.mediaDevices.getUserMedia(constraints)
      .then( stream => {
        if ( !video.srcObject )
          video.src = URL.createObjectURL(stream)
        else
          video.srcObject = stream

        // console.log(Object.values(this.$el)[1])
        console.log("Done with getUserMedia")
      })
      .catch ( err => {
        console.log(err.name + ": " + err.message)
      })
    })
    .catch ( err => {
      console.log(err.name + ": " + err.message)
    })
  }
  // methods: {
  //   captureImage () {
  //     console.log('captureImage')
  //     this.currentPhoto = 'hi'
  //   }
  // }
}
</script>

<style lang="stylus">
  #camera-controls
    height 90px
    background-color black
    position absolute
    right 0
    left 0
    bottom 0
    // z-index 100
</style>
