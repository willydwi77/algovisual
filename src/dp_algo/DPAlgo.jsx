import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BrainCircuit, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Table } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  fibonacciDP: `// Tabulation (Bottom-Up)
FUNCTION FibonacciDP(n: Integer)
  DECLARE dp: Array[n+1]
  
  dp[0] <- 0
  dp[1] <- 1
  
  FOR i FROM 2 TO n DO
    dp[i] <- dp[i-1] + dp[i-2]
  END FOR
  
  RETURN dp[n]
END FUNCTION

// Memoization (Top-Down)
FUNCTION FibMemo(n: Integer, memo: Array)
  IF n <= 1 THEN RETURN n
  IF memo[n] != -1 THEN RETURN memo[n]
  
  memo[n] <- FibMemo(n-1, memo) + FibMemo(n-2, memo)
  RETURN memo[n]
END FUNCTION`,

  knapsack01: `FUNCTION Knapsack01(weights: Array, values: Array, n: Integer, W: Integer)
  DECLARE dp: Matrix[n+1][W+1]
  
  // Initialize base cases
  FOR i FROM 0 TO n DO
    dp[i][0] <- 0
  END FOR
  FOR w FROM 0 TO W DO
    dp[0][w] <- 0
  END FOR
  
  // Fill DP table
  FOR i FROM 1 TO n DO
    FOR w FROM 1 TO W DO
      // Don't include item i
      dp[i][w] <- dp[i-1][w]
      
      // Include item i if possible
      IF weights[i-1] <= w THEN
        dp[i][w] <- MAX(dp[i][w], 
                        dp[i-1][w - weights[i-1]] + values[i-1])
      END IF
    END FOR
  END FOR
  
  RETURN dp[n][W]
END FUNCTION`,

  longestCommonSubsequence: `FUNCTION LCS(X: String, Y: String, m: Integer, n: Integer)
  DECLARE dp: Matrix[m+1][n+1]
  
  // Initialize base cases
  FOR i FROM 0 TO m DO
    dp[i][0] <- 0
  END FOR
  FOR j FROM 0 TO n DO
    dp[0][j] <- 0
  END FOR
  
  // Fill DP table
  FOR i FROM 1 TO m DO
    FOR j FROM 1 TO n DO
      IF X[i-1] == Y[j-1] THEN
        dp[i][j] <- dp[i-1][j-1] + 1
      ELSE
        dp[i][j] <- MAX(dp[i-1][j], dp[i][j-1])
      END IF
    END FOR
  END FOR
  
  RETURN dp[m][n]
END FUNCTION

// Backtrack to find actual LCS
FUNCTION PrintLCS(dp: Matrix, X: String, Y: String, i: Integer, j: Integer)
  IF i == 0 OR j == 0 THEN RETURN ""
  
  IF X[i-1] == Y[j-1] THEN
    RETURN PrintLCS(dp, X, Y, i-1, j-1) + X[i-1]
  ELSE
    IF dp[i-1][j] > dp[i][j-1] THEN
      RETURN PrintLCS(dp, X, Y, i-1, j)
    ELSE
      RETURN PrintLCS(dp, X, Y, i, j-1)
    END IF
  END IF
END FUNCTION`,

  editDistance: `FUNCTION EditDistance(str1: String, str2: String, m: Integer, n: Integer)
  DECLARE dp: Matrix[m+1][n+1]
  
  // Base cases: empty string
  FOR i FROM 0 TO m DO
    dp[i][0] <- i  // Delete all
  END FOR
  FOR j FROM 0 TO n DO
    dp[0][j] <- j  // Insert all
  END FOR
  
  // Fill DP table
  FOR i FROM 1 TO m DO
    FOR j FROM 1 TO n DO
      IF str1[i-1] == str2[j-1] THEN
        dp[i][j] <- dp[i-1][j-1]  // No operation needed
      ELSE
        dp[i][j] <- 1 + MIN(
          dp[i-1][j],      // Delete
          dp[i][j-1],      // Insert
          dp[i-1][j-1]     // Replace
        )
      END IF
    END FOR
  END FOR
  
  RETURN dp[m][n]
END FUNCTION`,

  matrixChainMultiplication: `FUNCTION MatrixChainOrder(p: Array, n: Integer)
  DECLARE dp: Matrix[n][n]  // Min cost
  DECLARE s: Matrix[n][n]   // Split point
  
  // Cost is 0 for single matrix
  FOR i FROM 1 TO n-1 DO
    dp[i][i] <- 0
  END FOR
  
  // L is chain length
  FOR L FROM 2 TO n-1 DO
    FOR i FROM 1 TO n-L DO
      j <- i + L - 1
      dp[i][j] <- INFINITY
      
      FOR k FROM i TO j-1 DO
        cost <- dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j]
        
        IF cost < dp[i][j] THEN
          dp[i][j] <- cost
          s[i][j] <- k
        END IF
      END FOR
    END FOR
  END FOR
  
  RETURN dp[1][n-1]
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  fibonacciDP: `// Tabulation (Bottom-Up)
int fibonacciDP(int n) {
  if (n <= 1) return n;
  
  vector<int> dp(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (int i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}

// Memoization (Top-Down)
int fibMemo(int n, vector<int>& memo) {
  if (n <= 1) return n;
  if (memo[n] != -1) return memo[n];
  
  memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
  return memo[n];
}

int fibonacci(int n) {
  vector<int> memo(n + 1, -1);
  return fibMemo(n, memo);
}`,

  knapsack01: `int knapsack(vector<int>& weights, vector<int>& values, int n, int W) {
  vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
  
  // Fill DP table
  for (int i = 1; i <= n; i++) {
    for (int w = 1; w <= W; w++) {
      // Don't include item i
      dp[i][w] = dp[i-1][w];
      
      // Include item i if possible
      if (weights[i-1] <= w) {
        dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
      }
    }
  }
  
  return dp[n][W];
}

// Space-optimized version
int knapsackOptimized(vector<int>& weights, vector<int>& values, int n, int W) {
  vector<int> dp(W + 1, 0);
  
  for (int i = 0; i < n; i++) {
    for (int w = W; w >= weights[i]; w--) {
      dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
    }
  }
  
  return dp[W];
}`,

  longestCommonSubsequence: `int lcs(string X, string Y, int m, int n) {
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
  
  // Fill DP table
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (X[i-1] == Y[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}

// Print actual LCS
string printLCS(vector<vector<int>>& dp, string X, string Y, int i, int j) {
  if (i == 0 || j == 0) {
    return "";
  }
  
  if (X[i-1] == Y[j-1]) {
    return printLCS(dp, X, Y, i-1, j-1) + X[i-1];
  }
  
  if (dp[i-1][j] > dp[i][j-1]) {
    return printLCS(dp, X, Y, i-1, j);
  } else {
    return printLCS(dp, X, Y, i, j-1);
  }
}`,

  editDistance: `int editDistance(string str1, string str2) {
  int m = str1.length();
  int n = str2.length();
  
  vector<vector<int>> dp(m + 1, vector<int>(n + 1));
  
  // Base cases
  for (int i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (int j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  // Fill DP table
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (str1[i-1] == str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + min({
          dp[i-1][j],      // Delete
          dp[i][j-1],      // Insert
          dp[i-1][j-1]     // Replace
        });
      }
    }
  }
  
  return dp[m][n];
}`,

  matrixChainMultiplication: `int matrixChainOrder(vector<int>& p, int n) {
  vector<vector<int>> dp(n, vector<int>(n, 0));
  vector<vector<int>> s(n, vector<int>(n, 0));
  
  // L is chain length
  for (int L = 2; L < n; L++) {
    for (int i = 1; i < n - L + 1; i++) {
      int j = i + L - 1;
      dp[i][j] = INT_MAX;
      
      for (int k = i; k < j; k++) {
        int cost = dp[i][k] + dp[k+1][j] + p[i-1] * p[k] * p[j];
        
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          s[i][j] = k;
        }
      }
    }
  }
  
  return dp[1][n-1];
}

void printOptimalParens(vector<vector<int>>& s, int i, int j) {
  if (i == j) {
    cout << "A" << i;
  } else {
    cout << "(";
    printOptimalParens(s, i, s[i][j]);
    printOptimalParens(s, s[i][j] + 1, j);
    cout << ")";
  }
}`,
}

const ALGO_INFO = {
  fibonacciDP: {
    title: 'FIBONACCI (DP)',
    description: 'Menghitung Fibonacci ke-n dengan memoization/tabulation untuk menghindari perhitungan berulang.',
    complexity: 'O(n)',
    useCase: 'Optimasi rekursif, contoh dasar DP, sequence generation',
  },
  knapsack01: {
    title: '0/1 KNAPSACK',
    description: 'Memilih item dengan berat dan nilai untuk dimasukkan ke dalam knapsack dengan kapasitas tetap untuk memaksimalkan nilai.',
    complexity: 'O(nW) (n = items, W = capacity)',
    useCase: 'Resource allocation, budget planning, portfolio optimization',
  },
  longestCommonSubsequence: {
    title: 'LONGEST COMMON SUBSEQUENCE (LCS)',
    description: 'Mencari subsequence terpanjang yang dimiliki oleh dua sequence (tidak harus berurutan).',
    complexity: 'O(mn) (m, n = panjang string)',
    useCase: 'Diff tools, bioinformatics (DNA alignment), plagiarism detection',
  },
  editDistance: {
    title: 'EDIT DISTANCE (LEVENSHTEIN)',
    description: 'Menghitung operasi minimum (insert, delete, replace) untuk mengubah string A menjadi string B.',
    complexity: 'O(mn)',
    useCase: 'Spell correction, DNA analysis, natural language processing',
  },
  matrixChainMultiplication: {
    title: 'MATRIX CHAIN MULTIPLICATION',
    description: 'Menentukan urutan perkalian matriks yang meminimalkan jumlah operasi perkalian skalar.',
    complexity: 'O(n³)',
    useCase: 'Compiler optimization, computer graphics, numerical analysis',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const DPTableVisualization = ({ table, activeCell = null, title = 'DP Table', rowHeaders = [], colHeaders = [] }) => {
  if (!table || table.length === 0) return null

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Table size={14} /> {title}
        </h3>
        <div className='flex gap-2'>
          {['CURRENT', 'COMPUTED', 'BASE'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'CURRENT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : label === 'COMPUTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='overflow-auto max-h-[400px]'>
        <table className='border-collapse'>
          <thead>
            <tr>
              <th className='border border-slate-600 bg-slate-800 p-2 text-xs font-bold text-slate-400 min-w-[40px]'></th>
              {colHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className='border border-slate-600 bg-slate-800 p-2 text-xs font-bold text-orange-400 min-w-[50px]'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <tr key={i}>
                <th className='border border-slate-600 bg-slate-800 p-2 text-xs font-bold text-orange-400'>{rowHeaders[i] || i}</th>
                {row.map((cell, j) => {
                  const isActive = activeCell && activeCell.row === i && activeCell.col === j
                  const isBase = i === 0 || j === 0
                  const isComputed = cell !== null && cell !== undefined && !isActive && !isBase

                  let bgColor = 'bg-slate-800'
                  let textColor = 'text-slate-400'

                  if (isActive) {
                    bgColor = 'bg-yellow-500/30 border-2 border-yellow-400'
                    textColor = 'text-yellow-200 font-bold'
                  } else if (isComputed) {
                    bgColor = 'bg-emerald-900/30'
                    textColor = 'text-emerald-300'
                  } else if (isBase) {
                    bgColor = 'bg-blue-900/30'
                    textColor = 'text-blue-300'
                  }

                  return (
                    <td
                      key={j}
                      className={`border border-slate-600 ${bgColor} ${textColor} p-2 text-center text-sm font-mono transition-all duration-300 min-w-[50px]`}>
                      {cell !== null && cell !== undefined ? cell : '-'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
      const keywords = ['void', 'int', 'bool', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'for', 'while', 'do', 'if', 'else', 'switch', 'case', 'default', 'return', 'break', 'continue', 'goto', 'true', 'false', 'nullptr', 'NULL', 'const', 'static', 'auto', 'this', 'class', 'struct', 'enum', 'typedef', 'public', 'private', 'protected', 'virtual', 'override', 'final', 'vector', 'string', 'map', 'set', 'queue', 'stack', 'pair', 'array', 'max', 'min']

      if (keywords.includes(token)) {
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
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

const DPAlgo = () => {
  const [algorithm, setAlgorithm] = useState('fibonacciDP')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Dynamic Data States
  const [fibN, setFibN] = useState(8)
  const [knapWeights, setKnapWeights] = useState('2, 3, 4, 5')
  const [knapValues, setKnapValues] = useState('3, 4, 5, 6')
  const [knapW, setKnapW] = useState(8)
  const [lcsStr1, setLcsStr1] = useState('ABCDGH')
  const [lcsStr2, setLcsStr2] = useState('AEDFHR')
  const [editStr1, setEditStr1] = useState('SUNDAY')
  const [editStr2, setEditStr2] = useState('SATURDAY')
  const [mcmDims, setMcmDims] = useState('10, 30, 5, 60')

  const snapshot = (table, activeCell, line, desc, rowHeaders = [], colHeaders = []) => ({
    table: table.map((row) => [...row]),
    activeCell: activeCell ? { ...activeCell } : null,
    activeLine: line,
    description: desc,
    rowHeaders: [...rowHeaders],
    colHeaders: [...colHeaders],
  })

  const generateSteps = (algo) => {
    let s = []

    if (algo === 'fibonacciDP') {
      const n = fibN
      const dp = Array(n + 1).fill(null)

      s.push(
        snapshot(
          [dp],
          null,
          1,
          `Memulai Fibonacci DP untuk n=${n}`,
          ['dp'],
          Array.from({ length: n + 1 }, (_, i) => i)
        )
      )

      dp[0] = 0
      s.push(
        snapshot(
          [dp],
          { row: 0, col: 0 },
          6,
          'Kasus dasar: dp[0] = 0',
          ['dp'],
          Array.from({ length: n + 1 }, (_, i) => i)
        )
      )

      if (n > 0) {
        dp[1] = 1
        s.push(
          snapshot(
            [dp],
            { row: 0, col: 1 },
            7,
            'Kasus dasar: dp[1] = 1',
            ['dp'],
            Array.from({ length: n + 1 }, (_, i) => i)
          )
        )
      }

      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
        s.push(
          snapshot(
            [dp],
            { row: 0, col: i },
            10,
            `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
            ['dp'],
            Array.from({ length: n + 1 }, (_, i) => i)
          )
        )
      }

      s.push(
        snapshot(
          [dp],
          null,
          13,
          `Selesai! Fibonacci(${n}) = ${dp[n]}`,
          ['dp'],
          Array.from({ length: n + 1 }, (_, i) => i)
        )
      )
    } else if (algo === 'knapsack01') {
      const weights = knapWeights
        .split(',')
        .map((x) => parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      const values = knapValues
        .split(',')
        .map((x) => parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      const n = Math.min(weights.length, values.length)
      const W = knapW

      const dp = Array(n + 1)
        .fill(null)
        .map(() => Array(W + 1).fill(0))

      s.push(
        snapshot(
          dp,
          null,
          1,
          `Knapsack: ${n} barang, kapasitas ${W}`,
          Array.from({ length: n + 1 }, (_, i) => (i === 0 ? '∅' : `i${i}`)),
          Array.from({ length: W + 1 }, (_, i) => i)
        )
      )

      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
          dp[i][w] = dp[i - 1][w]

          if (weights[i - 1] <= w) {
            const include = dp[i - 1][w - weights[i - 1]] + values[i - 1]
            if (include > dp[i][w]) {
              dp[i][w] = include
              s.push(
                snapshot(
                  dp,
                  { row: i, col: w },
                  12,
                  `dp[${i}][${w}] = max(${dp[i - 1][w]}, ${include}) = ${dp[i][w]} (pilih barang ${i})`,
                  Array.from({ length: n + 1 }, (_, i) => (i === 0 ? '∅' : `i${i}`)),
                  Array.from({ length: W + 1 }, (_, i) => i)
                )
              )
            } else {
              s.push(
                snapshot(
                  dp,
                  { row: i, col: w },
                  8,
                  `dp[${i}][${w}] = ${dp[i][w]} (lebih baik tidak pilih barang ${i})`,
                  Array.from({ length: n + 1 }, (_, i) => (i === 0 ? '∅' : `i${i}`)),
                  Array.from({ length: W + 1 }, (_, i) => i)
                )
              )
            }
          } else {
            s.push(
              snapshot(
                dp,
                { row: i, col: w },
                8,
                `dp[${i}][${w}] = ${dp[i][w]} (barang terlalu berat)`,
                Array.from({ length: n + 1 }, (_, i) => (i === 0 ? '∅' : `i${i}`)),
                Array.from({ length: W + 1 }, (_, i) => i)
              )
            )
          }
        }
      }

      s.push(
        snapshot(
          dp,
          null,
          17,
          `Nilai maksimum = ${dp[n][W]}`,
          Array.from({ length: n + 1 }, (_, i) => (i === 0 ? '∅' : `i${i}`)),
          Array.from({ length: W + 1 }, (_, i) => i)
        )
      )
    } else if (algo === 'longestCommonSubsequence') {
      const X = lcsStr1
      const Y = lcsStr2
      const m = X.length
      const n = Y.length

      const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0))

      s.push(snapshot(dp, null, 1, `LCS dari "${X}" dan "${Y}"`, ['∅', ...X.split('')], ['∅', ...Y.split('')]))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (X[i - 1] === Y[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
            s.push(snapshot(dp, { row: i, col: j }, 8, `${X[i - 1]} == ${Y[j - 1]}: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`, ['∅', ...X.split('')], ['∅', ...Y.split('')]))
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
            s.push(snapshot(dp, { row: i, col: j }, 10, `${X[i - 1]} ≠ ${Y[j - 1]}: dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`, ['∅', ...X.split('')], ['∅', ...Y.split('')]))
          }
        }
      }

      s.push(snapshot(dp, null, 15, `Panjang LCS = ${dp[m][n]}`, ['∅', ...X.split('')], ['∅', ...Y.split('')]))
    } else if (algo === 'editDistance') {
      const str1 = editStr1
      const str2 = editStr2
      const m = str1.length
      const n = str2.length

      const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0))

      // Base cases
      for (let i = 0; i <= m; i++) dp[i][0] = i
      for (let j = 0; j <= n; j++) dp[0][j] = j

      s.push(snapshot(dp, null, 1, `Jarak Edit: "${str1}" → "${str2}"`, ['∅', ...str1.split('')], ['∅', ...str2.split('')]))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (str1[i - 1] === str2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1]
            s.push(snapshot(dp, { row: i, col: j }, 20, `${str1[i - 1]} == ${str2[j - 1]}: dp[${i}][${j}] = ${dp[i][j]} (karakter sama)`, ['∅', ...str1.split('')], ['∅', ...str2.split('')]))
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            s.push(snapshot(dp, { row: i, col: j }, 22, `${str1[i - 1]} ≠ ${str2[j - 1]}: dp[${i}][${j}] = 1 + min(del, ins, rep) = ${dp[i][j]}`, ['∅', ...str1.split('')], ['∅', ...str2.split('')]))
          }
        }
      }

      s.push(snapshot(dp, null, 31, `Operasi minimum = ${dp[m][n]}`, ['∅', ...str1.split('')], ['∅', ...str2.split('')]))
    } else if (algo === 'matrixChainMultiplication') {
      const p = mcmDims
        .split(',')
        .map((x) => parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      const n = p.length

      const dp = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0))

      const numMatrices = n - 1

      s.push(
        snapshot(
          dp,
          null,
          1,
          `Matrix Chain Order: ${numMatrices} matrix`,
          Array.from({ length: n }, (_, i) => i),
          Array.from({ length: n }, (_, i) => i)
        )
      )

      // L is chain length
      for (let L = 2; L < n; L++) {
        for (let i = 1; i < n - L + 1; i++) {
          let j = i + L - 1
          dp[i][j] = Number.MAX_SAFE_INTEGER

          for (let k = i; k < j; k++) {
            // q = m[i,k] + m[k+1,j] + p[i-1]p[k]p[j]
            let cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j]

            if (cost < dp[i][j]) {
              dp[i][j] = cost
              // sTable[i][j] = k

              s.push(
                snapshot(
                  dp,
                  { row: i, col: j },
                  14,
                  `Split at k=${k}: Cost ${cost}`,
                  Array.from({ length: n }, (_, i) => i),
                  Array.from({ length: n }, (_, i) => i)
                )
              )
            }
          }
        }
      }

      s.push(
        snapshot(
          dp,
          null,
          22,
          `Min Multiplications: ${dp[1][n - 1]}`,
          Array.from({ length: n }, (_, i) => i),
          Array.from({ length: n }, (_, i) => i)
        )
      )
    } else {
      s.push(snapshot([[]], null, 1, `${ALGO_INFO[algo].title} - Visualisasi dalam pengembangan`, [], []))
    }

    s.push(snapshot(steps.length > 0 ? steps[steps.length - 1].table : [[]], null, -1, 'Algoritma selesai', [], []))
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
  }, [algorithm, fibN, knapWeights, knapValues, knapW, lcsStr1, lcsStr2, editStr1, editStr2, mcmDims])

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
    table: [[]],
    activeCell: null,
    activeLine: 0,
    description: 'Loading...',
    rowHeaders: [],
    colHeaders: [],
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <BrainCircuit
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGODP<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Dynamic Programming</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='fibonacciDP'>Fibonacci DP</option>
              <option value='knapsack01'>0/1 Knapsack</option>
              <option value='longestCommonSubsequence'>LCS</option>
              <option value='editDistance'>Edit Distance</option>
              <option value='matrixChainMultiplication'>Matrix Chain</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>

          {/* DYNAMIC INPUTS */}
          {algorithm === 'fibonacciDP' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>ARRAY</label>
              <input
                type='number'
                value={fibN}
                onChange={(e) => setFibN(Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                className='w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                max={20}
              />
            </>
          )}

          {algorithm === 'knapsack01' && (
            <>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <label className='text-[10px] text-slate-400 font-bold w-12'>WEIGHTS</label>
                  <input
                    type='text'
                    value={knapWeights}
                    onChange={(e) => setKnapWeights(e.target.value)}
                    className='w-32 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                    placeholder='2, 3, 4'
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label className='text-[10px] text-slate-400 font-bold w-12'>VALUES</label>
                  <input
                    type='text'
                    value={knapValues}
                    onChange={(e) => setKnapValues(e.target.value)}
                    className='w-32 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                    placeholder='3, 4, 5'
                  />
                </div>
              </div>
              <label className='text-xs text-slate-400 font-bold ml-2'>Kap(W)</label>
              <input
                type='number'
                value={knapW}
                onChange={(e) => setKnapW(Math.min(15, Math.max(1, parseInt(e.target.value) || 1)))}
                className='w-14 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                max={15}
              />
            </>
          )}

          {(algorithm === 'longestCommonSubsequence' || algorithm === 'editDistance') && (
            <div className='flex flex-wrap gap-1'>
              <div className='flex items-center gap-2'>
                <label className='text-xs text-slate-400 font-bold'>TEXT 1</label>
                <input
                  type='text'
                  value={algorithm === 'longestCommonSubsequence' ? lcsStr1 : editStr1}
                  onChange={(e) => (algorithm === 'longestCommonSubsequence' ? setLcsStr1(e.target.value.toUpperCase().slice(0, 10)) : setEditStr1(e.target.value.toUpperCase().slice(0, 10)))}
                  className='w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                />
              </div>
              <div className='flex items-center gap-2'>
                <label className='text-xs text-slate-400 font-bold'>TEXT 2</label>
                <input
                  type='text'
                  value={algorithm === 'longestCommonSubsequence' ? lcsStr2 : editStr2}
                  onChange={(e) => (algorithm === 'longestCommonSubsequence' ? setLcsStr2(e.target.value.toUpperCase().slice(0, 10)) : setEditStr2(e.target.value.toUpperCase().slice(0, 10)))}
                  className='w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                />
              </div>
            </div>
          )}

          {algorithm === 'matrixChainMultiplication' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>DIMENSION</label>
              <input
                type='text'
                value={mcmDims}
                onChange={(e) => setMcmDims(e.target.value)}
                className='w-40 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-orange-500 font-mono focus:ring-2 focus:ring-orange-500/50 outline-none text-center transition-colors'
                placeholder='10, 30, 5, 60'
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
            <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
              <Activity
                size={12}
                className='text-orange-400'
              />
              Complexity: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
            </div>
            <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
              <BrainCircuit
                size={12}
                className='text-blue-400'
              />
              Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
            </div>
          </div>

          {/* RIGHT COLUMN: PSEUDOCODE */}
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
          <DPTableVisualization
            table={currentVisual.table}
            activeCell={currentVisual.activeCell}
            title={ALGO_INFO[algorithm].title}
            rowHeaders={currentVisual.rowHeaders}
            colHeaders={currentVisual.colHeaders}
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

export default DPAlgo
