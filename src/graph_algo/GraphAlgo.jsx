import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Network, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, GitBranch } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  bfs: `PROCEDURE BFS(graph: Graph, source: Integer)
  DECLARE queue: Queue, visited: Set
  DECLARE distances: Array[V]
  
  FOR each vertex v IN graph DO
    distances[v] <- INFINITY
    visited[v] <- FALSE
  END FOR
  
  distances[source] <- 0
  visited[source] <- TRUE
  queue.enqueue(source)
  
  WHILE NOT queue.isEmpty() DO
    current <- queue.dequeue()
    
    FOR each neighbor IN graph.neighbors(current) DO
      IF NOT visited[neighbor] THEN
        visited[neighbor] <- TRUE
        distances[neighbor] <- distances[current] + 1
        queue.enqueue(neighbor)
      END IF
    END FOR
  END WHILE
END PROCEDURE`,

  dfs: `PROCEDURE DFS(graph: Graph, source: Integer)
  DECLARE stack: Stack, visited: Set
  
  FOR each vertex v IN graph DO
    visited[v] <- FALSE
  END FOR
  
  stack.push(source)
  
  WHILE NOT stack.isEmpty() DO
    current <- stack.pop()
    
    IF NOT visited[current] THEN
      visited[current] <- TRUE
      Process(current)
      
      FOR each neighbor IN graph.neighbors(current) DO
        IF NOT visited[neighbor] THEN
          stack.push(neighbor)
        END IF
      END FOR
    END IF
  END WHILE
END PROCEDURE`,

  dijkstra: `PROCEDURE Dijkstra(graph: Graph, source: Integer)
  DECLARE dist: Array[V], pq: PriorityQueue
  DECLARE visited: Set
  
  FOR each vertex v IN graph DO
    dist[v] <- INFINITY
    visited[v] <- FALSE
  END FOR
  
  dist[source] <- 0
  pq.insert(source, 0)
  
  WHILE NOT pq.isEmpty() DO
    current <- pq.extractMin()
    IF visited[current] THEN CONTINUE
    visited[current] <- TRUE
    
    FOR each neighbor, weight IN graph.edges(current) DO
      newDist <- dist[current] + weight
      IF newDist < dist[neighbor] THEN
        dist[neighbor] <- newDist
        pq.insert(neighbor, newDist)
      END IF
    END FOR
  END WHILE
END PROCEDURE`,

  bellmanFord: `PROCEDURE BellmanFord(graph: Graph, source: Integer)
  DECLARE dist: Array[V]
  
  FOR each vertex v IN graph DO
    dist[v] <- INFINITY
  END FOR
  dist[source] <- 0
  
  FOR i FROM 1 TO V-1 DO
    FOR each edge (u, v, w) IN graph.edges DO
      IF dist[u] != INFINITY AND dist[u] + w < dist[v] THEN
        dist[v] <- dist[u] + w
      END IF
    END FOR
  END FOR
  
  FOR each edge (u, v, w) IN graph.edges DO
    IF dist[u] != INFINITY AND dist[u] + w < dist[v] THEN
      RETURN "Negative cycle detected"
    END IF
  END FOR
  
  RETURN dist
END PROCEDURE`,

  floydWarshall: `PROCEDURE FloydWarshall(graph: Graph)
  DECLARE dist: Matrix[V][V]
  
  FOR i FROM 0 TO V-1 DO
    FOR j FROM 0 TO V-1 DO
      IF i == j THEN
        dist[i][j] <- 0
      ELSE IF edge(i,j) exists THEN
        dist[i][j] <- weight(i,j)
      ELSE
        dist[i][j] <- INFINITY
      END IF
    END FOR
  END FOR
  
  FOR k FROM 0 TO V-1 DO
    FOR i FROM 0 TO V-1 DO
      FOR j FROM 0 TO V-1 DO
        IF dist[i][k] + dist[k][j] < dist[i][j] THEN
          dist[i][j] <- dist[i][k] + dist[k][j]
        END IF
      END FOR
    END FOR
  END FOR
  
  RETURN dist
END PROCEDURE`,

  kruskal: `PROCEDURE Kruskal(graph: Graph)
  DECLARE mst: Set, parent: Array[V]
  DECLARE edges: List <- SortEdgesByWeight(graph)
  
  FOR each vertex v IN graph DO
    parent[v] <- v
  END FOR
  
  FOR each edge (u, v, w) IN edges DO
    rootU <- Find(u, parent)
    rootV <- Find(v, parent)
    
    IF rootU != rootV THEN
      mst.add(edge(u, v, w))
      Union(rootU, rootV, parent)
    END IF
  END FOR
  
  RETURN mst
END PROCEDURE

FUNCTION Find(x, parent)
  IF parent[x] != x THEN
    parent[x] <- Find(parent[x], parent)
  END IF
  RETURN parent[x]
END FUNCTION`,

  prim: `PROCEDURE Prim(graph: Graph, start: Integer)
  DECLARE mst: Set, pq: PriorityQueue
  DECLARE visited: Set, key: Array[V]
  
  FOR each vertex v IN graph DO
    key[v] <- INFINITY
    visited[v] <- FALSE
  END FOR
  
  key[start] <- 0
  pq.insert(start, 0)
  
  WHILE NOT pq.isEmpty() DO
    u <- pq.extractMin()
    IF visited[u] THEN CONTINUE
    visited[u] <- TRUE
    
    FOR each neighbor v, weight IN graph.edges(u) DO
      IF NOT visited[v] AND weight < key[v] THEN
        key[v] <- weight
        pq.insert(v, weight)
        mst.add(edge(u, v, weight))
      END IF
    END FOR
  END WHILE
  
  RETURN mst
END PROCEDURE`,

  topologicalSort: `PROCEDURE TopologicalSort(graph: DAG)
  DECLARE stack: Stack, visited: Set
  DECLARE result: List
  
  FOR each vertex v IN graph DO
    visited[v] <- FALSE
  END FOR
  
  FOR each vertex v IN graph DO
    IF NOT visited[v] THEN
      DFSUtil(v, visited, stack)
    END IF
  END FOR
  
  WHILE NOT stack.isEmpty() DO
    result.append(stack.pop())
  END WHILE
  
  RETURN result
END PROCEDURE

PROCEDURE DFSUtil(v, visited, stack)
  visited[v] <- TRUE
  
  FOR each neighbor IN graph.neighbors(v) DO
    IF NOT visited[neighbor] THEN
      DFSUtil(neighbor, visited, stack)
    END IF
  END FOR
  
  stack.push(v)
END PROCEDURE`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  bfs: `void BFS(vector<vector<int>>& graph, int source) {
  int V = graph.size();
  vector<bool> visited(V, false);
  vector<int> distance(V, INT_MAX);
  queue<int> q;
  
  visited[source] = true;
  distance[source] = 0;
  q.push(source);
  
  while (!q.empty()) {
    int current = q.front();
    q.pop();
    
    for (int neighbor : graph[current]) {
      if (!visited[neighbor]) {
        visited[neighbor] = true;
        distance[neighbor] = distance[current] + 1;
        q.push(neighbor);
      }
    }
  }
}`,

  dfs: `void DFS(vector<vector<int>>& graph, int source) {
  int V = graph.size();
  vector<bool> visited(V, false);
  stack<int> s;
  
  s.push(source);
  
  while (!s.empty()) {
    int current = s.top();
    s.pop();
    
    if (!visited[current]) {
      visited[current] = true;
      cout << current << " ";
      
      for (int neighbor : graph[current]) {
        if (!visited[neighbor]) {
          s.push(neighbor);
        }
      }
    }
  }
}`,

  dijkstra: `void dijkstra(vector<vector<pair<int,int>>>& graph, int source) {
  int V = graph.size();
  vector<int> dist(V, INT_MAX);
  vector<bool> visited(V, false);
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  
  dist[source] = 0;
  pq.push({0, source});
  
  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();
    
    if (visited[u]) continue;
    visited[u] = true;
    
    for (auto& [v, weight] : graph[u]) {
      int newDist = dist[u] + weight;
      if (newDist < dist[v]) {
        dist[v] = newDist;
        pq.push({newDist, v});
      }
    }
  }
}`,

  bellmanFord: `bool bellmanFord(vector<Edge>& edges, int V, int source, vector<int>& dist) {
  dist.assign(V, INT_MAX);
  dist[source] = 0;
  
  // Relax edges V-1 times
  for (int i = 0; i < V - 1; i++) {
    for (auto& edge : edges) {
      if (dist[edge.u] != INT_MAX && 
          dist[edge.u] + edge.weight < dist[edge.v]) {
        dist[edge.v] = dist[edge.u] + edge.weight;
      }
    }
  }
  
  // Check for negative cycles
  for (auto& edge : edges) {
    if (dist[edge.u] != INT_MAX && 
        dist[edge.u] + edge.weight < dist[edge.v]) {
      return false; // Negative cycle detected
    }
  }
  
  return true;
}`,

  floydWarshall: `void floydWarshall(vector<vector<int>>& graph) {
  int V = graph.size();
  vector<vector<int>> dist = graph;
  
  // Initialize
  for (int i = 0; i < V; i++) {
    for (int j = 0; j < V; j++) {
      if (i == j) dist[i][j] = 0;
      else if (dist[i][j] == 0) dist[i][j] = INT_MAX;
    }
  }
  
  // Floyd-Warshall algorithm
  for (int k = 0; k < V; k++) {
    for (int i = 0; i < V; i++) {
      for (int j = 0; j < V; j++) {
        if (dist[i][k] != INT_MAX && dist[k][j] != INT_MAX &&
            dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
}`,

  kruskal: `struct Edge {
  int u, v, weight;
  bool operator<(const Edge& other) const {
    return weight < other.weight;
  }
};

int find(int x, vector<int>& parent) {
  if (parent[x] != x)
    parent[x] = find(parent[x], parent);
  return parent[x];
}

vector<Edge> kruskal(vector<Edge>& edges, int V) {
  vector<Edge> mst;
  vector<int> parent(V);
  
  for (int i = 0; i < V; i++)
    parent[i] = i;
  
  sort(edges.begin(), edges.end());
  
  for (auto& edge : edges) {
    int rootU = find(edge.u, parent);
    int rootV = find(edge.v, parent);
    
    if (rootU != rootV) {
      mst.push_back(edge);
      parent[rootU] = rootV;
    }
  }
  
  return mst;
}`,

  prim: `vector<Edge> prim(vector<vector<pair<int,int>>>& graph, int start) {
  int V = graph.size();
  vector<Edge> mst;
  vector<bool> visited(V, false);
  vector<int> key(V, INT_MAX);
  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
  
  key[start] = 0;
  pq.push({0, start});
  
  while (!pq.empty()) {
    int u = pq.top().second;
    pq.pop();
    
    if (visited[u]) continue;
    visited[u] = true;
    
    for (auto& [v, weight] : graph[u]) {
      if (!visited[v] && weight < key[v]) {
        key[v] = weight;
        pq.push({weight, v});
        mst.push_back({u, v, weight});
      }
    }
  }
  
  return mst;
}`,

  topologicalSort: `void dfsUtil(int v, vector<bool>& visited, stack<int>& s, 
             vector<vector<int>>& graph) {
  visited[v] = true;
  
  for (int neighbor : graph[v]) {
    if (!visited[neighbor]) {
      dfsUtil(neighbor, visited, s, graph);
    }
  }
  
  s.push(v);
}

vector<int> topologicalSort(vector<vector<int>>& graph) {
  int V = graph.size();
  vector<bool> visited(V, false);
  stack<int> s;
  vector<int> result;
  
  for (int i = 0; i < V; i++) {
    if (!visited[i]) {
      dfsUtil(i, visited, s, graph);
    }
  }
  
  while (!s.empty()) {
    result.push_back(s.top());
    s.pop();
  }
  
  return result;
}`,
}

