const express = require('express');
const app = express();

const Contenedor = require('./Contenedor.js');
const contenedorProductos = new Contenedor('productos.txt');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const router = express.Router();
app.use('/api/productos', router);

// GET /api/productos
router.get('/', async (req, res) => {
  const productos = await contenedorProductos.getAll();
  res.status(200).json(productos);
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const producto = await contenedorProductos.getById(id);

  if (producto) {
    res.status(200).json(producto);
  } else {
    res.status(404).json({error: 'Producto no encontrado'});
  }
});

// POST /api/productos
router.post('/', async (req, res) => {
  const producto = req.body;
  const nuevoId = await contenedorProductos.save(producto);
  res.status(201).send(`Producto creado exitosamente, cuyo id es ${nuevoId}`);
});

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const producto = req.body;

  const productoActualizado = await contenedorProductos.updateById(id, producto);

  if (productoActualizado) {
    res.status(200).send(`Producto con id ${id} actualizado exitosamente`);
  } else {
    res.status(404).json({error: 'Producto no encontrado'});
  }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const productoEliminado = await contenedorProductos.deleteById(id);

  if (productoEliminado) {
    res.status(200).send(`El producto con id ${id} fue eliminado exitosamente`);  // También puedo hacer un productoEliminado.id
  } else {
    res.status(404).send({error: `Producto no eliminado, ya que no existe alguno con el id ${id}`});
  }
});


const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", error => console.log(`Encontramos el siguiente error en el servidor: ${error}`));



  