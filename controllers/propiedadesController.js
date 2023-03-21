
import { Categoria, Mensaje, Precio, Propiedad, User } from '../models/index.js'
import { validationResult } from 'express-validator'
import { unlink } from 'node:fs/promises'
import { esVendedor, formatearFecha } from '../helpers/index.js'


const admin = async (req, res) => {
    const { pagina: paginaActual } = req.query

    const expresion = /^[1-9]+$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('/mis-propiedades?pagina=1')
    }
    try {
        const limit = 3;
        const offset = ((paginaActual * limit) - limit)

        const { id } = req.usuario

        const [propiedadesUser, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: { usuarioId: id },
                include: [
                    {
                        model: Categoria, as: 'categoria'
                    },
                    {
                        model: Precio, as: 'precio'
                    },
                    {
                        model: Mensaje, as: 'mensajes'
                    }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })

        ])
        // console.log(propiedadesUser);
        res.render('propiedades/admin', {
            pagina: 'Mis propiedades...',
            propiedades: propiedadesUser,
            csrfToken: req.csrfToken(),
            paginador: Math.ceil(total / limit),
            paginaActual: parseInt(paginaActual),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error);
    }

}
const crear = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}
const guardar = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    let resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        return res.render('propiedades/crear', {
            pagina: 'Mis propiedades',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            datos: req.body
        })
    }

    const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

    const propiedadDuplicada = await Propiedad.findOne({ where: { calle } })
    if (propiedadDuplicada) {
        return res.render('propiedades/crear', {
            pagina: 'Mis propiedades',
            errores: [{ msg: 'Proiedad ya esta publicada' }],
            csrfToken: req.csrfToken(),
            categorias,
            precios
        })
    }

    const { id: usuarioId } = req.usuario
    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        })
        const { id } = propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log(error);
    }
    res.render('propiedades/crear', {
        pagina: 'Mis propiedades',
        success: { msg: 'Propiedad Guardada correctamente' },
        csrfToken: req.csrfToken(),
        categorias,
        precios
    })

}
const agregarImagen = async (req, res) => {
    const { id } = req.params
    //Validar que la propiedad existe
    const prop = await Propiedad.findByPk(id)
    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad no este publicada
    if (prop.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad sea del usuario quien la publico
    if (req.usuario.id.toString() !== prop.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar imagen de: ${prop.titulo}`,
        prop,
        csrfToken: req.csrfToken(),
    })


}

const subirImagen = async (req, res, next) => {
    const { id } = req.params
    //Validar que la propiedad existe
    const prop = await Propiedad.findByPk(id)
    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    //Validar que la propiedad no este publicada
    if (prop.publicado) {
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad sea del usuario quien la publico
    if (req.usuario.id.toString() !== prop.usuarioId.toString()) {
        return res.redirect('/mis-propiedades')
    }

    // console.log(req.file);
    try {
        prop.imagen = req.file.filename
        prop.publicado = 1
        await prop.save()
        next()
    } catch (error) {
        console.log(error);
    }
}
const editarProp = async (req, res) => {

    const { id } = req.params
    const prop = await Propiedad.findByPk(id)

    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar', {
        pagina: 'Editar Propiedad',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: prop
    })
}
const guardarCambios = async (req, res) => {

    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('propiedades/editar', {
            pagina: 'Editar Propiedad',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            datos: req.body
        })
    }

    const { id } = req.params
    const prop = await Propiedad.findByPk(id)

    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }

    try {
        const { titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precio: precioId, categoria: categoriaId } = req.body

        prop.set({ titulo, descripcion, habitaciones, estacionamiento, wc, calle, lat, lng, precioId, categoriaId })

        await prop.save()
        res.redirect('/mis-propiedades')

    } catch (error) {
        console.log(error);
    }

}
const eliminar = async (req, res) => {

    const { id } = req.params
    const prop = await Propiedad.findByPk(id)

    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }
    await unlink(`public/uploads/${prop.imagen}`)
    await prop.destroy()
    res.redirect('/mis-propiedades')

}
const cambiarEstado = async (req, res) => {
    const { id } = req.params
    const prop = await Propiedad.findByPk(id)

    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }
    prop.publicado = !prop.publicado
    await prop.save()
    res.json({
        response: true
    })
}
const mostrar = async (req, res) => {
    const { id } = req.params
    const prop = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria, as: 'categoria'
            },
            {
                model: Precio, as: 'precio'
            }
        ]
    })
    if (!prop || !prop.publicado) {
        return res.redirect('/404')
    }
    console.log(req.usuario.id);
    console.log(prop.usuarioId);

    res.render('propiedades/mostrar', {
        pagina: prop.titulo,
        prop,
        csrfToken: req.csrfToken(),
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario.id, prop.usuarioId)
    })
}
const enviarMensaje = async (req, res) => {
    const { id } = req.params
    const prop = await Propiedad.findByPk(id, {
        include: [
            {
                model: Categoria, as: 'categoria'
            },
            {
                model: Precio, as: 'precio'
            }
        ]
    })
    if (!prop) {
        return res.redirect('/404')
    }
    let resultado = validationResult(req)
    if (!resultado.isEmpty()) {
        res.render('propiedades/mostrar', {
            pagina: prop.titulo,
            prop,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario.id, prop.usuarioId),
            errores: resultado.array()
        })
    }
    const { id: propiedadId } = req.params
    const { mensaje } = req.body
    const { id: userId } = req.usuario

    await Mensaje.create({
        mensaje,
        propiedadId,
        userId

    })
    res.redirect('/')
}
const verMensajes = async (req, res) => {
    const { id } = req.params

    const prop = await Propiedad.findByPk(id, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [
                    { model: User.scope('eliminarPass'), as: 'usuario' }
                ]
            }
        ]
    })


    if (!prop) {
        return res.redirect('/mis-propiedades')
    }
    if (prop.usuarioId.toString() !== req.usuario.id.toString()) {
        return res.redirect('/mis-propiedades')
    }
    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: prop.mensajes,
        formatearFecha
    })
}
export {
    admin,
    crear,
    guardar,
    agregarImagen,
    subirImagen,
    editarProp,
    guardarCambios,
    eliminar,
    cambiarEstado,
    mostrar,
    enviarMensaje,
    verMensajes
}