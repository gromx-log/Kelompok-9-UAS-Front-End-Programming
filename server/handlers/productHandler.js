const Product = require('../models/productModel');
const { sendJSON, sendError } = require('../utils/responseHelper');

// GET /api/products
async function getAllProducts(req, res) {
  try {
    const products = await Product.find();
    sendJSON(res, 200, products);
  } catch (error) {
    sendError(res, 500, 'Server Error: ' + error.message);
  }
}

module.exports = {
  getAllProducts
};