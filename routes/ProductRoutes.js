const router = require('express').Router();
const ProductController = require('../controllers/productController');
const { isAdmin } = require('../middleware/isAdmin')

router.post("/", isAdmin, ProductController.create)
router.get("/", ProductController.getAll)
router.put("/:productid", isAdmin, ProductController.update)
router.patch("/:productid", isAdmin, ProductController.patchUpdate)
router.delete("/:productid", isAdmin, ProductController.delete)


module.exports = router