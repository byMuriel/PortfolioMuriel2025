// crud.js

const fs = require('fs')
const path = require('path')

const rutaArchivo = path.join(__dirname, 'datos.json')

// Leer datos del archivo
function leer() {
  const contenido = fs.readFileSync(rutaArchivo, 'utf8')
  return JSON.parse(contenido)
}

// Escribir datos al archivo
function guardar(datos) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(datos, null, 2))
}

// Crear nuevo registro
function crear(nombre) {
  const datos = leer()
  const nuevo = {
    id: Date.now(),
    nombre,
  }
  datos.push(nuevo)
  guardar(datos)
  return nuevo
}

// Eliminar por id
function eliminar(id) {
  const datos = leer()
  const actualizados = datos.filter((item) => item.id !== id)
  guardar(actualizados)
  return datos.length !== actualizados.length
}

// Modificar por id
function modificar(id, nuevoNombre) {
  const datos = leer()
  const index = datos.findIndex((item) => item.id == id)
  if (index !== -1) {
    datos[index].nombre = nuevoNombre
    guardar(datos)
    return datos[index]
  }
  return null
}

module.exports = {
  leer,
  crear,
  eliminar,
  modificar,
}
