import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Propiedad = db.define('propiedades', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    estacionamiento: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    wc: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    calle: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    lat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

})



export default Propiedad;