const ALGO_INFO = {
  bfs: {
    title: 'BREADTH-FIRST SEARCH (BFS)',
    description: 'Menjelajahi graf level demi level menggunakan queue, menemukan path terpendek (dalam edges) di unweighted graph.',
    complexity: 'O(V + E)',
    useCase: 'Shortest path unweighted graph, web crawling, GPS navigation',
  },
  dfs: {
    title: 'DEPTH-FIRST SEARCH (DFS)',
    description: 'Menjelajahi graf sedalam mungkin sebelum backtrack, menggunakan stack (rekursif atau iteratif).',
    complexity: 'O(V + E)',
    useCase: 'Cycle detection, topological sort, maze solving, connectivity check',
  },
  dijkstra: {
    title: "DIJKSTRA'S ALGORITHM",
    description: 'Menemukan path terpendek dari source ke semua node lain di weighted graph dengan bobot non-negatif.',
    complexity: 'O((V + E) log V) dengan priority queue',
    useCase: 'Routing network, GPS, shortest path dengan bobot positif',
  },
  bellmanFord: {
    title: 'BELLMAN-FORD ALGORITHM',
    description: 'Menemukan shortest path dari source dengan bobot negatif (tanpa negative cycle), bekerja dengan relaxation berulang.',
    complexity: 'O(VE)',
    useCase: 'Graf dengan bobot negatif, deteksi negative cycle, network routing protocols',
  },
  floydWarshall: {
    title: 'FLOYD-WARSHALL',
    description: 'Menemukan shortest path antara semua pasangan node (all-pairs shortest path) menggunakan dynamic programming.',
    complexity: 'O(V³)',
    useCase: 'Jarak antara semua kota, transitive closure, small dense graphs',
  },
  kruskal: {
    title: "KRUSKAL'S ALGORITHM",
    description: 'Membuat Minimum Spanning Tree (MST) dengan mengurutkan edges dan menambahkan edge terkecil yang tidak membentuk cycle.',
    complexity: 'O(E log E)',
    useCase: 'Jaringan kabel, clustering, network design',
  },
  prim: {
    title: "PRIM'S ALGORITHM",
    description: 'Membuat MST dengan menumbuhkan pohon dari node awal, selalu menambahkan edge terdekat yang terhubung ke pohon.',
    complexity: 'O(E log V)',
    useCase: 'Jaringan listrik, pipa, MST untuk dense graphs',
  },
  topologicalSort: {
    title: 'TOPOLOGICAL SORT',
    description: 'Mengurutkan node DAG (Directed Acyclic Graph) sehingga setiap edge mengarah dari node sebelumnya ke berikutnya.',
    complexity: 'O(V + E)',
    useCase: 'Scheduling tugas, dependency resolution, course prerequisites',
  },
}

