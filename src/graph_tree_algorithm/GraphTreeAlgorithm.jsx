import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Code,
  Variable,
  MessageSquare,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Square,
  Network,
  GitBranch,
  Route,
  Hash,
  Search,
  Clock,
  Info,
} from "lucide-react";

/**
 * GraphTreeAlgorithm Component
 * Visualizes BFS, DFS, Dijkstra, Bellman-Ford, A*, Prim, and Kruskal algorithms.
 * Uses a symmetrical layout, execution log, and step-by-step visualization.
 */
const GraphTreeAlgorithm = () => {
  // ==========================================
  // 1. CONSTANTS & DEFINITIONS
  // ==========================================

  const STEP_DELAY = 1000; // ms per step

  const variableDefinitions = {
    common: {
      curr: "Node Saat Ini",
      queue: "Antrian Kunjungan",
      stack: "Tumpukan",
      visited: "Node Dikunjungi",
    },
    bfs: { queue: "Antrian (FIFO)", neighbor: "Tetangga" },
    dfs: { stack: "Tumpukan (LIFO)", neighbor: "Tetangga" },
    dijkstra: {
      dist: "Jarak Terpendek",
      u: "Node Min Dist",
      v: "Tetangga",
      weight: "Bobot Edge",
    },
    bellman: { i: "Iterasi", u: "Asal Edge", v: "Tujuan Edge", w: "Bobot" },
    astar: {
      g: "Cost dari Start",
      h: "Heuristic ke Goal",
      f: "Total Cost (g+h)",
      openSet: "Candidate Nodes",
    },
    prim: {
      inMST: "Visited Node",
      minWeight: "Bobot Terkecil",
      totalWeight: "Total Bobot",
    },
    kruskal: { w: "Bobot Edge", totalWeight: "Total Bobot MST" },
  };

  const algorithmDescriptions = {
    bfs: {
      title: "Breadth-First Search (BFS)",
      description:
        "Menjelajahi graf level by level menggunakan queue. Dimulai dari node awal, kunjungi semua tetangga langsung, lalu tetangga dari tetangga, dan seterusnya.",
      complexity: "Time: O(V + E), Space: O(V)",
      useCase: "Shortest path (unweighted), Web Crawling",
      pseudocode: `Q.enqueue(start)
visited.add(start)
While Q is not empty:
  curr = Q.dequeue()
  For n in neighbors(curr):
    If n not visited:
      visited.add(n)
      Q.enqueue(n)`,
    },
    dfs: {
      title: "Depth-First Search (DFS)",
      description:
        "Menjelajahi graf sedalam mungkin menggunakan stack sebelum backtrack. Mengikuti satu jalur sampai mentok, lalu kembali dan coba jalur lain.",
      complexity: "Time: O(V + E), Space: O(V)",
      useCase: "Cycle Detection, Maze Solving",
      pseudocode: `S.push(start)
visited.add(start)
While S is not empty:
  curr = S.pop()
  For n in neighbors(curr):
    If n not visited:
      visited.add(n)
      S.push(n)`,
    },
    dijkstra: {
      title: "Dijkstra's Algorithm",
      description:
        "Menemukan jalur terpendek dari satu node ke semua node lain pada graf berbobot non-negatif dengan pendekatan greedy.",
      complexity: "Time: O((V+E) log V)",
      useCase: "GPS Navigation, Network Routing",
      pseudocode: `dist[start] = 0
While unvisited exist:
  u = node with min dist
  visited.add(u)
  For neighbor v of u:
    newDist = dist[u] + weight(u,v)
    If newDist < dist[v]:
      dist[v] = newDist`,
    },
    bellman: {
      title: "Bellman-Ford Algorithm",
      description:
        "Menemukan jalur terpendek dan dapat menangani bobot negatif dengan merelaksasi semua edge berulang kali.",
      complexity: "Time: O(VE)",
      useCase: "Forex Arbitrage, Negative Weight Graphs",
      pseudocode: `dist[start] = 0
For i = 1 to V-1:
  For each edge (u, v, w):
    If dist[u] + w < dist[v]:
      dist[v] = dist[u] + w`,
    },
    astar: {
      title: "A* (A-Star) Pathfinding",
      description:
        "Pencarian jalur terpendek yang dipandu heuristic. Sangat efisien untuk mencapai target spesifik.",
      complexity: "Time: O(E)",
      useCase: "Game Pathfinding, Robot Navigation",
      pseudocode: `f[start] = h(start, goal)
openSet.add(start)
While openSet not empty:
  curr = node with min f
  If curr == goal: return
  For neighbor n of curr:
    g = g[curr] + w
    f[n] = g + h(n, goal)`,
    },
    prim: {
      title: "Prim's Algorithm (MST)",
      description:
        "Membangun Minimum Spanning Tree dengan menumbuhkan pohon dari node awal, selalu memilih edge teringan.",
      complexity: "Time: O(E log V)",
      useCase: "Network Design, Piping",
      pseudocode: `MST.add(start)
While MST.size < V:
  Find min edge (u, v)
  where u in MST, v not in MST
  MST.add(v)
  Add edge to result`,
    },
    kruskal: {
      title: "Kruskal's Algorithm (MST)",
      description:
        "Membangun MST dengan mengurutkan edge berdasarkan bobot dan menambahkannya jika tidak membentuk cycle.",
      complexity: "Time: O(E log E)",
      useCase: "Clustering, Circuit Design",
      pseudocode: `Sort edges by weight
For each edge (u, v, w):
  If find(u) != find(v):
    union(u, v)
    Add edge to MST`,
    },
  };

  const algoCode = {
    bfs: `function BFS(startNode) {
  let queue = [startNode];
  let visited = new Set([startNode]);

  while (queue.length > 0) {
    let curr = queue.shift();

    for (let neighbor of getNeighbors(curr)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
    dfs: `function DFS(startNode) {
  let stack = [startNode];
  let visited = new Set([startNode]);

  while (stack.length > 0) {
    let curr = stack.pop();

    for (let neighbor of getNeighbors(curr)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
}`,
    dijkstra: `function dijkstra(start) {
  let dist = Array(n).fill(Infinity);
  let visited = new Set();
  dist[start] = 0;
  
  while (visited.size < n) {
    let u = getMinDistNode(dist, visited);
    if (u === null) break;
    visited.add(u);
    
    for (let [v, weight] of adj[u]) {
      if (!visited.has(v)) {
        let newDist = dist[u] + weight;
        if (newDist < dist[v]) {
          dist[v] = newDist; // Relax
        }
      }
    }
  }
}`,
    bellman: `function bellmanFord(start) {
  let dist = Array(n).fill(Infinity);
  dist[start] = 0;
  
  // Relax all edges V-1 times
  for (let i = 0; i < n - 1; i++) {
    for (let [u, v, w] of edges) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }
  return dist;
}`,
    astar: `function aStar(start, goal) {
  let openSet = [start];
  let gScore = { [start]: 0 };
  let fScore = { [start]: heuristic(start, goal) };
  
  while (openSet.length > 0) {
    let curr = getMinF(openSet, fScore);
    if (curr === goal) return reconstructPath();
    
    openSet.remove(curr);
    for (let [nbr, cost] of adj[curr]) {
      let tentG = gScore[curr] + cost;
      if (tentG < (gScore[nbr] || Infinity)) {
        gScore[nbr] = tentG;
        fScore[nbr] = tentG + heuristic(nbr, goal);
        if (!openSet.includes(nbr)) openSet.push(nbr);
      }
    }
  }
}`,
    prim: `function prim(start) {
  let inMST = new Set([start]);
  let totalWeight = 0;
  
  while (inMST.size < n) {
    let minEdge = null;
    
    for (let u of inMST) {
      for (let [v, w] of adj[u]) {
        if (!inMST.has(v) && w < minWeight) {
          minEdge = [u, v, w];
        }
      }
    }
    
    if (minEdge) {
      inMST.add(minEdge.v);
      totalWeight += minEdge.w;
    }
  }
}`,
    kruskal: `function kruskal() {
  let edges = getAllEdges().sort((a,b) => a.w - b.w);
  let parent = Array(n).fill(-1); // Union-Find
  let totalWeight = 0;
  
  for (let [u, v, w] of edges) {
    let rootU = find(u);
    let rootV = find(v);
    
    if (rootU !== rootV) {
      union(rootU, rootV);
      totalWeight += w;
      addEdgeToMST(u, v);
    }
  }
}`,
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================
  const [algorithm, setAlgorithm] = useState("bfs");
  const [startNode, setStartNode] = useState(0);
  const [targetNode, setTargetNode] = useState(6); // For A*

  // Timeline Engine
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Time tracking
  const [elapsedTime, setElapsedTime] = useState(0);

  // Graph Data
  const [nodes] = useState([
    { id: 0, label: "A", x: 300, y: 50 },
    { id: 1, label: "B", x: 150, y: 150 },
    { id: 2, label: "C", x: 450, y: 150 },
    { id: 3, label: "D", x: 80, y: 280 },
    { id: 4, label: "E", x: 220, y: 280 },
    { id: 5, label: "F", x: 380, y: 280 },
    { id: 6, label: "G", x: 520, y: 280 },
  ]);

  // Weighted edges [u, v, weight]
  const [edges] = useState([
    [0, 1, 4],
    [0, 2, 3],
    [1, 3, 2],
    [1, 4, 5],
    [2, 5, 6],
    [2, 6, 3],
    [4, 5, 1],
    [3, 4, 3],
    [5, 6, 2],
  ]);

  // ==========================================
  // 3. LOGIC & HELPERS
  // ==========================================

  const getVarDesc = (name) => {
    if (
      variableDefinitions[algorithm] &&
      variableDefinitions[algorithm][name]
    ) {
      return variableDefinitions[algorithm][name];
    }
    return variableDefinitions.common[name] || "";
  };

  const getAdjacencyList = () => {
    const adj = {};
    nodes.forEach((n) => (adj[n.id] = []));
    edges.forEach(([u, v, w]) => {
      adj[u].push({ node: v, weight: w });
      adj[v].push({ node: u, weight: w }); // Undirected
    });
    Object.keys(adj).forEach((key) => adj[key].sort((a, b) => a.node - b.node));
    return adj;
  };

  const heuristic = (node1, node2) => {
    const dx = nodes[node1].x - nodes[node2].x;
    const dy = nodes[node1].y - nodes[node2].y;
    return Math.sqrt(dx * dx + dy * dy) / 50; // Normalize
  };

  const snapshot = (
    active,
    visited,
    struct,
    mstEdges,
    distances,
    pathEdges,
    line,
    desc,
    vars
  ) => ({
    activeNode: active,
    visitedNodes: [...visited],
    structure: [...struct],
    mstEdges: mstEdges ? [...mstEdges] : [],
    distances: distances ? { ...distances } : {},
    pathEdges: pathEdges ? [...pathEdges] : [],
    activeCodeLine: line,
    stepDescription: desc,
    variables: { ...vars },
  });

  // Start with default empty visual state
  const currentVisual = steps[currentStep] || {
    activeNode: null,
    visitedNodes: [],
    structure: [],
    mstEdges: [],
    distances: {},
    pathEdges: [],
    activeCodeLine: -1,
    stepDescription: "Memuat...",
    variables: {},
  };

  const generateSteps = (algoType, start, target = null) => {
    const stepsArr = [];
    const adj = getAdjacencyList();
    const n = nodes.length;

    stepsArr.push(
      snapshot(
        null,
        [],
        [],
        null,
        null,
        null,
        -1,
        "Persiapan Algoritma - Inisialisasi struktur data",
        {}
      )
    );

    if (algoType === "bfs") {
      let queue = [start];
      let visited = [start];
      let visitedSet = new Set([start]);

      stepsArr.push(
        snapshot(
          null,
          visited,
          queue,
          null,
          null,
          null,
          2,
          `Inisialisasi Queue dengan node awal ${nodes[start].label}.`,
          {
            queue: `[${nodes[start].label}]`,
            visited: `{${nodes[start].label}}`,
          }
        )
      );

      while (queue.length > 0) {
        stepsArr.push(
          snapshot(
            null,
            visited,
            queue,
            null,
            null,
            null,
            5,
            "Loop: Cek apakah Queue masih ada isinya?",
            { queue: queue.map((id) => nodes[id].label).join(", ") }
          )
        );

        let curr = queue.shift();
        stepsArr.push(
          snapshot(
            curr,
            visited,
            queue,
            null,
            null,
            null,
            6,
            `Ambil ${nodes[curr].label} dari depan Queue.`,
            {
              curr: nodes[curr].label,
              queue: queue.map((id) => nodes[id].label).join(", "),
            }
          )
        );

        const neighbors = adj[curr];
        for (let { node: neighbor } of neighbors) {
          stepsArr.push(
            snapshot(
              curr,
              visited,
              queue,
              null,
              null,
              null,
              8,
              `Cek tetangga dari ${nodes[curr].label}: ${nodes[neighbor].label}`,
              { curr: nodes[curr].label, neighbor: nodes[neighbor].label }
            )
          );

          if (!visitedSet.has(neighbor)) {
            visitedSet.add(neighbor);
            visited.push(neighbor);
            queue.push(neighbor);
            stepsArr.push(
              snapshot(
                curr,
                visited,
                queue,
                null,
                null,
                null,
                10,
                `${nodes[neighbor].label} belum dikunjungi. Masukkan ke Queue dan tandai visited.`,
                {
                  visited: visited.map((id) => nodes[id].label).join(","),
                  queue: queue.map((id) => nodes[id].label).join(", "),
                }
              )
            );
          }
        }
      }
    } else if (algoType === "dfs") {
      let stack = [start];
      let visitedSet = new Set([start]);
      let visited = [start];

      stepsArr.push(
        snapshot(
          null,
          visited,
          stack,
          null,
          null,
          null,
          2,
          `Inisialisasi Stack dengan node awal ${nodes[start].label}.`,
          { stack: `[${nodes[start].label}]` }
        )
      );

      while (stack.length > 0) {
        stepsArr.push(
          snapshot(
            null,
            visited,
            stack,
            null,
            null,
            null,
            5,
            "Loop: Cek Stack.",
            { stack: stack.map((id) => nodes[id].label).join(", ") }
          )
        );

        let curr = stack.pop();
        stepsArr.push(
          snapshot(
            curr,
            visited,
            stack,
            null,
            null,
            null,
            6,
            `Pop ${nodes[curr].label} dari tumpukan atas.`,
            {
              curr: nodes[curr].label,
              stack: stack.map((id) => nodes[id].label).join(", "),
            }
          )
        );

        const neighbors = adj[curr].slice().reverse();
        for (let { node: neighbor } of neighbors) {
          stepsArr.push(
            snapshot(
              curr,
              visited,
              stack,
              null,
              null,
              null,
              8,
              `Cek tetangga: ${nodes[neighbor].label}`,
              { curr: nodes[curr].label, neighbor: nodes[neighbor].label }
            )
          );

          if (!visitedSet.has(neighbor)) {
            visitedSet.add(neighbor);
            visited.push(neighbor);
            stack.push(neighbor);
            stepsArr.push(
              snapshot(
                curr,
                visited,
                stack,
                null,
                null,
                null,
                10,
                `${nodes[neighbor].label} belum dikunjungi. Push ke Stack.`,
                { stack: stack.map((id) => nodes[id].label).join(", ") }
              )
            );
          }
        }
      }
    } else if (algoType === "dijkstra") {
      let dist = {};
      let visited = new Set();
      let pathEdges = [];
      nodes.forEach((n) => (dist[n.id] = Infinity));
      dist[start] = 0;

      stepsArr.push(
        snapshot(
          null,
          [],
          [],
          null,
          dist,
          null,
          3,
          `Inisialisasi jarak: dist[${nodes[start].label}] = 0, sisanya ∞.`,
          { start: nodes[start].label }
        )
      );

      while (visited.size < n) {
        let u = null;
        let minDist = Infinity;
        for (let i = 0; i < n; i++) {
          if (!visited.has(i) && dist[i] < minDist) {
            minDist = dist[i];
            u = i;
          }
        }

        if (u === null) break;

        visited.add(u);
        stepsArr.push(
          snapshot(
            u,
            Array.from(visited),
            [],
            null,
            dist,
            pathEdges,
            7,
            `Pilih node dengan jarak terpendek: ${nodes[u].label} (${dist[u]}).`,
            { u: nodes[u].label, dist: dist[u] }
          )
        );

        for (let { node: v, weight } of adj[u]) {
          if (!visited.has(v)) {
            let newDist = dist[u] + weight;
            stepsArr.push(
              snapshot(
                u,
                Array.from(visited),
                [],
                null,
                dist,
                pathEdges,
                11,
                `Cek edge ${nodes[u].label}→${nodes[v].label} (bobot ${weight}). Jarak baru? ${dist[u]} + ${weight} = ${newDist}`,
                { u: nodes[u].label, v: nodes[v].label, weight }
              )
            );

            if (newDist < dist[v]) {
              dist[v] = newDist;
              pathEdges.push([u, v]);
              stepsArr.push(
                snapshot(
                  u,
                  Array.from(visited),
                  [],
                  null,
                  dist,
                  pathEdges,
                  13,
                  `✓ Update dist[${nodes[v].label}] = ${newDist}. (Relax)`,
                  { v: nodes[v].label, newDist }
                )
              );
            }
          }
        }
      }
    } else if (algoType === "bellman") {
      let dist = {};
      nodes.forEach((n) => (dist[n.id] = Infinity));
      dist[start] = 0;

      stepsArr.push(
        snapshot(
          null,
          [],
          [],
          null,
          dist,
          null,
          2,
          `Inisialisasi: dist[${nodes[start].label}] = 0, others = ∞`,
          {}
        )
      );

      for (let i = 0; i < n - 1; i++) {
        stepsArr.push(
          snapshot(
            null,
            [],
            [],
            null,
            dist,
            null,
            6,
            `Iterasi relaksasi ke-${i + 1}.`,
            { i: i + 1 }
          )
        );

        for (let [u, v, w] of edges) {
          if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
            let oldDist = dist[v];
            dist[v] = dist[u] + w;
            stepsArr.push(
              snapshot(
                null,
                [],
                [],
                null,
                dist,
                null,
                9,
                `Relax edge ${nodes[u].label}→${nodes[v].label} (${w}): Update dist[${nodes[v].label}] = ${dist[v]}`,
                { u: nodes[u].label, v: nodes[v].label, w }
              )
            );
          }
        }
      }
    } else if (algoType === "astar") {
      let gScore = {};
      let fScore = {};
      let openSet = [start];
      let closedSet = new Set();
      let cameFrom = {};
      let pathEdges = [];

      nodes.forEach((n) => {
        gScore[n.id] = Infinity;
        fScore[n.id] = Infinity;
      });
      gScore[start] = 0;
      fScore[start] = heuristic(start, target);

      stepsArr.push(
        snapshot(
          null,
          [],
          openSet,
          null,
          gScore,
          null,
          2,
          `Init: OpenSet = [${nodes[start].label}], g=0.`,
          { start: nodes[start].label }
        )
      );

      while (openSet.length > 0) {
        let curr = openSet.reduce(
          (min, node) => (fScore[node] < fScore[min] ? node : min),
          openSet[0]
        );

        stepsArr.push(
          snapshot(
            curr,
            Array.from(closedSet),
            openSet,
            null,
            gScore,
            pathEdges,
            6,
            `Pilih node dengan fScore terendah: ${
              nodes[curr].label
            } (f=${fScore[curr].toFixed(1)})`,
            { curr: nodes[curr].label, f: fScore[curr].toFixed(1) }
          )
        );

        if (curr === target) {
          let path = [curr];
          let currTemp = curr;
          while (cameFrom[currTemp] !== undefined) {
            pathEdges.push([cameFrom[currTemp], currTemp]);
            currTemp = cameFrom[currTemp];
            path.unshift(currTemp);
          }
          stepsArr.push(
            snapshot(
              target,
              Array.from(closedSet),
              [],
              null,
              gScore,
              pathEdges,
              7,
              `✓ GOAL REACHED! Path: ${path
                .map((id) => nodes[id].label)
                .join("→")}`,
              { path: path.map((id) => nodes[id].label).join("→") }
            )
          );
          break;
        }

        openSet = openSet.filter((n) => n !== curr);
        closedSet.add(curr);

        for (let { node: neighbor, weight } of adj[curr]) {
          let tentativeG = gScore[curr] + weight;
          stepsArr.push(
            snapshot(
              curr,
              Array.from(closedSet),
              openSet,
              null,
              gScore,
              pathEdges,
              11,
              `Cek Neighbor ${
                nodes[neighbor].label
              }, tentativeG = ${tentativeG.toFixed(1)}`,
              { nbr: nodes[neighbor].label }
            )
          );

          if (tentativeG < gScore[neighbor]) {
            gScore[neighbor] = tentativeG;
            fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, target);
            if (!openSet.includes(neighbor)) openSet.push(neighbor);
            cameFrom[neighbor] = curr;
            stepsArr.push(
              snapshot(
                curr,
                Array.from(closedSet),
                openSet,
                null,
                gScore,
                pathEdges,
                13,
                `Update ${nodes[neighbor].label}: g=${tentativeG.toFixed(
                  1
                )}, f=${fScore[neighbor].toFixed(1)}.`,
                { nbr: nodes[neighbor].label }
              )
            );
          }
        }
      }
    } else if (algoType === "prim") {
      let inMST = new Set([start]);
      let mstEdges = [];
      let totalWeight = 0;

      stepsArr.push(
        snapshot(
          null,
          [start],
          [],
          mstEdges,
          null,
          null,
          2,
          `Mulai MST dari ${nodes[start].label}`,
          { inMST: `{${nodes[start].label}}` }
        )
      );

      while (inMST.size < n) {
        let minEdge = null;
        let minWeight = Infinity;

        stepsArr.push(
          snapshot(
            null,
            Array.from(inMST),
            [],
            mstEdges,
            null,
            null,
            6,
            `Cari edge terpendek dari set visited ke unvisited...`,
            {}
          )
        );

        for (let u of inMST) {
          for (let { node: v, weight } of adj[u]) {
            if (!inMST.has(v) && weight < minWeight) {
              minWeight = weight;
              minEdge = [u, v, weight];
            }
          }
        }

        if (!minEdge) break;

        const [u, v, w] = minEdge;
        inMST.add(v);
        mstEdges.push(minEdge);
        totalWeight += w;

        stepsArr.push(
          snapshot(
            v,
            Array.from(inMST),
            [],
            mstEdges,
            null,
            null,
            12,
            `Pilih edge ${nodes[u].label}→${nodes[v].label} (bobot ${w}). Tambah ke MST.`,
            { u: nodes[u].label, v: nodes[v].label, w }
          )
        );
      }
    } else if (algoType === "kruskal") {
      let sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);
      let parent = Array(n).fill(-1);
      let mstEdges = [];
      let totalWeight = 0;

      const find = (p, i) => (p[i] === -1 ? i : find(p, p[i]));
      const union = (p, x, y) => {
        p[x] = y;
      };

      stepsArr.push(
        snapshot(
          null,
          [],
          [],
          mstEdges,
          null,
          null,
          2,
          `Sorting semua edge berdasarkan bobot.`,
          { edges: sortedEdges.length }
        )
      );

      for (let [u, v, w] of sortedEdges) {
        stepsArr.push(
          snapshot(
            null,
            [],
            [],
            mstEdges,
            null,
            null,
            6,
            `Cek edge minimum berikutnya: ${nodes[u].label}→${nodes[v].label} (${w})`,
            { u: nodes[u].label, v: nodes[v].label, w }
          )
        );

        let rootU = find(parent, u);
        let rootV = find(parent, v);

        if (rootU !== rootV) {
          mstEdges.push([u, v, w]);
          totalWeight += w;
          union(parent, rootU, rootV);
          stepsArr.push(
            snapshot(
              null,
              [],
              [],
              mstEdges,
              null,
              null,
              10,
              `✓ Valid! ${nodes[u].label} dan ${nodes[v].label} beda set. Gabung.`,
              { totalWeight }
            )
          );
        } else {
          stepsArr.push(
            snapshot(
              null,
              [],
              [],
              mstEdges,
              null,
              null,
              9,
              `✗ Skip! ${nodes[u].label} dan ${nodes[v].label} sudah terhubung.`,
              {}
            )
          );
        }
      }
    }

    // Final
    if (stepsArr.length > 0) {
      const last = stepsArr[stepsArr.length - 1];
      stepsArr.push(
        snapshot(
          last.activeNode,
          last.visitedNodes,
          last.structure,
          last.mstEdges,
          last.distances,
          last.pathEdges,
          -1,
          "Algoritma Selesai.",
          {}
        )
      );
    }
    return stepsArr;
  };

  // ==========================================
  // 4. EFFECTS & HANDLERS
  // ==========================================

  useEffect(() => {
    resetAndGenerate();
  }, [algorithm, startNode, targetNode]);

  const resetAndGenerate = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
    const generatedSteps = generateSteps(algorithm, startNode, targetNode);
    setSteps(generatedSteps);
  };

  useEffect(() => {
    if (isPlaying) {
      const baseTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - baseTime;
        setElapsedTime(newElapsed);

        const targetStep = Math.floor(newElapsed / STEP_DELAY);
        if (targetStep >= steps.length - 1) {
          setCurrentStep(steps.length - 1);
          setIsPlaying(false);
        } else {
          setCurrentStep(targetStep);
        }
      }, 30);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps.length]);

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
  };
  const handleBegin = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
  };
  const handleEnd = () => {
    setIsPlaying(false);
    const last = steps.length - 1;
    setCurrentStep(last);
    setElapsedTime(last * STEP_DELAY);
  };
  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setElapsedTime(prev * STEP_DELAY);
    }
  };
  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setElapsedTime(next * STEP_DELAY);
    }
  };

  // ==========================================
  // 5. RENDER HELPER COMPONENTS
  // ==========================================

  const getStatusColor = () => {
    if (currentStep >= steps.length - 1) return "text-orange-400";
    if (isPlaying) return "text-yellow-400";
    return "text-slate-400";
  };

  const getStatusText = () => {
    if (currentStep >= steps.length - 1) return "FINISHED";
    if (isPlaying) return "COMPUTING";
    return "READY";
  };

  const VarBadge = ({ name, value }) => (
    <div className="flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600">
      <span className="text-[10px] text-orange-300 font-mono font-bold uppercase">
        {name}
      </span>
      <span className="text-sm text-white font-bold">{value}</span>
      <span className="text-[8px] text-slate-400 text-center">
        {getVarDesc(name)}
      </span>
    </div>
  );

  const CodeBlock = ({ code }) => {
    const lines = code.trim().split("\n");
    return (
      <div className="font-mono text-xs overflow-auto">
        {lines.map((line, index) => {
          const isActive = currentVisual.activeCodeLine === index + 1;
          return (
            <div
              key={index}
              className={`flex px-2 py-0.5 ${
                isActive
                  ? "bg-orange-900/60 border-l-4 border-orange-400"
                  : "border-l-4 border-transparent"
              }`}
            >
              <span className="w-8 text-slate-600 text-right mr-3 leading-5 select-none">
                {index + 1}
              </span>
              <span
                className={`whitespace-pre ${
                  isActive ? "text-orange-200 font-bold" : "text-slate-300"
                }`}
              >
                {line}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const ExecutionLog = () => {
    const logRef = useRef(null);
    const logs = steps.slice(0, currentStep + 1);

    useEffect(() => {
      if (logRef.current) {
        logRef.current.scrollTop = logRef.current.scrollHeight;
      }
    }, [logs.length]);

    return (
      <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
        <div className="bg-slate-800/80 p-3 border-b border-slate-700 flex items-center gap-2 text-orange-100 text-sm font-semibold">
          <MessageSquare size={16} className="text-orange-400" />
          Log Eksekusi
        </div>
        <div
          ref={logRef}
          className="flex-1 overflow-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700"
        >
          {logs.map((step, idx) => (
            <div
              key={idx}
              className={`text-xs p-2 rounded border-l-2 ${
                idx === logs.length - 1
                  ? "bg-orange-900/30 border-orange-500 ring-1 ring-orange-500/20"
                  : "bg-slate-800/50 border-slate-600"
              }`}
            >
              <div className="flex gap-2 items-start">
                <span className="font-mono text-slate-500 font-bold min-w-[24px] text-right border-r border-slate-700 pr-2 mr-1">
                  {idx + 1}
                </span>
                <span
                  className={
                    idx === logs.length - 1
                      ? "text-orange-200"
                      : "text-slate-400"
                  }
                >
                  {step.stepDescription}
                </span>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-slate-500 text-center italic mt-10">
              Menunggu eksekusi...
            </div>
          )}
        </div>
      </div>
    );
  };

  // ==========================================
  // 6. MAIN COMPONENT RENDER
  // ==========================================

  return (
    <div className="h-full overflow-auto bg-slate-900">
      <div className="min-h-full text-white font-sans p-4 flex flex-col items-center">
        {/* HEADER */}
        <header className="w-full max-w-7xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20">
                <Network size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo Graph & Tree
                </h1>
                <p className="text-xs text-slate-400">
                  BFS, DFS, Dijkstra, A*, Prim, Kruskal
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <optgroup label="Traversal">
                  <option value="bfs">BFS</option>
                  <option value="dfs">DFS</option>
                </optgroup>
                <optgroup label="Shortest Path">
                  <option value="dijkstra">Dijkstra</option>
                  <option value="bellman">Bellman-Ford</option>
                  <option value="astar">A* (A-Star)</option>
                </optgroup>
                <optgroup label="MST">
                  <option value="prim">Prim</option>
                  <option value="kruskal">Kruskal</option>
                </optgroup>
              </select>

              <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] uppercase text-slate-400 font-bold">
                  Start
                </span>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-1 outline-none"
                >
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </div>
              {algorithm === "astar" && (
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">
                    Goal
                  </span>
                  <select
                    value={targetNode}
                    onChange={(e) => setTargetNode(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-1 outline-none"
                  >
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Time Display */}
              <div className="px-3 py-1 bg-slate-900 rounded border border-slate-600 flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                  <Clock size={10} /> Waktu
                </span>
                <span className="text-sm font-mono text-orange-400">
                  {(elapsedTime / 1000).toFixed(1)}s
                </span>
              </div>

              <button
                onClick={resetAndGenerate}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white"
                title="Reset"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ALGORITHM DESCRIPTION */}
        <section className="w-full max-w-7xl mb-4">
          <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700/50 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20 mt-1">
                {["bfs", "dfs"].includes(algorithm) ? (
                  <Search size={20} className="text-white" />
                ) : ["dijkstra", "bellman", "astar"].includes(algorithm) ? (
                  <Route size={20} className="text-white" />
                ) : (
                  <GitBranch size={20} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-200 mb-2">
                  {algorithmDescriptions[algorithm].title}
                </h3>
                <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                  {algorithmDescriptions[algorithm].description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700">
                    <span className="text-slate-400 font-semibold">
                      Kompleksitas:
                    </span>
                    <span className="text-orange-300 ml-2 font-mono">
                      {algorithmDescriptions[algorithm].complexity}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-2 border border-slate-700">
                    <span className="text-slate-400 font-semibold">
                      Use Case:
                    </span>
                    <span className="text-slate-300 ml-2">
                      {algorithmDescriptions[algorithm].useCase}
                    </span>
                  </div>
                </div>
                {algorithmDescriptions[algorithm].pseudocode && (
                  <div className="mt-3 bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 font-mono text-xs text-slate-400 whitespace-pre overflow-x-auto">
                    <div className="text-orange-400 font-bold mb-1">
                      Pseudocode:
                    </div>
                    {algorithmDescriptions[algorithm].pseudocode}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID - SYMMETRICAL 2 COLUMNS */}
        <main className="w-full max-w-7xl flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: VISUALIZATION & CONTROLS */}
          <section className="flex flex-col gap-4">
            {/* 1. Visualization */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[400px]">
              <div className="bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center text-orange-100 text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <Hash size={16} className="text-orange-400" />
                  Visualisasi Graf
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>

              <div className="relative w-full h-[400px] bg-[#0f1117]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, i) => {
                    const u = nodes[edge[0]];
                    const v = nodes[edge[1]];
                    // Weighted edges
                    // Fix: Check if edges have weight, initial edges state has [u, v, w]
                    const weight = edge[2];

                    const isMST = currentVisual.mstEdges.some(
                      ([a, b]) =>
                        (a === edge[0] && b === edge[1]) ||
                        (a === edge[1] && b === edge[0])
                    );
                    const isPath =
                      currentVisual.pathEdges &&
                      currentVisual.pathEdges.some(
                        ([a, b]) =>
                          (a === edge[0] && b === edge[1]) ||
                          (a === edge[1] && b === edge[0])
                      );

                    let strokeColor = "#334155";
                    let strokeWidth = "2";

                    if (isMST) {
                      strokeColor = "#06b6d4"; // amber
                      strokeWidth = "4";
                    } else if (isPath) {
                      strokeColor = "#10b981"; // orange
                      strokeWidth = "4";
                    }

                    return (
                      <g key={i}>
                        <line
                          x1={u.x}
                          y1={u.y}
                          x2={v.x}
                          y2={v.y}
                          stroke={strokeColor}
                          strokeWidth={strokeWidth}
                        />
                        <text
                          x={(u.x + v.x) / 2}
                          y={(u.y + v.y) / 2}
                          fill="#94a3b8"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none bg-slate-900"
                        >
                          {weight}
                        </text>
                        {/* Background for weight text to make it readable */}
                        <rect
                          x={(u.x + v.x) / 2 - 8}
                          y={(u.y + v.y) / 2 - 8}
                          width="16"
                          height="16"
                          rx="4"
                          fill="#0f1117"
                          opacity="0.8"
                          className="-z-10"
                        />
                        <text
                          x={(u.x + v.x) / 2}
                          y={(u.y + v.y) / 2 + 4}
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="pointer-events-none"
                        >
                          {weight}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {nodes.map((node) => {
                  const isActive = currentVisual.activeNode === node.id;
                  const isVisited = currentVisual.visitedNodes.includes(
                    node.id
                  );

                  // For structure highlight (queue/stack)
                  const isInStructure =
                    currentVisual.structure &&
                    currentVisual.structure.includes(node.id);

                  let bgColor = "bg-slate-800";
                  let borderColor = "border-slate-500";
                  let textColor = "text-slate-300";

                  if (isActive) {
                    bgColor = "bg-yellow-500";
                    borderColor = "border-yellow-300";
                    textColor = "text-black font-bold";
                  } else if (isInStructure) {
                    bgColor = "bg-blue-600";
                    borderColor = "border-blue-400";
                    textColor = "text-white";
                  } else if (isVisited) {
                    bgColor = "bg-orange-600";
                    borderColor = "border-orange-400";
                    textColor = "text-white";
                  }

                  return (
                    <div
                      key={node.id}
                      className={`absolute w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${bgColor} ${borderColor} ${textColor}`}
                      style={{ left: node.x - 20, top: node.y - 20 }}
                    >
                      <span className="text-sm font-bold">{node.label}</span>

                      {/* Dijkstra/A* Distances */}
                      {currentVisual.distances &&
                        currentVisual.distances[node.id] !== undefined &&
                        currentVisual.distances[node.id] !== Infinity && (
                          <div className="absolute -bottom-6 bg-slate-900 text-xs px-1.5 py-0.5 rounded border border-slate-700 text-orange-400 font-mono">
                            {typeof currentVisual.distances[node.id] ===
                            "number"
                              ? currentVisual.distances[node.id].toFixed(0)
                              : currentVisual.distances[node.id]}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Controls */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl p-4 flex flex-col gap-4">
              <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-600 flex justify-center items-center gap-4 shadow-lg">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleStop}
                    className="p-2 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg"
                    title="Stop"
                  >
                    <Square size={20} fill="currentColor" />
                  </button>
                  <div className="w-px h-6 bg-slate-600 mx-2"></div>
                  <button
                    onClick={handleBegin}
                    className="p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg"
                    title="Start"
                  >
                    <SkipBack size={20} />
                  </button>
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30"
                    title="Prev"
                  >
                    <StepBack size={20} />
                  </button>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-3 rounded-full shadow-lg ${
                      isPlaying ? "bg-orange-500" : "bg-orange-600"
                    } text-white`}
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentStep === steps.length - 1}
                    className="p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30"
                    title="Next"
                  >
                    <StepForward size={20} />
                  </button>
                  <button
                    onClick={handleEnd}
                    className="p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg"
                    title="End"
                  >
                    <SkipForward size={20} />
                  </button>
                </div>
                <div className="hidden md:flex flex-col flex-1 max-w-xs ml-4">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {currentStep} / {steps.length - 1}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-orange-500 h-full transition-all duration-100"
                      style={{
                        width: `${
                          (currentStep / (steps.length - 1 || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Variables */}
            {Object.keys(currentVisual.variables).length > 0 && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="bg-slate-800/80 p-3 border-b border-slate-700 flex items-center gap-2 text-orange-100 text-sm font-semibold">
                  <Variable size={16} className="text-orange-400" />
                  Variabel
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-[#151925]">
                  {Object.entries(currentVisual.variables).map(([key, val]) => (
                    <VarBadge
                      key={key}
                      name={key}
                      value={
                        typeof val === "object" ? JSON.stringify(val) : val
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: CODE & LOG */}
          <section className="flex flex-col gap-4 h-[calc(100vh-200px)] min-h-[600px]">
            {/* 1. Code View */}
            <div className="flex flex-col flex-1 bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[300px]">
              <div className="bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2 text-slate-200 text-sm font-semibold">
                <Code size={16} className="text-orange-400" />
                Implementasi Algoritma
              </div>
              <div className="flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
                <CodeBlock code={algoCode[algorithm]} />
              </div>
            </div>

            {/* 2. Execution Log (Stack) */}
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[250px]">
              <ExecutionLog />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default GraphTreeAlgorithm;
