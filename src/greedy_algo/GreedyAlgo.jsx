import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Coins, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Zap } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  activitySelection: `FUNCTION ActivitySelection(activities: Array, n: Integer)
  // Sort by finish time
  Sort(activities by finish_time)
  
  DECLARE selected: List
  selected.add(activities[0])
  lastFinish <- activities[0].finish
  
  FOR i FROM 1 TO n-1 DO
    IF activities[i].start >= lastFinish THEN
      selected.add(activities[i])
      lastFinish <- activities[i].finish
    END IF
  END FOR
  
  RETURN selected
END FUNCTION`,

  huffmanCoding: `STRUCTURE HuffmanNode
  char: Character
  freq: Integer
  left: HuffmanNode
  right: HuffmanNode
END STRUCTURE

FUNCTION BuildHuffmanTree(chars: Array, freq: Array, n: Integer)
  DECLARE minHeap: PriorityQueue
  
  // Create leaf nodes
  FOR i FROM 0 TO n-1 DO
    node <- new HuffmanNode(chars[i], freq[i])
    minHeap.insert(node)
  END FOR
  
  // Build tree bottom-up
  WHILE minHeap.size() > 1 DO
    left <- minHeap.extractMin()
    right <- minHeap.extractMin()
    
    internal <- new HuffmanNode('$', left.freq + right.freq)
    internal.left <- left
    internal.right <- right
    
    minHeap.insert(internal)
  END WHILE
  
  RETURN minHeap.extractMin()
END FUNCTION

PROCEDURE PrintCodes(root: HuffmanNode, code: String)
  IF root.left == NULL AND root.right == NULL THEN
    PRINT root.char + ": " + code
    RETURN
  END IF
  
  PrintCodes(root.left, code + "0")
  PrintCodes(root.right, code + "1")
END PROCEDURE`,

  coinChangeGreedy: `FUNCTION CoinChangeGreedy(coins: Array, amount: Integer)
  // Sort coins in descending order
  Sort(coins in descending order)
  
  DECLARE result: List
  remaining <- amount
  
  FOR each coin IN coins DO
    WHILE remaining >= coin DO
      result.add(coin)
      remaining <- remaining - coin
    END WHILE
    
    IF remaining == 0 THEN
      BREAK
    END IF
  END FOR
  
  IF remaining > 0 THEN
    RETURN "No solution"
  ELSE
    RETURN result
  END IF
END FUNCTION`,

  kruskalGreedy: `STRUCTURE DisjointSet
  parent: Array
  rank: Array
END STRUCTURE

FUNCTION Find(ds: DisjointSet, i: Integer)
  IF ds.parent[i] != i THEN
    ds.parent[i] <- Find(ds, ds.parent[i])
  END IF
  RETURN ds.parent[i]
END FUNCTION

PROCEDURE Union(ds: DisjointSet, x: Integer, y: Integer)
  xroot <- Find(ds, x)
  yroot <- Find(ds, y)
  
  IF ds.rank[xroot] < ds.rank[yroot] THEN
    ds.parent[xroot] <- yroot
  ELSE IF ds.rank[xroot] > ds.rank[yroot] THEN
    ds.parent[yroot] <- xroot
  ELSE
    ds.parent[yroot] <- xroot
    ds.rank[xroot] <- ds.rank[xroot] + 1
  END IF
END PROCEDURE

FUNCTION KruskalMST(edges: Array, V: Integer, E: Integer)
  // Sort edges by weight
  Sort(edges by weight)
  
  DECLARE result: List
  DECLARE ds: DisjointSet(V)
  
  FOR each edge IN edges DO
    x <- Find(ds, edge.src)
    y <- Find(ds, edge.dest)
    
    IF x != y THEN
      result.add(edge)
      Union(ds, x, y)
    END IF
    
    IF result.size() == V-1 THEN
      BREAK
    END IF
  END FOR
  
  RETURN result
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  activitySelection: `struct Activity {
  int start, finish;
};

bool compareActivity(Activity a, Activity b) {
  return a.finish < b.finish;
}

