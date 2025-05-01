function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const queue = new Set(graph.nodes);
  
    graph.nodes.forEach(node => {
      distances[node] = Infinity;
    });
    distances[start] = 0;
  
    while (queue.size > 0) {
      let current = [...queue].reduce((a, b) => distances[a] < distances[b] ? a : b);
      queue.delete(current);
  
      if (current === end) break;
  
      for (let neighbor of graph.edges[current]) {
        let alt = distances[current] + neighbor.weight;
        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = current;
        }
      }
    }
  
    const path = [];
    let u = end;
    while (u) {
      path.unshift(u);
      u = previous[u];
    }
  
    return { path, distance: distances[end] };
  }
  