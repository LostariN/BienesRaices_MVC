
import express from 'express'; // necesitas activar el TYPE = MODULE en package.json(ECMAscript module)
// const express = require('express') //Antifua forma de hacerlo(CommonJS)
import usuarioRoute from './routes/usuarioRoutes.js'
import propiedadesRoute from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoute from './routes/apiRoute.js'
// import probandoRuta from './routes/index.js'
// conexion a la DB con Sequelize(ORM)
import db from './config/db.js'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'

// import probando from './routes/index.js'


// Crear la App
const app = express()
// Habilitar lectura de datos formularios
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(csurf({ cookie: true }));
app.use(express.json())

//conectando a db
try {
    await db.authenticate();
    db.sync();
    console.log('conectado');
} catch (error) {
    console.log(error);
}

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoute) // use: busca todas las rutas que inicien con una diagonal
// // app.get('/',usuarioRoute) solo busca exactamente la ruta que has proporcionado
app.use('/', propiedadesRoute)
app.use('/api', apiRoute)

// app.use('/probando', probando)



//app.set() agrega configuracion, habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

// carpeta publica, contenedor de archivos estaticos
app.use(express.static('public'))


// Define eñ puerto y arranca el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor esta conectado al puerto: ${port}`);
})