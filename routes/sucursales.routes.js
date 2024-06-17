import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const router = Router();

const fileUser = await readFile("./data/sucursales.json", "utf-8");
const sucursales = JSON.parse(fileUser);

// Mostrar todas las sucursales.

router.get("/all", async (req, res) => {
  try {
    res.status(200).json(sucursales);
  } catch {
    res.status(500).json({ message: "No se pudieron cargar las sucursales" });
  }
});

// Buscar Usuario por ID.

router.get("/buscarPorId/:id_sucursal", async (req, res) => {
  const id_sucursal = parseInt(req.params.id_sucursal);
  const sucursal = sucursales.find(
    (sucursal) => sucursal.id_sucursal == id_sucursal
  );
  if (!sucursal) {
    return res.status(400).json({ message: "Sucursal no encontrado" });
  } else {
    return res.json(sucursal);
  }
});

// Dar de alta una nueva sucursal

router.post("/sucursalNueva", async (req, res) => {
  const { direccion } = req.body;

  try {
    const id_sucursal = sucursales.length + 1;
    const nuevaSucursal = { id_sucursal, direccion };
    sucursales.push(nuevaSucursal);
    await writeFile(
      "./data/sucursales.json",
      JSON.stringify(sucursales, null, 2)
    );

    res.json({ message: "Sucursal creada con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la sucursal" });
  }
});

// Actualizar domicilio sucursal

router.put("/actualizarDomicilio", async (req, res) => {
  const id_sucursal = parseInt(req.body.id_sucursal);
  const direccion = req.body.direccion;

  try {
    const sucursal = sucursales.find(
      (sucursal) => sucursal.id_sucursal == id_sucursal
    );
    if (sucursal) {
      sucursal.direccion = direccion;
      await writeFile(
        "./data/sucursales.json",
        JSON.stringify(sucursales, null, 2)
      );

      res.json({ message: "Domicilio actualizado con éxito" });
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró la sucursal solicitada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar domicilio" });
  }
});

// Eliminar sucursal

router.delete("/delete/:id_sucursal", async (req, res) => {
  const id_sucursal = parseInt(req.params.id_sucursal);

  try {
    const i = sucursales.findIndex((e) => e.id_sucursal == id_sucursal);

    if (i !== -1) {
      sucursales.splice(i, 1);
      await writeFile(
        "./data/sucursales.json",
        JSON.stringify(sucursales, null, 2)
      );

      let ventas = await readFile("./data/ventas.json");
      ventas = JSON.parse(ventas);
      ventas = ventas.filter((venta) => venta.id_sucursal !== id_sucursal);

      await writeFile("./data/ventas.json", JSON.stringify(ventas, null, 2));
      return res.json({ message: "Sucursal eliminada con éxito" });
    } else {
      return res.status(200).json("No se encontró la sucursal");
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la sucursal" });
  }
});

export default router;
