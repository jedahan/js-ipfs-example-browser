self.oninstall = (event) => {
  event.waitUntil(self.skipWaiting())
}

self.onactivate = (event) => {
  event.waitUntil(self.clients.claim())
}

importScripts('./lib/ServiceWorkerWare.js')
var root = (() => {
  var tokens = (self.location + '').split('/')
  tokens[ tokens.length - 1 ] = ''
  return tokens.join('/')
})()

var worker = new ServiceWorkerWare()

worker.get(root, (req, res) => {
  const sample_hash = 'QmcTopr4M1aYDAu7WbbBfNVWx1sRBnd6cPBSHjBbqXAovm'
  const sample_url = root + 'ipfs/' + sample_hash

  const content = 'Welcome to IPFS' +
  '<br /> Enter a hash into the address bar ' +
  '<br /> ie: <a href=\'' + sample_url + '\'>' + sample_url + '</a>'

  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})

worker.get(root + 'ipfs/:hash', (req, res) => {
  console.log('IPFS GET: ' + req.url)

  const hash = req.parameters.hash
  const content = `requested ${hash}`

  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})

worker.get(root + 'ipfs/:hash/*', (req, res) => {
  console.log('IPFS GET: ' + req.url)

  const url = req.clone().url
  const hash = req.parameters.hash
  const resource = url.substring(url.indexOf(hash) + hash.length, url.length)
  let content = '<html><body><br />' +
    'Request for: <br />' + url +
    '<br/>will work one day</body></html>'
  return Promise.resolve(new Response(content, {
    headers: {
      'Content-Type': 'text/html'
    }
  }))
})

worker.init()