void activitySelection(Activity arr[], int n) {
  sort(arr, arr + n, compareActivity);
  
  cout << "Selected activities: ";
  int i = 0;
  cout << "(" << arr[i].start << ", " << arr[i].finish << ") ";
  
  for (int j = 1; j < n; j++) {
    if (arr[j].start >= arr[i].finish) {
      cout << "(" << arr[j].start << ", " << arr[j].finish << ") ";
      i = j;
    }
  }
}`,

  huffmanCoding: `struct HuffmanNode {
  char data;
  int freq;
  HuffmanNode *left, *right;
  
  HuffmanNode(char d, int f) {
    data = d;
    freq = f;
    left = right = nullptr;
  }
};

struct Compare {
  bool operator()(HuffmanNode* l, HuffmanNode* r) {
    return l->freq > r->freq;
  }
};

HuffmanNode* buildHuffmanTree(char data[], int freq[], int n) {
  priority_queue<HuffmanNode*, vector<HuffmanNode*>, Compare> minHeap;
  
  for (int i = 0; i < n; i++)
    minHeap.push(new HuffmanNode(data[i], freq[i]));
  
  while (minHeap.size() > 1) {
    HuffmanNode *left = minHeap.top();
    minHeap.pop();
    
    HuffmanNode *right = minHeap.top();
    minHeap.pop();
    
    HuffmanNode *top = new HuffmanNode('$', left->freq + right->freq);
    top->left = left;
    top->right = right;
    
    minHeap.push(top);
  }
  
  return minHeap.top();
}

void printCodes(HuffmanNode* root, string code) {
  if (!root) return;
  
  if (root->data != '$')
    cout << root->data << ": " << code << endl;
  
  printCodes(root->left, code + "0");
  printCodes(root->right, code + "1");
}`,

  coinChangeGreedy: `int coinChangeGreedy(vector<int>& coins, int amount) {
  sort(coins.rbegin(), coins.rend());
  
  int count = 0;
  int remaining = amount;
  
  for (int coin : coins) {
    while (remaining >= coin) {
      remaining -= coin;
      count++;
      cout << coin << " ";
    }
    
    if (remaining == 0)
      break;
  }
  
  if (remaining > 0) {
    cout << "No solution" << endl;
    return -1;
  }
  
  return count;
}`,

  kruskalGreedy: `struct Edge {
  int src, dest, weight;
};

bool compareEdge(Edge a, Edge b) {
  return a.weight < b.weight;
}

int find(int parent[], int i) {
  if (parent[i] != i)
    parent[i] = find(parent, parent[i]);
  return parent[i];
}

void unionSet(int parent[], int rank[], int x, int y) {
  int xroot = find(parent, x);
  int yroot = find(parent, y);
  
  if (rank[xroot] < rank[yroot])
    parent[xroot] = yroot;
  else if (rank[xroot] > rank[yroot])
    parent[yroot] = xroot;
  else {
    parent[yroot] = xroot;
    rank[xroot]++;
  }
}

