// server.js sin base dedatos, solo con JSON
const express = require('express')
const path = require('path')
const crud = require('./crud')
const app = express()
const PORT = 3000

// Middleware para leer JSON
app.use(express.json())

// Servir archivos estáticos desde la carpeta "dist", hace que s emuestre el fichero index.html en el navegador
app.use(express.static(path.join(__dirname, '..', 'dist')))

// API para crear registro
app.post('/api/create', (req, res) => {
  const { nombre } = req.body
  const nuevoRegistro = crud.crear(nombre)
  res.json({ mensaje: 'Registro creado', registro: nuevoRegistro })
})

// API para leer todos los registros
app.get('/api/read', (req, res) => {
  const datos = crud.leer()
  res.json(datos)
})

// API para actualizar registro
app.put('/api/update/:id', (req, res) => {
  const id = req.params.id
  const { nombre } = req.body
  const actualizado = crud.modificar(id, nombre)
  if (actualizado) {
    res.json({ mensaje: 'Registro modificado', registro: actualizado })
  } else {
    res.status(404).json({ mensaje: 'Registro no encontrado' })
  }
})

// API para eliminar registro
app.delete('/api/delete/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const eliminar = crud.eliminar(id)
  if (!eliminar) {
    return res.status(404).json({ mensaje: 'Registro no encontrado' })
  } else {
    res.json({ mensaje: 'Registro eliminado' })
  }
})

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

// // Ruta API GET simple
// app.get('/api/saludo', (req, res) => {
//   res.json({ mensaje: 'Hola desde el backend con Node.js!' });
// });

// // Ruta API POST para recibir datos
// app.post('/api/data', (req, res) => {
//   const recibido = req.body;
//   console.log('Datos recibidos:', recibido);
//   res.json({ status: 'ok', recibido });
// });
