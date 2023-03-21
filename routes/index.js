import express from 'express'
import fs from 'fs'
import path from 'path';
import { fileURLToPath } from 'url'
import usuarioRoute from './usuarioRoutes.js'
import propiedadesRoute from './propiedadesRoutes.js'

const rutas = [usuarioRoute, propiedadesRoute]
const router = express.Router()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const removeExtensions = (filename) => {
    return filename.split('.').shift()
}
console.log(fs.readdirSync(__dirname));

console.log(rutas[0]);
fs.readdirSync(__dirname).filter(file => {
    const name = removeExtensions(file)
    console.log(name);
    // if (name !== 'index') {
    //     router.use(`/${name}`,)
    // }
})


export default router;