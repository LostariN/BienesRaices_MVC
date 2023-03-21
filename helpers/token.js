import crypto from 'crypto'
import jwt from 'jsonwebtoken'


const generarJWT = (datos) =>
    jwt.sign({ id: datos.id, name: datos.name }, process.env.SECRET_WORD, { expiresIn: '1d' })

const generarId = () => Math.random().toString(32).substring(2) + crypto.randomUUID();


export {
    generarJWT,
    generarId
}