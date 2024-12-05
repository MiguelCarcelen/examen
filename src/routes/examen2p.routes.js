import { Router } from "express";
import {
    grabarResultado,
    login,
    recuperarPartidos,
    recuperarResultados,
    registrarPartido, registrarPronostico
} from "../controladores/examen2pCtrl.js";
const router = Router();
// armar nuestras rutas


router.post("/login", login);
router.post("/registrarPartido", registrarPartido);
router.post("/registrarPronostico", registrarPronostico);
router.post("/recuperarPartidos", recuperarPartidos);
router.post("/recuperarResultados", recuperarResultados);
router.post("/grabarResultado", grabarResultado);





export default router;
