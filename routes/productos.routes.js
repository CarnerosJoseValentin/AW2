import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const router = Router();

const fileUser = await readFile("./data/productos.json", "utf-8");
const productos = JSON.parse(fileUser);

// Buscar Producto por palabra clave.

router.get("/buscarArtPorPalabra/:palabra", async (req, res) => {
  const palabra = req.params.palabra.toLocaleLowerCase();
  try {
    const producto = productos.filter((product) =>
      product.nombre.toLocaleLowerCase().includes(palabra)
    );
    if (producto.length === 0) {
      return res.status(400).json({
        message: "No se encontraron productos con la palabra elegida",
      });
    } else {
      return res.json(producto);
    }
  } catch (error) {
    res
      .send(500)
      .json({ message: "Se produjo un error inesperado en la busqueda." });
  }
});

// Mostrar todos los Productos.

router.get("/all", async (req, res) => {
  try {
    res.status(200).json(productos);
  } catch {
    res
      .send(500)
      .json({ message: "Se produjo un error al listar los productos." });
  }
});

// Buscar Producto por rango de precios

router.post("/BuscarPorPrecio", (req, res) => {
  const desde = req.body.desde;
  const hasta = req.body.hasta;

  try {
    const arr = productos.filter((e) => e.precio >= desde && e.precio <= hasta);

    const resultado = arr.map((e) => {
      return {
        id_producto: e.id_producto,
        nombre: e.nombre,
        desc: e.desc,
        precio: e.precio,
        imagen: e.imagen,
      };
    });
    if (resultado) {
      res.status(200).json(resultado);
    } else {
      res
        .status(400)
        .json(
          `No se encontraron productos entre los montos ${desde} y ${hasta}`
        );
    }
  } catch (error) {
    res.send(500).json("Se produjo un error inesperado en la busqueda.");
  }
});

// Dar de alta Producto

router.post("/ProductoNuevo", async (req, res) => {
  const { nombre, desc, precio, imagen } = req.body;

  try {
    const nuevoProducto = productos.find((e) => e.nombre === nombre);
    if (nuevoProducto) {
      return res.status(400).json({ message: "El producto ya existe" });
    } else {
      const id_producto = productos.length + 1;
      const nuevoProducto = { id_producto, nombre, desc, precio, imagen };
      productos.push(nuevoProducto);
      await writeFile(
        "./data/productos.json",
        JSON.stringify(productos, null, 2)
      );

      res.json({ message: "Producto cargado con éxito" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al cargar el producto" });
  }
});

// Actualizar Precio del producto

router.put("/actualizarPrecio", async (req, res) => {
  const id_producto = parseInt(req.body.id_producto);
  const precio = parseFloat(req.body.precio);

  try {
    const producto = productos.find(
      (producto) => producto.id_producto == id_producto
    );
    if (producto) {
      producto.precio = precio;
      await writeFile("./data/productos.json", JSON.stringify(productos, null, 2));

      res.json({ message: "Precio del producto actualizado con éxito" });
    } else {
      return res.status(404).json({ message: "No se encontró el producto" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el precio del producto" });
  }
});

// Aumentar Precios de los productos

router.put("/aumentarPrecios", async (req, res) => {
  const porcentaje = parseFloat(req.body.porcentaje);

  try {
    productos.forEach((producto) => {
      producto.precio += (producto.precio * porcentaje) / 100;
    });

    await writeFile(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );

    res.json({ message: "Precios de los productos actualizados con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar los precios de los productos",
      error: error.message,
    });
  }
});

// Disminuir Precios de los productos

router.put("/disminuirPrecios", async (req, res) => {
  const porcentaje = parseFloat(req.body.porcentaje);

  try {
    productos.forEach((producto) => {
      producto.precio -= (producto.precio * porcentaje) / 100;
    });

    await writeFile(
      "./data/productos.json",
      JSON.stringify(productos, null, 2)
    );

    res.json({ message: "Precios de los productos actualizados con éxito" });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar los precios de los productos",
      error: error.message,
    });
  }
});

// Eliminar producto

router.delete("/delete/:id_producto", (req, res) => {
  const id_producto = parseInt(req.params.id_producto);

  try {
    const i = productos.findIndex((e) => e.id_producto == id_producto);

    if (i !== -1) {
      productos.splice(i, 1);
      writeFile("./data/productos.json", JSON.stringify(productos, null, 2));
      res.json({ message: "Producto eliminado con éxito" });
    } else {
      res.send(200).json("No se encontro al producto");
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

export default router;
