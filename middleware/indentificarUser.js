import jwt from 'jsonwebtoken'

import Usuario from '../models/User.js'


const identificarUsuario = async (req, res, next) => {

    const { _token } = req.cookies
    if (!_token) {
        req.usuario = ''
        return next()
    }
    try {
        const decoded = jwt.verify(_token, process.env.SECRET_WORD)
        const user = await Usuario.scope('eliminarPass').findByPk(decoded.id)

        if (user) {
            req.usuario = user
        }
        return next()
    } catch (error) {
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identificarUsuario;