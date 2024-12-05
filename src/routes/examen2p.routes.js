import { Router } from "express";
import {
    login,
} from "../controladores/examen2pCtrl.js";
const router = Router();
// armar nuestras rutas

// router.get("/listarFacturaDetalles", listarFacturaDetalles);
// router.get("/listarFacturaDetallesActivas", listarFacturaDetallesActivas);
// router.post("/getFacturaDetalleID", getFacturaDetalleID);
// router.post("/getDetalleFacturaID", getFacturaPorID);
// router.post("/insertFacturaDetalle", insertFacturaDetalle);
// router.post("/updateFacturaDetalle", updateFacturaDetalle);
// router.post("/eliminarFacturaDetalle", eliminarFacturaDetalle);
router.post("/login", login);
export default router;
