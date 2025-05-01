let map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);

let graph;
let markers = [];
let lines = [];
let selectedNodes = [];
let pathLine;

fetch('graph-data.json')
  .then(response => response.json())
  .then(data => {
    graph = data;
    drawGraph();
  });

function drawGraph() {
  for (let node in graph.coordinates) {
    let [lat, lng] = graph.coordinates[node];
    let marker = L.marker([lat, lng]).addTo(map).bindPopup(node);
    marker.nodeId = node;
    marker.on('click', () => selectNode(marker));
    markers.push(marker);
  }

  for (let from in graph.edges) {
    graph.edges[from].forEach(edge => {
      let fromCoord = graph.coordinates[from];
      let toCoord = graph.coordinates[edge.node];
      let line = L.polyline([fromCoord, toCoord], { color: 'grey', weight: 2 }).addTo(map);
      lines.push(line);
    });
  }
}

function selectNode(marker) {
  selectedNodes.push(marker.nodeId);
  marker.openPopup();

  if (selectedNodes.length === 2) {
    findPath(selectedNodes[0], selectedNodes[1]);
  }
}

function findPath(start, end) {
  if (pathLine) {
    map.removeLayer(pathLine);
  }

  const result = dijkstra(graph, start, end);
  const coordinates = result.path.map(node => graph.coordinates[node]);
  
  pathLine = L.polyline(coordinates, { color: 'red', weight: 4 }).addTo(map);

  document.getElementById('info').innerHTML = `
    <b>Start:</b> ${start}<br>
    <b>End:</b> ${end}<br>
    <b>Distance:</b> ${result.distance}<br>
    <b>Path:</b> ${result.path.join(' → ')}
  `;
}

document.getElementById('resetButton').addEventListener('click', () => {
  if (pathLine) {
    map.removeLayer(pathLine);
  }
  selectedNodes = [];
  document.getElementById('info').innerHTML = '';
});