// ==========================================
// SAMPLE GRAPHS
// ==========================================

const SAMPLE_GRAPHS = {
  unweighted: {
    nodes: [
      { id: 0, x: 150, y: 100, label: '0' },
      { id: 1, x: 300, y: 50, label: '1' },
      { id: 2, x: 450, y: 100, label: '2' },
      { id: 3, x: 150, y: 250, label: '3' },
      { id: 4, x: 300, y: 200, label: '4' },
      { id: 5, x: 450, y: 250, label: '5' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 3 },
      { from: 1, to: 2 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ],
  },
  weighted: {
    nodes: [
      { id: 0, x: 150, y: 100, label: '0' },
      { id: 1, x: 300, y: 50, label: '1' },
      { id: 2, x: 450, y: 100, label: '2' },
      { id: 3, x: 150, y: 250, label: '3' },
      { id: 4, x: 300, y: 200, label: '4' },
      { id: 5, x: 450, y: 250, label: '5' },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 3, weight: 2 },
      { from: 1, to: 2, weight: 3 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 5, weight: 2 },
      { from: 3, to: 4, weight: 1 },
      { from: 4, to: 5, weight: 6 },
    ],
  },
  dag: {
    nodes: [
      { id: 0, x: 100, y: 100, label: '0' },
      { id: 1, x: 250, y: 50, label: '1' },
      { id: 2, x: 250, y: 150, label: '2' },
      { id: 3, x: 400, y: 50, label: '3' },
      { id: 4, x: 400, y: 150, label: '4' },
      { id: 5, x: 550, y: 100, label: '5' },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
    ],
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const GraphVisualization = ({ graph, step }) => {
  const { nodes, edges } = graph
  const { visitedNodes = [], activeNodes = [], selectedEdges = [], distances = {}, queue = [], stack = [] } = step

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl min-h-[350px] relative'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Network size={14} /> Visualisasi Graf
        </h3>
        <div className='flex gap-2'>
          {['VISITED', 'ACTIVE', 'PATH'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'VISITED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : label === 'ACTIVE' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <svg
        width='600'
        height='300'
        className='mx-auto'>
        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          const isSelected = selectedEdges.some((e) => e.from === edge.from && e.to === edge.to)

          const midX = (fromNode.x + toNode.x) / 2
          const midY = (fromNode.y + toNode.y) / 2

          return (
            <g key={idx}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isSelected ? '#3b82f6' : '#475569'}
                strokeWidth={isSelected ? '3' : '2'}
                className='transition-all duration-300'
              />
              {edge.weight !== undefined && (
                <text
                  x={midX}
                  y={midY - 5}
                  fill='#94a3b8'
                  fontSize='12'
                  fontWeight='bold'
                  textAnchor='middle'
                  className='select-none'>
                  {edge.weight}
                </text>
              )}
            </g>
          )
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.includes(node.id)
          const isActive = activeNodes.includes(node.id)

          let fillColor = '#1e293b' // default
          let strokeColor = '#475569'
          let strokeWidth = '2'

          if (isActive) {
            fillColor = '#fef3c7'
            strokeColor = '#fbbf24'
            strokeWidth = '3'
          } else if (isVisited) {
            fillColor = '#d1fae5'
            strokeColor = '#10b981'
            strokeWidth = '2'
          }

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r='25'
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className='transition-all duration-300'
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill={isActive || isVisited ? '#000' : '#fff'}
                fontSize='16'
                fontWeight='bold'
                textAnchor='middle'
                className='select-none'>
                {node.label}
              </text>
              {distances[node.id] !== undefined && distances[node.id] !== Infinity && (
                <text
                  x={node.x}
                  y={node.y - 35}
                  fill='#f97316'
                  fontSize='12'
                  fontWeight='bold'
                  textAnchor='middle'
                  className='select-none'>
                  d={distances[node.id]}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Queue/Stack Display */}
      {(queue.length > 0 || stack.length > 0) && (
        <div className='mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700'>
          <div className='text-xs font-bold text-slate-400 mb-2'>{queue.length > 0 ? 'QUEUE' : 'STACK'}</div>
          <div className='flex gap-2'>
            {(queue.length > 0 ? queue : stack).map((item, idx) => (
              <div
                key={idx}
                className='px-3 py-1 bg-orange-500/20 border border-orange-500 rounded text-orange-400 font-mono text-sm'>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const CodeViewer = ({ code, activeLine }) => {
  const lines = code.split('\n')
  const scrollRef = useRef(null)

  const highlightSyntax = (line) => {
    if (line.includes('//')) {
      const commentIndex = line.indexOf('//')
      const codePart = line.substring(0, commentIndex)
      const commentPart = line.substring(commentIndex)

      return (
        <>
          {highlightCodePart(codePart)}
          <span className='text-slate-500 italic'>{commentPart}</span>
        </>
      )
    }

    return highlightCodePart(line)
  }

  const highlightCodePart = (text) => {
    const words = text.split(/(\s+)/)

    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) {
        return <span key={idx}>{word}</span>
      }

      const keywords = ['void', 'int', 'bool', 'vector', 'for', 'while', 'if', 'else', 'return', 'swap', 'break', 'continue', 'struct', 'const', 'auto']
      const literals = ['true', 'false', 'nullptr']

      if (keywords.includes(word)) {
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
            {word}
          </span>
        )
      }

      if (literals.includes(word)) {
        return (
          <span
            key={idx}
            className='text-red-400 font-bold'>
            {word}
          </span>
        )
      }

      if (/^\d+$/.test(word)) {
        return (
          <span
            key={idx}
            className='text-green-400'>
            {word}
          </span>
        )
      }

      return <span key={idx}>{word}</span>
    })
  }

  useEffect(() => {
    if (scrollRef.current && activeLine > 0) {
      const container = scrollRef.current
      const el = container.children[activeLine - 1]
      if (el && container) {
        const containerRect = container.getBoundingClientRect()
        const elRect = el.getBoundingClientRect()

        const isAbove = elRect.top < containerRect.top
        const isBelow = elRect.bottom > containerRect.bottom

        if (isAbove || isBelow) {
          const scrollOffset = elRect.top - containerRect.top - containerRect.height / 2 + elRect.height / 2
          container.scrollBy({ top: scrollOffset, behavior: 'smooth' })
        }
      }
    }
  }, [activeLine])

  return (
    <div className='bg-[#1e1e1e] rounded-lg border border-slate-700 overflow-hidden flex flex-col h-full shadow-inner'>
      <div className='flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-slate-700'>
        <span className='text-xs text-slate-400 font-bold flex items-center gap-2'>
          <Code size={14} /> C++ CODE
        </span>
        <span className='text-[10px] text-slate-500 uppercase tracking-widest'>CPP</span>
      </div>
      <div
        className='flex-1 p-4 font-mono text-sm leading-6 overflow-auto'
        ref={scrollRef}>
        {lines.map((line, idx) => {
          const lineNum = idx + 1
          const isActive = activeLine === lineNum

          return (
            <div
              key={idx}
              className={`flex ${isActive ? 'bg-slate-700/50 -mx-4 px-4 border-l-2 border-orange-500' : ''}`}>
              <span className='w-8 text-slate-600 text-right mr-4 select-none shrink-0'>{lineNum}</span>
              <span className={`whitespace-pre ${isActive ? 'text-orange-100' : 'text-slate-300'}`}>{highlightSyntax(line)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// 3. MAIN LOGIC
// ==========================================

const GraphAlgo = () => {
  const [algorithm, setAlgorithm] = useState('bfs')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Select appropriate graph based on algorithm
  const getGraphType = (algo) => {
    if (['topologicalSort'].includes(algo)) return 'dag'
    if (['bfs', 'dfs'].includes(algo)) return 'unweighted'
    return 'weighted'
  }

  const currentGraph = SAMPLE_GRAPHS[getGraphType(algorithm)]

  // --- ALGORITHM GENERATORS ---

  const snapshot = (visitedNodes, activeNodes, selectedEdges, distances, queue, stack, line, desc) => ({
    visitedNodes: [...visitedNodes],
    activeNodes: [...activeNodes],
    selectedEdges: [...selectedEdges],
    distances: { ...distances },
    queue: [...queue],
    stack: [...stack],
    activeLine: line,
    description: desc,
  })

  const generateSteps = (graph, algo) => {
    const { nodes, edges } = graph
    let s = []

    s.push(snapshot([], [], [], {}, [], [], 1, 'Mulai algoritma'))

    if (algo === 'bfs') {
      // BFS Implementation
      const visited = new Set()
      const distances = {}
      const queue = []
      const source = 0

      // Initialize
      nodes.forEach((node) => {
        distances[node.id] = Infinity
      })
      distances[source] = 0

      visited.add(source)
      queue.push(source)
      s.push(snapshot([source], [source], [], distances, queue, [], 8, `Mulai dari node ${source}, tambahkan ke queue`))

      // Build adjacency list
      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach((e) => {
        adj[e.from].push(e.to)
        adj[e.to].push(e.from) // undirected
      })

      while (queue.length > 0) {
        const current = queue.shift()
        s.push(snapshot(Array.from(visited), [current], [], distances, queue, [], 12, `Dequeue node ${current}`))

        for (const neighbor of adj[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            distances[neighbor] = distances[current] + 1
            queue.push(neighbor)

            s.push(snapshot(Array.from(visited), [current, neighbor], [{ from: current, to: neighbor }], distances, queue, [], 16, `Kunjungi neighbor ${neighbor}, distance=${distances[neighbor]}`))
          }
        }
      }
    } else if (algo === 'dfs') {
      // DFS Implementation
      const visited = new Set()
      const stack = []
      const source = 0

      stack.push(source)
      s.push(snapshot([], [source], [], {}, [], stack, 7, `Mulai dari node ${source}, push ke stack`))

      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach((e) => {
        adj[e.from].push(e.to)
        adj[e.to].push(e.from)
      })

      while (stack.length > 0) {
        const current = stack.pop()
        s.push(snapshot(Array.from(visited), [current], [], {}, [], stack, 10, `Pop node ${current} dari stack`))

        if (!visited.has(current)) {
          visited.add(current)
          s.push(snapshot(Array.from(visited), [current], [], {}, [], stack, 13, `Tandai node ${current} sebagai visited`))

          for (const neighbor of adj[current]) {
            if (!visited.has(neighbor)) {
              stack.push(neighbor)
              s.push(snapshot(Array.from(visited), [current, neighbor], [{ from: current, to: neighbor }], {}, [], stack, 17, `Push neighbor ${neighbor} ke stack`))
            }
          }
        }
      }
    } else if (algo === 'dijkstra') {
      // Dijkstra's Algorithm
      const dist = {}
      const visited = new Set()
      const source = 0

      nodes.forEach((node) => {
        dist[node.id] = Infinity
      })
      dist[source] = 0

      s.push(snapshot([], [source], [], dist, [], [], 9, `Set distance[${source}] = 0`))

      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach((e) => {
        adj[e.from].push({ to: e.to, weight: e.weight })
        adj[e.to].push({ to: e.from, weight: e.weight })
      })

      for (let i = 0; i < nodes.length; i++) {
        let minDist = Infinity
        let u = -1

        nodes.forEach((node) => {
          if (!visited.has(node.id) && dist[node.id] < minDist) {
            minDist = dist[node.id]
            u = node.id
          }
        })

        if (u === -1) break

        visited.add(u)
        s.push(snapshot(Array.from(visited), [u], [], dist, [], [], 13, `Pilih node ${u} dengan distance terkecil = ${dist[u]}`))

        for (const { to: v, weight } of adj[u]) {
          const newDist = dist[u] + weight
          if (newDist < dist[v]) {
            dist[v] = newDist
            s.push(snapshot(Array.from(visited), [u, v], [{ from: u, to: v }], dist, [], [], 18, `Relax edge (${u},${v}): dist[${v}] = ${newDist}`))
          }
        }
      }
    } else if (algo === 'bellmanFord') {
      // Bellman-Ford Algorithm
      const dist = {}
      const source = 0
      const V = nodes.length

      nodes.forEach((node) => {
        dist[node.id] = Infinity
      })
      dist[source] = 0

      s.push(snapshot([], [source], [], dist, [], [], 6, `Set distance[${source}] = 0`))

      // Relax edges V-1 times
      for (let i = 0; i < V - 1; i++) {
        s.push(snapshot([], [], [], dist, [], [], 9, `Iterasi ${i + 1}: Relax semua edges`))

        for (const edge of edges) {
          const { from: u, to: v, weight } = edge
          if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
            dist[v] = dist[u] + weight
            s.push(snapshot([], [u, v], [{ from: u, to: v }], dist, [], [], 11, `Relax (${u},${v}): dist[${v}] = ${dist[v]}`))
          }
        }
      }

      s.push(
        snapshot(
          Array.from({ length: V }, (_, i) => i),
          [],
          [],
          dist,
          [],
          [],
          17,
          'Bellman-Ford selesai, tidak ada negative cycle'
        )
      )
    } else if (algo === 'floydWarshall') {
      // Floyd-Warshall Algorithm
      const V = nodes.length
      const dist = {}

      // Initialize distance matrix
      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          const key = `${i},${j}`
          if (i === j) {
            dist[key] = 0
          } else {
            dist[key] = Infinity
          }
        }
      }

      edges.forEach((edge) => {
        dist[`${edge.from},${edge.to}`] = edge.weight
        dist[`${edge.to},${edge.from}`] = edge.weight
      })

      s.push(snapshot([], [], [], {}, [], [], 7, 'Initialize distance matrix'))

      // Floyd-Warshall
      for (let k = 0; k < V; k++) {
        s.push(snapshot([], [k], [], {}, [], [], 19, `Intermediate node k=${k}`))

        for (let i = 0; i < V; i++) {
          for (let j = 0; j < V; j++) {
            const ikKey = `${i},${k}`
            const kjKey = `${k},${j}`
            const ijKey = `${i},${j}`

            if (dist[ikKey] + dist[kjKey] < dist[ijKey]) {
              dist[ijKey] = dist[ikKey] + dist[kjKey]
              s.push(
                snapshot(
                  [],
                  [i, j, k],
                  [
                    { from: i, to: k },
                    { from: k, to: j },
                  ],
                  {},
                  [],
                  [],
                  23,
                  `Update dist[${i}][${j}] = ${dist[ijKey]} via ${k}`
                )
              )
            }
          }
        }
      }
    } else if (algo === 'kruskal') {
      // Kruskal's Algorithm
      const parent = {}
      const mst = []
      nodes.forEach((n) => (parent[n.id] = n.id))

      const find = (x) => {
        if (parent[x] !== x) {
          parent[x] = find(parent[x])
        }
        return parent[x]
      }

      const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight)

      s.push(snapshot([], [], [], {}, [], [], 4, 'Initialize parent array'))

      for (const edge of sortedEdges) {
        const { from: u, to: v, weight } = edge
        const rootU = find(u)
        const rootV = find(v)

        s.push(snapshot([], [u, v], [], {}, [], [], 9, `Check edge (${u},${v}) weight=${weight}`))

        if (rootU !== rootV) {
          mst.push({ from: u, to: v })
          parent[rootU] = rootV
          s.push(snapshot([], [u, v], mst, {}, [], [], 12, `Add edge (${u},${v}) to MST`))
        } else {
          s.push(snapshot([], [u, v], mst, {}, [], [], 11, `Skip edge (${u},${v}) - forms cycle`))
        }
      }
    } else if (algo === 'prim') {
      // Prim's Algorithm
      const visited = new Set()
      const key = {}
      const mst = []
      const start = 0

      nodes.forEach((n) => (key[n.id] = Infinity))
      key[start] = 0

      s.push(snapshot([], [start], [], key, [], [], 9, `Start from node ${start}`))

      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach((e) => {
        adj[e.from].push({ to: e.to, weight: e.weight })
        adj[e.to].push({ to: e.from, weight: e.weight })
      })

      for (let i = 0; i < nodes.length; i++) {
        let minKey = Infinity
        let u = -1

        nodes.forEach((node) => {
          if (!visited.has(node.id) && key[node.id] < minKey) {
            minKey = key[node.id]
            u = node.id
          }
        })

        if (u === -1) break

        visited.add(u)
        s.push(snapshot(Array.from(visited), [u], mst, key, [], [], 14, `Add node ${u} to MST`))

        for (const { to: v, weight } of adj[u]) {
          if (!visited.has(v) && weight < key[v]) {
            key[v] = weight
            mst.push({ from: u, to: v })
            s.push(snapshot(Array.from(visited), [u, v], mst, key, [], [], 20, `Update key[${v}] = ${weight}, add edge (${u},${v})`))
          }
        }
      }
    } else if (algo === 'topologicalSort') {
      // Topological Sort using DFS
      const visited = new Set()
      const stack = []
      const result = []

      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach((e) => {
        adj[e.from].push(e.to) // directed
      })

      const dfsUtil = (v) => {
        visited.add(v)
        s.push(snapshot(Array.from(visited), [v], [], {}, [], stack, 12, `Visit node ${v}`))

        for (const neighbor of adj[v]) {
          if (!visited.has(neighbor)) {
            s.push(snapshot(Array.from(visited), [v, neighbor], [{ from: v, to: neighbor }], {}, [], stack, 15, `Recurse to neighbor ${neighbor}`))
            dfsUtil(neighbor)
          }
        }

        stack.push(v)
        s.push(snapshot(Array.from(visited), [v], [], {}, [], stack, 19, `Push node ${v} to stack`))
      }

      for (const node of nodes) {
        if (!visited.has(node.id)) {
          s.push(snapshot(Array.from(visited), [node.id], [], {}, [], stack, 9, `Start DFS from node ${node.id}`))
          dfsUtil(node.id)
        }
      }

      while (stack.length > 0) {
        result.push(stack.pop())
      }

      s.push(snapshot(Array.from(visited), [], [], {}, [], [], 24, `Topological order: ${result.join(' → ')}`))
    }

    s.push(
      snapshot(
        Array.from({ length: nodes.length }, (_, i) => i),
        [],
        [],
        {},
        [],
        [],
        -1,
        'Algoritma selesai'
      )
    )

    return s
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generated = generateSteps(currentGraph, algorithm)
    setSteps(generated)
  }

  useEffect(() => {
    reset()
  }, [algorithm])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 800)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps])

  const currentVisual = steps[currentStep] || {
    visitedNodes: [],
    activeNodes: [],
    selectedEdges: [],
    distances: {},
    queue: [],
    stack: [],
    activeLine: 0,
    description: 'Loading...',
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  // ==========================================
  // 4. RENDER
  // ==========================================
  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Network
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOGRAPH<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Algoritma Graf</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='bfs'>BFS</option>
              <option value='dfs'>DFS</option>
              <option value='dijkstra'>Dijkstra</option>
              <option value='bellmanFord'>Bellman-Ford</option>
              <option value='floydWarshall'>Floyd-Warshall</option>
              <option value='kruskal'>Kruskal MST</option>
              <option value='prim'>Prim MST</option>
              <option value='topologicalSort'>Topological Sort</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={reset}
            className='p-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors'
            title='Reset'>
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* TOP INFO CARD */}
      <div className='p-6 border-b border-slate-700 bg-[#151925]'>
        <h2 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-2'>{ALGO_INFO[algorithm].title}</h2>
        <p className='text-sm text-slate-400 leading-relaxed max-w-2xl'>{ALGO_INFO[algorithm].description}</p>

        <div className='flex gap-4 mt-4'>
          <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <Activity
              size={12}
              className='text-orange-400'
            />
            Time: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
          </div>
          <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <GitBranch
              size={12}
              className='text-blue-400'
            />
            Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
          </div>
        </div>

        {/* STATIC PSEUDOCODE SECTION */}
        <div className='mt-4 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden'>
          <div className='px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2'>
            <MessageSquare
              size={12}
              className='text-slate-400'
            />
            <span className='text-xs text-slate-400 font-bold'>PSEUDOCODE</span>
          </div>
          <div className='p-4 max-h-64 overflow-auto'>
            <pre className='text-xs text-slate-300 font-mono whitespace-pre leading-relaxed'>{PSEUDOCODE[algorithm]}</pre>
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <main className='flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0'>
        {/* LEFT COLUMN: VISUALS (5/12) */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          {/* GRAPH VISUALIZATION */}
          <GraphVisualization
            graph={currentGraph}
            step={currentVisual}
          />

          {/* PLAYBACK CONTROLS */}
          <div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-3'>
            <div className='flex items-center justify-between gap-4 mb-2'>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className='p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all'>
                <StepBack size={16} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className='flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-lg shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95'>
                {isPlaying ? (
                  <>
                    <Pause size={18} /> PAUSE
                  </>
                ) : (
                  <>
                    <Play size={18} /> MULAI ANIMASI
                  </>
                )}
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className='p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all'>
                <StepForward size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className='w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2'>
              <div
                className='h-full bg-orange-500 transition-all duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className='flex justify-between mt-1 text-[10px] text-slate-400'>
              <span>Langkah {currentStep}</span>
              <span>{percentage}% Selesai</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO & CODE (7/12) */}
        <div className='lg:col-span-7 bg-[#1e1e1e] flex flex-col border-l border-slate-800'>
          {/* C++ CODE PANEL */}
          <div className='p-4 bg-[#252526]'>
            <CodeViewer
              code={ALGO_CPLUSPLUS[algorithm]}
              activeLine={currentVisual.activeLine}
            />
          </div>

          {/* CURRENT ACTION INDICATOR */}
          <div className='p-6 border-b border-slate-800 bg-slate-900/50'>
            <div className='bg-slate-900 border border-orange-500/50 p-4 rounded-xl shadow-lg border-l-4 border-l-orange-500 flex items-start gap-4'>
              <div className='p-2 bg-orange-900/30 rounded-lg shrink-0'>
                <MessageSquare
                  size={16}
                  className='text-orange-400'
                />
              </div>
              <div>
                <h4 className='text-[10px] font-bold text-orange-400 uppercase mb-1'>Status Eksekusi</h4>
                <p className='text-sm font-medium text-white leading-tight'>{currentVisual.description}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default GraphAlgo
