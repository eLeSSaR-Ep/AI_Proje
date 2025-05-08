let map = L.map('map').setView([37.1618182, 28.3755766], 13); // Harita oluşturma.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map); //Harita gösteli gösterme.

let graph; //Node verisi.
let selectedNodes = []; //Secilen node'lar
let pathLine; //Harita üstünde cizilen rota
const markerGroup = L.layerGroup().addTo(map); //Secilen noktaların markerları

fetch('graph-data.json')
  .then(response => response.json())
  .then(data => {
    graph = data;
    enableMapClick();
  }); //graph-data.json dan verileri alma.

function enableMapClick() {
  map.on('click', function (e) {
    const clickedLatLng = [e.latlng.lat, e.latlng.lng];//Haritada tıklandığı noktadan verileri alma
    const nearest = findNearestNode(clickedLatLng); //Noktaya en yakın node'u bulma

    selectedNodes.push(nearest); //Secilen node'u listeye ekler
    L.marker(graph.coordinates[nearest]).addTo(markerGroup).bindPopup(`Selected: ${nearest}`).openPopup(); //Node üstüne marker ekler

    if (selectedNodes.length === 2) {
      findPath(selectedNodes[0], selectedNodes[1]); //2 node secilmiş ise yolu bulur
    }
  });
}

function findNearestNode([lat, lng]) { // Harita üstünde tıklanan noktanın kordinatı ile en yakın node bulunur.
  let minDistance = Infinity;
  let nearestNode = null;

  for (let node in graph.coordinates) {
    const [nodeLat, nodeLng] = graph.coordinates[node];
    const dist = haversineDistance(lat, lng, nodeLat, nodeLng); 
    if (dist < minDistance) {
      minDistance = dist;
      nearestNode = node;
    }
  }

  return nearestNode;
}

function haversineDistance(lat1, lon1, lat2, lon2) { //Tıklanan nokta ve node arasındaki mesafeyi kuş ucuşu olarak hesaplayan fonksiyon
  const R = 6371e3; 
  const toRad = x => (x * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function findPath(start, end) { //En kısa yolu bulma fonksiyonu
  if (pathLine) {
    map.removeLayer(pathLine); //Yolu siler
  }

  const result = dijkstra(graph, start, end); // dijkstra çağrılır yol hesaplanır
  const coordinates = result.path.map(node => graph.coordinates[node]);

  pathLine = L.polyline(coordinates, { color: 'red', weight: 4 }).addTo(map); //Haritada yol kırmızı cizgiyle cizilir

  document.getElementById('info').innerHTML = `
    <b>Start:</b> ${start}<br>
    <b>End:</b> ${end}<br>
    <b>Distance:</b> ${result.distance.toFixed(2)}<br>
    <b>Path:</b> ${result.path.join(' → ')}
  `;
}

document.getElementById('resetButton').addEventListener('click', () => {
  if (pathLine) {
    map.removeLayer(pathLine); //Yolu siler
  }
  selectedNodes = [];
  markerGroup.clearLayers(); //Haritadaki markerları kaldırır
  document.getElementById('info').innerHTML = '';
});
