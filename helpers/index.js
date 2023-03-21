const esVendedor = (usuarioId, propiedadUsuarioId) => {

    return usuarioId === propiedadUsuarioId
}

const formatearFecha = (fecha) => {

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    return new Date(nuevaFecha).toLocaleDateString('es-ES', opciones)

}
export {
    esVendedor,
    formatearFecha
}