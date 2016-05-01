/*
 * This is meant to run in the browser, after being transformed by webpack. It is a proof of concept that can read and write to ipfs.
 *
 * 1. establish repo
 * 2. put html in that repo
 * 3. pull html out of repo
 * 4. setup service worker to serve html
 * 5. render html
 */
const async = require('async')
const _ = require('lodash')

// configure repo
var repoData = []
const store = require('idb-plus-blob-store')
const mainBlob = store('ipfs')
const blocksBlob = store('ipfs/blocks')
const repoContext = require.context('buffer!./.ipfs', true)

// load repo into memory
repoContext.keys().forEach((key) => {
  console.log('stuffing into idb: ' + key)
  repoData.push({
    key: key.replace('./', ''),
    value: repoContext(key)
  })
})

// store memory into idb
async.eachSeries(repoData, storeInIdb, registerServiceWorker)

// store something from memory into a blob store
const storeInIdb = function (file, cb) {
  var [prefix, ...key] = file.key.split('/')[0]

  if (prefix == 'datastore') {
    return cb()
  }

  blob.createWriteStream({key: key[0] || prefix}).end(file.value, cb)
}

// register the ipfs service worker
const registerServiceWorker = function() {
  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('ipfs-service-worker.js', {scope: './'})
  }
}
