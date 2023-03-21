import categorias from './categorias.js'
import precios from './precios.js'
import usuarios from './usuarios.js'
// import Categoria from '../models/Categoria.js'
// import Precio from '../models/Precio.js'
import { Categoria, Precio, User } from '../models/index.js'
import db from '../config/db.js'
import { exit } from 'node:process'


const importarDatos = async () => {
    try {
        //autenticar
        await db.authenticate()
        // Generar las columnas
        await db.sync()
        // Insertar Datos
        await Categoria.bulkCreate(categorias)
        await Precio.bulkCreate(precios)
        await User.bulkCreate(usuarios)

        // tambien podias usar un Promise para ambos await, ya que no dependen del otro para funcionar
        // await.Promise.all([
        //  Categoria.bulkCreate(categorias)
        //  Precio.bulkCreate(precios)
        // ])
        console.log('Datos creados Correctamente');
        //exit() o exit(0) termina el proceso, sin errores
        exit();

    } catch (error) {
        console.log(error);
        exit(1)
    }
}
const eliminarDatos = async () => {
    try {
        // await Promise.all([
        //     Categoria.destroy({ where: {}, truncate: true }),
        //     Precio.destroy({ where: {}, truncate: true })
        // ])
        await db.sync({ force: {} })
        console.log('Datos Eliminados Correctamente');
        //exit() o exit(0) termina el proceso, sin errores
        exit();
    } catch (error) {
        console.log(error);
        exit(1)
    }
}

if (process.argv[2] === '-i') {
    importarDatos()
}
if (process.argv[2] === '-e') {
    eliminarDatos()
}