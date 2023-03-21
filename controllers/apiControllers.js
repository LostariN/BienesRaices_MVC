import { Propiedad, Categoria, Precio } from '../models/index.js'

const propiedades = async (req, res) => {

    const propiedades = await Propiedad.findAll({
        where: {
            publicado: 1
        },
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio, as: 'precio' }
        ]
    })

    res.json(propiedades)
}

export {
    propiedades
}