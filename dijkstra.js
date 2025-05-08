function dijkstra(graph, start, end) {
    const distances = {}; //En kısa mesafeyi tutar
    const previous = {}; //Geldigi node'u tutar
    const queue = new Set(graph.nodes); //Tüm node'ları tutar
  
    graph.nodes.forEach(node => {
      distances[node] = Infinity;
    });
    distances[start] = 0;
  
    while (queue.size > 0) {
      let current = [...queue].reduce((a, b) => distances[a] < distances[b] ? a : b); //Mesafe en kücük olan node bulunur.
      queue.delete(current); //Tüm node'lardan cıkarılır
  
      if (current === end) break; //Hedefe ulaşıldıysa döngü sonlandırılır
  
      for (let neighbor of graph.edges[current]) {
        let alt = distances[current] + neighbor.weight; //Mevcut node dan komşu node a gidildiginde toplam mesafe
        if (alt < distances[neighbor.node]) { //Yeni mesafe önceki mesafeden kücükse mesafe güncellenir geldigi yolu kaydeder
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      }
    }
  
    const path = [];
    let u = end;
    while (u) { //Yol end den başlayarak previous doğrultusunda geriye doğru oluşturulur.
      path.unshift(u);
      u = previous[u];
    }
  
    return { path, distance: distances[end] }; //En kısa yolu döndürür.
  }
  