import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, GitBranch, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Binary } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  treeTraversal: `PROCEDURE InorderTraversal(node: TreeNode)
  IF node == NULL THEN RETURN
  InorderTraversal(node.left)
  Visit(node)
  InorderTraversal(node.right)
END PROCEDURE

PROCEDURE PreorderTraversal(node: TreeNode)
  IF node == NULL THEN RETURN
  Visit(node)
  PreorderTraversal(node.left)
  PreorderTraversal(node.right)
END PROCEDURE

PROCEDURE PostorderTraversal(node: TreeNode)
  IF node == NULL THEN RETURN
  PostorderTraversal(node.left)
  PostorderTraversal(node.right)
  Visit(node)
END PROCEDURE

PROCEDURE LevelOrderTraversal(root: TreeNode)
  DECLARE queue: Queue
  queue.enqueue(root)
  
  WHILE NOT queue.isEmpty() DO
    node <- queue.dequeue()
    Visit(node)
    IF node.left != NULL THEN queue.enqueue(node.left)
    IF node.right != NULL THEN queue.enqueue(node.right)
  END WHILE
END PROCEDURE`,

  avlTree: `FUNCTION GetHeight(node: TreeNode)
  IF node == NULL THEN RETURN 0
  RETURN node.height
END FUNCTION

FUNCTION GetBalance(node: TreeNode)
  IF node == NULL THEN RETURN 0
  RETURN GetHeight(node.left) - GetHeight(node.right)
END FUNCTION

FUNCTION RotateRight(y: TreeNode)
  x <- y.left
  T2 <- x.right
  
  x.right <- y
  y.left <- T2
  
  UpdateHeight(y)
  UpdateHeight(x)
  
  RETURN x
END FUNCTION

FUNCTION RotateLeft(x: TreeNode)
  y <- x.right
  T2 <- y.left
  
  y.left <- x
  x.right <- T2
  
  UpdateHeight(x)
  UpdateHeight(y)
  
  RETURN y
END FUNCTION

FUNCTION Insert(node: TreeNode, key: Integer)
  IF node == NULL THEN
    RETURN new TreeNode(key)
  END IF
  
  IF key < node.key THEN
    node.left <- Insert(node.left, key)
  ELSE IF key > node.key THEN
    node.right <- Insert(node.right, key)
  ELSE
    RETURN node
  END IF
  
  UpdateHeight(node)
  balance <- GetBalance(node)
  
  // Left-Left Case
  IF balance > 1 AND key < node.left.key THEN
    RETURN RotateRight(node)
  END IF
  
  // Right-Right Case
  IF balance < -1 AND key > node.right.key THEN
    RETURN RotateLeft(node)
  END IF
  
  // Left-Right Case
  IF balance > 1 AND key > node.left.key THEN
    node.left <- RotateLeft(node.left)
    RETURN RotateRight(node)
  END IF
  
  // Right-Left Case
  IF balance < -1 AND key < node.right.key THEN
    node.right <- RotateRight(node.right)
    RETURN RotateLeft(node)
  END IF
  
  RETURN node
END FUNCTION`,

  redBlackTree: `FUNCTION Insert(root: TreeNode, key: Integer)
  node <- BSTInsert(root, key)
  node.color <- RED
  
  WHILE node != root AND node.parent.color == RED DO
    IF node.parent == node.parent.parent.left THEN
      uncle <- node.parent.parent.right
      
      IF uncle.color == RED THEN
        node.parent.color <- BLACK
        uncle.color <- BLACK
        node.parent.parent.color <- RED
        node <- node.parent.parent
      ELSE
        IF node == node.parent.right THEN
          node <- node.parent
          RotateLeft(node)
        END IF
        node.parent.color <- BLACK
        node.parent.parent.color <- RED
        RotateRight(node.parent.parent)
      END IF
    ELSE
      // Mirror case
      uncle <- node.parent.parent.left
      
      IF uncle.color == RED THEN
        node.parent.color <- BLACK
        uncle.color <- BLACK
        node.parent.parent.color <- RED
        node <- node.parent.parent
      ELSE
        IF node == node.parent.left THEN
          node <- node.parent
          RotateRight(node)
        END IF
        node.parent.color <- BLACK
        node.parent.parent.color <- RED
        RotateLeft(node.parent.parent)
      END IF
    END IF
  END WHILE
  
  root.color <- BLACK
  RETURN root
END FUNCTION`,

  segmentTree: `PROCEDURE Build(tree: Array, arr: Array, node: Integer, start: Integer, end: Integer)
  IF start == end THEN
    tree[node] <- arr[start]
  ELSE
    mid <- (start + end) / 2
    Build(tree, arr, 2*node, start, mid)
    Build(tree, arr, 2*node+1, mid+1, end)
    tree[node] <- tree[2*node] + tree[2*node+1]
  END IF
END PROCEDURE

FUNCTION Query(tree: Array, node: Integer, start: Integer, end: Integer, L: Integer, R: Integer)
  IF start > R OR end < L THEN
    RETURN 0
  END IF
  
  IF start >= L AND end <= R THEN
    RETURN tree[node]
  END IF
  
  mid <- (start + end) / 2
  leftSum <- Query(tree, 2*node, start, mid, L, R)
  rightSum <- Query(tree, 2*node+1, mid+1, end, L, R)
  
  RETURN leftSum + rightSum
END FUNCTION

PROCEDURE Update(tree: Array, node: Integer, start: Integer, end: Integer, idx: Integer, value: Integer)
  IF start == end THEN
    tree[node] <- value
  ELSE
    mid <- (start + end) / 2
    IF idx <= mid THEN
      Update(tree, 2*node, start, mid, idx, value)
    ELSE
      Update(tree, 2*node+1, mid+1, end, idx, value)
    END IF
    tree[node] <- tree[2*node] + tree[2*node+1]
  END IF
END PROCEDURE`,

  fenwickTree: `PROCEDURE Update(BIT: Array, index: Integer, value: Integer, n: Integer)
  WHILE index <= n DO
    BIT[index] <- BIT[index] + value
    index <- index + (index & -index)
  END WHILE
END PROCEDURE

FUNCTION Query(BIT: Array, index: Integer)
  sum <- 0
  WHILE index > 0 DO
    sum <- sum + BIT[index]
    index <- index - (index & -index)
  END WHILE
  RETURN sum
END FUNCTION

FUNCTION RangeQuery(BIT: Array, left: Integer, right: Integer)
  RETURN Query(BIT, right) - Query(BIT, left - 1)
END FUNCTION

PROCEDURE Build(BIT: Array, arr: Array, n: Integer)
  FOR i FROM 1 TO n DO
    Update(BIT, i, arr[i], n)
  END FOR
END PROCEDURE`,

  trie: `STRUCTURE TrieNode
  children: Array[26] of TrieNode
  isEndOfWord: Boolean
END STRUCTURE

PROCEDURE Insert(root: TrieNode, word: String)
  node <- root
  
  FOR each char IN word DO
    index <- char - 'a'
    IF node.children[index] == NULL THEN
      node.children[index] <- new TrieNode()
    END IF
    node <- node.children[index]
  END FOR
  
  node.isEndOfWord <- TRUE
END PROCEDURE

FUNCTION Search(root: TrieNode, word: String)
  node <- root
  
  FOR each char IN word DO
    index <- char - 'a'
    IF node.children[index] == NULL THEN
      RETURN FALSE
    END IF
    node <- node.children[index]
  END FOR
  
  RETURN node.isEndOfWord
END FUNCTION

FUNCTION StartsWith(root: TrieNode, prefix: String)
  node <- root
  
  FOR each char IN prefix DO
    index <- char - 'a'
    IF node.children[index] == NULL THEN
      RETURN FALSE
    END IF
    node <- node.children[index]
  END FOR
  
  RETURN TRUE
END FUNCTION`,

  heapOps: `PROCEDURE Insert(heap: Array, value: Integer)
  heap.append(value)
  index <- heap.size() - 1
  
  WHILE index > 0 DO
    parent <- (index - 1) / 2
    IF heap[index] < heap[parent] THEN
      Swap(heap[index], heap[parent])
      index <- parent
    ELSE
      BREAK
    END IF
  END WHILE
END PROCEDURE

FUNCTION ExtractMin(heap: Array)
  IF heap.isEmpty() THEN RETURN NULL
  
  minValue <- heap[0]
  heap[0] <- heap[heap.size() - 1]
  heap.removeLast()
  
  Heapify(heap, 0)
  
  RETURN minValue
END FUNCTION

PROCEDURE Heapify(heap: Array, index: Integer)
  smallest <- index
  left <- 2 * index + 1
  right <- 2 * index + 2
  
  IF left < heap.size() AND heap[left] < heap[smallest] THEN
    smallest <- left
  END IF
  
  IF right < heap.size() AND heap[right] < heap[smallest] THEN
    smallest <- right
  END IF
  
  IF smallest != index THEN
    Swap(heap[index], heap[smallest])
    Heapify(heap, smallest)
  END IF
END PROCEDURE

PROCEDURE BuildHeap(arr: Array, n: Integer)
  FOR i FROM n/2 - 1 DOWNTO 0 DO
    Heapify(arr, i)
  END FOR
END PROCEDURE`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  treeTraversal: `void inorder(TreeNode* node) {
  if (node == nullptr) return;
  inorder(node->left);
  cout << node->val << " ";
  inorder(node->right);
}

void preorder(TreeNode* node) {
  if (node == nullptr) return;
  cout << node->val << " ";
  preorder(node->left);
  preorder(node->right);
}

void postorder(TreeNode* node) {
  if (node == nullptr) return;
  postorder(node->left);
  postorder(node->right);
  cout << node->val << " ";
}

void levelOrder(TreeNode* root) {
  if (root == nullptr) return;
  queue<TreeNode*> q;
  q.push(root);
  
  while (!q.empty()) {
    TreeNode* node = q.front();
    q.pop();
    cout << node->val << " ";
    
    if (node->left) q.push(node->left);
    if (node->right) q.push(node->right);
  }
}`,

  avlTree: `int height(TreeNode* node) {
  return node ? node->height : 0;
}

int getBalance(TreeNode* node) {
  return node ? height(node->left) - height(node->right) : 0;
}

TreeNode* rotateRight(TreeNode* y) {
  TreeNode* x = y->left;
  TreeNode* T2 = x->right;
  
  x->right = y;
  y->left = T2;
  
  y->height = max(height(y->left), height(y->right)) + 1;
  x->height = max(height(x->left), height(x->right)) + 1;
  
  return x;
}

TreeNode* rotateLeft(TreeNode* x) {
  TreeNode* y = x->right;
  TreeNode* T2 = y->left;
  
  y->left = x;
  x->right = T2;
  
  x->height = max(height(x->left), height(x->right)) + 1;
  y->height = max(height(y->left), height(y->right)) + 1;
  
  return y;
}

TreeNode* insert(TreeNode* node, int key) {
  if (node == nullptr)
    return new TreeNode(key);
  
  if (key < node->key)
    node->left = insert(node->left, key);
  else if (key > node->key)
    node->right = insert(node->right, key);
  else
    return node;
  
  node->height = 1 + max(height(node->left), height(node->right));
  int balance = getBalance(node);
  
  // Left-Left
  if (balance > 1 && key < node->left->key)
    return rotateRight(node);
  
  // Right-Right
  if (balance < -1 && key > node->right->key)
    return rotateLeft(node);
  
  // Left-Right
  if (balance > 1 && key > node->left->key) {
    node->left = rotateLeft(node->left);
    return rotateRight(node);
  }
  
  // Right-Left
  if (balance < -1 && key < node->right->key) {
    node->right = rotateRight(node->right);
    return rotateLeft(node);
  }
  
  return node;
}`,

  redBlackTree: `enum Color { RED, BLACK };

struct Node {
  int data;
  Color color;
  Node *left, *right, *parent;
};

void rotateLeft(Node*& root, Node* x) {
  Node* y = x->right;
  x->right = y->left;
  
  if (y->left != nullptr)
    y->left->parent = x;
  
  y->parent = x->parent;
  
  if (x->parent == nullptr)
    root = y;
  else if (x == x->parent->left)
    x->parent->left = y;
  else
    x->parent->right = y;
  
  y->left = x;
  x->parent = y;
}

void fixViolation(Node*& root, Node* node) {
  while (node != root && node->color == RED && 
         node->parent->color == RED) {
    Node* parent = node->parent;
    Node* grandparent = parent->parent;
    
    if (parent == grandparent->left) {
      Node* uncle = grandparent->right;
      
      if (uncle && uncle->color == RED) {
        grandparent->color = RED;
        parent->color = BLACK;
        uncle->color = BLACK;
        node = grandparent;
      } else {
        if (node == parent->right) {
          rotateLeft(root, parent);
          node = parent;
          parent = node->parent;
        }
        rotateRight(root, grandparent);
        swap(parent->color, grandparent->color);
        node = parent;
      }
    } else {
      // Mirror case
      Node* uncle = grandparent->left;
      
      if (uncle && uncle->color == RED) {
        grandparent->color = RED;
        parent->color = BLACK;
        uncle->color = BLACK;
        node = grandparent;
      } else {
        if (node == parent->left) {
          rotateRight(root, parent);
          node = parent;
          parent = node->parent;
        }
        rotateLeft(root, grandparent);
        swap(parent->color, grandparent->color);
        node = parent;
      }
    }
  }
  root->color = BLACK;
}`,

  segmentTree: `void build(vector<int>& tree, vector<int>& arr, 
          int node, int start, int end) {
  if (start == end) {
    tree[node] = arr[start];
  } else {
    int mid = (start + end) / 2;
    build(tree, arr, 2*node, start, mid);
    build(tree, arr, 2*node+1, mid+1, end);
    tree[node] = tree[2*node] + tree[2*node+1];
  }
}

int query(vector<int>& tree, int node, int start, int end,
          int L, int R) {
  if (start > R || end < L)
    return 0;
  
  if (start >= L && end <= R)
    return tree[node];
  
  int mid = (start + end) / 2;
  int left_sum = query(tree, 2*node, start, mid, L, R);
  int right_sum = query(tree, 2*node+1, mid+1, end, L, R);
  
  return left_sum + right_sum;
}

void update(vector<int>& tree, int node, int start, int end,
            int idx, int value) {
  if (start == end) {
    tree[node] = value;
  } else {
    int mid = (start + end) / 2;
    if (idx <= mid)
      update(tree, 2*node, start, mid, idx, value);
    else
      update(tree, 2*node+1, mid+1, end, idx, value);
    tree[node] = tree[2*node] + tree[2*node+1];
  }
}`,

  fenwickTree: `void update(vector<int>& BIT, int index, int value, int n) {
  while (index <= n) {
    BIT[index] += value;
    index += index & (-index);
  }
}

int query(vector<int>& BIT, int index) {
  int sum = 0;
  while (index > 0) {
    sum += BIT[index];
    index -= index & (-index);
  }
  return sum;
}

int rangeQuery(vector<int>& BIT, int left, int right) {
  return query(BIT, right) - query(BIT, left - 1);
}

void build(vector<int>& BIT, vector<int>& arr, int n) {
  for (int i = 1; i <= n; i++) {
    update(BIT, i, arr[i], n);
  }
}`,

  trie: `struct TrieNode {
  TrieNode* children[26];
  bool isEndOfWord;
  
  TrieNode() {
    isEndOfWord = false;
    for (int i = 0; i < 26; i++)
      children[i] = nullptr;
  }
};

void insert(TrieNode* root, string word) {
  TrieNode* node = root;
  
  for (char c : word) {
    int index = c - 'a';
    if (!node->children[index])
      node->children[index] = new TrieNode();
    node = node->children[index];
  }
  
  node->isEndOfWord = true;
}

bool search(TrieNode* root, string word) {
  TrieNode* node = root;
  
  for (char c : word) {
    int index = c - 'a';
    if (!node->children[index])
      return false;
    node = node->children[index];
  }
  
  return node->isEndOfWord;
}

bool startsWith(TrieNode* root, string prefix) {
  TrieNode* node = root;
  
  for (char c : prefix) {
    int index = c - 'a';
    if (!node->children[index])
      return false;
    node = node->children[index];
  }
  
  return true;
}`,

  heapOps: `void insert(vector<int>& heap, int value) {
  heap.push_back(value);
  int index = heap.size() - 1;
  
  while (index > 0) {
    int parent = (index - 1) / 2;
    if (heap[index] < heap[parent]) {
      swap(heap[index], heap[parent]);
      index = parent;
    } else {
      break;
    }
  }
}

int extractMin(vector<int>& heap) {
  if (heap.empty()) return -1;
  
  int minValue = heap[0];
  heap[0] = heap[heap.size() - 1];
  heap.pop_back();
  
  heapify(heap, 0);
  
  return minValue;
}

void heapify(vector<int>& heap, int index) {
  int smallest = index;
  int left = 2 * index + 1;
  int right = 2 * index + 2;
  
  if (left < heap.size() && heap[left] < heap[smallest])
    smallest = left;
  
  if (right < heap.size() && heap[right] < heap[smallest])
    smallest = right;
  
  if (smallest != index) {
    swap(heap[index], heap[smallest]);
    heapify(heap, smallest);
  }
}

void buildHeap(vector<int>& arr) {
  int n = arr.size();
  for (int i = n / 2 - 1; i >= 0; i--)
    heapify(arr, i);
}`,
}

