const router = require('express').Router();
const userRoutes = require('./UserRoutes')
const categoriesRoutes = require('./CategoriesRoutes')
const productRoutes = require('./ProductRoutes')
const transactionRoutes = require('./TransactionRoutes')
const { authentication } = require('../middleware/auth')
const { isAdmin } = require('../middleware/isAdmin')

router.use('/users', userRoutes)
router.use('/categories', authentication, isAdmin, categoriesRoutes)
router.use('/product', authentication, productRoutes)
router.use('/transactions', authentication, transactionRoutes)



module.exports = router