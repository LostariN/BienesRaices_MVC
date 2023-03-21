(function () {

    const lat = -33.468296;
    const lng = -70.5706927;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 16);
    let markers = new L.FeatureGroup().addTo(mapa)
    console.log(markers);
    const filtros = {
        categorias: '',
        precios: ''
    }
    let props = [];

    const categoriaSelect = document.querySelector('#categorias')
    const precioSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    categoriaSelect.addEventListener('change', e => {
        filtros.categorias = +e.target.value //se puede pasasr a integer con el simbolo de +
        FiltrarPorSelect()
    })
    precioSelect.addEventListener('change', e => {
        filtros.precios = parseInt(e.target.value) // otra manera de pasar de STRING a integer
        FiltrarPorSelect()

    })

    const obtenerPropiedadesApi = async () => {
        try {
            const url = '/api/propiedades'
            const resp = await fetch(url)
            props = await resp.json()

            mostrarPropiedades(props)

        } catch (error) {
            console.log(error);
        }
    }
    const mostrarPropiedades = (propiedades) => {
        markers.clearLayers()
        propiedades.forEach(element => {
            const marker = new L.marker([element?.lat, element?.lng], {
                autoPan: true
            })
                .addTo(mapa)
                .bindPopup(`
                    <p class="text-indigo-600 font-bold">${element.categoria.nombre}</p>
                    <h1 class="text-xl font-extrabold uppercase my-5">${element.titulo}</h1>
                    <img src="/uploads/${element?.imagen}" alt="${element.titulo}" >
                    <p class="text-gray-600 font-bold">${element.precio.nombre}</p>
                    <a href="/propiedades/${element.id}" class="text-center bg-indigo-600 block p-2 font-bold uppercase"> Ver Propiedad </a>
                `)

            markers.addLayer(marker)
        });
    }
    const FiltrarPorSelect = () => {
        const propiedadesFiltradas = props.filter(filtrarPorCategorias).filter(filtrarPorPrecios)
        mostrarPropiedades(propiedadesFiltradas);
    }
    const filtrarPorCategorias = (propiedad) => {
        return filtros.categorias ? filtros.categorias === propiedad.categoriaId : propiedad
    }
    const filtrarPorPrecios = (propiedad) => {
        return filtros.precios ? filtros.precios === propiedad.precioId : propiedad
    }
    obtenerPropiedadesApi()
})()