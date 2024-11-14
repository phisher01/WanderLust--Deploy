
// const parsedGeometry = JSON.parse(listing);
const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`, // Replace with your access token
    center: listing.geometry.coordinates, // Example coordinates (Delhi, India)
    zoom: 9
});

// Add navigation controls to the map
map.addControl(new maplibregl.NavigationControl());

const marker = new maplibregl.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates) // Set marker's longitude and latitude
  .setPopup(new maplibregl.Popup({offset:25}).setHTML(
    `<H4>Welcome to ${listing.title }</H4><p>Exact Location provided after bookings</p>`)
  )

  .addTo(map); 
 
