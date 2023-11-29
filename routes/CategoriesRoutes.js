const router = require('express').Router();
const CategoriesController = require('../controllers/categoriesController');


router.post("/", CategoriesController.create)
router.get("/", CategoriesController.getAll)
router.patch("/:categoryid", CategoriesController.update)
router.delete("/:categoryid", CategoriesController.delete)


module.exports = router