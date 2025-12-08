import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Undo2, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Grid3x3 } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  nQueens: `FUNCTION SolveNQueens(n: Integer)
  DECLARE board: Matrix[n][n]
  DECLARE solutions: List
  
  InitializeBoard(board, n)
  PlaceQueens(board, 0, n, solutions)
  
  RETURN solutions
END FUNCTION

FUNCTION PlaceQueens(board: Matrix, row: Integer, n: Integer, solutions: List)
  IF row == n THEN
    solutions.add(CopyBoard(board))
    RETURN
  END IF
  
  FOR col FROM 0 TO n-1 DO
    IF IsSafe(board, row, col, n) THEN
      board[row][col] <- 'Q'
      
      PlaceQueens(board, row + 1, n, solutions)
      
      board[row][col] <- '.'  // Backtrack
    END IF
  END FOR
END FUNCTION

FUNCTION IsSafe(board: Matrix, row: Integer, col: Integer, n: Integer)
  // Check column
  FOR i FROM 0 TO row-1 DO
    IF board[i][col] == 'Q' THEN
      RETURN FALSE
    END IF
  END FOR
  
  // Check diagonal (up-left)
  i <- row - 1
  j <- col - 1
  WHILE i >= 0 AND j >= 0 DO
    IF board[i][j] == 'Q' THEN
      RETURN FALSE
    END IF
    i <- i - 1
    j <- j - 1
  END WHILE
  
  // Check diagonal (up-right)
  i <- row - 1
  j <- col + 1
  WHILE i >= 0 AND j < n DO
    IF board[i][j] == 'Q' THEN
      RETURN FALSE
    END IF
    i <- i - 1
    j <- j + 1
  END WHILE
  
  RETURN TRUE
END FUNCTION`,

  sudokuSolver: `FUNCTION SolveSudoku(board: Matrix[9][9])
  FOR row FROM 0 TO 8 DO
    FOR col FROM 0 TO 8 DO
      IF board[row][col] == 0 THEN
        FOR num FROM 1 TO 9 DO
          IF IsValid(board, row, col, num) THEN
            board[row][col] <- num
            
            IF SolveSudoku(board) THEN
              RETURN TRUE
            END IF
            
            board[row][col] <- 0  // Backtrack
          END IF
        END FOR
        RETURN FALSE
      END IF
    END FOR
  END FOR
  
  RETURN TRUE
END FUNCTION

FUNCTION IsValid(board: Matrix, row: Integer, col: Integer, num: Integer)
  // Check row
  FOR j FROM 0 TO 8 DO
    IF board[row][j] == num THEN
      RETURN FALSE
    END IF
  END FOR
  
  // Check column
  FOR i FROM 0 TO 8 DO
    IF board[i][col] == num THEN
      RETURN FALSE
    END IF
  END FOR
  
  // Check 3x3 box
  startRow <- (row / 3) * 3
  startCol <- (col / 3) * 3
  
  FOR i FROM 0 TO 2 DO
    FOR j FROM 0 TO 2 DO
      IF board[startRow + i][startCol + j] == num THEN
        RETURN FALSE
      END IF
    END FOR
  END FOR
  
  RETURN TRUE
END FUNCTION`,

  permutation: `PROCEDURE GeneratePermutations(arr: Array, start: Integer, end: Integer)
  IF start == end THEN
    PrintArray(arr)
    RETURN
  END IF
  
  FOR i FROM start TO end DO
    Swap(arr[start], arr[i])
    
    GeneratePermutations(arr, start + 1, end)
    
    Swap(arr[start], arr[i])  // Backtrack
  END FOR
END PROCEDURE

PROCEDURE Swap(a: Integer, b: Integer)
  temp <- a
  a <- b
  b <- temp
END PROCEDURE

// Alternative: Using boolean array
PROCEDURE PermuteWithVisited(nums: Array, path: List, used: Array[Boolean], result: List)
  IF path.size() == nums.length THEN
    result.add(CopyList(path))
    RETURN
  END IF
  
  FOR i FROM 0 TO nums.length-1 DO
    IF NOT used[i] THEN
      used[i] <- TRUE
      path.append(nums[i])
      
      PermuteWithVisited(nums, path, used, result)
      
      path.removeLast()  // Backtrack
      used[i] <- FALSE
    END IF
  END FOR
END PROCEDURE`,

  subsetSum: `FUNCTION FindSubsetSum(arr: Array, n: Integer, target: Integer)
  DECLARE result: List
  DECLARE current: List
  
  FindSubsets(arr, 0, n, target, 0, current, result)
  
  RETURN result
END FUNCTION

PROCEDURE FindSubsets(arr: Array, index: Integer, n: Integer, target: Integer, 
                      currentSum: Integer, current: List, result: List)
  IF currentSum == target THEN
    result.add(CopyList(current))
    RETURN
  END IF
  
  IF index == n OR currentSum > target THEN
    RETURN
  END IF
  
  // Include current element
  current.append(arr[index])
  FindSubsets(arr, index + 1, n, target, currentSum + arr[index], current, result)
  
  // Exclude current element (backtrack)
  current.removeLast()
  FindSubsets(arr, index + 1, n, target, currentSum, current, result)
END PROCEDURE

// Dynamic Programming version
FUNCTION SubsetSumDP(arr: Array, n: Integer, target: Integer)
  DECLARE dp: Matrix[n+1][target+1] of Boolean
  
  FOR i FROM 0 TO n DO
    dp[i][0] <- TRUE
  END FOR
  
  FOR i FROM 1 TO n DO
    FOR j FROM 1 TO target DO
      dp[i][j] <- dp[i-1][j]
      
      IF j >= arr[i-1] THEN
        dp[i][j] <- dp[i][j] OR dp[i-1][j - arr[i-1]]
      END IF
    END FOR
  END FOR
  
  RETURN dp[n][target]
END FUNCTION`,

  mazeSolver: `FUNCTION SolveMaze(maze: Matrix, n: Integer)
  DECLARE solution: Matrix[n][n]
  
  InitializeSolution(solution, n)
  
  IF SolveMazeUtil(maze, 0, 0, solution, n) THEN
    RETURN solution
  ELSE
    RETURN NULL
  END IF
END FUNCTION

FUNCTION SolveMazeUtil(maze: Matrix, x: Integer, y: Integer, sol: Matrix, n: Integer)
  IF x == n-1 AND y == n-1 AND maze[x][y] == 1 THEN
    sol[x][y] <- 1
    RETURN TRUE
  END IF
  
  IF IsSafe(maze, x, y, n) THEN
    IF sol[x][y] == 1 THEN
      RETURN FALSE  // Already visited
    END IF
    
    sol[x][y] <- 1
    
    // Move right
    IF SolveMazeUtil(maze, x + 1, y, sol, n) THEN
      RETURN TRUE
    END IF
    
    // Move down
    IF SolveMazeUtil(maze, x, y + 1, sol, n) THEN
      RETURN TRUE
    END IF
    
    // Move left
    IF SolveMazeUtil(maze, x - 1, y, sol, n) THEN
      RETURN TRUE
    END IF
    
    // Move up
    IF SolveMazeUtil(maze, x, y - 1, sol, n) THEN
      RETURN TRUE
    END IF
    
    sol[x][y] <- 0  // Backtrack
    RETURN FALSE
  END IF
  
  RETURN FALSE
END FUNCTION

FUNCTION IsSafe(maze: Matrix, x: Integer, y: Integer, n: Integer)
  RETURN x >= 0 AND x < n AND y >= 0 AND y < n AND maze[x][y] == 1
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  nQueens: `bool isSafe(vector<vector<char>>& board, int row, int col, int n) {
  // Check column
  for (int i = 0; i < row; i++) {
    if (board[i][col] == 'Q')
      return false;
  }
  
  // Check diagonal (up-left)
  for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] == 'Q')
      return false;
  }
  
  // Check diagonal (up-right)
  for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
    if (board[i][j] == 'Q')
      return false;
  }
  
  return true;
}

