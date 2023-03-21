(function () {


    const lat = document.querySelector('#lat').value || -33.468296;
    const lng = document.querySelector('#lng').value || -70.5706927;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, Tiles &copy; <a href="https://carto.com/attribution/">CARTO</a>',
    //     subdomains: 'abcd',
    //     maxZoom: 19
    // }).addTo(mapa);
    let marker = L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    marker.on('moveend', function (e) {
        const posicion = e.target._latlng;
        // console.log(posicion);
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))
        geocodeService.reverse().latlng(posicion, 13).run(function (error, result) {
            console.log(result);
            marker.bindPopup(result.address.LongLabel)

            document.querySelector('.calle').textContent = result.address.Address ?? ''
            document.querySelector('#calle').value = result.address.Address ?? ''
            document.querySelector('#lat').value = result.latlng.lat ?? ''
            document.querySelector('#lng').value = result.latlng.lng ?? ''
        })
    })


})()