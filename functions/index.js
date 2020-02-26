'use strict'

const functions = require('firebase-functions')
const config = {
  projectId: 'rocky-money',
  keyfileName: 'keyfile.json'
}
// const vision = require('@google-cloud/vision')(config)
const vision = require('@google-cloud/vision')
const client = new vision.ImageAnnotatorClient()

var admin = require("firebase-admin")
var serviceAccount = require('./keyfile.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rocky-money.firebaseio.com"
})
const db = admin.database()

exports.callVision = functions.storage.object().onChange(event => {
  const obj = event.data
  // Get user ID and entity ID from file path and create entry ref
  const uid = obj.name.split('/')[1]
  const entryId = obj.name.split('/')[2]
  const entryRef = db.ref('/users/' + uid + '/' + entryId)
  const gcsUrl = 'gs://' + obj.bucket + '/' + obj.name

  client.textDetection(gcsUrl)
    .then(results => {
      const detections = results[0].textAnnotations
      console.log('DETECTIONS:')
      console.log(detections)

      const tags = detections[0].description.split(/\n| /)
      console.log('TAGS:')
      console.log(tags)

      entryRef.child('uploadTags').set(tags)
      return true
    })
    .catch((err) => {
      console.error(err)
    })
})
