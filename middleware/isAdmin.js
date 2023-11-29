const isAdmin = (req, res, next) => {
    try {
        const userData = req.UserData
        if (userData.role !== 'admin') {
            throw {
                code: 401,
                message: "You don't have permission to access this resource"
            }
        }
        next()

    } catch (error) {
        res.status(error.code || 500).json({ message: error.message })
    }
}

module.exports = { isAdmin }
