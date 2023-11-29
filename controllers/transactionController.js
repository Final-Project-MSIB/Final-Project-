const { Product, Category, User, TransactionHistories } = require('../models')
const formatIdr = require('../utils/formatIdr')
class transactionController {
    static async create(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userData = req.UserData
            const product = await Product.findByPk(productId, { include: Category });

            if (!product) {
                throw {
                    code: 404,
                    message: 'Product not found'
                }
            }
            if (quantity > product.stock) {
                throw {
                    code: 400,
                    message: 'Stock not enough'
                }
            }
            // pengecekan user 
            
            const user = await User.findByPk(userData.id);
            if (!user) {
                throw {
                    code: 404,
                    message: 'User not found'
                }
            }
            // pengecekan user balance
            if (user.balance < product.price * quantity) {
                throw {
                    code: 400,
                    message: 'Balance not enough'
                }
            }

            // Seluruh pengecekan selesai, lakukan pembelian
            const totalPrice = product.price * quantity;
            await Product.update(
                {
                    stock: product.stock - quantity
                },
                {
                    where: { id: productId },
                    validate: false, // Nonaktifkan sementara validasi stok saat operasi update
                }
            );
            // Kurangi balance user
            await User.update({ balance: user.balance - totalPrice }, { where: { id: req.UserData.id }, validate: false });

            // Tambahkan sold_product_amount pada category sesuai quantity
            await Category.update(
                { sold_product_amount: product.Category.sold_product_amount + quantity },
                { where: { id: product.Category.id } }
            );

            const data = await TransactionHistories.create({
                quantity: quantity,
                total_price: totalPrice,
                UserId: userData.id,
                ProductId: productId
            })
            if (!data) {
                throw {
                    code: 400,
                    message: "Failed to create new transaction"
                }
            }
            res.status(201).json({
                message: 'You have successfully purchased the product',
                transactionBill: {
                    totalPrice: formatIdr(totalPrice),
                    quantity: quantity,
                    product_name: product.title
                }
            });
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async getUser(req, res) {
        try {
            const userData = req.UserData
            const data = await TransactionHistories.findAll({
                model: TransactionHistories,
                attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    }
                ],
                where: {
                    UserId: userData.id
                }
            })
            if (!data) {
                throw {
                    code: 404,
                    message: 'Transaction not found'
                }
            }
            data.forEach(transaction => {
                transaction.Product.price = formatIdr(transaction.Product.price);
                transaction.total_price = formatIdr(transaction.total_price);
            });

            res.status(200).json({
                transactionHistories: data
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async getAll(req, res) {
        try {
            const userData = req.UserData
            if (userData.role !== 'admin') {
                throw {
                    code: 401,
                    message: "You don't have permission to access this resource"
                }
            }
            const transactionHistories = await TransactionHistories.findAll({
                model: TransactionHistories,
                attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                include: [
                    {
                        model: Product,
                        attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                    }, {
                        model: User,
                        attributes: ['id', 'email', 'balance', 'gender', 'role'],
                    }
                ],

            })
            if (!transactionHistories) {
                throw {
                    code: 404,
                    message: 'Transaction not found'
                }
            }
            transactionHistories.forEach(transaction => {
                transaction.Product.price = formatIdr(transaction.Product.price);
                transaction.total_price = formatIdr(transaction.total_price);
                transaction.User.balance = formatIdr(transaction.User.balance);
            });
            res.status(200).json({
                transactionHistories
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async getOne(req, res) {
        try {
            const { transactionid } = req.params
            const userData = req.UserData
            let transactionHistories
            if (userData.role === 'admin') {
                transactionHistories = await TransactionHistories.findOne({
                    where: { id: transactionid },
                    attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                        }
                    ]
                })
            } else {
                transactionHistories = await TransactionHistories.findOne({
                    where: { id: transactionid, UserId: userData.id },
                    attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: Product,
                            attributes: ['id', 'title', 'price', 'stock', 'CategoryId']
                        }
                    ]
                })
            }
            if (!transactionHistories) {
                throw {
                    code: 404,
                    message: 'Transaction not found'
                }
            }

            transactionHistories.Product.price = formatIdr(transactionHistories.Product.price);
            transactionHistories.total_price = formatIdr(transactionHistories.total_price);
            res.status(200).json({
                transactionHistories
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }

}



module.exports = transactionController