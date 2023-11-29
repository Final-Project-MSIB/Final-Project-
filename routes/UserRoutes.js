const router = require('express').Router();
const UserController = require('../controllers/userController');
const { authentication } = require('../middleware/auth')

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.put("/:userid", authentication, UserController.update)
router.put("/", authentication, UserController.update)
router.delete("/:userid", authentication, UserController.delete)
router.delete("/", authentication, UserController.delete)
router.patch("/topup", authentication, UserController.topup)


module.exports = router