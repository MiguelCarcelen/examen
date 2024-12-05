import { conmysql } from "../db.js";
export const login = async (req, res) => {
    try {
      const { user, password } = req.body;
  
      // Validar que se envían ambos campos
      if (!user) {
        return res.status(400).json({
          Mensaje: "Error: El usuario es requerido",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
  
      if (!password) {
        return res.status(400).json({
          Mensaje: "Error: La contraseña es requerida",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
  
      // Consulta la base de datos
      const [result] = await conmysql.query(
        `SELECT * FROM usuario WHERE usuario = ? AND clave = ?`,
        [user, password]
      );
  
      // Manejo de resultados
      if (result.length > 0) {
        return res.json({
          Mensaje: "Inicio de sesión exitoso",
          cantidad: result.length,
          data: result,
          color: "success",
        });
      } else {
        return res.status(401).json({
          Mensaje: "Credenciales incorrectas",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
    } catch (error) {
      // Manejo de errores del servidor
      return res.status(500).json({
        Mensaje: "Error en el servidor",
        error: error.message,
      });
    }
  };
  