void kruskalMST(Edge edges[], int V, int E) {
  sort(edges, edges + E, compareEdge);
  
  int parent[V], rank[V];
  for (int i = 0; i < V; i++) {
    parent[i] = i;
    rank[i] = 0;
  }
  
  Edge result[V];
  int e = 0, i = 0;
  
  while (e < V - 1 && i < E) {
    Edge next = edges[i++];
    
    int x = find(parent, next.src);
    int y = find(parent, next.dest);
    
    if (x != y) {
      result[e++] = next;
      unionSet(parent, rank, x, y);
    }
  }
  
  cout << "MST edges:" << endl;
  for (i = 0; i < e; i++)
    cout << result[i].src << " -- " << result[i].dest 
         << " == " << result[i].weight << endl;
}`,
}

const ALGO_INFO = {
  activitySelection: {
    title: 'ACTIVITY SELECTION',
    description: 'Memilih jumlah maksimum aktivitas yang tidak saling tumpang-tindih dari himpunan aktivitas dengan waktu mulai dan selesai.',
    complexity: 'O(n log n)',
    useCase: 'Scheduling, resource allocation, time management',
  },
  huffmanCoding: {
    title: 'HUFFMAN CODING',
    description: 'Algoritma kompresi lossless yang membuat prefix code optimal berdasarkan frekuensi karakter.',
    complexity: 'O(n log n)',
    useCase: 'Data compression (ZIP, JPEG, MP3), encoding',
  },
  coinChangeGreedy: {
    title: 'COIN CHANGE (GREEDY)',
    description: 'Menemukan jumlah koin minimum untuk nilai tertentu (hanya bekerja untuk sistem koin tertentu seperti USD).',
    complexity: 'O(n log n) sorting + O(n)',
    useCase: 'Vending machines, cashier systems (jika sistem koin optimal)',
  },
  kruskalGreedy: {
    title: 'KRUSKAL (GREEDY)',
    description: 'Contoh algoritma greedy untuk MST dengan selalu memilih edge terkecil yang tidak membentuk cycle.',
    complexity: 'O(E log E)',
    useCase: 'Network design, clustering, infrastructure planning',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const GreedyVisualization = ({ data, title = 'Greedy Visualization', type = 'activities' }) => {
  if (!data || data.length === 0) return null

  const renderActivities = () => {
    return (
      <div className='space-y-2'>
        {data.map((activity, idx) => {
          const isSelected = activity.selected
          const isCurrent = activity.current

          let bgColor = 'bg-slate-800'
          let borderColor = 'border-slate-700'
          let textColor = 'text-slate-300'

          if (isCurrent) {
            bgColor = 'bg-yellow-500/30'
            borderColor = 'border-yellow-400 border-2'
            textColor = 'text-yellow-200'
          } else if (isSelected) {
            bgColor = 'bg-emerald-500/30'
            borderColor = 'border-emerald-500'
            textColor = 'text-emerald-300'
          }

          return (
            <div
              key={idx}
              className={`${bgColor} border ${borderColor} rounded-lg p-3 transition-all duration-300`}>
              <div className='flex justify-between items-center'>
                <span className={`font-mono text-sm ${textColor} font-bold`}>Activity {activity.id}</span>
                <span className={`text-xs ${textColor}`}>
                  Start: {activity.start} | Finish: {activity.finish}
                </span>
              </div>
              {/* Timeline visualization */}
              <div className='mt-2 h-4 bg-slate-700 rounded-full overflow-hidden relative'>
                <div
                  className={`h-full ${isSelected ? 'bg-emerald-500' : isCurrent ? 'bg-yellow-500' : 'bg-slate-600'} transition-all`}
                  style={{
                    marginLeft: `${(activity.start / 24) * 100}%`,
                    width: `${((activity.finish - activity.start) / 24) * 100}%`,
                  }}></div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderCoins = () => {
    return (
      <div className='flex flex-wrap gap-3 justify-center'>
        {data.map((item, idx) => {
          const isUsed = item.used
          const isCurrent = item.current

          let bgColor = isUsed ? 'bg-emerald-500/30' : isCurrent ? 'bg-yellow-500/30' : 'bg-slate-800'
          let borderColor = isUsed ? 'border-emerald-500' : isCurrent ? 'border-yellow-400 border-2' : 'border-slate-700'

          return (
            <div
              key={idx}
              className={`${bgColor} border ${borderColor} rounded-full w-16 h-16 flex items-center justify-center transition-all duration-300`}>
              <span className='text-lg font-bold text-white'>{item.value}</span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTree = () => {
    return (
      <div className='flex flex-wrap gap-2'>
        {data.map((node, idx) => {
          const isSelected = node.selected
          const isCurrent = node.current

          let bgColor = isSelected ? 'bg-emerald-500/30' : isCurrent ? 'bg-yellow-500/30' : 'bg-slate-800'
          let borderColor = isSelected ? 'border-emerald-500' : isCurrent ? 'border-yellow-400' : 'border-slate-700'

          return (
            <div
              key={idx}
              className={`${bgColor} border ${borderColor} rounded-lg p-3 transition-all duration-300`}>
              <div className='text-xs text-slate-400'>{node.char || `Node ${idx}`}</div>
              <div className='text-lg font-bold text-white font-mono'>{node.freq || node.weight}</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Zap size={14} /> {title}
        </h3>
        <div className='flex gap-2'>
          {['SELECTED', 'CURRENT', 'PENDING'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'SELECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : label === 'CURRENT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='overflow-auto max-h-[400px]'>
        {type === 'activities' && renderActivities()}
        {type === 'coins' && renderCoins()}
        {(type === 'huffman' || type === 'kruskal') && renderTree()}
      </div>
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
    // Split by word boundaries but preserve operators and symbols
    const tokens = text.split(/(\s+|[(){}\[\];,&<>*=+\-!|])/)

    return tokens.map((token, idx) => {
      // Skip whitespace and empty
      if (!token || /^\s+$/.test(token)) {
        return <span key={idx}>{token}</span>
      }

      // C++ Keywords (kontrol alur)
      const keywords = ['void', 'int', 'bool', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'for', 'while', 'do', 'if', 'else', 'switch', 'case', 'default', 'return', 'break', 'continue', 'goto', 'true', 'false', 'nullptr', 'NULL', 'const', 'static', 'auto', 'this', 'class', 'struct', 'enum', 'typedef', 'public', 'private', 'protected', 'virtual', 'override', 'final']

      // C++ Types and STL
      const types = ['vector', 'string', 'map', 'set', 'queue', 'stack', 'pair', 'array', 'priority_queue']

      if (keywords.includes(token)) {
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
            {token}
          </span>
        )
      }

      if (types.includes(token)) {
        return (
          <span
            key={idx}
            className='text-cyan-400 font-semibold'>
            {token}
          </span>
        )
      }

      // Numbers
      if (/^\d+$/.test(token)) {
        return (
          <span
            key={idx}
            className='text-green-400'>
            {token}
          </span>
        )
      }

      // Operators
      if (/^[(){}\[\];,&<>*=+\-!|]+$/.test(token)) {
        return (
          <span
            key={idx}
            className='text-yellow-400'>
            {token}
          </span>
        )
      }

      // Function names (word followed by parenthesis)
      if (idx + 1 < tokens.length && tokens[idx + 1] === '(') {
        return (
          <span
            key={idx}
            className='text-blue-300'>
            {token}
          </span>
        )
      }

      return <span key={idx}>{token}</span>
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

const GreedyAlgo = () => {
  const [algorithm, setAlgorithm] = useState('activitySelection')
  const [amount, setAmount] = useState(63)
  const [activityCount, setActivityCount] = useState(6)
  const [huffmanInput, setHuffmanInput] = useState('MISSISSIPPI')
  const [kruskalNodes, setKruskalNodes] = useState(5)
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const snapshot = (data, line, desc, type = 'activities') => ({
    data: JSON.parse(JSON.stringify(data)),
    activeLine: line,
    description: desc,
    type,
  })

  // --- GENERATORS ---
  const generateActivities = (n) => {
    const acts = []
    for (let i = 0; i < n; i++) {
      const start = Math.floor(Math.random() * 20)
      const duration = Math.floor(Math.random() * 6) + 1
      acts.push({
        id: i + 1,
        start,
        finish: start + duration,
        selected: false,
        current: false,
      })
    }
    return acts
  }

  const generateFrequencies = (text) => {
    const freqMap = {}
    for (let char of text) {
      freqMap[char] = (freqMap[char] || 0) + 1
    }
    return Object.entries(freqMap).map(([char, freq]) => ({
      char,
      freq,
      selected: false,
      current: false,
    }))
  }

  const generateGraph = (v) => {
    const edges = []
    // Ensure connectivity by spanning tree first
    for (let i = 1; i < v; i++) {
      const parent = Math.floor(Math.random() * i)
      edges.push({
        src: parent,
        dest: i,
        weight: Math.floor(Math.random() * 15) + 1,
        selected: false,
        current: false,
      })
    }
    // Add random edges
    const extraEdges = Math.floor(v * 1.5)
    for (let i = 0; i < extraEdges; i++) {
      const src = Math.floor(Math.random() * v)
      let dest = Math.floor(Math.random() * v)
      while (src === dest) dest = Math.floor(Math.random() * v)

      // Avoid duplicates (simplified)
      if (!edges.some((e) => (e.src === src && e.dest === dest) || (e.src === dest && e.dest === src))) {
        edges.push({
          src: Math.min(src, dest),
          dest: Math.max(src, dest),
          weight: Math.floor(Math.random() * 15) + 1,
          selected: false,
          current: false,
        })
      }
    }
    return edges
  }

  const generateSteps = (algo) => {
    let s = []

    if (algo === 'activitySelection') {
      const activities = generateActivities(activityCount)

      // Sort by finish time
      activities.sort((a, b) => a.finish - b.finish)

      s.push(snapshot(activities, 9, 'Mulai Activity Selection', 'activities'))
      s.push(snapshot(activities, 10, 'Sort aktivitas berdasarkan waktu selesai', 'activities'))

      // Select first activity
      activities[0].selected = true
      activities[0].current = true
      let lastFinish = activities[0].finish
      s.push(snapshot(activities, 13, `Pilih aktivitas ${activities[0].id} (finish: ${lastFinish})`, 'activities'))

      activities[0].current = false

      for (let i = 1; i < activities.length; i++) {
        activities[i].current = true
        s.push(snapshot(activities, 17, `Cek aktivitas ${activities[i].id}: start=${activities[i].start}, lastFinish=${lastFinish}`, 'activities'))

        if (activities[i].start >= lastFinish) {
          activities[i].selected = true
          lastFinish = activities[i].finish
          s.push(snapshot(activities, 18, `✓ Pilih aktivitas ${activities[i].id} (tidak overlap)`, 'activities'))
        } else {
          s.push(snapshot(activities, 17, `✗ Skip aktivitas ${activities[i].id} (overlap)`, 'activities'))
        }

        activities[i].current = false
      }

      const selected = activities.filter((a) => a.selected)
      s.push(snapshot(activities, 22, `Selesai! Total ${selected.length} aktivitas dipilih`, 'activities'))
    } else if (algo === 'coinChangeGreedy') {
      const coins = [
        { value: 25, used: false, current: false },
        { value: 10, used: false, current: false },
        { value: 5, used: false, current: false },
        { value: 1, used: false, current: false },
      ]

      let remaining = amount
      const result = []

      s.push(snapshot(coins, 1, `Mulai Coin Change untuk amount=${amount}`, 'coins'))

      for (let i = 0; i < coins.length; i++) {
        coins[i].current = true

        while (remaining >= coins[i].value) {
          const newCoin = { ...coins[i], used: true, current: false }
          result.push(newCoin)
          remaining -= coins[i].value
          s.push(snapshot([...coins, ...result], 9, `Gunakan koin ${coins[i].value}, remaining=${remaining}`, 'coins'))
        }

        coins[i].current = false

        if (remaining === 0) {
          s.push(snapshot([...coins, ...result], 13, `Selesai! Total ${result.length} koin digunakan`, 'coins'))
          break
        }
      }

      if (remaining > 0) {
        s.push(snapshot([...coins, ...result], 17, `Tidak bisa menyelesaikan dengan koin yang ada`, 'coins'))
      }
    } else if (algo === 'huffmanCoding') {
      const chars = generateFrequencies(huffmanInput)

      s.push(snapshot(chars, 1, 'Mulai Huffman Coding', 'huffman'))
      s.push(snapshot(chars, 7, 'Build min-heap berdasarkan frekuensi', 'huffman'))

      // Simulate building tree
      chars.sort((a, b) => a.freq - b.freq)

      for (let i = 0; i < chars.length - 1; i++) {
        chars[i].current = true
        chars[i + 1].current = true
        s.push(snapshot(chars, 14, `Ambil 2 node terkecil: ${chars[i].char}(${chars[i].freq}), ${chars[i + 1].char}(${chars[i + 1].freq})`, 'huffman'))

        chars[i].selected = true
        chars[i + 1].selected = true
        chars[i].current = false
        chars[i + 1].current = false
        s.push(snapshot(chars, 18, `Gabungkan menjadi node internal`, 'huffman'))
      }

      s.push(snapshot(chars, 23, 'Huffman Tree selesai dibuat', 'huffman'))
    } else if (algo === 'kruskalGreedy') {
      const edges = generateGraph(kruskalNodes)

      edges.sort((a, b) => a.weight - b.weight)

      s.push(snapshot(edges, 1, 'Mulai Kruskal MST', 'kruskal'))
      s.push(snapshot(edges, 2, 'Sort edges berdasarkan weight', 'kruskal'))

      const parent = Array.from({ length: kruskalNodes }, (_, i) => i)
      let edgeCount = 0

      for (let i = 0; i < edges.length; i++) {
        edges[i].current = true
        s.push(snapshot(edges, 16, `Cek edge (${edges[i].src}-${edges[i].dest}) weight=${edges[i].weight}`, 'kruskal'))

        // Simple cycle check (simplified)
        const x = parent[edges[i].src]
        const y = parent[edges[i].dest]

        if (x !== y) {
          edges[i].selected = true
          edges[i].current = false
          edgeCount++
          // Union
          for (let j = 0; j < parent.length; j++) {
            if (parent[j] === y) parent[j] = x
          }
          s.push(snapshot(edges, 22, `✓ Tambahkan edge ke MST (tidak membentuk cycle)`, 'kruskal'))
        } else {
          edges[i].current = false
          s.push(snapshot(edges, 24, `✗ Skip edge (membentuk cycle)`, 'kruskal'))
        }

        if (edgeCount === 3) break
      }

      s.push(snapshot(edges, 30, `MST selesai! Total weight = ${edges.filter((e) => e.selected).reduce((sum, e) => sum + e.weight, 0)}`, 'kruskal'))
    }

    return s
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generated = generateSteps(algorithm)
    setSteps(generated)
  }

  useEffect(() => {
    reset()
  }, [algorithm, amount, activityCount, huffmanInput, kruskalNodes])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 700)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps])

  const currentVisual = steps[currentStep] || {
    data: [],
    activeLine: 0,
    description: 'Loading...',
    type: 'activities',
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Coins
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOGREEDY<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Greedy Algorithm</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='activitySelection'>Activity Selection</option>
              <option value='huffmanCoding'>Huffman Coding</option>
              <option value='coinChangeGreedy'>Coin Change</option>
              <option value='kruskalGreedy'>Kruskal MST</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>

          {algorithm === 'coinChangeGreedy' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>AMOUNT</label>
              <input
                type='number'
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className='w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                min='1'
                max='1000'
              />
            </>
          )}

          {algorithm === 'activitySelection' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>ACTIVITIES</label>
              <input
                type='number'
                value={activityCount}
                onChange={(e) => setActivityCount(parseInt(e.target.value) || 0)}
                className='w-16 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                min='3'
                max='12'
              />
            </>
          )}

          {algorithm === 'huffmanCoding' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>TEXT</label>
              <input
                type='text'
                value={huffmanInput}
                onChange={(e) => setHuffmanInput(e.target.value)}
                className='w-32 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                maxLength={20}
              />
            </>
          )}

          {algorithm === 'kruskalGreedy' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>NODES</label>
              <input
                type='number'
                value={kruskalNodes}
                onChange={(e) => setKruskalNodes(parseInt(e.target.value) || 0)}
                className='w-16 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                min='3'
                max='8'
              />
            </>
          )}
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
        {/* TWO COLUMN LAYOUT: INFO & PSEUDOCODE */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          {/* LEFT COLUMN: INFO */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-2'>{ALGO_INFO[algorithm].title}</h2>
            <p className='text-sm text-slate-400 leading-relaxed max-w-2xl'>{ALGO_INFO[algorithm].description}</p>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Activity
                  size={12}
                  className='text-orange-400'
                />
                Complexity: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
              </div>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Coins
                  size={12}
                  className='text-blue-400'
                />
                Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Pseudocode */}
          <div className='bg-slate-900 rounded-lg border border-slate-700 overflow-hidden'>
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
      </div>

      {/* MAIN BODY */}
      <main className='flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0'>
        {/* LEFT COLUMN */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          <GreedyVisualization
            data={currentVisual.data}
            title={ALGO_INFO[algorithm].title}
            type={currentVisual.type}
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

        {/* RIGHT COLUMN */}
        <div className='lg:col-span-7 bg-[#1e1e1e] flex flex-col border-l border-slate-800'>
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

          <div className='p-4 bg-[#252526]'>
            <CodeViewer
              code={ALGO_CPLUSPLUS[algorithm]}
              activeLine={currentVisual.activeLine}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default GreedyAlgo