const ALGO_INFO = {
  treeTraversal: {
    title: 'TREE TRAVERSAL',
    description: 'Teknik mengunjungi semua node dalam pohon: inorder (kiri-akar-kanan), preorder (akar-kiri-kanan), postorder (kiri-kanan-akar), level-order.',
    complexity: 'O(n)',
    useCase: 'Expression evaluation, serialization/deserialization, tree operations',
  },
  avlTree: {
    title: 'AVL TREE',
    description: 'Self-balancing BST di mana perbedaan tinggi subtree kiri dan kanan maksimal 1, menggunakan rotasi untuk balance.',
    complexity: 'O(log n) untuk semua operasi',
    useCase: 'Database indexing, memory management, frequent insert/delete dengan pencarian',
  },
  redBlackTree: {
    title: 'RED-BLACK TREE',
    description: 'Self-balancing BST dengan properti warna (red/black) yang menjaga keseimbangan dengan lebih sedikit rotasi daripada AVL.',
    complexity: 'O(log n) untuk semua operasi',
    useCase: 'Java TreeMap, C++ map, filesystem, process scheduler',
  },
  segmentTree: {
    title: 'SEGMENT TREE',
    description: 'Struktur data pohon untuk range query (sum, min, max) dan update dengan kompleksitas logaritmik.',
    complexity: 'O(log n) query/update, O(n) build',
    useCase: 'Range queries di array statis/dinamis, RMQ (Range Minimum Query)',
  },
  fenwickTree: {
    title: 'FENWICK TREE (BIT)',
    description: 'Binary Indexed Tree untuk prefix sum queries dan point updates yang lebih sederhana dan efisien daripada segment tree.',
    complexity: 'O(log n) query/update, O(n) build',
    useCase: 'Prefix sum yang sering diupdate, counting inversions, frequency tables',
  },
  trie: {
    title: 'TRIE (PREFIX TREE)',
    description: 'Pohon untuk menyimpan kumpulan string, di mana setiap node merepresentasikan prefiks.',
    complexity: 'O(L) per operasi (L = panjang string)',
    useCase: 'Autocomplete, spell checker, IP routing, dictionary',
  },
  heapOps: {
    title: 'HEAP OPERATIONS',
    description: 'Min-Heap/Max-Heap: insert (percolate up), extract-min/max (percolate down), heapify.',
    complexity: 'O(log n) insert/extract, O(n) build-heap',
    useCase: 'Priority queue, Dijkstra, Heap Sort, median maintenance',
  },
}

