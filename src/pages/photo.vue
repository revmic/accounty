<template>
  <q-layout class="black">

    <camera></camera>

    <div class="controls text-center">
      <router-link to="/">
        <q-btn color="red" round
          size="md"
          wait-for-ripple
          icon="close"
        />
      </router-link>

      <q-btn color="primary" round
        @click="captureImage"
        size="xl"
        icon="camera"
      />
    </div>

    <q-modal v-model="open">
      <q-modal-layout>
        <div class="output">
          <canvas id="canvas" style="display:none"></canvas>
          <img id="photo" alt="Captured photo from camera.">
        </div>

        <div class="controls text-center">
          <q-btn color="secondary" round
            @click="open=false"
            size="md"
            wait-for-ripple
            icon="replay"
          />

          <q-btn color="primary" round
            @click="saveImage"
            size="xl"
            icon="check"
          />
        </div>

      </q-modal-layout>
    </q-modal>

  </q-layout>

</template>

<script>
import Camera from '../components/CameraSelector'

export default {
  name: 'Photo',
  components: {
    Camera
  },
  data () {
    return {
      video: null,
      currentPhoto: null,
      capturedPhotos: [],
      open: false,
      storageRef: null
    }
  },
  created () {
    this.storageRef = this.$storage.ref().child('images')
  },
  methods: {
    captureImage () {
      console.log('captureImage')
      this.video = document.getElementById('video')
      var canvas = document.getElementById('canvas')
      var photo = document.getElementById('photo')
      var context = canvas.getContext('2d')

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          this.video.srcObject = stream
          // video.play()
        })
        .catch((err) => {
          console.log('Error capturing image: ' + err)
        })

      context.drawImage(this.video, 0, 0, canvas.width, canvas.height)
      this.currentPhoto = canvas.toDataURL('image/jpeg')
      // console.log('this.currentPhoto')
      // console.log(this.currentPhoto)
      photo.setAttribute('src', this.currentPhoto)
      this.open = true
    },
    saveImage () {
      console.log('saveImage')
      this.$q.loading.show({ 'message': 'Saving' })
      this.stopCamera()

      const base64 = this.currentPhoto.split(',')[1]
      const filename = new Date() / 1
      const imgRef = this.storageRef.child(filename + '.jpeg')

      imgRef.putString(base64, 'base64')
        .then((snapshot) => {
          console.log('Uploaded file successfully')
          this.$q.loading.hide()

          var notifyOptions = {
            type: 'positive',
            position: 'bottom',
            message: 'Image saved successfully!'
          }
          this.$q.notify(notifyOptions)

          this.$router.push('/?add_image=' + filename + '.jpeg')
        })
        .catch((err) => {
          console.log('Error saving image: ' + err)

          var notifyOptions = {
            type: 'negative',
            position: 'bottom',
            message: 'Failed saving image :-/'
          }
          this.$q.notify(notifyOptions)
        })
    },
    stopCamera () {
      console.log('stopCamera')
      console.log(this.video.srcObject.getVideoTracks())
      // this.video.srcObject.getVideoTracks().forEach(track => track.stop())
      this.video.srcObject.getTracks()[0].stop()
      this.video.srcObject = null
      // this.video.srcObject.getTracks().forEach(track => track.stop())
    }
  }
}
</script>

<style lang="stylus">
  .black
    background-color black

  .controls
    height 80px
    background-color black
    position absolute
    right 0
    left 0
    bottom 0
    // z-index 100
</style>
