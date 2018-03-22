<template>

  <q-page class="layout-padding" style="max-width: 800px">
    <q-card>
      <q-card-title class="q-pa-none q-pl-sm">Create an Entry</q-card-title>

      <q-card-main class="q-pa-lg">
        <!-- Job -->
        <q-field class="text-center">
          <q-btn-toggle
            v-model="newEntry.job"
            toggle-color="tertiary"
            :options="jobOptions"
          />
        </q-field>

        <!-- Date -->
        <q-field class="q-pt-sm">
          <q-datetime
            v-model="newEntry.date"
            type="date"
            float-label="Date"
            format="DD MMM YYYY"
            :before="[
              {
                icon: 'date_range'
              }
            ]"
          />
        </q-field>

        <!-- Hours -->
        <q-field>
          <q-input
            v-model="newEntry.hours"
            type="number"
            float-label="Hours"
            :before="[
              {
                icon: 'timer'
              }
            ]"
          />
        </q-field>

        <!-- Money -->
        <q-field>
          <q-input
            v-model="newEntry.dollars"
            type="number"
            float-label="Dollars"
            :before="[
              {
                icon: 'attach_money'
              }
            ]"
          />
        </q-field>
        <q-field class="text-center q-pt-sm">
          <q-btn-toggle
            v-model="newEntry.type"
            :toggle-color="incomeToggleColor"
            :options="[
              { label: 'income', value: 'income' },
              { label: 'expense', value: 'expense' }
            ]"
          />
        </q-field>

        <!-- Description and Tags -->
        <q-field>
          <q-input
            v-model="newEntry.description"
            type="text"
            float-label="Description"
            :before="[
              {
                icon: 'description'
              }
            ]"
          />
        </q-field>
        <q-field>
          <q-chips-input
            v-model="newEntry.tags"
            float-label="Tags"
            placeholder="Enter searchable tags"
            :before="[
              {
                icon: 'local_offer'
              }
            ]"
          />
        </q-field>

        <q-field class="q-pt-sm">
          <q-uploader :url="uploadUrl"
            float-label="Add files"
            clearable
            multiple
            hide-upload-progress
            hide-upload-button
            @add="addFiles"
            @remove:cancel="removeFile"
            :before="[
              {
                icon: 'cloud_upload'
              }
            ]"
          />
        </q-field>

        <!-- <q-field class="q-pt-sm text-center">
          <q-btn style="height:40px; width:100%"
            @click="captureModal=true"
            icon="camera"
            color="tertiary"
          >
            Capture Image
          </q-btn>
        </q-field> -->

       <!--  <q-modal maximized v-model="captureModal">
          <q-modal-layout>

            <camera v-if="captureModal"></camera>

            <div class="controls text-center">
              <q-btn color="red" round
                @click="captureModal=false"
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

          </q-modal-layout>
        </q-modal>

        <q-modal v-model="previewModal">
          <q-modal-layout>
            <div class="output">
              <canvas id="canvas" style="display:none"></canvas>
              <img id="photo" alt="Captured photo from camera.">
            </div>

            <div class="controls text-center">
              <q-btn color="secondary" round
                @click="previewModal=false; captureModal=true"
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
        </q-modal> -->

       <!--  <div v-if="newEntry.uploads.length > 0">
          <q-chips-input
            v-model="newEntry.uploads"
            float-label="Uploads"
          />
        </div> -->

      </q-card-main>

      <q-card-separator />

      <q-card-actions align="center">
        <q-btn style="width:25%"
          icon="clear"
          @click="clearEntry">
          Clear
        </q-btn>

        <q-btn style="width:25%"
          icon="done"
          color="primary"
          @click="validateEntry">
          Save
        </q-btn>
      </q-card-actions>

    </q-card>

    <q-table v-if="entries" class="q-mt-lg"
      title="Latest Entries"
      :data="entries"
      :columns="latestColumns"
      :visible-columns="visibleColumns"
      row-key="id"
      :loading="!loaded"
      :pagination.sync="pagination"
    />

  </q-page>

</template>

<script>
import { date } from 'quasar'
// import Camera from '../components/CameraSelector'

const initTime = new Date()