// ==========================================
// SAMPLE TREES
// ==========================================

const SAMPLE_TREES = {
  binary: {
    nodes: [
      { id: 0, x: 300, y: 50, label: '50', value: 50 },
      { id: 1, x: 200, y: 120, label: '30', value: 30 },
      { id: 2, x: 400, y: 120, label: '70', value: 70 },
      { id: 3, x: 150, y: 190, label: '20', value: 20 },
      { id: 4, x: 250, y: 190, label: '40', value: 40 },
      { id: 5, x: 350, y: 190, label: '60', value: 60 },
      { id: 6, x: 450, y: 190, label: '80', value: 80 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ],
  },
  heap: {
    nodes: [
      { id: 0, x: 300, y: 50, label: '10', value: 10 },
      { id: 1, x: 200, y: 120, label: '20', value: 20 },
      { id: 2, x: 400, y: 120, label: '15', value: 15 },
      { id: 3, x: 150, y: 190, label: '30', value: 30 },
      { id: 4, x: 250, y: 190, label: '40', value: 40 },
      { id: 5, x: 350, y: 190, label: '50', value: 50 },
      { id: 6, x: 450, y: 190, label: '25', value: 25 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ],
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const TreeVisualization = ({ tree, step }) => {
  const { nodes, edges } = tree
  const { visitedNodes = [], activeNodes = [], highlightedEdges = [], description = '' } = step

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl min-h-[300px]'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <GitBranch size={14} /> Visualisasi Pohon
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
        height='250'
        className='mx-auto'>
        {/* Draw Edges */}
        {edges.map((edge, idx) => {
          const fromNode = nodes.find((n) => n.id === edge.from)
          const toNode = nodes.find((n) => n.id === edge.to)
          if (!fromNode || toNode) return null

          const isHighlighted = highlightedEdges.some((e) => e.from === edge.from && e.to === edge.to)

          return (
            <line
              key={idx}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={isHighlighted ? '#3b82f6' : '#475569'}
              strokeWidth={isHighlighted ? '3' : '2'}
              className='transition-all duration-300'
            />
          )
        })}

        {/* Draw Nodes */}
        {nodes.map((node) => {
          const isVisited = visitedNodes.includes(node.id)
          const isActive = activeNodes.includes(node.id)

          let fillColor = '#1e293b'
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
                r='20'
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className='transition-all duration-300'
              />
              <text
                x={node.x}
                y={node.y + 5}
                fill={isActive || isVisited ? '#000' : '#fff'}
                fontSize='14'
                fontWeight='bold'
                textAnchor='middle'
                className='select-none'>
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {description && (
        <div className='mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700'>
          <div className='text-xs font-bold text-slate-400 mb-1'>Output Traversal</div>
          <div className='text-sm text-orange-400 font-mono'>{description}</div>
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

      const keywords = ['void', 'int', 'bool', 'vector', 'for', 'while', 'if', 'else', 'return', 'swap', 'break', 'continue', 'struct', 'enum', 'nullptr', 'new', 'delete']
      const literals = ['true', 'false', 'RED', 'BLACK']

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

const TreeAlgo = () => {
  const [algorithm, setAlgorithm] = useState('treeTraversal')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const getTreeType = (algo) => {
    if (['heapOps'].includes(algo)) return 'heap'
    return 'binary'
  }

  const currentTree = SAMPLE_TREES[getTreeType(algorithm)]

  const snapshot = (visitedNodes, activeNodes, highlightedEdges, line, desc, output = '') => ({
    visitedNodes: [...visitedNodes],
    activeNodes: [...activeNodes],
    highlightedEdges: [...highlightedEdges],
    activeLine: line,
    description: desc,
    output,
  })

  const generateSteps = (tree, algo) => {
    const { nodes } = tree
    let s = []

    s.push(snapshot([], [], [], 1, 'Mulai algoritma', ''))

    if (algo === 'treeTraversal') {
      // Inorder Traversal (Left-Root-Right)
      const inorder = (nodeId, visited, output) => {
        if (nodeId === null || nodeId === undefined) return { visited, output }

        const node = nodes[nodeId]
        const leftChild = tree.edges.find((e) => e.from === nodeId && nodes[e.to].x < node.x)?.to
        const rightChild = tree.edges.find((e) => e.from === nodeId && nodes[e.to].x > node.x)?.to

        s.push(snapshot(visited, [nodeId], [], 2, `Visit node ${node.label} (inorder)`, output.join(' ')))

        // Left
        if (leftChild !== undefined) {
          const result = inorder(leftChild, visited, output)
          visited = result.visited
          output = result.output
        }

        // Root
        visited.push(nodeId)
        output.push(node.label)
        s.push(snapshot(visited, [nodeId], [], 3, `Process node ${node.label}`, output.join(' ')))

        // Right
        if (rightChild !== undefined) {
          const result = inorder(rightChild, visited, output)
          visited = result.visited
          output = result.output
        }

        return { visited, output }
      }

      inorder(0, [], [])
    } else if (algo === 'heapOps') {
      // Min-Heap Insert
      const heapArray = nodes.map((n) => n.value)
      s.push(snapshot([], [], [], 1, 'Heap array: ' + heapArray.join(', '), heapArray.join(', ')))

      // Insert operation
      const newValue = 5
      s.push(snapshot([], [heapArray.length], [], 2, `Insert ${newValue} ke heap`, heapArray.join(', ')))

      heapArray.push(newValue)
      let idx = heapArray.length - 1

      while (idx > 0) {
        const parent = Math.floor((idx - 1) / 2)
        s.push(snapshot([], [idx, parent], [], 6, `Compare ${heapArray[idx]} dengan parent ${heapArray[parent]}`, heapArray.join(', ')))

        if (heapArray[idx] < heapArray[parent]) {
          ;[heapArray[idx], heapArray[parent]] = [heapArray[parent], heapArray[idx]]
          s.push(
            snapshot(
              Array.from({ length: idx }, (_, i) => i),
              [parent],
              [],
              8,
              `Swap dan percolate up`,
              heapArray.join(', ')
            )
          )
          idx = parent
        } else {
          break
        }
      }

      s.push(
        snapshot(
          Array.from({ length: heapArray.length }, (_, i) => i),
          [],
          [],
          11,
          'Insert selesai',
          heapArray.join(', ')
        )
      )
    } else {
      // Placeholder for other algorithms
      s.push(snapshot([], [0], [], 1, `${ALGO_INFO[algo].title} - Visualisasi dalam pengembangan`, ''))
    }

    s.push(
      snapshot(
        Array.from({ length: nodes.length }, (_, i) => i),
        [],
        [],
        -1,
        'Algoritma selesai',
        ''
      )
    )

    return s
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generated = generateSteps(currentTree, algorithm)
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
    highlightedEdges: [],
    activeLine: 0,
    description: 'Loading...',
    output: '',
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <GitBranch
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOTREE<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Algoritma Tree</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='treeTraversal'>Tree Traversal</option>
              <option value='avlTree'>AVL Tree</option>
              <option value='redBlackTree'>Red-Black Tree</option>
              <option value='segmentTree'>Segment Tree</option>
              <option value='fenwickTree'>Fenwick Tree</option>
              <option value='trie'>Trie</option>
              <option value='heapOps'>Heap Operations</option>
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
            Complexity: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
          </div>
          <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <GitBranch
              size={12}
              className='text-blue-400'
            />
            Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
          </div>
        </div>

        {/* PSEUDOCODE */}
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
        {/* LEFT COLUMN */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          <TreeVisualization
            tree={currentTree}
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
          <div className='p-4 bg-[#252526]'>
            <CodeViewer
              code={ALGO_CPLUSPLUS[algorithm]}
              activeLine={currentVisual.activeLine}
            />
          </div>

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

export default TreeAlgo
