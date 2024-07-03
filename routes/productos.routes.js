import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const router = Router();

const getData = async()=>{
  const fileUser = await readFile("./data/productos.json", "utf-8");
  return JSON.parse(fileUser);
}

// Mostrar todos los Productos.

router.get("/all", async (req, res) => {
  const dataProductos = await getData()
  try {
    res.status(200).json(dataProductos);
  } catch {
    res
      .send(500)
      .json({ message: "Se produjo un error al listar los productos." });
  }
});

// Listar producto por Id

router.get("/buscarProductoPorId/:id", async (req, res) => {
  const id_producto = parseInt(req.params.id);
  const dataProductos = await getData()

  try {
    const producto = dataProductos.find((e) => e.id_producto == id_producto);
    if (!producto) {
      return res.status(400).json({ message: "Producto no encontrado" });
    } else {
      return res.json(producto);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar el producto" });
  }
});
export default router;