export default {
  data () {
    return {
      loaded: false,

      uid: '',
      entries: [],
      entriesRef: {},
      storageRef: null,

      newEntry: {
        date: date.formatDate(initTime, 'YYYY-MM-DDTHH:mm:ss'),
        dateStr: date.formatDate(initTime, 'DD MMM YYYY'),
        dollars: null,
        hours: null,
        job: 'restaurant',
        type: 'income',
        description: '',
        tags: [],
        uploads: []
      },

      uploads: [],
      entryId: '',

      jobOptions: [
        { label: 'Restaurant', value: 'restaurant' },
        { label: 'Jewelry', value: 'jewelry' }
      ],
      incomeToggleColor: 'secondary',
      latestColumns: [
        {
          name: 'date',
          label: 'Date',
          align: 'left',
          // field: row => row.date.split('T')[0],
          field: 'date',
          sortable: true
        },
        {
          name: 'job',
          label: 'Job',
          align: 'left',
          field: 'job'
        },
        {
          name: 'hours',
          label: 'Hours',
          align: 'right',
          field: 'hours'
        },
        {
          name: 'dollars',
          label: 'Dollars',
          align: 'right',
          field: 'dollars',
          format: val => `$${val}`
        },
        {
          name: 'id',
          field: 'id'
        }
      ],
      visibleColumns: ['date', 'job', 'hours', 'dollars'],
      pagination: {
        sortBy: 'date',
        descending: true,
        page: 1,
        rowsPerPage: 5
      },

      captureModal: false,
      previewModal: false,
      uploadUrl: ''
    }
  },
  firebase () {
    return {
      entries: this.$db.ref('users/' + this.uid)
    }
  },
  watch: {
    'newEntry.type': function (newVal, oldVal) {
      // console.log('toggleColor watch')
      if (newVal === 'income') {
        this.incomeToggleColor = 'secondary'
      } else {
        this.incomeToggleColor = 'red'
      }
    }
  },
  beforeCreate () {
  },
  created () {
    this.$auth.onAuthStateChanged(user => {
      this.uid = user.uid
      this.entriesRef = this.$db.ref('users/' + user.uid)
      // console.log(this.entriesRef)

      this.entriesRef.on('value', data => {
        this.entries = []
        // console.log('entriesRef on value')
        var obj = data.val()
        if (!obj) {
          this.loaded = true
          return
        }

        for (const [key, value] of Object.entries(obj)) {
          // console.log(key)
          value.id = key
          this.entries.push(value)
        }
        this.storageRef = this.$storage.ref().child('uploads/' + this.uid)

        this.loaded = true
      })
    })
  },
  methods: {
    validateEntry () {
      if (!this.newEntry.dollars && !this.newEntry.hours) {
        this.$q.notify({
          type: 'warning',
          position: 'top',
          message: 'You must enter at least dollars or hours'
        })
        return
      }
      if (!this.newEntry.dollars) {
        this.newEntry.dollars = 0
      } else if (!this.newEntry.hours) {
        this.newEntry.hours = 0
      }
      if (this.newEntry.type === 'expense') {
        this.newEntry.dollars = -this.newEntry.dollars
      }
      this.saveEntry()
    },
    saveEntry () {
      this.newEntry.date = date.formatDate(this.newEntry.date, 'YYYY-MM-DDTHH:mm:ss')
      this.newEntry.dateStr = date.formatDate(this.newEntry.date, 'DD MMM YYYY')
      // const resetDate = this.newEntry.date

      var notifyOptions = {
        type: 'positive',
        position: 'top',
        message: 'Adding entry for ' + this.newEntry.dateStr
      }

      try {
        this.entriesRef.push(this.newEntry)
          .then((snap) => {
            if (this.uploads.length > 0) {
              this.uploadFiles(snap.key)
            }
            // if (this.imageUploads.length > 0) {
            //   this.uploadImages(snap.key)
            // }
          })
      } catch (err) {
        console.log(err.message)
        notifyOptions = {
          type: 'negative',
          position: 'top',
          message: 'Failed with error "' + err.message + '"'
        }
      }
      this.$q.notify(notifyOptions)
    },
    clearEntry () {
      this.newEntry.dollars = null
      this.newEntry.hours = null
      this.newEntry.uploads = []
      this.newEntry.tags = []
      this.newEntry.date = date.addToDate(this.newEntry.date, { minutes: 1 })
      // this.uploads = []
      // this.imageUploads = []
      console.info(this.uploads)
    },
    addFiles (files) {
      console.log('add file')
      console.log(files)

      files.forEach((file) => {
        // const f = { data: files[0], name: file.name }
        this.uploads.push(file)
        this.newEntry.uploads.push(file.name)
      })
    },
    removeFile (file) {
      console.log('removing file')
      console.log(file)
      this.uploads = this.uploads.filter(f => f !== file)
      this.newEntry.uploads = this.newEntry.uploads.filter(fname => fname !== file.name)
    },
    uploadFiles (entryId) {
      console.info('Uploading files for entry ' + entryId)
      console.log(this.uploads)
      this.$q.loading.show({ 'message': 'Uploading files' })

      this.uploads.forEach((file) => {
        const fileRef = this.storageRef.child(entryId + '/' + file.name)

        // fileRef.put(file.data)
        fileRef.put(file)
          .then((snapshot) => {
            this.notifyUploadSuccess(file.name)
            this.newEntry.uploads.push(file.name)
            this.clearEntry()
          })
          .catch((err) => {
            this.notifyUploadException(file.name, err)
          })
      })
    },
    // uploadImages (entryId) {
    //   console.info('Uploading file for entry ' + entryId)
    //   console.log(this.imageUploads)
    //   this.$q.loading.show({ 'message': 'Uploading images' })
    //   var metadata = { contentType: 'image/jpeg' }

    //   this.imageUploads.forEach((image) => {
    //     const imgRef = this.storageRef.child(entryId + '/' + image.name)
    //     this.newEntry.uploads.push(image.name)

    //     imgRef.putString(image.data, 'base64', metadata)
    //       .then((snapshot) => {
    //         this.notifyUploadSuccess(image.name)
    //         this.previewModal = false
    //         this.clearEntry()
    //       })
    //       .catch((err) => {
    //         this.handleUploadException(err)
    //       })
    //   })
    // },
    notifyUploadSuccess (filename) {
      console.log(filename + ' uploaded successfully')
      this.$q.loading.hide()

      var notifyOptions = {
        type: 'positive',
        position: 'top',
        message: filename + ' uploaded successfully!'
      }
      this.$q.notify(notifyOptions)
    },
    notifyUploadException (filename, err) {
      console.log('Error saving file: ' + err)

      var notifyOptions = {
        type: 'negative',
        position: 'top',
        message: filename + ' failed to upload :-/'
      }
      this.$q.notify(notifyOptions)
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
</style>
