 
 
 const map = new maplibregl.Map({
      container: 'map',
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', 
      center: coordinates,
      zoom: 9
    });


    new maplibregl.Marker({ color: '#fe424d' })
    .setLngLat(coordinates)
    .setPopup(
        new maplibregl.Popup({ offset: 25 })
            .setHTML(`<h6>Exact Location Provided After Booking</h6>`)
    )
    .addTo(map);