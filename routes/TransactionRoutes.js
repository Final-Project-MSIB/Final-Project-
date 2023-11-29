const router = require('express').Router()
const TransactionController = require('../controllers/transactionController')
const { isAdmin } = require('../middleware/isAdmin')

router.post("/", TransactionController.create)
router.get("/user", TransactionController.getUser)
router.get("/admin", isAdmin, TransactionController.getAll)
router.get("/:transactionid", TransactionController.getOne)


module.exports = router