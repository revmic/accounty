<template>
  <q-page class="layout-padding q-pt-md" style="max-width: 800px">

    <q-table
      title="All Entries"
      :data="entries"
      :columns="columns"
      row-key="id"
      :loading="!loaded"
      :pagination.sync="pagination"
      :filter="search"
      table-style="font-size: 50px"
    >
    <!-- :table-style="{width: '100%', color: 'blue', fontSize: '40px'}" -->
      <!-- <template slot="top-selection" slot-scope="props">
        <div class="col" />
        <q-btn color="negative" flat round delete icon="delete" @click="deleteEntries" />
      </template> -->
      <template slot="top-right" slot-scope="props">
        <!-- <q-search hide-underline v-model="filter" /> -->
        <!-- <q-btn v-if="edit"
          color="negative" flat delete
          @click="deleteEntries">
          Delete
        </q-btn> -->
        <span>
          <q-btn @click="showDetails=!showDetails">
            Details
          </q-btn>
        </span>
        <q-btn @click="edit=!edit" class="q-ml-sm">
          <span v-if="edit">Done</span>
          <span v-else>Edit</span>
        </q-btn>
      </template>

      <template slot="top-left" slot-scope="props">
        <q-search style="font-size:16px"
          v-model="search"
          placeholder="Search"
          hide-underline
          :clearable="true"
        />
      </template>

      <template slot="body" slot-scope="props" v-if="loaded">

          <!-- Edit view -->
          <q-tr v-show="edit" :props="props">
            <!-- <q-td key="date" :props="props">{{ props.row.date.split('T')[0] }}</q-td> -->
            <q-td>
              <q-datetime
                v-model="props.row.date"
                type="date"
                format="YYYY-MM-DD"
              />
            </q-td>
            <q-td>
              <q-select
                :options="[
                  { 'label': 'Jewelry', 'value': 'jewelry' },
                  { 'label': 'Restaurant', 'value': 'restaurant' }
                ]"
                :value="props.row.job"
                @change="editCell('job', $event, props.row)"
              />
            </q-td>
            <q-td>
              <q-input align="center"
                :value="props.row.hours"
                type="number"
                @change="editCell('hours', $event, props.row)"
              />
            </q-td>
            <q-td>
              <q-input align="center"
                :value="props.row.dollars"
                type="number"
                prefix="$"
                @change="editCell('dollars', $event, props.row)"
              />
            </q-td>
          </q-tr>

          <q-tr v-show="edit && showDetails" :props="props"
            @click.native="setSelectedRow(props.row)"
          >
            <q-td colspan="100%">
              <div class="row">
                <div>
                  <q-btn flat disabled icon="subdirectory_arrow_right" size="sm" style="width:8px"/>
                </div>
                <div style="width:90%">
                  <span>
                    <q-input align="left"
                      :value="props.row.description"
                      type="text"
                      prefix="<b style='font-size:9px'>Desc: </b>"
                      placeholder="Add a description"
                      @change="editCell('description', $event, props.row)"
                    />
                    <!-- Desc: {{ props.row.description.substring(0, 50) }} ... -->
                  </span>
                  <span>
                    <q-chips-input
                      v-model="props.row.tags"
                      prefix="<b style='font-size:9px'>Tags: </b>"
                      placeholder="Add"
                      @input="editCell('tags', $event, props.row)"
                    />
                  </span>
                  <span>
                    <q-chips-input
                      v-model="props.row.uploads"
                      prefix="<b style='font-size:9px'>Files: </b>"
                      @input="editCell('uploads', $event, props.row)"
                    />
                  </span>
                  <q-field class="q-pt-sm">
                    <q-uploader :url="uploadUrl"
                      float-label="Add files"
                      clearable
                      multiple
                      hide-upload-button
                      hide-upload-progress
                      @add="addFiles"
                      @remove:cancel="removeFile"
                      :before="[
                        {
                          icon: 'cloud_upload'
                        }
                      ]"
                      :after="[
                        {
                          icon: 'file_upload',
                          handler () {
                            uploadFiles()
                          }
                        }
                      ]"
                    />
                  </q-field>
                  <!-- <span v-if="props.row.uploads.length > 0">
                    <span class="input-prefix"><b>Files: </b> </span>{{ props.row.uploads }}
                  </span> -->
                </div>
              </div>
            </q-td>
          </q-tr>

          <!-- Read-only view -->
          <q-tr v-show="!edit" :props="props">
            <!-- <q-td key="date" :props="props">{{ props.row.date.split('T')[0] }}</q-td> -->
            <q-td
              key="date"
              :props="props"
              v-if="props.row.date">{{ props.row.date.split('T')[0] }}
            </q-td>
            <q-td key="job" :props="props" >
              {{ props.row.job }}
            </q-td>
            <q-td key="hours" :props="props" >
              {{ props.row.hours }}
            </q-td>
            <q-td key="dollars" :props="props">
              $ {{ props.row.dollars }}
            </q-td>
          </q-tr>

          <q-tr v-show="!edit && showDetails" :props="props">
            <q-td colspan="100%"
              v-if="props.row.tags.length > 0 ||
                    props.row.uploads.length > 0 ||
                    props.row.description"
            >
              <div class="row" nowrap>
                <div>
                  <q-btn flat disabled icon="subdirectory_arrow_right" size="sm" style="width:8px"/>
                </div>
                <div>
                  <span v-if="props.row.description">
                    <span class="input-prefix"><b>Desc: </b> </span>{{ props.row.description.substring(0, 50) }} ...
                    <br>
                  </span>

                  <span v-if="props.row.tags.length > 0">
                    <span>
                      <q-chips-input
                        v-model="props.row.tags"
                        prefix="<b style='font-size:9px'>Tags: </b>"
                        disable
                        color="tertiary"
                      />
                    </span>
                  </span>

                  <span v-if="props.row.uploads.length > 0">
                    <span>
                      <q-chips-input
                        v-model="props.row.uploads"
                        prefix="<b style='font-size:9px'>Files: </b>"
                        disable
                        color="tertiary"
                      />
                    </span>
                  </span>
