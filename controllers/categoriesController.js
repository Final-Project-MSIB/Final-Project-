
const { Category, Product } = require('../models')
class categoriesController {
    static async create(req, res) {
        try {
            const { type } = req.body
            const newCategories = await Category.create({
                type
            }
            )
            if (!newCategories) {
                throw {
                    code: 400,
                    message: "Failed to create new categoris"
                }
            }
            res.status(201).json({
                "categories": {
                    id: newCategories.id,
                    type: newCategories.type,
                    createdAt: newCategories.createdAt,
                    updatedAt: newCategories.updatedAt,
                    sold_product_amount: newCategories.sold_product_amount
                }
            })

        } catch (error) {

            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async getAll(req, res) {
        try {
            const data = await Category.findAll({
                include: [
                    {
                        model: Product
                    }
                ]
            })
            if (!data) {
                throw {
                    code: 404,
                    message: "Categoris not found!"
                }
            }

            res.status(200).json({
                "categories": data
            })

        } catch (error) {

            res.status(error.code || 500).json({ message: error.message })

        }
    }
    static async update(req, res) {
        try {
            const { categoryid } = req.params
            const { type } = req.body
            const data = await Category.update({
                type
            },
                {
                    where: {
                        id: categoryid
                    },
                    returning: true
                    
                }
            )
            res.status(200).json({
                "categories": {
                    id: data[1][0].id,
                    type: data[1][0].type,
                    sold_product_amount: data[1][0].sold_product_amount,
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
            const { categoryid } = req.params
            const userData = req.UserData
            if (categoryid != userData.id) {
                throw {
                    code: 403,
                    message: "You Cannot Delete This User"
                }
            }
            const check = await Category.findOne({
                where: {
                    id: categoryid
                }
            })
            if (!check) {
                throw {
                    code: 404,
                    message: "Category Not Found"
                }
            }
            const data = await Category.destroy({
                where: {
                    id: categoryid
                }
            })
            res.status(200).json({
                message: "Categories has been successfully deleted"
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }

}

module.exports = categoriesController