// server.js para base de datos
const express = require('express')
const path = require('path')
const usuarioRoutes = require('./routes/usuarioRoutes')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'dist')))

app.use('/api/usuarios', usuarioRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
