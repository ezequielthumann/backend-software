//aquí se manejan las peticiones que realiza en front
//esta en construcción

//en funcionamiento
//login y singup

import { connect } from "./databases";

export const getPublish = async (req, res) => {
  const cnn = await connect();
  const [row] = await cnn.query("select * from users");
  res.json(row); 
};

//devuelve todas las categorias de la bd
export const getCategoria = async (req, res) => {
  try {
    const cnn = await connect();
    const [cat] = await cnn.query("SELECT * FROM categoria");
    res.json(cat);
  } catch (err) {
    res.json(err);
  }
};

//devuelve todo los puntos de ventas de la bd
export const getPtovta = async (req, res) => {
  try {
    const cnn = await connect();
    const [pto] = await cnn.query("SELECT * FROM punto_venta");
    res.json(pto);
  } catch (err) {
    res.json(err);
  }
};

export const getAll = async (req, res) => {
  try {
    const { tabla } = req.body;
    const cnn = await connect();
    const [all] = await cnn.query(`SELECT * FROM ${tabla}` );
    res.json(all);
  } catch (er){
    res.json(er);
  }
};
