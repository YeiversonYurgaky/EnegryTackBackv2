const UserModel = require("../models/usuariosModel");
const {
  CreateUser,
  FindOneUsername,
  updateUser,
} = require("../repository/usuariosRepository");
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
    res.status(400).send({ message: "Todos los campos son requeridos" });
    return;
  }

  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(params.password, 10);

    // Asignar los valores al usuario
    user.nombres = params.nombres;
    user.apellidos = params.apellidos;
    user.email = params.email;
    user.usuario = params.usuario;
    user.password = hashedPassword;

    // Crear el usuario en la base de datos
    const response = await CreateUser(user);
    res.status(response.status).send(response);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
}

async function login(req, res) {
  const params = req.body;

  if (!params.usuario || !params.password) {
    return res
      .status(400)
      .send({ message: "Por favor, proporcione un usuario y una contraseña." });
  }

  try {
    const user = await FindOneUsername(params.usuario);

    if (user) {
      bcrypt.compare(
        params.password,
        user.result.password,
        function (err, check) {
          if (err) {
            console.error("Error al comparar contraseñas:", err);
            return res
              .status(500)
              .send({ message: "Error interno del servidor" });
          }

          if (check) {
            // Si la contraseña es correcta, crea un token JWT y lo envía en la respuesta
            const token = jwt.createToken(user);
            return res.status(200).send({
              message: "El usuario se encuentra logueado",
              token: token,
            });
          } else {
            return res
              .status(401)
              .send({ message: "Usuario o contraseña inválida" });
          }
        }
      );
    } else {
      return res.status(401).send({ message: "Usuario o contraseña inválida" });
    }
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return res.status(500).send({ message: "Error interno del servidor" });
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
