const express = require("express");
const usuariosController = require("../controllers/usuariosController");

const api = express.Router();

api.post("/usuarios/registrarse", usuariosController.create);
api.post("/usuarios/ingresar", usuariosController.login);
api.put(
  "/usuarios/actualizarcontraseña/:usuario",
  usuariosController.updateUserDataPassword
);

module.exports = api;
