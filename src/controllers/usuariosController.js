const UserModel = require("../models/UsuariosModels");
const {
  CreateUser,
  FindOneUsername,
  updateUser,
} = require("../repository/UserRepository");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
// Registrar/Crear usuarios
async function create(req, res) {
  const params = req.body;

  const user = new UserModel();

  if (
    !params.nombres ||
    !params.apellidos ||
    !params.usuario ||
    !params.password ||
    !params.email
  ) {
    res.status(404).send({ message: "Todos los campos son requeridos" });
    return;
  }

  //Encriptar password
  bcrypt.hash(params.password, null, null, async function (err, hash) {
    if (hash) {
      user.nombres = params.nombres;
      user.apellidos = params.apellidos;
      user.email = params.email;
      user.usuario = params.usuario;
      user.password = hash;

      const response = await CreateUser(user);
      res.status(response.status).send(response);
    }
  });
}

async function login(req, res) {
  const params = req.body;

  if (!params.usuario || !params.password) {
    res
      .status(404)
      .send({ message: "Por favor, proporcione un usuario y una contraseña." });
    return;
  }

  const user = await FindOneUsername(params.usuario);
  if (user) {
    //Logueo
    bcrypt.compare(
      params.password,
      user.result.password,
      function (err, check) {
        if (check) {
          res.status(200).send({
            message: "el usuario se encuentra logueado",
            token: jwt.createToken(user.result),
          });
        } else {
          res.status(404).send({ message: "Usuario o contraseña Invalida" });
        }
      }
    );
  } else {
    res.status(404).send({ message: "Usuario o contraseña Invalida" });
  }
}

async function updateUserDataPassword(req, res) {
  const params = req.body;
  const userExiste = await FindOneUsername(params.usuario);

  if (userExiste.result) {
    const usuario = params.usuario; // Usar params.usuario en lugar de req.params["usuario"]
    const body = req.body;

    let user = new UserModel();
    user.password = body.password;

    bcrypt.hash(user.password, null, null, async function (err, hash) {
      if (hash) {
        user.password = hash;
        const response = await updateUser(usuario, user);
        res.status(response.status).send(response);
      }
    });
  } else {
    res.status(400).send({ message: "Usuario  Invalido" });
  }
}

module.exports = {
  create,
  login,
  updateUserDataPassword,
};
