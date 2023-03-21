import express from 'express'
import { buscador, categoria, inicio, noEncontrado } from '../controllers/appControllers.js'
import identificarUsuario from '../middleware/indentificarUser.js'


const router = express.Router()

router.get('/', identificarUsuario, inicio)
router.get('/categorias/:id', categoria)
router.get('/404', noEncontrado)
router.post('/buscador', buscador)


export default router;