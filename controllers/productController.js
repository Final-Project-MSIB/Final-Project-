const { Product, Category } = require('../models')
const formatIdr = require('../utils/formatIdr')
class productController {
    static async create(req, res) {
        try {
            const { title, price, stock, CategoryId } = req.body
            if (!CategoryId) {
                return res.status(400).json({
                    message: 'CategoryId is required'
                })
            }

            const category = await Category.findByPk(CategoryId);

            if (!category) {
                return res.status(404).json({
                    message: 'Category not found'
                })
            }
            const newProduct = await Product.create({
                title,
                price,
                stock,
                CategoryId
            })
            if (!newProduct) {
                throw {
                    code: 400,
                    message: "Failed to create new product"
                }
            }
            res.status(201).json({
                "products": {
                    id: newProduct.id,
                    title: newProduct.title,
                    price: formatIdr(newProduct.price),
                    stock: newProduct.stock,
                    Category: newProduct.Category,
                    createdAt: newProduct.createdAt,
                    updatedAt: newProduct.updatedAt
                }
            })
        } catch (error) {

            res.status(error.code || 500).json({ message: error.errors[0].message })
        }
    }
    static async getAll(req, res) {
        try {
            const data = await Product.findAll()
            data.forEach(transaction => {
                transaction.price = formatIdr(transaction.price);
            });
            res.status(200).json({
                "products": data
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async update(req, res) {
        try {
            const { productid } = req.params
            const { title, price, stock } = req.body
            const data = await Product.update(
                {
                    title,
                    price,
                    stock
                }, {
                where: {
                    id: productid
                },
                returning: true
            }
            )
            res.status(200).json({
                "products": {
                    id: data[1][0].id,
                    title: data[1][0].title,
                    price: formatIdr(data[1][0].price),
                    stock: data[1][0].stock,
                    Category: data[1][0].Category,
                    createdAt: data[1][0].createdAt,
                    updatedAt: data[1][0].updatedAt
                }
            })

        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })

        }
    }
    static async patchUpdate(req, res) {
        try {
            const { productid } = req.params
            const { CategoryId } = req.body
            const check = await Product.findByPk(productid)
            if (!check) {
                throw {
                    code: 404,
                    message: 'Product not found'
                }
            }
            if (!CategoryId) {
                throw {
                    code: 400,
                    message: 'CategoryId is required'
                }
            }

            const category = await Category.findByPk(CategoryId);

            if (!category) {
                throw {
                    code: 404,
                    message: 'Category not found'
                }
            }
            const data = await Product.update(
                {
                    CategoryId
                }, {
                where: {
                    id: productid
                },
                returning: true
            })
            res.status(200).json({
                Product: {
                    id: data[1][0].id,
                    title: data[1][0].title,
                    price: formatIdr(data[1][0].price),
                    stock: data[1][0].stock,
                    CategoryId: data[1][0].CategoryId,
                    createdAt: data[1][0].createdAt,
                    updatedAt: data[1][0].updatedAt
                }
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async delete(req, res) {
        try {
            const { productid } = req.params
            const check = await Product.findOne({
                where: {
                    id: productid
                }
            })
            if (!check) {
                throw {
                    code: 404,
                    message: "Product not found"
                }
            }
            const data = await Product.destroy({
                where: {
                    id: productid
                }
            })
            res.status(200).json({
                message: "Your product has been successfully deleted"
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
}

module.exports = productController