void solveNQueens(vector<vector<char>>& board, int row, int n,
                  vector<vector<string>>& solutions) {
  if (row == n) {
    vector<string> solution;
    for (auto& r : board) {
      solution.push_back(string(r.begin(), r.end()));
    }
    solutions.push_back(solution);
    return;
  }
  
  for (int col = 0; col < n; col++) {
    if (isSafe(board, row, col, n)) {
      board[row][col] = 'Q';
      
      solveNQueens(board, row + 1, n, solutions);
      
      board[row][col] = '.'; // Backtrack
    }
  }
}

vector<vector<string>> nQueens(int n) {
  vector<vector<string>> solutions;
  vector<vector<char>> board(n, vector<char>(n, '.'));
  
  solveNQueens(board, 0, n, solutions);
  
  return solutions;
}`,

  sudokuSolver: `bool isValid(vector<vector<int>>& board, int row, int col, int num) {
  // Check row
  for (int j = 0; j < 9; j++) {
    if (board[row][j] == num)
      return false;
  }
  
  // Check column
  for (int i = 0; i < 9; i++) {
    if (board[i][col] == num)
      return false;
  }
  
  // Check 3x3 box
  int startRow = (row / 3) * 3;
  int startCol = (col / 3) * 3;
  
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] == num)
        return false;
    }
  }
  
  return true;
}

