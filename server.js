const crypto = require('crypto')
const express = require('express')
const { createServer } = require('http')
const webSocket = require('ws')

const app = express()
const port = 3100

app.get('/', (req, res) => {
    res.send("Welcome")
})

const server = createServer(app)

const wss = () => {
    return webSocket.WebSocketServer({server})
}

module.exports = wss

server.listen()