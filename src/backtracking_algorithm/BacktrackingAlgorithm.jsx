import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Undo2, Code, Variable, Layers, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Crown, Grid3x3, Shuffle } from 'lucide-react'

const BacktrackingAlgorithm = () => {
  // --- STATE ---
  const [speed, setSpeed] = useState(5)
  const [algorithm, setAlgorithm] = useState('nqueens')

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Algorithm-specific inputs
  const [queensN, setQueensN] = useState(4)
  const [mazeRows, setMazeRows] = useState(11)
  const [mazeCols, setMazeCols] = useState(11)

  const algorithmDescriptions = {
    nqueens: {
      title: 'N-Queens Problem',
      description: 'Tempatkan N queens di papan catur N×N sehingga tidak ada queen yang saling menyerang (sama row/column/diagonal). Backtracking mencoba posisi dan mundur ketika konflik.',
      complexity: 'O(N!) worst case dengan pruning optimization',
      useCase: 'Constraint satisfaction, game AI, placement problems, scheduling',
    },
    sudoku: {
      title: 'Sudoku Solver (9×9)',
      description: 'Selesaikan puzzle Sudoku dengan backtracking. Coba angka 1-9 di cell kosong, validasi constraint (row, column, 3×3 box), backtrack jika tidak valid.',
      complexity: 'O(9^m) dimana m = empty cells',
      useCase: 'Puzzle solving, constraint satisfaction, logic games',
    },
    maze: {
      title: 'Maze Generation - Recursive Backtracker',
      description: 'Generate perfect maze dengan recursive backtracking. Pilih neighbor random, carve path, recurse. Backtrack ketika semua neighbor sudah visited, creating dead-ends.',
      complexity: 'O(rows × cols)',
      useCase: 'Game development, procedural generation, pathfinding testing',
    },
    subset: {
      title: 'Subset Sum Problem',
      description: 'Temukan subset dari array yang jumlahnya = target. Decision tree: include atau exclude element. Backtrack jika sum > target atau tidak mungkin mencapai target.',
      complexity: 'O(2^n) - exponential search space',
      useCase: 'Partition problems, combinatorial optimization, knapsack variant',
    },
    hamiltonian: {
      title: 'Hamiltonian Path in Graph',
      description: 'Temukan path yang mengunjungi setiap vertex tepat sekali. Backtrack explore semua kemungkinan path, mark visited, backtrack ketika stuck atau semua neighbors visited.',
      complexity: 'O(N!) - NP-complete problem',
      useCase: 'Traveling salesman, circuit design, DNA sequencing, route optimization',
    },
  }

  const algoCode = {
    nqueens: `function solveNQueens(board, col) {
  if (col >= n) return true; // All placed
  
  for (let row = 0; row < n; row++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 1; // Place queen
      
      if (solveNQueens(board, col + 1))
        return true;
      
      board[row][col] = 0; // Backtrack
    }
  }
  return false;
}`,
    sudoku: `function solveSudoku(grid, row, col) {
  if (row === 9) return true;
  if (col === 9) 
    return solveSudoku(grid, row+1, 0);
  if (grid[row][col] !== 0) 
    return solveSudoku(grid, row, col+1);
  
  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid, row, col+1))
        return true;
      grid[row][col] = 0; // Backtrack
    }
  }
  return false;
}`,
    maze: `function generateMaze(current) {
  visited.add(current);
  let neighbors = getUnvisited(current);
  
  while (neighbors.length > 0) {
    let next = random(neighbors);
    removeWall(current, next);
    generateMaze(next); // Recurse
    neighbors = getUnvisited(current);
  }
  // Backtrack implicitly
}`,
    subset: `function subsetSum(arr, i, sum, subset) {
  if (sum === target) {
    solutions.push([...subset]);
    return;
  }
  if (i >= n || sum > target) return;
  
  subset.push(arr[i]); // Include
  subsetSum(arr, i+1, sum+arr[i], subset);
  subset.pop(); // Backtrack
  
  subsetSum(arr, i+1, sum, subset); // Exclude
}`,
    hamiltonian: `function hamiltonianPath(v, path) {
  if (path.length === n) return true;
  
  for (let next of graph[v]) {
    if (!visited[next]) {
      visited[next] = true;
      path.push(next);
      
      if (hamiltonianPath(next, path))
        return true;
      
      path.pop(); // Backtrack
      visited[next] = false;
    }
  }
  return false;
}`,
  }

  // --- ENGINE: SNAPSHOT ---
  const snapshot = (board, row, col, status, desc, vars = {}, extra = {}) => ({
    board: board ? JSON.parse(JSON.stringify(board)) : null,
    currentRow: row,
    currentCol: col,
    status: status, // 'trying', 'valid', 'invalid', 'backtrack', 'solution'
    stepDescription: desc,
    variables: { ...vars },
    ...extra,
  })

  const generateSteps = (algoType) => {
    const stepsArr = []

    if (algoType === 'nqueens') {
      const n = queensN
      let board = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0))

      const isSafe = (board, row, col) => {
        // Check left side of current row
        for (let i = 0; i < col; i++) {
          if (board[row][i] === 1) return false
        }
        // Check upper diagonal on left
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
          if (board[i][j] === 1) return false
        }
        // Check lower diagonal on left
        for (let i = row, j = col; i < n && j >= 0; i++, j--) {
          if (board[i][j] === 1) return false
        }
        return true
      }

      const getAttackedCells = (board, row, col) => {
        const attacked = []
        // Row
        for (let i = 0; i < n; i++) {
          if (i !== col) attacked.push([row, i])
        }
        // Column
        for (let i = 0; i < n; i++) {
          if (i !== row) attacked.push([i, col])
        }
        // Diagonals
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (i !== row && j !== col && Math.abs(i - row) === Math.abs(j - col)) {
              attacked.push([i, j])
            }
          }
        }
        return attacked
      }

      let solutionFound = false

      const solveNQueens = (board, col) => {
        if (col >= n) {
          solutionFound = true
          stepsArr.push(snapshot(board, -1, -1, 'solution', `✓ Solution found! All ${n} queens placed safely. No queens attack each other.`, { queens: n }, { attackedCells: [] }))
          return true
        }

        for (let row = 0; row < n; row++) {
          stepsArr.push(snapshot(board, row, col, 'trying', `Column ${col}, Row ${row}: Try placing queen at position (${row}, ${col})...`, { col, row, queens: col }, { attackedCells: [] }))

          if (isSafe(board, row, col)) {
            board[row][col] = 1
            const attacked = getAttackedCells(board, row, col)
            stepsArr.push(snapshot(board, row, col, 'valid', `✓ Safe! Queen ${col + 1} placed at (${row}, ${col}). This queen attacks ${attacked.length} cells. Moving to column ${col + 1}.`, { col, row, queens: col + 1 }, { attackedCells: attacked }))

            if (solveNQueens(board, col + 1)) return true

            // Backtrack
            board[row][col] = 0
            stepsArr.push(snapshot(board, row, col, 'backtrack', `✗ Backtrack! Dead end reached. Remove queen from (${row}, ${col}) and try next row.`, { col, row, queens: col }, { attackedCells: [] }))
          } else {
            stepsArr.push(snapshot(board, row, col, 'invalid', `✗ Conflict! Position (${row}, ${col}) is under attack. Try next row.`, { col, row }, { attackedCells: [] }))
          }
        }
        return false
      }

      stepsArr.push(snapshot(board, -1, -1, 'start', `Start ${n}-Queens Problem. Goal: Place ${n} queens, one per column, with no attacks.`, { n, queens: 0 }, { attackedCells: [] }))

      solveNQueens(board, 0)

      if (!solutionFound) {
        stepsArr.push(snapshot(board, -1, -1, 'no_solution', `No solution exists for ${n}-Queens with current configuration.`, { n }, { attackedCells: [] }))
      }
    } else if (algoType === 'sudoku') {
      // Simple Sudoku puzzle (easy)
      let grid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9],
      ]

      const isValid = (grid, row, col, num) => {
        // Check row
        for (let x = 0; x < 9; x++) {
          if (grid[row][x] === num) return false
        }
        // Check column
        for (let x = 0; x < 9; x++) {
          if (grid[x][col] === num) return false
        }
        // Check 3x3 box
        let startRow = row - (row % 3),
          startCol = col - (col % 3)
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false
          }
        }
        return true
      }

      let stepCount = 0
      const maxSteps = 150 // Limit steps for visualization

      const solveSudoku = (grid, row, col) => {
        if (stepCount >= maxSteps) return false

        if (row === 9) {
          stepsArr.push(snapshot(grid, row, col, 'solution', `✓ Sudoku solved! All cells filled correctly with valid constraints.`, { filled: 81 }))
          return true
        }

        if (col === 9) return solveSudoku(grid, row + 1, 0)

        if (grid[row][col] !== 0) {
          return solveSudoku(grid, row, col + 1)
        }

        for (let num = 1; num <= 9; num++) {
          stepCount++
          if (stepCount >= maxSteps) return false

          stepsArr.push(snapshot(grid, row, col, 'trying', `Cell (${row}, ${col}): Try number ${num}...`, { row, col, trying: num }))

          if (isValid(grid, row, col, num)) {
            grid[row][col] = num
            stepsArr.push(snapshot(grid, row, col, 'valid', `✓ Valid! ${num} placed at (${row}, ${col}). No conflicts in row/col/box.`, { row, col, placed: num }))

            if (solveSudoku(grid, row, col + 1)) return true

            grid[row][col] = 0
            stepsArr.push(snapshot(grid, row, col, 'backtrack', `✗ Backtrack! Remove ${num} from (${row}, ${col}). Try next number.`, { row, col, removed: num }))
          } else {
            stepsArr.push(snapshot(grid, row, col, 'invalid', `✗ Invalid! ${num} conflicts with existing numbers. Try next.`, { row, col, conflict: num }))
          }
        }
        return false
      }

      stepsArr.push(snapshot(grid, -1, -1, 'start', `Start Sudoku Solver. Fill empty cells (0) with numbers 1-9 following Sudoku rules.`, {}))

      solveSudoku(grid, 0, 0)
    } else if (algoType === 'maze') {
      const rows = mazeRows
      const cols = mazeCols
      // Grid: each cell has {visited: bool, walls: {top, right, bottom, left}}
      let grid = Array(rows)
        .fill(0)
        .map(() =>
          Array(cols)
            .fill(0)
            .map(() => ({
              visited: false,
              walls: { top: true, right: true, bottom: true, left: true },
            }))
        )

      const getNeighbors = (row, col) => {
        const neighbors = []
        if (row > 0) neighbors.push({ row: row - 1, col, dir: 'top' })
        if (col < cols - 1) neighbors.push({ row, col: col + 1, dir: 'right' })
        if (row < rows - 1) neighbors.push({ row: row + 1, col, dir: 'bottom' })
        if (col > 0) neighbors.push({ row, col: col - 1, dir: 'left' })
        return neighbors.filter((n) => !grid[n.row][n.col].visited)
      }

      const removeWall = (current, next) => {
        const dr = next.row - current.row
        const dc = next.col - current.col

        if (dr === -1) {
          grid[current.row][current.col].walls.top = false
          grid[next.row][next.col].walls.bottom = false
        } else if (dr === 1) {
          grid[current.row][current.col].walls.bottom = false
          grid[next.row][next.col].walls.top = false
        } else if (dc === 1) {
          grid[current.row][current.col].walls.right = false
          grid[next.row][next.col].walls.left = false
        } else if (dc === -1) {
          grid[current.row][current.col].walls.left = false
          grid[next.row][next.col].walls.right = false
        }
      }

      const stack = []
      let stepCount = 0
      const maxSteps = 200

      const generateMaze = (row, col) => {
        if (stepCount >= maxSteps) return

        grid[row][col].visited = true
        stepCount++

        stepsArr.push(snapshot(grid, row, col, 'visiting', `Visit cell (${row}, ${col}). Mark as visited.`, { row, col, stackSize: stack.length }, { stack: [...stack] }))

        let neighbors = getNeighbors(row, col)

        while (neighbors.length > 0) {
          if (stepCount >= maxSteps) return

          const next = neighbors[Math.floor(Math.random() * neighbors.length)]
          stack.push({ row, col })

          removeWall({ row, col }, next)
          stepCount++

          stepsArr.push(snapshot(grid, next.row, next.col, 'carving', `Carve path from (${row}, ${col}) to (${next.row}, ${next.col}). Remove wall.`, { from: `(${row},${col})`, to: `(${next.row},${next.col})` }, { stack: [...stack] }))

          generateMaze(next.row, next.col)
          neighbors = getNeighbors(row, col)
        }

        if (stack.length > 0) {
          const prev = stack.pop()
          stepCount++
          stepsArr.push(snapshot(grid, prev.row, prev.col, 'backtrack', `✗ No unvisited neighbors. Backtrack to (${prev.row}, ${prev.col}).`, { row: prev.row, col: prev.col }, { stack: [...stack] }))
        }
      }

      stepsArr.push(snapshot(grid, -1, -1, 'start', `Generate ${rows}×${cols} maze using recursive backtracking. Start at (0, 0).`, { rows, cols }, { stack: [] }))

      generateMaze(0, 0)

      stepsArr.push(snapshot(grid, -1, -1, 'complete', `✓ Maze generation complete! Perfect maze with single solution path.`, { rows, cols }, { stack: [] }))
    } else if (algoType === 'subset') {
      const arr = [3, 34, 4, 12, 5, 2]
      const target = 9
      const solutions = []
      let stepCount = 0
      const maxSteps = 100

      const subsetSum = (i, sum, subset) => {
        if (stepCount >= maxSteps) return

        if (sum === target) {
          solutions.push([...subset])
          stepCount++
          stepsArr.push(snapshot([arr], -1, -1, 'solution', `✓ Solution found: {${subset.join(', ')}} = ${target}`, { subset: subset.join(','), sum: target, solutions: solutions.length }, { subset: [...subset], index: i }))
          return
        }

        if (i >= arr.length || sum > target) {
          stepCount++
          stepsArr.push(snapshot([arr], -1, i >= arr.length ? -1 : i, 'pruned', i >= arr.length ? `End of array. Backtrack.` : `Sum ${sum} > target ${target}. Prune branch.`, { i, sum, subset: subset.join(',') || 'empty' }, { subset: [...subset], index: i }))
          return
        }

        // Include arr[i]
        stepCount++
        stepsArr.push(snapshot([arr], -1, i, 'include', `Include arr[${i}] = ${arr[i]}. New sum = ${sum} + ${arr[i]} = ${sum + arr[i]}`, { i, value: arr[i], sum: sum + arr[i] }, { subset: [...subset, arr[i]], index: i }))

        subset.push(arr[i])
        subsetSum(i + 1, sum + arr[i], subset)
        subset.pop()

        // Exclude arr[i]
        stepCount++
        stepsArr.push(snapshot([arr], -1, i, 'exclude', `Skip arr[${i}] = ${arr[i]}. Sum remains ${sum}. Try next element.`, { i, value: arr[i], sum }, { subset: [...subset], index: i }))

        subsetSum(i + 1, sum, subset)
      }

      stepsArr.push(snapshot([arr], -1, -1, 'start', `Find subsets of [${arr.join(', ')}] that sum to ${target}. Try include/exclude each element.`, { array: arr.join(','), target }, { subset: [], index: 0 }))

      subsetSum(0, 0, [])

      stepsArr.push(snapshot([arr], -1, -1, 'complete', `Search complete! Found ${solutions.length} solution(s).`, { solutions: solutions.length }, { subset: [], index: 0 }))
    } else if (algoType === 'hamiltonian') {
      // Small graph for visualization
      const nodes = [
        { id: 0, label: 'A', x: 300, y: 100 },
        { id: 1, label: 'B', x: 150, y: 200 },
        { id: 2, label: 'C', x: 450, y: 200 },
        { id: 3, label: 'D', x: 200, y: 300 },
        { id: 4, label: 'E', x: 400, y: 300 },
      ]

      const edges = [
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ]

      const adj = {}
      nodes.forEach((n) => (adj[n.id] = []))
      edges.forEach(([u, v]) => {
        adj[u].push(v)
        adj[v].push(u)
      })

      const n = nodes.length
      let visited = Array(n).fill(false)
      let path = []
      let found = false
      let stepCount = 0
      const maxSteps = 80

      const hamiltonianPath = (v) => {
        if (stepCount >= maxSteps) return false

        if (path.length === n) {
          found = true
          stepCount++
          stepsArr.push(snapshot(null, -1, -1, 'solution', `✓ Hamiltonian path found: ${path.map((id) => nodes[id].label).join(' → ')}`, { pathLength: n, path: path.map((id) => nodes[id].label).join('→') }, { graph: { nodes, edges }, path: [...path], visited: [...visited] }))
          return true
        }

        for (let next of adj[v]) {
          if (!visited[next]) {
            stepCount++
            stepsArr.push(snapshot(null, -1, -1, 'trying', `From ${nodes[v].label}, try visiting ${nodes[next].label}. Path: ${path.map((id) => nodes[id].label).join('→')} → ${nodes[next].label}`, { from: nodes[v].label, to: nodes[next].label, pathLength: path.length + 1 }, { graph: { nodes, edges }, path: [...path, next], visited: [...visited] }))

            visited[next] = true
            path.push(next)

            if (hamiltonianPath(next)) return true

            path.pop()
            visited[next] = false

            stepCount++
            stepsArr.push(snapshot(null, -1, -1, 'backtrack', `✗ Dead end from ${nodes[next].label}. Backtrack to ${nodes[v].label}.`, { backFrom: nodes[next].label, backTo: nodes[v].label }, { graph: { nodes, edges }, path: [...path], visited: [...visited] }))
          }
        }
        return false
      }

      stepsArr.push(snapshot(null, -1, -1, 'start', `Find Hamiltonian path in graph (visit all ${n} vertices exactly once). Start from ${nodes[0].label}.`, { vertices: n }, { graph: { nodes, edges }, path: [], visited: [...visited] }))

      visited[0] = true
      path.push(0)
      hamiltonianPath(0)

      if (!found) {
        stepsArr.push(snapshot(null, -1, -1, 'no_solution', `No Hamiltonian path found starting from ${nodes[0].label}.`, {}, { graph: { nodes, edges }, path: [], visited: Array(n).fill(false) }))
      }
    }

    return stepsArr
  }

  // --- CONTROL ---
  useEffect(() => {
    resetAndGenerate()
  }, [algorithm, queensN, mazeRows, mazeCols])

  const resetAndGenerate = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generatedSteps = generateSteps(algorithm)
    setSteps(generatedSteps)
  }

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 1050 - speed * 100)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps.length, speed])

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }
  const handleBegin = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }
  const handleEnd = () => {
    setIsPlaying(false)
    setCurrentStep(steps.length - 1)
  }

  const currentVisual = steps[currentStep] || {
    board: null,
    currentRow: -1,
    currentCol: -1,
    status: 'start',
    stepDescription: 'Loading...',
    variables: {},
  }

  const renderCodeBlock = (codeString) => {
    const lines = codeString.trim().split('\n')
    return lines.map((line, index) => (
      <div
        key={index}
        className='flex px-2 py-0.5'>
        <span className='w-8 text-slate-600 text-right mr-3 text-xs leading-5'>{index + 1}</span>
        <span className='font-mono text-xs whitespace-pre text-slate-300'>{line}</span>
      </div>
    ))
  }

  const renderNQueens = () => {
    const board = currentVisual.board
    if (!board) return null
    const n = board.length
    const attacked = currentVisual.attackedCells || []

    return (
      <div className='flex flex-col items-center gap-2'>
        <div
          className='grid gap-0 border-2 border-pink-700'
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {board.map((row, i) =>
            row.map((cell, j) => {
              const isCurrentCell = currentVisual.currentRow === i && currentVisual.currentCol === j
              const hasQueen = cell === 1
              const isAttacked = attacked.some(([ar, ac]) => ar === i && ac === j)
              const isEvenSquare = (i + j) % 2 === 0

              let bgClass = isEvenSquare ? 'bg-slate-700' : 'bg-slate-600'
              let textClass = 'text-slate-400'

              if (isCurrentCell && currentVisual.status === 'trying') {
                bgClass = 'bg-yellow-400'
                textClass = 'text-black'
              } else if (isCurrentCell && currentVisual.status === 'valid') {
                bgClass = 'bg-emerald-500'
                textClass = 'text-white'
              } else if (isCurrentCell && currentVisual.status === 'invalid') {
                bgClass = 'bg-red-500'
                textClass = 'text-white'
              } else if (isCurrentCell && currentVisual.status === 'backtrack') {
                bgClass = 'bg-pink-400'
                textClass = 'text-white'
              } else if (hasQueen) {
                bgClass = 'bg-emerald-700'
                textClass = 'text-yellow-300'
              } else if (isAttacked) {
                bgClass = 'bg-red-900/40'
              }

              const size = n <= 4 ? 'w-16 h-16' : n <= 6 ? 'w-12 h-12' : 'w-10 h-10'

              return (
                <div
                  key={`${i}-${j}`}
                  className={`${size} flex items-center justify-center border border-slate-800 transition-all ${bgClass} ${textClass} font-bold text-xl`}>
                  {hasQueen ? '♛' : ''}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderSudoku = () => {
    const grid = currentVisual.board
    if (!grid) return null

    return (
      <div className='flex flex-col items-center'>
        <div
          className='grid gap-0 border-4 border-pink-700'
          style={{ gridTemplateColumns: `repeat(9, minmax(0, 1fr))` }}>
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isCurrentCell = currentVisual.currentRow === i && currentVisual.currentCol === j
              const isPrefilled = steps[0]?.board?.[i]?.[j] !== 0

              let bgClass = 'bg-slate-800'
              let textClass = 'text-slate-300'
              let borderClass = ''

              // 3x3 box borders
              if (i % 3 === 0) borderClass += ' border-t-2 border-t-pink-600'
              if (j % 3 === 0) borderClass += ' border-l-2 border-l-pink-600'
              if (i === 8) borderClass += ' border-b-2 border-b-pink-600'
              if (j === 8) borderClass += ' border-r-2 border-r-pink-600'

              if (isPrefilled) {
                bgClass = 'bg-slate-700'
                textClass = 'text-white font-bold'
              }

              if (isCurrentCell) {
                if (currentVisual.status === 'trying') {
                  bgClass = 'bg-yellow-400'
                  textClass = 'text-black font-bold'
                } else if (currentVisual.status === 'valid') {
                  bgClass = 'bg-emerald-500'
                  textClass = 'text-white font-bold'
                } else if (currentVisual.status === 'invalid') {
                  bgClass = 'bg-red-500'
                  textClass = 'text-white font-bold'
                } else if (currentVisual.status === 'backtrack') {
                  bgClass = 'bg-pink-400'
                  textClass = 'text-white font-bold'
                }
              }

              return (
                <div
                  key={`${i}-${j}`}
                  className={`w-8 h-8 flex items-center justify-center border border-slate-700 ${borderClass} transition-all ${bgClass} ${textClass} text-sm`}>
                  {cell !== 0 ? cell : ''}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  const renderMaze = () => {
    const grid = currentVisual.board
    if (!grid) return null

    const cellSize = 16
    const rows = grid.length
    const cols = grid[0].length

    return (
      <div className='flex justify-center overflow-auto max-h-[400px]'>
        <svg
          width={cols * cellSize + 2}
          height={rows * cellSize + 2}
          className='border-2 border-pink-700'>
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isCurrentCell = currentVisual.currentRow === i && currentVisual.currentCol === j
              let fill = cell.visited ? '#10b981' : '#334155'

              if (isCurrentCell) {
                if (currentVisual.status === 'visiting') fill = '#facc15'
                else if (currentVisual.status === 'carving') fill = '#22c55e'
                else if (currentVisual.status === 'backtrack') fill = '#f472b6'
              }

              return (
                <g key={`${i}-${j}`}>
                  <rect
                    x={j * cellSize + 1}
                    y={i * cellSize + 1}
                    width={cellSize}
                    height={cellSize}
                    fill={fill}
                  />
                  {cell.walls.top && (
                    <line
                      x1={j * cellSize + 1}
                      y1={i * cellSize + 1}
                      x2={(j + 1) * cellSize + 1}
                      y2={i * cellSize + 1}
                      stroke='#e11d48'
                      strokeWidth='2'
                    />
                  )}
                  {cell.walls.right && (
                    <line
                      x1={(j + 1) * cellSize + 1}
                      y1={i * cellSize + 1}
                      x2={(j + 1) * cellSize + 1}
                      y2={(i + 1) * cellSize + 1}
                      stroke='#e11d48'
                      strokeWidth='2'
                    />
                  )}
                  {cell.walls.bottom && (
                    <line
                      x1={j * cellSize + 1}
                      y1={(i + 1) * cellSize + 1}
                      x2={(j + 1) * cellSize + 1}
                      y2={(i + 1) * cellSize + 1}
                      stroke='#e11d48'
                      strokeWidth='2'
                    />
                  )}
                  {cell.walls.left && (
                    <line
                      x1={j * cellSize + 1}
                      y1={i * cellSize + 1}
                      x2={j * cellSize + 1}
                      y2={(i + 1) * cellSize + 1}
                      stroke='#e11d48'
                      strokeWidth='2'
                    />
                  )}
                </g>
              )
            })
          )}
        </svg>
      </div>
    )
  }

  const renderSubset = () => {
    if (!currentVisual.board || !currentVisual.board[0]) return null
    const arr = currentVisual.board[0]
    const currentIndex = currentVisual.index !== undefined ? currentVisual.index : -1
    const subset = currentVisual.subset || []

    return (
      <div className='flex flex-col gap-4 items-center'>
        <div className='flex gap-2'>
          {arr.map((val, idx) => {
            const isActive = idx === currentIndex
            const isInSubset = subset.includes(val)

            let bgClass = 'bg-slate-800'
            let borderClass = 'border-slate-600'
            let textClass = 'text-slate-300'

            if (isActive) {
              bgClass = 'bg-yellow-400'
              borderClass = 'border-yellow-300'
              textClass = 'text-black font-bold'
            } else if (isInSubset) {
              bgClass = 'bg-emerald-600'
              borderClass = 'border-emerald-400'
              textClass = 'text-white font-bold'
            }

            return (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center border-2 rounded transition-all ${bgClass} ${borderClass} ${textClass}`}>
                {val}
              </div>
            )
          })}
        </div>
        <div className='text-sm text-slate-400'>
          Current Subset: {subset.length > 0 ? `{${subset.join(', ')}}` : 'empty'} = {subset.reduce((a, b) => a + b, 0)}
        </div>
      </div>
    )
  }

  const renderHamiltonian = () => {
    if (!currentVisual.graph) return null
    const { nodes, edges } = currentVisual.graph
    const path = currentVisual.path || []
    const visited = currentVisual.visited || []

    return (
      <div className='relative w-full h-[300px] bg-[#0f1117] flex items-center justify-center'>
        <svg className='absolute inset-0 w-full h-full'>
          {edges.map(([u, v], i) => {
            const n1 = nodes[u]
            const n2 = nodes[v]
            const isInPath = path.length >= 2 && path.includes(u) && path.includes(v) && Math.abs(path.indexOf(u) - path.indexOf(v)) === 1

            return (
              <line
                key={i}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={isInPath ? '#10b981' : '#475569'}
                strokeWidth={isInPath ? '4' : '2'}
              />
            )
          })}
        </svg>
        {nodes.map((node) => {
          const isInPath = path.includes(node.id)
          const isCurrent = path.length > 0 && path[path.length - 1] === node.id

          let bg = 'bg-slate-800'
          let border = 'border-slate-600'
          let text = 'text-slate-400'

          if (isCurrent) {
            bg = 'bg-yellow-500'
            border = 'border-yellow-300'
            text = 'text-black font-bold'
          } else if (isInPath) {
            bg = 'bg-emerald-600'
            border = 'border-emerald-400'
            text = 'text-white font-bold'
          }

          return (
            <div
              key={node.id}
              className='absolute'
              style={{ left: node.x - 20, top: node.y - 20 }}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all z-10 shadow-lg ${bg} ${border} ${text}`}>{node.label}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderVisualization = () => {
    if (algorithm === 'nqueens') return renderNQueens()
    if (algorithm === 'sudoku') return renderSudoku()
    if (algorithm === 'maze') return renderMaze()
    if (algorithm === 'subset') return renderSubset()
    if (algorithm === 'hamiltonian') return renderHamiltonian()
    return null
  }

  const getStatusColor = () => {
    const status = currentVisual.status
    if (status === 'trying') return 'text-yellow-400'
    if (status === 'valid') return 'text-emerald-400'
    if (status === 'invalid' || status === 'pruned') return 'text-red-400'
    if (status === 'backtrack') return 'text-pink-400'
    if (status === 'solution' || status === 'complete') return 'text-emerald-300'
    return 'text-slate-400'
  }

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-pink-600 rounded-lg shadow-lg shadow-pink-500/20'>
                <Undo2
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <div>
                  <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-300 pb-2 mb-1'>Backtracking Algorithms</h1>
                  <p className='text-xs text-slate-400'>Trial, Error & Backtrack Visualization</p>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-pink-500 outline-none'>
                <option value='nqueens'>N-Queens</option>
                <option value='sudoku'>Sudoku Solver</option>
                <option value='maze'>Maze Generation</option>
                <option value='subset'>Subset Sum</option>
                <option value='hamiltonian'>Hamiltonian Path</option>
              </select>
              {algorithm === 'nqueens' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>Data (N)</span>
                    <span className='text-pink-300 font-mono'>{queensN}</span>
                  </div>
                  <input
                    type='range'
                    min='4'
                    max='8'
                    step='1'
                    value={queensN}
                    onChange={(e) => setQueensN(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-pink-500 cursor-pointer'
                  />
                </div>
              )}
              <div className='flex flex-col gap-1 min-w-[100px]'>
                <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                  <span>Speed</span>
                  <span className='text-pink-300 font-mono'>{speed}</span>
                </div>
                <input
                  type='range'
                  min='1'
                  max='10'
                  step='1'
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className='w-24 h-2 bg-slate-700 rounded-lg accent-pink-500 cursor-pointer'
                />
              </div>
              <button
                onClick={resetAndGenerate}
                className='p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white'>
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ALGORITHM DESCRIPTION */}
        <section className='w-full max-w-6xl mb-4'>
          <div className='bg-gradient-to-r from-pink-900/30 to-rose-900/30 border border-pink-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-pink-600 rounded-lg shadow-lg shadow-pink-500/20 mt-1'>
                <Crown
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-pink-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kompleksitas:</span>
                    <span className='text-pink-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
                  </div>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Use Case:</span>
                    <span className='text-slate-300 ml-2'>{algorithmDescriptions[algorithm].useCase}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className='w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* VISUALIZATION */}
          <section className='lg:col-span-2 flex flex-col gap-4'>
            <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[350px]'>
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center text-pink-100 text-sm font-mono'>
                <div className='flex items-center gap-2'>
                  {algorithm === 'nqueens' && (
                    <Crown
                      size={16}
                      className='text-pink-400'
                    />
                  )}
                  {algorithm === 'sudoku' && (
                    <Grid3x3
                      size={16}
                      className='text-pink-400'
                    />
                  )}
                  {algorithm === 'maze' && (
                    <Shuffle
                      size={16}
                      className='text-pink-400'
                    />
                  )}
                  {algorithm === 'subset' && (
                    <Layers
                      size={16}
                      className='text-pink-400'
                    />
                  )}
                  {algorithm === 'hamiltonian' && (
                    <Share2
                      size={16}
                      className='text-pink-400'
                    />
                  )}
                  Visualization
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>{currentVisual.status.toUpperCase()}</div>
              </div>
              <div className='relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[300px]'>{renderVisualization()}</div>
            </div>

            {/* PLAYER CONTROLS MOVED HERE */}
            <div className='w-full bg-slate-800/80 p-2 rounded-xl border border-slate-600 flex justify-center items-center gap-4 shadow-lg'>
              <div className='flex items-center gap-1'>
                <button
                  onClick={handleStop}
                  className='p-2 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition-colors'
                  title='Stop / Reset'>
                  <Square
                    size={20}
                    fill='currentColor'
                  />
                </button>
                <div className='w-px h-6 bg-slate-600 mx-2'></div>
                <button
                  onClick={handleBegin}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg'
                  title='Awal'>
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    if (currentStep > 0) setCurrentStep((c) => c - 1)
                  }}
                  disabled={currentStep === 0}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30'
                  title='Step Back'>
                  <StepBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500' : 'bg-pink-600'} text-white`}>
                  {isPlaying ? (
                    <Pause
                      size={24}
                      fill='currentColor'
                    />
                  ) : (
                    <Play
                      size={24}
                      fill='currentColor'
                      className='ml-1'
                    />
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    if (currentStep < steps.length - 1) setCurrentStep((c) => c + 1)
                  }}
                  disabled={currentStep === steps.length - 1}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30'
                  title='Step Forward'>
                  <StepForward size={20} />
                </button>
                <button
                  onClick={handleEnd}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg'
                  title='Akhir'>
                  <SkipForward size={20} />
                </button>
              </div>
              <div className='hidden md:flex flex-col flex-1 max-w-xs ml-4'>
                <div className='flex justify-between text-[10px] text-slate-400 mb-1'>
                  <span>Progress</span>
                  <span>
                    {currentStep} / {steps.length - 1}
                  </span>
                </div>
                <div className='w-full bg-slate-700 h-1.5 rounded-full overflow-hidden'>
                  <div
                    className='bg-pink-500 h-full transition-all duration-100'
                    style={{ width: `${(currentStep / (steps.length - 1 || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Variables Display */}
            {Object.keys(currentVisual.variables).length > 0 && (
              <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
                <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-slate-800 text-slate-200 text-sm font-semibold'>
                  <Variable
                    size={16}
                    className='text-pink-400'
                  />{' '}
                  Variables
                </div>
                <div className='p-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/50'>
                  {Object.entries(currentVisual.variables).map(([key, val]) => (
                    <div
                      key={key}
                      className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
                      <span className='text-[10px] text-pink-300 font-mono font-bold uppercase'>{key}</span>
                      <span className='text-sm text-white font-bold'>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT INFO */}
          <section className='lg:col-span-1 flex flex-col gap-4'>
            <div className='flex flex-col flex-1 max-h-[40vh] bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden shadow-xl'>
              <div className='bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2 text-slate-200 text-sm font-semibold'>
                <Code
                  size={16}
                  className='text-pink-400'
                />{' '}
                Algorithm
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-pink-900/20 text-pink-100 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-pink-400'
                />{' '}
                Explanation
              </div>
              <div className='p-4 bg-slate-900/50 min-h-[60px] flex items-center'>
                <p className='text-sm text-slate-300 leading-relaxed'>{currentVisual.stepDescription}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default BacktrackingAlgorithm
