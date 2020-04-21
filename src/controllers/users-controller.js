const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../mongo/models/users');

const expiresIn = 600;

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await Users.findOne({ email });

    if (user) {
      const passwordIsOk = await bcrypt.compare(password, user.password);
      if (passwordIsOk) {
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn,
          }
        );
        response.send({
          status: 'OK',
          data: {
            token,
            expiresIn,
          },
        });
      } else {
        response.status(401).send({ status: 'Invalid_password', message: '' });
      }
    } else {
      response.status(404).send({ status: 'User_not_found', message: '' });
    }
  } catch (error) {
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

const createUser = async (request, response) => {
  try {
    const { username, email, password, data } = request.body;

    const hash = await bcrypt.hash(password, 15);

    await Users.create({
      username,
      email,
      password: hash,
      data,
    });

    response.send({ status: 'ok', message: 'User created' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      response
        .status(400)
        .send({ status: 'Duplicated_Values', message: error.keyValue });
      return;
    }
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

const deleteUser = (request, response) => {
  response.send({ status: 'ok', message: 'User deleted' });
};

const getUsers = (request, response) => {
  response.send({ status: 'ok', data: [] });
};

const updateUser = async (request, response) => {
  try {
    const { username, email, userId } = request.body;

    await Users.findByIdAndUpdate(userId, {
      username,
      email,
    });

    response.send({ status: 'OK', message: 'User updated' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      response
        .status(400)
        .send({ status: 'Duplicated_Values', message: error.keyValue });
      return;
    }
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  login,
};
