const express = require('express')
const bodyparser = require('body-parser')

const server = express()
const port = 3005
const Userroute = require('./Routes/user-route')

server.use(bodyparser.json())
server.use(bodyparser.urlencoded({extended:true}))
//indica qual rota vai usar, /api é o "prefixo da rota"
server.use('/api',Userroute)


server.listen(port,()=>(
    console.log(`backend rodando na porta ${port}`)
))