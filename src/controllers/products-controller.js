const Products = require('../mongo/models/products');

const createProduct = async (request, response) => {
  try {
    const { title, desc, price, images, userId } = request.body;

    const product = await Products.create({
      title,
      desc,
      price,
      images,
      user: userId,
    });

    response.send({ status: 'OK', data: product });
  } catch (e) {
    console.log('Create product error', e);
    response.status(500).send({ status: 'Error', data: e.message });
  }
};

const deleteProduct = (request, response) => {};

const getProducts = async (request, response) => {
  try {
    const products = await Products.find()
      .select('title desc price')
      .populate('user', 'username email data role');
    response.send({ status: 'OK', data: products });
  } catch (e) {
    console.log('Get products error', e);
    response.status(500).send({ status: 'Error', data: e.message });
  }
};

const getProductsByUser = async (request, response) => {
  try {
    const products = await Products.find({
      user: request.params.userId
    });
    response.send({ status: 'OK', data: products });
  } catch (e) {
    console.log('Get products by user error', e);
    response.status(500).send({ status: 'Error', data: e.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProductsByUser,
};
