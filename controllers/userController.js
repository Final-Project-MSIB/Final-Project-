const { User } = require('../models')
const formatBalance = require('../utils/formatIdr')
const { generateToken } = require('../utils/jwt')
const { comparePassword } = require('../utils/bcrypt')
class userController {
    static async register(req, res) {
        try {

            const { full_name, email, password, gender, role } = req.body
            const newUser = await User.create({
                full_name,
                email,
                password,
                gender,
                role
            })
            if (!newUser) {
                throw {
                    code: 400,
                    message: "Failed to create new user"
                }
            }
            res.status(201).json({
                "users": {
                    id: newUser.id,
                    full_name: newUser.full_name,
                    email: newUser.email,
                    gender: newUser.gender,
                    balance: formatBalance(newUser.balance),
                    createdAt: newUser.createdAt
                }
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.errors[0].message })
        }

    }
    static async login(req, res) {
        try {
            const { email, password } = req.body
            const data = await User.findOne({
                where: {
                    email: email
                }
            })
            if (!data) {
                throw {
                    code: 404,
                    message: "User not found"
                }
            }
            const isValid = comparePassword(password, data.password)
            if (!isValid) {
                throw {
                    code: 401,
                    message: "Incorrect Password!"
                }
            }
            const token = generateToken({
                id: data.id,
                email: data.email
            })
            res.status(200).json({
                token
            })

        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async update(req, res) {
        try {
            // const { userid } = req.params
            const { full_name, email } = req.body
            const userData = req.UserData
            // if (userid != userData.id) {
            //     throw {
            //         code: 403,
            //         message: "You Cannot Update This User"
            //     }
            // }
            
            const data = await User.update(
                {
                    full_name,
                    email
                }, {
                where: {
                    id: userData.id
                },
                returning: true
            }
            )
            res.status(200).json({
                user: {
                    id: data[1][0].id,
                    full_name: data[1][0].full_name,
                    email: data[1][0].email,
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
            // const { userid } = req.params
            const userData = req.UserData
            // if (userid != userData.id) {
            //     throw {
            //         code: 403,
            //         message: "You Cannot Delete This User"
            //     }
            // }
            await User.destroy({
                where: {
                    id: userData.id
                }
            })
            res.status(200).json({
                message: "Your account has been successfully deleted"
            })
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
    static async topup(req, res) {
        try {
            const { balance } = req.body
            const userData = req.UserData
            const topup = balance + userData.balance
            // cek balance apakah bernilai angka
            if (!Number.isInteger(balance)) {
                throw {
                    code: 400,
                    message: "Topup amount must be an integer"
                }
            }
            // cek apakah balance lebih kecil dari 0
            const minbalance = 1
            if (balance < minbalance) {
                throw {
                    code: 400,
                    message: "Topup amount must be greater than or equal to 0"
                }
            }
            // cek apakah balance lebih besar dari 100000000
            const maxbalance = 100000000
            if (balance > maxbalance) {
                throw {
                    code: 400,
                    message: "Topup amount must be less than or equal to 100000000"
                }
            }
            const data = await User.update(
                {
                    balance: topup
                }, {
                where: {
                    id: userData.id
                },
                returning: true
            }
            )
            if (!data) {
                throw {
                    code: 400,
                    message: "Failed to top up balance"
                }
            }
            else {
                throw {
                    code: 200,
                    message: `Your balance has been successfully updated to ${formatBalance(data[1][0].balance)}`
                }
            }
        } catch (error) {
            res.status(error.code || 500).json({ message: error.message })
        }
    }
}


module.exports = userController