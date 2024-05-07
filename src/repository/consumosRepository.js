const { Response } = require("../utils/response");
const ConsumoModel = require("../models/consumosModel");

module.exports.createConsumo = async (consumo) => {
  return new Promise((resolve, reject) => {
    consumo
      .save()
      .then((resp) => {
        Response.status = 201;
        Response.message = "Datos guardados correctamente en la base de datos";
        Response.result = resp;
        resolve(Response);
      })
      .catch((err) => {
        console.log("error:", err);
        Response.status = 500;
        Response.message = "Error al guardar los datos en la base de datos";
        Response.result = err;
        reject(Response);
      });
  });
};

module.exports.obtenerDatosDiarios = async (fecha) => {
  return new Promise((resolve, reject) => {
    ConsumoModel.find({ fecha })
      .then((resp) => {
        Response.status = 201;
        Response.message = "Datos obtenidos correctamente en la base de datos";
        Response.result = resp;
        resolve(Response);
      })
      .catch((err) => {
        console.log("error:", err);
        Response.status = 500;
        Response.message = "Error al obtener los datos en la base de datos";
        Response.result = err;
        reject(Response);
      });
  });
};

module.exports.findAllConsumos = async () => {
  return new Promise((resolve, reject) => {
    ConsumoModel.find()
      .then((resp) => {
        Response.status = 200;
        Response.message = "Registros Encontrados";
        Response.result = resp;
        resolve(Response);
      })
      .catch((err) => {
        console.log("error:", err);
        Response.status = 500;
        Response.message = "Ocurrio un error en el servidor";
        Response.result = err;
        reject(Response);
      });
  });
};
