import { hostname, networkInterfaces } from 'os'

const nets = networkInterfaces()
const results = {}

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = []
      }
      results[name].push(net.address)
    }
  }
}
const ip = (results['en0'] || results['eth0'])[0]
console.log(ip)

Bun.serve({
  development: true,
  fetch(req, server) {
    let filePath = new URL(req.url).pathname
    if (filePath === '/' || filePath === '/control') {
      filePath = 'index.html'
    }
    console.log(req.url, filePath)
    return new Response(Bun.file(`./dist/${filePath}`))
  }, // upgrade logic

  port: 4040
})

Bun.serve({
  development: true,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return // do not return a Response
    }
    return new Response('Upgrade failed :(', { status: 500 })
  }, // upgrade logic
  websocket: {
    message(ws, message) {
      console.log('ws.message', { message })
      ws.publish('rondebord', message)
    }, // a message is received
    open(ws) {
      console.log('ws.open')
      ws.subscribe('rondebord')
      ws.send(JSON.stringify({ type: 'ip', data: ip }))
    }, // a socket is opened
    close(ws, code, message) {
      console.log('ws.close', { code, message })
    }, // a socket is closed
    drain(ws) {
      console.log('ws.drain')
    } // the socket is ready to receive more data
  },
  port: 3030
})
