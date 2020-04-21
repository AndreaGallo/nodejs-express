const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('../mongo/models/users');
const Products = require('../mongo/models/products');

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

const deleteUser = async (request, response) => {
  try {
    const { userId } = request.body;

    if (!userId) {
      throw new Error('Missing param userId');
    }

    await Users.findByIdAndDelete(userId);
    await Products.deleteMany({ user: userId });
    response.send({ status: 'ok', message: 'User deleted' });
  } catch (error) {
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

const getUsers = async (request, response) => {
  try {
    const users = await Users.find().select({ password: 0, data: 0 });
    response.send({ status: 'ok', data: users });
  } catch (error) {
    response.status(500).send({ status: 'Error', message: error.message });
  }
};

const updateUser = async (request, response) => {
  try {
    console.log('Sessiondata', request.sessionData);
    const { username, email } = request.body;

    await Users.findByIdAndUpdate(request.sessionData.userId, {
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
