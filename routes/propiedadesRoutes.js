import express from 'express'
import { admin, crear, guardar, agregarImagen, subirImagen, editarProp, guardarCambios, eliminar, cambiarEstado, mostrar, enviarMensaje, verMensajes } from '../controllers/propiedadesController.js'
import { body } from 'express-validator'
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'
import identificarUser from '../middleware/indentificarUser.js'

const route = express.Router();


route.get('/mis-propiedades', protegerRuta, admin)
route.get('/propiedades/crear', protegerRuta, crear)
route.post('/propiedades/crear', protegerRuta,
    body('titulo').notEmpty().withMessage('Titulo es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('Descripcion es Obligatorio')
        .isLength({ max: 200 }).withMessage('Descripcion es muy larga(200 caracteres MAX)'),
    body('categoria').isNumeric().withMessage('Elige una categoria'),
    body('precio').isNumeric().withMessage('Seleciona una precio'),
    body('habitaciones').isNumeric().withMessage('Elige cuantas habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Elige cuantos estacionamientos'),
    body('wc').isNumeric().withMessage('Elige cuantos WC'),
    body('calle').notEmpty().withMessage('Ubica tu propiedad')
    , guardar)

route.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)
route.post('/propiedades/agregar-imagen/:id', protegerRuta, upload.single('imagen'), subirImagen)

route.get('/propiedades/editar/:id', protegerRuta, editarProp)
route.post('/propiedades/editar/:id', protegerRuta,
    body('titulo').notEmpty().withMessage('Titulo es Obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('Descripcion es Obligatorio')
        .isLength({ max: 200 }).withMessage('Descripcion es muy larga(200 caracteres MAX)'),
    body('categoria').isNumeric().withMessage('Elige una categoria'),
    body('precio').isNumeric().withMessage('Seleciona una precio'),
    body('habitaciones').isNumeric().withMessage('Elige cuantas habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Elige cuantos estacionamientos'),
    body('wc').isNumeric().withMessage('Elige cuantos WC'),
    body('calle').notEmpty().withMessage('Ubica tu propiedad')
    , guardarCambios)

route.post('/propiedades/eliminar/:id', protegerRuta, eliminar)
route.put('/propiedades/:id', protegerRuta, cambiarEstado)

route.get('/propiedades/:id', identificarUser, mostrar)
route.post('/propiedades/:id', identificarUser,
    body('mensaje').isLength({ min: 20 }).withMessage('Mensaje debe ser superior a 20 caracteres'),
    enviarMensaje)
route.get('/mensajes/:id', protegerRuta, verMensajes)
export default route;