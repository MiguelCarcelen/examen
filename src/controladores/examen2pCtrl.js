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
  export const registrarPartido = async (req, res) => {
    try {
      const { eq_uno, eq_dos, fecha_par, estado_par } = req.body;
  
      // Validar que se envían los campos requeridos
      if (!eq_uno || !eq_dos || !fecha_par || !estado_par) {
        return res.status(400).json({
          Mensaje: "Error: Todos los campos son requeridos",
          cantidad: 0,
          data: [],
          color: "danger",
        });
      }
  
      // Insertar el partido en la base de datos
      const [result] = await conmysql.query(
        `INSERT INTO partido (eq_uno, eq_dos, fecha_par, estado_par) VALUES (?, ?, ?, ?)`,
        [eq_uno, eq_dos, fecha_par, estado_par]
      );
  
      return res.json({
        Mensaje: "Partido registrado exitosamente",
        cantidad: result.affectedRows,
        data: { id_par: result.insertId, eq_uno, eq_dos, fecha_par, estado_par },
        color: "success",
      });
    } catch (error) {
      // Manejo de errores del servidor
      return res.status(500).json({
        Mensaje: "Error en el servidor",
        error: error.message,
      });
    }

  };
  export const registrarPronostico = async (req, res) => {
  try {
    const { id_usr, id_par, id_res, valor } = req.body;

    // Validar que se envían los campos requeridos
    if (!id_usr || !id_par || !id_res || !valor) {
      return res.status(400).json({
        Mensaje: "Error: Todos los campos son requeridos",
        cantidad: 0,
        data: [],
        color: "danger",
      });
    }

    // Verificar si el partido está activo
    const [partido] = await conmysql.query(
      `SELECT estado_par FROM partido WHERE id_par = ?`,
      [id_par]
    );

    if (partido.length === 0 || partido[0].estado_par !== 'activo') {
      return res.status(400).json({
        Mensaje: "Error: El partido no está activo o no existe",
        cantidad: 0,
        data: [],
        color: "danger",
      });
    }

    // Insertar el pronóstico en la base de datos
    const [result] = await conmysql.query(
      `INSERT INTO pronostico (id_usr, id_par, id_res, valor, fecha_registro) VALUES (?, ?, ?, ?, NOW())`,
      [id_usr, id_par, id_res, valor]
    );

    return res.json({
      Mensaje: "Pronóstico registrado exitosamente",
      cantidad: result.affectedRows,
      data: { id_pron: result.insertId, id_usr, id_par, id_res, valor },
      color: "success",
    });
  } catch (error) {
    // Manejo de errores del servidor
    return res.status(500).json({
      Mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};


export const recuperarPartidos = async (req, res) => {
  try {
    // Recuperar los partidos activos
    const [partidos] = await conmysql.query(
      `SELECT p.id_par, e1.nombre_eq AS equipo_uno, e2.nombre_eq AS equipo_dos, p.fecha_par, p.estado_par 
       FROM partido p
       JOIN equipo e1 ON p.eq_uno = e1.id_eq
       JOIN equipo e2 ON p.eq_dos = e2.id_eq
       WHERE p.estado_par = 'activo'`
    );

    return res.json({
      Mensaje: "Partidos activos recuperados exitosamente",
      cantidad: partidos.length,
      data: partidos,
      color: "success",
    });
  } catch (error) {
    // Manejo de errores del servidor
    return res.status(500).json({
      Mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

export const recuperarResultados = async (req, res) => {
  try {
    // Recuperar los resultados
    const [resultados] = await conmysql.query(
      `SELECT * FROM resultado`
    );

    return res.json({
      Mensaje: "Resultados recuperados exitosamente",
      cantidad: resultados.length,
      data: resultados,
      color: "success",
    });
  } catch (error) {
    return res.status(500).json({
      Mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};

export const grabarResultado = async (req, res) => {
  try {
    const { id_par, id_res } = req.body;

    if (!id_par || !id_res) {
      return res.status(400).json({
        Mensaje: "Error: Todos los campos son requeridos",
        cantidad: 0,
        data: [],
        color: "danger",
      });
    }

    // Actualizar el resultado del partido
    const [result] = await conmysql.query(
      `UPDATE partido SET id_res = ?, estado_par = 'cerrado' WHERE id_par = ?`,
      [id_res, id_par]
    );

    return res.json({
      Mensaje: "Resultado del partido actualizado exitosamente",
      cantidad: result.affectedRows,
      data: { id_par, id_res },
      color: "success",
    });
  } catch (error) {
    return res.status(500).json({
      Mensaje: "Error en el servidor",
      error: error.message,
    });
  }
};
