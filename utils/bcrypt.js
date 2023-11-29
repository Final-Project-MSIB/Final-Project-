const bcrypt = require('bcrypt')

function hashPassword(plainPassword) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(plainPassword, salt)
    return hash
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash)
}


module.exports = {
    hashPassword,
    comparePassword,
};