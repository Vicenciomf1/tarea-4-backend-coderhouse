const fs = require('fs');


class Contenedor {
  constructor(productos) {
    this.productos = productos || [];
    this.actualizar = false;
  }

  async getAll() {
    if (!this.actualizar) return [...this.productos];

    try {
      const productos = await fs.promises.readFile(this.ruta, 'utf-8');
      return JSON.parse(productos);  //Ojo con el error si es que parto con un archivo vacío
    } catch (error) {
      console.log("No se pudo leer el archivo desde el filesystem, tu error es el siguiente: " + error);
    }
  }

  async getById(id) {
    const productos = await this.getAll();
    const producto = productos.find(prod => prod.id === id);
    if (!producto) return null;
    return producto;
  }

  async reemplazar(productos) {
    try{
      await fs.promises.writeFile(this.ruta, JSON.stringify(productos, null, 2));
      this.productos = productos;
      this.actualizar = true;
    } catch (e) {
      console.log("No se pudo sobrescribir el archivo desde el filesystem, tu error es el siguiente: " + error);
    }
  }

  async save(producto) {
    const productos = await this.getAll();
    const ultimoId = productos.length === 0 ? 0 : productos[productos.length - 1].id;
    const nuevoId = ultimoId + 1;
    
    producto.id = nuevoId;
    productos.push(producto);

    await this.reemplazar(productos);

    return nuevoId;
  }

  async updateById(id, nuevoProducto) {
    const productos = await this.getAll();
    const index = productos.findIndex(prod => prod.id === id);
    if (index === -1) return null;

    productos[index] = {...nuevoProducto, id: id};
    
    await this.reemplazar(productos);

    return nuevoProducto;
  }

  async deleteById(id) {
    const productos = await this.getAll();
    const indice = productos.findIndex(prod => prod.id === id);
    if (indice === -1) return null;
    
    const productoEliminado = productos[indice];
    productos.splice(indice, 1);

    await this.reemplazar(productos);

    return productoEliminado;
  }

  async deleteAll() {
    await this.reemplazar([]);
  }
}

const contenedorProductos = async () => {
  const productos = await fs.promises.readFile(this.ruta, 'utf-8');
  const parseados = JSON.parse(productos);
  const contenedor = new Contenedor(parseados);
  return contenedor;
};

module.exports = contenedorProductos;