<!--                   <span v-if="props.row.tags.length > 0">
                    <span class="input-prefix"><b>Tags: </b> </span>{{ props.row.tags.slice(0, 6) }}
                    <br>
                  </span>
                  <span v-if="props.row.uploads.length > 0">
                    <span class="input-prefix"><b>Files: </b> </span>{{ props.row.uploads }}
                  </span> -->
                </div>
              </div>
            </q-td>
          </q-tr>

      </template>

    </q-table>

  </q-page>

</template>

<style>
</style>

<script>
// import { Dialog } from 'quasar'

export default {
  data: () => ({
    uid: '',
    loaded: false,
    edit: false,
    showDetails: true,
    storageRef: null,
    entries: [],
    fileEntryId: '',
    newUploads: [],
    existingUploads: [],
    uploadUrl: '',
    search: '',

    columns: [
      {
        name: 'date',
        label: 'Date',
        align: 'left',
        field: 'date',
        sortable: true
      },
      {
        name: 'job',
        label: 'Job',
        align: 'left',
        field: 'job',
        sortable: true
      },
      {
        name: 'hours',
        label: 'Hours',
        align: 'center',
        field: 'hours',
        sortable: true
      },
      {
        name: 'dollars',
        label: 'Dollars',
        align: 'center',
        field: 'dollars',
        format: val => `$${val}`,
        sortable: true
      },
      {
        name: 'description',
        field: 'description'
      },
      {
        name: 'tags',
        field: 'tags'
      },
      {
        name: 'uploads',
        field: 'uploads'
      },
      {
        name: 'uploadTags',
        field: 'uploadTags'
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
      rowsPerPage: 10
    },
    selectedRows: []
  }),
  firebase () {
    return {
      entries: this.$db.ref('users/' + this.uid)
    }
  },
  created () {
    this.$auth.onAuthStateChanged(user => {
      console.log('onAuthStateChanged inside table.vue')
      this.uid = this.$auth.currentUser.uid
      this.entriesRef = this.$db.ref('users/' + this.uid)

      this.entriesRef.on('value', data => {
        this.entries = []
        // console.log('entriesRef on value')
        var obj = data.val()

        if (!obj) {
          this.loaded = true
          return
        }

        for (const [key, value] of Object.entries(obj)) {
          if (!value.tags) {
            value.tags = []
          }
          if (!value.uploads) {
            value.uploads = []
          }
          value.id = key
          // console.log(value)
          this.entries.push(value)
        }
        this.storageRef = this.$storage.ref().child('uploads/' + this.uid)
        this.loaded = true
      })
    })
  },
  methods: {
    // customSearch (rows, terms, cols, cellValue) {
    //   // console.log(cols)
    //   const lowerTerms = terms ? terms.toLowerCase() : ''
    //   var results = rows.filter(
    //     row => cols.some(col => (cellValue(col, row) + '').toLowerCase().indexOf(lowerTerms) !== -1)
    //   )

    //   for (let i = 0; i < this.entries.length; i++) {
    //     const entry = this.entries[i]
    //     var desc = entry.description.toLowerCase().split(' ')
    //     var tags = entry.tags
    //     var allTerms = desc.concat(tags)

    //     for (let j = 0; j < allTerms.length; j++) {
    //       if (this.search === allTerms[j]) {
    //         results.push(entry)
    //       }
    //     }
    //   }
    //   return results
    // },
    editCell (field, value, row) {
      console.log('editCell()')
      console.log('field: ' + field)
      console.log('value: ' + value)
      this.entriesRef.child(row.id + '/' + field).set(value)
    },
    deleteEntries () {
      this.$q.dialog({
        title: 'Delete entries',
        message: 'Do you want to delete all selected entries?',
        cancel: true,
        ok: true
      }).then(() => {
        for (let i = 0; i < this.selectedRows.length; i++) {
          // console.log(this.selectedRows[i])
          // console.log(this.selectedRows[i].id)
          this.entriesRef.child(this.selectedRows[i].id).remove()
          // this.$db.ref().child(this.selectedRows[i].id).remove()
        }
      }).catch((err) => {
        this.$q.notify('Could not delete. ' + err.message)
      })
    },

    addFiles (files) {
      files.forEach((file) => {
        this.newUploads.push(file)
      })
    },
    removeFile (file) {
      this.newUploads = this.newUploads.filter(f => f !== file)
    },
    uploadFiles () {
      console.info('Uploading files for entry ' + this.fileEntryId)
      console.log(this.newUploads)
      if (this.newUploads.length === 0) {
        this.$q.notify('First click the add button to select files for upload.')
        return
      }

      this.$q.loading.show({ 'message': 'Uploading files' })

      this.newUploads.forEach((file) => {
        const fileRef = this.storageRef.child(this.fileEntryId + '/' + file.name)

        fileRef.put(file)
          .then((snapshot) => {
            this.notifyUploadSuccess(file.name)
          })
          .catch((err) => {
            this.notifyUploadException(file.name, err)
          })
      })

      // Merge existing and new upload filenames in database
      var newFilenames = []
      this.newUploads.forEach((file) => {
        newFilenames.push(file.name)
      })
      var allFilenames = newFilenames.concat(this.existingUploads)
      console.log(allFilenames)
      this.entriesRef.child(this.fileEntryId + '/' + 'uploads').set(allFilenames)
    },
    setSelectedRow (row) {
      console.log('setting selected row to:')
      console.log(row)
      this.fileEntryId = row.id
      this.existingUploads = row.uploads
    },
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

<style lang='stylus'>
// Hide empty column headers
.text-right
  display none

.q-input
  padding 2px

.q-datetime
  padding 2px

.q-select
  padding 2px

.q-chip
  margin 2px 1px
  font-size 10px
  .q-icon
    font-size 14px
.q-chips-input
  padding 2px
.q-input-chips
  padding-left 4px

.input-prefix
  font-size 9px
</style>
