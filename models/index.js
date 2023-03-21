import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Propiedad from './Propiedad.js'
import User from './User.js'
import Mensaje from './Mensaje.js'

// belongsTo: precioId se agregara a la tabla propiedad, relacion 1:1
//Precio.hasOne(Propiedad) Tambien hace lo mismo pero agrega el id al modelo que esta en el parentesis- hasOne(1:1) y hasMany(1:N) hace lo mismo con el modelo
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }); // sirve para dar nombre a la llave foranea

// belongsTo: propiedadID se agregara a la tabla precio, relacion 1:1
// Precio.belongsTo(Propiedad);
// Propiedad.hasOne(Precio); Tambien hace lo mismo

Propiedad.belongsTo(Categoria)
// Propiedad.belongsToMany(Categoria); Haria lo mismo q hasMany()


// 
Propiedad.belongsTo(User, { foreignKey: 'usuarioId' })
// Propiedad.belongsToMany(User); Haria lo mismo q hasMany()
Propiedad.hasMany(Mensaje, { foreignKey: "propiedadId" })

Mensaje.belongsTo(Propiedad, { foreignKey: 'propiedadId' })
Mensaje.belongsTo(User, { foreignKey: 'userId' })


export {
    Categoria,
    Precio,
    Propiedad,
    User,
    Mensaje
}