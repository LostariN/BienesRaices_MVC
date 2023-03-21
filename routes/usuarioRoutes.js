import express from 'express'
import { formularioLogin, autenticar, formularioRegistro, formularioOlvidePass, register, confirmarEmail, resetPass, comprobarToken, crearNuevoPass, cerrarSesion } from '../controllers/usuarioController.js'

const router = express.Router();


router.get('/login', formularioLogin)
router.post('/login', autenticar)
router.get('/registro', formularioRegistro)
router.post('/registro', register)
router.get('/confirmar/:token', confirmarEmail)
router.get('/olvide-pass', formularioOlvidePass)
router.post('/olvide-pass', resetPass)

//recupera tu pass
router.get('/olvide-pass/:token', comprobarToken)
router.post('/olvide-pass/:token', crearNuevoPass)
router.post('/cerrar-sesion', cerrarSesion)

export default router;