bool solveSudoku(vector<vector<int>>& board) {
  for (int row = 0; row < 9; row++) {
    for (int col = 0; col < 9; col++) {
      if (board[row][col] == 0) {
        for (int num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku(board))
              return true;
            
            board[row][col] = 0; // Backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}`,

  permutation: `void permute(vector<int>& nums, int start, vector<vector<int>>& result) {
  if (start == nums.size()) {
    result.push_back(nums);
    return;
  }
  
  for (int i = start; i < nums.size(); i++) {
    swap(nums[start], nums[i]);
    
    permute(nums, start + 1, result);
    
    swap(nums[start], nums[i]); // Backtrack
  }
}

vector<vector<int>> permutations(vector<int>& nums) {
  vector<vector<int>> result;
  permute(nums, 0, result);
  return result;
}

// Alternative with used array
void permuteHelper(vector<int>& nums, vector<int>& path,
                   vector<bool>& used, vector<vector<int>>& result) {
  if (path.size() == nums.size()) {
    result.push_back(path);
    return;
  }
  
  for (int i = 0; i < nums.size(); i++) {
    if (!used[i]) {
      used[i] = true;
      path.push_back(nums[i]);
      
      permuteHelper(nums, path, used, result);
      
      path.pop_back(); // Backtrack
      used[i] = false;
    }
  }
}`,

  subsetSum: `void findSubsets(vector<int>& arr, int index, int target,
                int currentSum, vector<int>& current,
                vector<vector<int>>& result) {
  if (currentSum == target) {
    result.push_back(current);
    return;
  }
  
  if (index == arr.size() || currentSum > target)
    return;
  
  // Include current element
  current.push_back(arr[index]);
  findSubsets(arr, index + 1, target, currentSum + arr[index],
              current, result);
  
  // Exclude current element (backtrack)
  current.pop_back();
  findSubsets(arr, index + 1, target, currentSum, current, result);
}

vector<vector<int>> subsetSum(vector<int>& arr, int target) {
  vector<vector<int>> result;
  vector<int> current;
  
  findSubsets(arr, 0, target, 0, current, result);
  
  return result;
}

// DP version
bool subsetSumDP(vector<int>& arr, int target) {
  int n = arr.size();
  vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
  
  for (int i = 0; i <= n; i++)
    dp[i][0] = true;
  
  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= target; j++) {
      dp[i][j] = dp[i-1][j];
      
      if (j >= arr[i-1])
        dp[i][j] = dp[i][j] || dp[i-1][j - arr[i-1]];
    }
  }
  
  return dp[n][target];
}`,

  mazeSolver: `bool isSafe(vector<vector<int>>& maze, int x, int y, int n) {
  return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] == 1;
}

bool solveMazeUtil(vector<vector<int>>& maze, int x, int y,
                   vector<vector<int>>& sol, int n) {
  // Reached destination
  if (x == n - 1 && y == n - 1 && maze[x][y] == 1) {
    sol[x][y] = 1;
    return true;
  }
  
  if (isSafe(maze, x, y, n)) {
    // Already visited
    if (sol[x][y] == 1)
      return false;
    
    sol[x][y] = 1;
    
    // Move right
    if (solveMazeUtil(maze, x + 1, y, sol, n))
      return true;
    
    // Move down
    if (solveMazeUtil(maze, x, y + 1, sol, n))
      return true;
    
    // Move left
    if (solveMazeUtil(maze, x - 1, y, sol, n))
      return true;
    
    // Move up
    if (solveMazeUtil(maze, x, y - 1, sol, n))
      return true;
    
    sol[x][y] = 0; // Backtrack
    return false;
  }
  
  return false;
}

bool solveMaze(vector<vector<int>>& maze, int n) {
  vector<vector<int>> solution(n, vector<int>(n, 0));
  
  if (solveMazeUtil(maze, 0, 0, solution, n)) {
    // Print or return solution
    return true;
  }
  
  return false;
}`,
}

const ALGO_INFO = {
  nQueens: {
    title: 'N-QUEENS PROBLEM',
    description: 'Menempatkan N ratu di papan catur N×N sehingga tidak ada dua ratu yang saling menyerang.',
    complexity: 'O(N!)',
    useCase: 'Puzzle solving, constraint satisfaction, brute-force optimization',
  },
  sudokuSolver: {
    title: 'SUDOKU SOLVER',
    description: 'Mengisi grid 9×9 dengan angka 1-9 sehingga setiap baris, kolom, dan subgrid 3×3 berisi angka unik.',
    complexity: 'O(9^(n²)) teoretis, O(n!) praktis',
    useCase: 'Puzzle games, constraint propagation, recursive problem solving',
  },
  permutation: {
    title: 'PERMUTATIONS GENERATION',
    description: 'Menghasilkan semua permutasi dari himpunan elemen dengan backtracking dan swapping.',
    complexity: 'O(n!)',
    useCase: 'Brute-force search, anagram generation, combinatorial problems',
  },
  subsetSum: {
    title: 'SUBSET SUM',
    description: 'Menemukan subset dari himpunan angka yang menjumlahkan ke target tertentu.',
    complexity: 'O(2^n)',
    useCase: 'Knapsack problems, resource allocation, financial planning',
  },
  mazeSolver: {
    title: 'MAZE SOLVER (BACKTRACKING)',
    description: 'Menemukan path dari start ke finish dengan mencoba semua kemungkinan dan backtrack saat dead end.',
    complexity: 'O(4^(n²)) untuk grid n×n',
    useCase: 'Pathfinding, puzzle games, robot navigation',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const GridVisualization = ({ grid, highlightCells = [], activeCells = [], title = 'Grid Visualization' }) => {
  const cellSize = grid.length <= 9 ? 40 : 30
  const gridSize = grid.length * cellSize

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Grid3x3 size={14} /> {title}
        </h3>
        <div className='flex gap-2'>
          {['SOLUTION', 'TRYING', 'BACKTRACK'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'SOLUTION' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : label === 'TRYING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div
        className='mx-auto'
        style={{ width: gridSize, height: gridSize }}>
        <div
          className='grid gap-[2px] bg-slate-700 p-[2px]'
          style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}>
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isHighlight = highlightCells.some((c) => c.row === i && c.col === j)
              const isActive = activeCells.some((c) => c.row === i && c.col === j)

              let bgColor = 'bg-slate-800'
              let textColor = 'text-slate-300'

              if (isActive) {
                bgColor = 'bg-yellow-500/20 border-2 border-yellow-400'
                textColor = 'text-yellow-400'
              } else if (isHighlight) {
                bgColor = 'bg-emerald-500/20 border-2 border-emerald-400'
                textColor = 'text-emerald-400'
              } else if (cell === 'Q' || cell === 1) {
                bgColor = 'bg-blue-500/20'
                textColor = 'text-blue-400'
              }

              return (
                <div
                  key={`${i}-${j}`}
                  className={`${bgColor} ${textColor} flex items-center justify-center font-mono text-xs font-bold transition-all duration-300`}
                  style={{ width: cellSize, height: cellSize }}>
                  {cell === 'Q' ? '♛' : cell === 0 || cell === '.' ? '' : cell}
                </div>
              )
            })
          )}
        </div>
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
    const words = text.split(/(\s+)/)

    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) {
        return <span key={idx}>{word}</span>
      }

      const keywords = ['void', 'int', 'bool', 'vector', 'for', 'while', 'if', 'else', 'return', 'swap', 'break', 'continue', 'true', 'false']

      if (keywords.includes(word)) {
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
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

const BTAlgo = () => {
  const [algorithm, setAlgorithm] = useState('nQueens')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const snapshot = (grid, highlightCells, activeCells, line, desc) => ({
    grid: grid.map((row) => [...row]),
    highlightCells: [...highlightCells],
    activeCells: [...activeCells],
    activeLine: line,
    description: desc,
  })

  const generateSteps = (algo) => {
    let s = []

    if (algo === 'nQueens') {
      const n = 4
      const board = Array(n)
        .fill(null)
        .map(() => Array(n).fill('.'))

      s.push(snapshot(board, [], [], 1, 'Mulai N-Queens untuk n=4'))

      const solve = (row) => {
        if (row === n) {
          s.push(snapshot(board, [], [], 7, 'Solusi ditemukan!'))
          return true
        }

        for (let col = 0; col < n; col++) {
          s.push(snapshot(board, [], [{ row, col }], 11, `Mencoba menempatkan ratu di (${row}, ${col})`))

          // Check if safe
          let safe = true
          // Check column
          for (let i = 0; i < row; i++) {
            if (board[i][col] === 'Q') {
              safe = false
              break
            }
          }

          if (safe) {
            board[row][col] = 'Q'
            s.push(snapshot(board, [{ row, col }], [], 13, `Ratu ditempatkan di (${row}, ${col})`))

            if (solve(row + 1)) {
              return true
            }

            board[row][col] = '.'
            s.push(snapshot(board, [], [], 17, `Backtrack dari (${row}, ${col})`))
          } else {
            s.push(snapshot(board, [], [], 14, `Posisi (${row}, ${col}) tidak aman`))
          }
        }

        return false
      }

      solve(0)
    } else if (algo === 'permutation') {
      const arr = [1, 2, 3]
      s.push(snapshot([arr], [], [], 1, 'Mulai generate permutations untuk [1,2,3]'))

      const permute = (start) => {
        if (start === arr.length) {
          s.push(snapshot([arr], [], [], 3, `Permutasi: ${arr.join(',')}`))
          return
        }

        for (let i = start; i < arr.length; i++) {
          s.push(snapshot([arr], [], [{ row: 0, col: i }], 7, `Swap posisi ${start} dengan ${i}`))
          ;[arr[start], arr[i]] = [arr[i], arr[start]]

          s.push(snapshot([arr], [{ row: 0, col: start }], [], 9, `Array setelah swap: ${arr.join(',')}`))

          permute(start + 1)
          ;[arr[start], arr[i]] = [arr[i], arr[start]]
          s.push(snapshot([arr], [], [], 13, `Backtrack: restore ke ${arr.join(',')}`))
        }
      }

      permute(0)
    } else if (algo === 'mazeSolver') {
      const n = 5
      const maze = [
        [1, 0, 0, 0, 0],
        [1, 1, 0, 1, 0],
        [0, 1, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [0, 0, 0, 1, 1],
      ]
      const sol = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0))

      s.push(snapshot(maze, [], [], 1, 'Mulai maze solver'))

      const solveMaze = (x, y) => {
        if (x === n - 1 && y === n - 1 && maze[x][y] === 1) {
          sol[x][y] = 1
          s.push(snapshot(sol, [{ row: x, col: y }], [], 8, 'Mencapai tujuan!'))
          return true
        }

        if (x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1) {
          if (sol[x][y] === 1) return false

          sol[x][y] = 1
          s.push(snapshot(sol, [{ row: x, col: y }], [], 17, `Kunjungi (${x}, ${y})`))

          // Try all 4 directions
          if (solveMaze(x + 1, y)) return true
          if (solveMaze(x, y + 1)) return true
          if (solveMaze(x - 1, y)) return true
          if (solveMaze(x, y - 1)) return true

          sol[x][y] = 0
          s.push(snapshot(sol, [], [{ row: x, col: y }], 35, `Backtrack dari (${x}, ${y})`))
          return false
        }

        return false
      }

      solveMaze(0, 0)
    } else {
      // Placeholder
      s.push(snapshot([[]], [], [], 1, `${ALGO_INFO[algo].title} - Visualisasi dalam pengembangan`))
    }

    s.push(snapshot(steps.length > 0 ? steps[steps.length - 1].grid : [[]], [], [], -1, 'Algoritma selesai'))
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
  }, [algorithm])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 600)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps])

  const currentVisual = steps[currentStep] || {
    grid: [[]],
    highlightCells: [],
    activeCells: [],
    activeLine: 0,
    description: 'Loading...',
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Undo2
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGODP<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Algoritma Backtracking</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='nQueens'>N-Queens</option>
              <option value='sudokuSolver'>Sudoku Solver</option>
              <option value='permutation'>Permutations</option>
              <option value='subsetSum'>Subset Sum</option>
              <option value='mazeSolver'>Maze Solver</option>
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
            <Undo2
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
          <GridVisualization
            grid={currentVisual.grid}
            highlightCells={currentVisual.highlightCells}
            activeCells={currentVisual.activeCells}
            title={ALGO_INFO[algorithm].title}
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

export default BTAlgo
