import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const protegerRuta = async (req, res, next) => {

    //Verificar si existe token
    const { _token } = req.cookies
    if (!_token) {
        return res.redirect('/auth/login')
    }
    //Comprobar token
    try {
        const decoded = jwt.verify(_token, process.env.SECRET_WORD)
        const usuario = await User.scope('eliminarPass').findByPk(decoded.id)
        if (usuario) {
            req.usuario = usuario;

        } else {
            return res.redirect('/auth/login')
        }
        return next()
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }

}

export default protegerRuta;