import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Undo2,
  Code,
  Variable,
  Layers,
  MessageSquare,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Square,
  Crown,
  Grid3x3,
  Shuffle,
  Share2,
  Clock,
  Info,
  Percent,
} from "lucide-react";

/**
 * BacktrackingAlgorithm Component
 * Visualizes N-Queens, Sudoku, Maze Generation, Subset Sum, and Hamiltonian Path
 * using a symmetrical layout, execution log, and step-by-step visualization.
 */
const BacktrackingAlgorithm = () => {
  // ==========================================
  // 1. CONSTANTS & DEFINITIONS
  // ==========================================

  const STEP_DELAY = 500; // ms per step

  /**
   * Variable descriptions for the variable badge display.
   */
  const variableDefinitions = {
    common: { rows: "Jumlah Baris", cols: "Jumlah Kolom" },
    nqueens: {
      n: "Ukuran Papan",
      queens: "Ratu Terpasang",
      col: "Kolom Aktif",
      row: "Baris Aktif",
    },
    sudoku: {
      row: "Baris",
      col: "Kolom",
      num: "Angka Dicoba",
      filled: "Terisi",
    },
    maze: { stackSize: "Ukuran Stack", row: "Baris", col: "Kolom" },
    subset: {
      sum: "Total Saat Ini",
      target: "Target",
      i: "Indeks",
      subset: "Himpunan Bagian",
    },
    hamiltonian: {
      pathLength: "Panjang Jalur",
      from: "Dari",
      to: "Ke",
      visited: "Dikunjungi",
    },
  };

  /**
   * Detailed algorithm descriptions including complexity and pseudocode.
   */
  const algorithmDescriptions = {
    nqueens: {
      title: "N-Queens Problem",
      description:
        "Menempatkan N ratu di papan catur N×N sehingga tidak ada dua ratu yang saling menyerang. Menggunakan backtracking untuk mencoba penempatan kolom demi kolom dan mundur jika tejadi konflik.",
      complexity: "Time: O(N!), Space: O(N)",
      useCase: "Constraint satisfaction, AI game, masalah penjadwalan.",
      pseudocode: `function solve(col):
  if col >= n: return true
  
  for row from 0 to n:
    if isSafe(row, col):
      placeQueen(row, col)
      if solve(col + 1): return true
      removeQueen(row, col) // Backtrack
      
  return false`,
    },
    sudoku: {
      title: "Sudoku Solver (9×9)",
      description:
        "Menyelesaikan puzzle Sudoku dengan mengisi angka 1-9 pada sel kosong. Memvalidasi batasan baris, kolom, dan kotak 3x3 setiap kali mencoba angka.",
      complexity: "Time: O(9^m), Space: O(m)",
      useCase: "Pemecahan puzzle, constraint satisfaction, permainan logika.",
      pseudocode: `function solve(grid):
  row, col = findEmpty(grid)
  if noEmpty: return true
  
  for num from 1 to 9:
    if isValid(row, col, num):
      grid[row][col] = num
      if solve(grid): return true
      grid[row][col] = 0 // Backtrack
      
  return false`,
    },
    maze: {
      title: "Maze Generation - Recursive Backtracker",
      description:
        "Membuat labirin sempurna menggunakan penelusuran mendalam (DFS) acak. Algoritma menggali lorong sejauh mungkin sebelum mundur (backtrack) ketika menemui jalan buntu.",
      complexity: "Time: O(Rows × Cols), Space: O(Rows × Cols)",
      useCase:
        "Desain level game, procedural content generation, pengujian pathfinding.",
      pseudocode: `function generate(cell):
  markVisited(cell)
  neighbors = getUnvisited(cell)
  
  while neighbors not empty:
    next = random(neighbors)
    removeWall(cell, next)
    generate(next)
    neighbors = getUnvisited(cell)`,
    },
    subset: {
      title: "Subset Sum Problem",
      description:
        "Menemukan himpunan bagian dari angka-angka yang jumlahnya sama dengan target tertentu. Mencoba menyertakan atau mengecualikan setiap angka secara rekursif.",
      complexity: "Time: O(2^n), Space: O(n)",
      useCase: "Masalah partisi, kriptografi, knapsack problem.",
      pseudocode: `function solve(index, currentSum):
  if currentSum == target: return true
  if index >= n or currentSum > target: return
  
  // Include
  solve(index + 1, currentSum + arr[index])
  
  // Exclude
  solve(index + 1, currentSum)`,
    },
    hamiltonian: {
      title: "Hamiltonian Path in Graph",
      description:
        "Mencari jalur yang mengunjungi setiap titik (vertex) dalam graf tepat satu kali. Backtracking mengeksplorasi semua kemungkinan jalur sampai menemukan solusi atau buntu.",
      complexity: "Time: O(N!), Space: O(N)",
      useCase: "Traveling Salesman Problem, logistik, pengurutan DNA.",
      pseudocode: `function solve(vertex, path):
  path.add(vertex)
  if path.length == n: return true
  
  for neighbor in adj[vertex]:
    if not visited[neighbor]:
      if solve(neighbor, path): return true
      
  path.remove(vertex) // Backtrack
  return false`,
    },
  };

  /**
   * Code snippets for display and highlighting.
   */
  const algoCode = {
    nqueens: `function solveNQueens(board, col) {
  if (col >= n) return true;
  
  for (let row = 0; row < n; row++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 1;
      
      if (solveNQueens(board, col + 1))
        return true;
      
      board[row][col] = 0;
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
      grid[row][col] = 0;
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
    generateMaze(next);
    neighbors = getUnvisited(current);
  }
}`,
    subset: `function subsetSum(arr, i, sum, subset) {
  if (sum === target) {
    solutions.push([...subset]);
    return;
  }
  if (i >= n || sum > target) return;
  
  subset.push(arr[i]);
  subsetSum(arr, i+1, sum+arr[i], subset);
  subset.pop();
  
  subsetSum(arr, i+1, sum, subset);
}`,
    hamiltonian: `function hamiltonianPath(v, path) {
  if (path.length === n) return true;
  
  for (let next of graph[v]) {
    if (!visited[next]) {
      visited[next] = true;
      path.push(next);
      
      if (hamiltonianPath(next, path))
        return true;
      
      path.pop();
      visited[next] = false;
    }
  }
  return false;
}`,
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  const [algorithm, setAlgorithm] = useState("nqueens");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // Algorithm-specific inputs
  const [queensN, setQueensN] = useState(4);
  const [mazeRows, setMazeRows] = useState(11);
  const [mazeCols, setMazeCols] = useState(11);

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

  const snapshot = (
    board,
    row,
    col,
    status,
    desc,
    vars = {},
    extra = {},
    activeLine = -1
  ) => ({
    board: board ? JSON.parse(JSON.stringify(board)) : null,
    currentRow: row,
    currentCol: col,
    status: status, // 'trying', 'valid', 'invalid', 'backtrack', 'solution'
    stepDescription: desc,
    variables: { ...vars },
    activeCodeLine: activeLine,
    ...extra,
  });

  const currentVisual = steps[currentStep] || {
    board: null,
    currentRow: -1,
    currentCol: -1,
    status: "start",
    stepDescription: "Memuat...",
    variables: {},
    activeCodeLine: -1,
  };

  const generateSteps = (algoType) => {
    const stepsArr = [];

    if (algoType === "nqueens") {
      const n = queensN;
      let board = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0));

      const isSafe = (board, row, col) => {
        // Check left side of current row
        for (let i = 0; i < col; i++) {
          if (board[row][i] === 1) return false;
        }
        // Check upper diagonal on left
        for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
          if (board[i][j] === 1) return false;
        }
        // Check lower diagonal on left
        for (let i = row, j = col; i < n && j >= 0; i++, j--) {
          if (board[i][j] === 1) return false;
        }
        return true;
      };

      const getAttackedCells = (board, row, col) => {
        const attacked = [];
        // Row
        for (let i = 0; i < n; i++) {
          if (i !== col) attacked.push([row, i]);
        }
        // Column
        for (let i = 0; i < n; i++) {
          if (i !== row) attacked.push([i, col]);
        }
        // Diagonals
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if (
              i !== row &&
              j !== col &&
              Math.abs(i - row) === Math.abs(j - col)
            ) {
              attacked.push([i, j]);
            }
          }
        }
        return attacked;
      };

      let solutionFound = false;

      const solveNQueens = (board, col) => {
        if (col >= n) {
          solutionFound = true;
          stepsArr.push(
            snapshot(
              board,
              -1,
              -1,
              "solution",
              `✓ Solusi ditemukan! Semua ${n} ratu aman.`,
              { n, queens: n },
              { attackedCells: [] },
              2
            )
          );
          return true;
        }

        for (let row = 0; row < n; row++) {
          stepsArr.push(
            snapshot(
              board,
              row,
              col,
              "trying",
              `Kolom ${col}, Baris ${row}: Coba tempatkan ratu...`,
              { col, row, queens: col },
              { attackedCells: [] },
              4
            )
          );

          if (isSafe(board, row, col)) {
            board[row][col] = 1;
            const attacked = getAttackedCells(board, row, col);
            stepsArr.push(
              snapshot(
                board,
                row,
                col,
                "valid",
                `✓ Aman! Ratu ditempatkan di (${row}, ${col}). Lanjut kolom berikutnya.`,
                { col, row, queens: col + 1 },
                { attackedCells: attacked },
                5
              )
            );

            if (solveNQueens(board, col + 1)) return true;

            // Backtrack
            board[row][col] = 0;
            stepsArr.push(
              snapshot(
                board,
                row,
                col,
                "backtrack",
                `✗ Backtrack! Jalan buntu. Hapus ratu dari (${row}, ${col}).`,
                { col, row, queens: col },
                { attackedCells: [] },
                10
              )
            );
          } else {
            stepsArr.push(
              snapshot(
                board,
                row,
                col,
                "invalid",
                `✗ Konflik! Posisi (${row}, ${col}) diserang.`,
                { col, row },
                { attackedCells: [] },
                5
              )
            );
          }
        }
        return false;
      };

      stepsArr.push(
        snapshot(
          board,
          -1,
          -1,
          "start",
          `Mulai ${n}-Queens Problem. Tujuam: Tempatkan ${n} ratu aman.`,
          { n, queens: 0 },
          { attackedCells: [] },
          1
        )
      );

      solveNQueens(board, 0);

      if (!solutionFound) {
        stepsArr.push(
          snapshot(
            board,
            -1,
            -1,
            "no_solution",
            `Tidak ada solusi untuk ${n}-Queens.`,
            { n },
            { attackedCells: [] },
            13
          )
        );
      }
    } else if (algoType === "sudoku") {
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
      ];

      const isValid = (grid, row, col, num) => {
        // Check row
        for (let x = 0; x < 9; x++) {
          if (grid[row][x] === num) return false;
        }
        // Check column
        for (let x = 0; x < 9; x++) {
          if (grid[x][col] === num) return false;
        }
        // Check 3x3 box
        let startRow = row - (row % 3),
          startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
          }
        }
        return true;
      };

      let stepCount = 0;
      const maxSteps = 150; // Limit steps for visualization

      const solveSudoku = (grid, row, col) => {
        if (stepCount >= maxSteps) return false;

        if (row === 9) {
          stepsArr.push(
            snapshot(
              grid,
              row,
              col,
              "solution",
              `✓ Sudoku selesai! Semua sel terisi valid.`,
              { filled: 81 },
              {},
              2
            )
          );
          return true;
        }

        if (col === 9) return solveSudoku(grid, row + 1, 0);

        if (grid[row][col] !== 0) {
          return solveSudoku(grid, row, col + 1);
        }

        for (let num = 1; num <= 9; num++) {
          stepCount++;
          if (stepCount >= maxSteps) return false;

          stepsArr.push(
            snapshot(
              grid,
              row,
              col,
              "trying",
              `Sel (${row}, ${col}): Coba angka ${num}...`,
              { row, col, num },
              {},
              8
            )
          );

          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            stepsArr.push(
              snapshot(
                grid,
                row,
                col,
                "valid",
                `✓ Valid! Angka ${num} masuk.`,
                { row, col, num },
                {},
                10
              )
            );

            if (solveSudoku(grid, row, col + 1)) return true;

            grid[row][col] = 0;
            stepsArr.push(
              snapshot(
                grid,
                row,
                col,
                "backtrack",
                `✗ Backtrack! Angka ${num} salah jalan. Hapus.`,
                { row, col, num },
                {},
                13
              )
            );
          } else {
            stepsArr.push(
              snapshot(
                grid,
                row,
                col,
                "invalid",
                `✗ Invalid! Angka ${num} konflik.`,
                { row, col, num },
                {},
                8
              )
            );
          }
        }
        return false;
      };

      stepsArr.push(
        snapshot(
          grid,
          -1,
          -1,
          "start",
          `Mulai Sudoku Solver. Isi sel kosong (0).`,
          {},
          {},
          1
        )
      );

      solveSudoku(grid, 0, 0);
    } else if (algoType === "maze") {
      const rows = mazeRows;
      const cols = mazeCols;
      let grid = Array(rows)
        .fill(0)
        .map(() =>
          Array(cols)
            .fill(0)
            .map(() => ({
              visited: false,
              walls: { top: true, right: true, bottom: true, left: true },
            }))
        );

      const getNeighbors = (row, col) => {
        const neighbors = [];
        if (row > 0) neighbors.push({ row: row - 1, col, dir: "top" });
        if (col < cols - 1) neighbors.push({ row, col: col + 1, dir: "right" });
        if (row < rows - 1)
          neighbors.push({ row: row + 1, col, dir: "bottom" });
        if (col > 0) neighbors.push({ row, col: col - 1, dir: "left" });
        return neighbors.filter((n) => !grid[n.row][n.col].visited);
      };

      const removeWall = (current, next) => {
        const dr = next.row - current.row;
        const dc = next.col - current.col;

        if (dr === -1) {
          grid[current.row][current.col].walls.top = false;
          grid[next.row][next.col].walls.bottom = false;
        } else if (dr === 1) {
          grid[current.row][current.col].walls.bottom = false;
          grid[next.row][next.col].walls.top = false;
        } else if (dc === 1) {
          grid[current.row][current.col].walls.right = false;
          grid[next.row][next.col].walls.left = false;
        } else if (dc === -1) {
          grid[current.row][current.col].walls.left = false;
          grid[next.row][next.col].walls.right = false;
        }
      };

      const stack = [];
      let stepCount = 0;
      const maxSteps = 200;

      const generateMaze = (row, col) => {
        if (stepCount >= maxSteps) return;

        grid[row][col].visited = true;
        stepCount++;

        stepsArr.push(
          snapshot(
            grid,
            row,
            col,
            "visiting",
            `Kunjungi sel (${row}, ${col}). Tandai visited.`,
            { row, col, stackSize: stack.length },
            { stack: [...stack] },
            2
          )
        );

        let neighbors = getNeighbors(row, col);

        while (neighbors.length > 0) {
          if (stepCount >= maxSteps) return;

          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          stack.push({ row, col });

          removeWall({ row, col }, next);
          stepCount++;

          stepsArr.push(
            snapshot(
              grid,
              next.row,
              next.col,
              "carving",
              `Gali jalur ke (${next.row}, ${next.col}). Hapus dinding.`,
              { row, col, to: `(${next.row},${next.col})` },
              { stack: [...stack] },
              7
            )
          );

          generateMaze(next.row, next.col);
          neighbors = getNeighbors(row, col);
        }

        if (stack.length > 0) {
          const prev = stack.pop();
          stepCount++;
          stepsArr.push(
            snapshot(
              grid,
              prev.row,
              prev.col,
              "backtrack",
              `✗ Buntu. Mundur ke (${prev.row}, ${prev.col}).`,
              { row: prev.row, col: prev.col },
              { stack: [...stack] },
              10
            )
          );
        }
      };

      stepsArr.push(
        snapshot(
          grid,
          -1,
          -1,
          "start",
          `Generate Maze ${rows}×${cols} dengan DFS Backtracker.`,
          { rows, cols },
          { stack: [] },
          1
        )
      );

      generateMaze(0, 0);

      stepsArr.push(
        snapshot(
          grid,
          -1,
          -1,
          "complete",
          `✓ Maze selesai!`,
          { rows, cols },
          { stack: [] },
          12
        )
      );
    } else if (algoType === "subset") {
      const arr = [3, 34, 4, 12, 5, 2];
      const target = 9;
      const solutions = [];
      let stepCount = 0;
      const maxSteps = 100;

      const subsetSum = (i, sum, subset) => {
        if (stepCount >= maxSteps) return;

        if (sum === target) {
          solutions.push([...subset]);
          stepCount++;
          stepsArr.push(
            snapshot(
              [arr],
              -1,
              -1,
              "solution",
              `✓ Solusi! {${subset.join(", ")}} = ${target}`,
              { subset: subset.join(","), sum: target },
              { subset: [...subset], index: i },
              2
            )
          );
          return;
        }

        if (i >= arr.length || sum > target) {
          stepCount++;
          stepsArr.push(
            snapshot(
              [arr],
              -1,
              i >= arr.length ? -1 : i,
              "pruned",
              i >= arr.length
                ? `Habis elemen. Backtrack.`
                : `Sum ${sum} > ${target}. Pruning.`,
              { i, sum, subset: subset.join(",") || "-" },
              { subset: [...subset], index: i },
              5
            )
          );
          return;
        }

        // Include arr[i]
        stepCount++;
        stepsArr.push(
          snapshot(
            [arr],
            -1,
            i,
            "include",
            `Ambil arr[${i}] = ${arr[i]}. Sum: ${sum} -> ${sum + arr[i]}`,
            { i, value: arr[i], sum: sum + arr[i] },
            { subset: [...subset, arr[i]], index: i },
            9
          )
        );

        subset.push(arr[i]);
        subsetSum(i + 1, sum + arr[i], subset);
        subset.pop();

        // Exclude arr[i]
        stepCount++;
        stepsArr.push(
          snapshot(
            [arr],
            -1,
            i,
            "exclude",
            `Lewati arr[${i}]. Sum tetap ${sum}.`,
            { i, value: arr[i], sum },
            { subset: [...subset], index: i },
            13
          )
        );

        subsetSum(i + 1, sum, subset);
      };

      stepsArr.push(
        snapshot(
          [arr],
          -1,
          -1,
          "start",
          `Cari subset sum = ${target} dari [${arr.join(", ")}].`,
          { target },
          { subset: [], index: 0 },
          1
        )
      );

      subsetSum(0, 0, []);

      stepsArr.push(
        snapshot(
          [arr],
          -1,
          -1,
          "complete",
          `Selesai. Ditemukan ${solutions.length} solusi.`,
          { solutions: solutions.length },
          { subset: [], index: 0 },
          15
        )
      );
    } else if (algoType === "hamiltonian") {
      const nodes = [
        { id: 0, label: "A", x: 300, y: 100 },
        { id: 1, label: "B", x: 150, y: 200 },
        { id: 2, label: "C", x: 450, y: 200 },
        { id: 3, label: "D", x: 200, y: 300 },
        { id: 4, label: "E", x: 400, y: 300 },
      ];

      const edges = [
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 3],
        [2, 4],
        [3, 4],
      ];

      const adj = {};
      nodes.forEach((n) => (adj[n.id] = []));
      edges.forEach(([u, v]) => {
        adj[u].push(v);
        adj[v].push(u);
      });

      const n = nodes.length;
      let visited = Array(n).fill(false);
      let path = [];
      let found = false;
      let stepCount = 0;
      const maxSteps = 80;

      const hamiltonianPath = (v) => {
        if (stepCount >= maxSteps) return false;

        if (path.length === n) {
          found = true;
          stepCount++;
          stepsArr.push(
            snapshot(
              null,
              -1,
              -1,
              "solution",
              `✓ Hamiltonian Path ketemu: ${path
                .map((id) => nodes[id].label)
                .join(" → ")}`,
              { pathLength: n },
              {
                graph: { nodes, edges },
                path: [...path],
                visited: [...visited],
              },
              2
            )
          );
          return true;
        }

        for (let next of adj[v]) {
          if (!visited[next]) {
            stepCount++;
            stepsArr.push(
              snapshot(
                null,
                -1,
                -1,
                "trying",
                `${nodes[v].label} -> ${nodes[next].label}.`,
                { from: nodes[v].label, to: nodes[next].label },
                {
                  graph: { nodes, edges },
                  path: [...path, next],
                  visited: [...visited],
                },
                7
              )
            );

            visited[next] = true;
            path.push(next);

            if (hamiltonianPath(next)) return true;

            path.pop();
            visited[next] = false;

            stepCount++;
            stepsArr.push(
              snapshot(
                null,
                -1,
                -1,
                "backtrack",
                `✗ Buntu di ${nodes[next].label}. Backtrack ke ${nodes[v].label}.`,
                { from: nodes[next].label, to: nodes[v].label },
                {
                  graph: { nodes, edges },
                  path: [...path],
                  visited: [...visited],
                },
                11
              )
            );
          }
        }
        return false;
      };

      stepsArr.push(
        snapshot(
          null,
          -1,
          -1,
          "start",
          `Hamiltonian Path (visit all ${n} nodes). Start A.`,
          { n },
          { graph: { nodes, edges }, path: [], visited: [...visited] },
          1
        )
      );

      visited[0] = true;
      path.push(0);
      hamiltonianPath(0);

      if (!found) {
        stepsArr.push(
          snapshot(
            null,
            -1,
            -1,
            "no_solution",
            `Tidak ada jalur Hamiltonian.`,
            {},
            {
              graph: { nodes, edges },
              path: [],
              visited: Array(n).fill(false),
            },
            14
          )
        );
      }
    }

    return stepsArr;
  };

  // ==========================================
  // 4. EFFECTS & HANDLERS
  // ==========================================

  useEffect(() => {
    resetAndGenerate();
  }, [algorithm, queensN, mazeRows, mazeCols]);

  const resetAndGenerate = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
    const generatedSteps = generateSteps(algorithm);
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

  const handleAlgorithmChange = (e) => {
    const newAlgo = e.target.value;
    setAlgorithm(newAlgo);
    // Clearing steps immediately to prevent render crash during transition
    setSteps([]);
    setCurrentStep(0);
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
    const status = currentVisual.status;
    if (status === "trying" || status === "visiting") return "text-yellow-400";
    if (
      status === "valid" ||
      status === "carving" ||
      status === "include" ||
      status === "exclude"
    )
      return "text-emerald-400";
    if (status === "invalid" || status === "pruned") return "text-red-400";
    if (status === "backtrack") return "text-pink-400";
    if (status === "solution" || status === "complete")
      return "text-emerald-300";
    return "text-slate-400";
  };

  const getStatusText = () => {
    return (currentVisual.status || "READY").toUpperCase();
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
                  ? "bg-indigo-900/60 border-l-4 border-indigo-400"
                  : "border-l-4 border-transparent"
              }`}
            >
              <span className="w-8 text-slate-600 text-right mr-3 leading-5 select-none">
                {index + 1}
              </span>
              <span
                className={`whitespace-pre ${
                  isActive ? "text-indigo-200 font-bold" : "text-slate-300"
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

  // Visualization Renderers
  const renderNQueens = () => {
    const board = currentVisual.board;
    if (!board) return null;
    const n = board.length;
    const attacked = currentVisual.attackedCells || [];

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="grid gap-0 border-2 border-orange-700"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => {
              const isCurrentCell =
                currentVisual.currentRow === i &&
                currentVisual.currentCol === j;
              const hasQueen = cell === 1;
              const isAttacked = attacked.some(
                ([ar, ac]) => ar === i && ac === j
              );
              const isEvenSquare = (i + j) % 2 === 0;

              let bgClass = isEvenSquare ? "bg-slate-700" : "bg-slate-600";
              let textClass = "text-slate-400";

              if (isCurrentCell && currentVisual.status === "trying") {
                bgClass = "bg-yellow-400";
                textClass = "text-black";
              } else if (isCurrentCell && currentVisual.status === "valid") {
                bgClass = "bg-emerald-500";
                textClass = "text-white";
              } else if (isCurrentCell && currentVisual.status === "invalid") {
                bgClass = "bg-red-500";
                textClass = "text-white";
              } else if (
                isCurrentCell &&
                currentVisual.status === "backtrack"
              ) {
                bgClass = "bg-pink-400";
                textClass = "text-white";
              } else if (hasQueen) {
                bgClass = "bg-emerald-700";
                textClass = "text-yellow-300";
              } else if (isAttacked) {
                bgClass = "bg-red-900/40";
              }

              const size =
                n <= 4 ? "w-16 h-16" : n <= 6 ? "w-12 h-12" : "w-10 h-10";

              return (
                <div
                  key={`${i}-${j}`}
                  className={`${size} flex items-center justify-center border border-slate-800 transition-all ${bgClass} ${textClass} font-bold text-xl`}
                >
                  {hasQueen ? "♛" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderSudoku = () => {
    const grid = currentVisual.board;
    if (!grid) return null;

    return (
      <div className="flex flex-col items-center">
        <div
          className="grid gap-0 border-4 border-orange-700"
          style={{ gridTemplateColumns: `repeat(9, minmax(0, 1fr))` }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const isCurrentCell =
                currentVisual.currentRow === i &&
                currentVisual.currentCol === j;
              const isPrefilled = steps[0]?.board?.[i]?.[j] !== 0;

              let bgClass = "bg-slate-800";
              let textClass = "text-slate-300";
              let borderClass = "";

              if (i % 3 === 0) borderClass += " border-t-2 border-t-orange-600";
              if (j % 3 === 0) borderClass += " border-l-2 border-l-orange-600";
              if (i === 8) borderClass += " border-b-2 border-b-orange-600";
              if (j === 8) borderClass += " border-r-2 border-r-orange-600";

              if (isPrefilled) {
                bgClass = "bg-slate-700";
                textClass = "text-white font-bold";
              }

              if (isCurrentCell) {
                if (currentVisual.status === "trying") {
                  bgClass = "bg-yellow-400";
                  textClass = "text-black font-bold";
                } else if (currentVisual.status === "valid") {
                  bgClass = "bg-emerald-500";
                  textClass = "text-white font-bold";
                } else if (currentVisual.status === "invalid") {
                  bgClass = "bg-red-500";
                  textClass = "text-white font-bold";
                } else if (currentVisual.status === "backtrack") {
                  bgClass = "bg-pink-400";
                  textClass = "text-white font-bold";
                }
              }

              return (
                <div
                  key={`${i}-${j}`}
                  className={`w-8 h-8 flex items-center justify-center border border-slate-700 ${borderClass} transition-all ${bgClass} ${textClass} text-sm`}
                >
                  {cell !== 0 ? cell : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderMaze = () => {
    const grid = currentVisual.board;
    if (!grid) return null;
    // Defensive check: ensure grid is valid for maze (has objects with walls)
    if (!grid[0] || !grid[0][0] || typeof grid[0][0].walls === "undefined") {
      return null;
    }

    const cellSize = 16;
    const rows = grid.length;
    const cols = grid[0].length;

    return (
      <div className="flex justify-center overflow-auto max-h-[400px]">
        <svg
          width={cols * cellSize + 2}
          height={rows * cellSize + 2}
          className="border-2 border-orange-700 bg-slate-900"
        >
          {grid.map((row, i) =>
            row.map((cell, j) => {
              const x = j * cellSize;
              const y = i * cellSize;
              let fill = "none";

              if (
                i === currentVisual.currentRow &&
                j === currentVisual.currentCol
              ) {
                fill = "#f59e0b";
              } else if (cell.visited) {
                fill = "#1e293b";
              }

              const lines = [];
              if (cell.walls.top)
                lines.push(
                  <line
                    key="t"
                    x1={x}
                    y1={y}
                    x2={x + cellSize}
                    y2={y}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                );
              if (cell.walls.right)
                lines.push(
                  <line
                    key="r"
                    x1={x + cellSize}
                    y1={y}
                    x2={x + cellSize}
                    y2={y + cellSize}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                );
              if (cell.walls.bottom)
                lines.push(
                  <line
                    key="b"
                    x1={x}
                    y1={y + cellSize}
                    x2={x + cellSize}
                    y2={y + cellSize}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                );
              if (cell.walls.left)
                lines.push(
                  <line
                    key="l"
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y + cellSize}
                    stroke="#475569"
                    strokeWidth="2"
                  />
                );

              return (
                <g key={`${i}-${j}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={fill}
                  />
                  {lines}
                </g>
              );
            })
          )}
        </svg>
      </div>
    );
  };

  const renderSubset = () => {
    const subsetData = steps[0]?.board?.[0];
    if (!subsetData) return null;

    // Check if current visual has variables index
    const currentIndex = currentVisual.variables.index;
    const currentSubset = (currentVisual.variables.subset || "")
      .split(",")
      .filter((x) => x)
      .map(Number);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2 flex-wrap justify-center">
          {subsetData.map((val, idx) => {
            let bgClass = "bg-slate-700";
            let borderClass = "border-slate-500";
            let textClass = "text-slate-300";

            const isInSubset = currentSubset.includes(val);
            const isProcessing = idx === currentIndex;

            if (isProcessing) {
              borderClass = "border-yellow-400";
              bgClass = "bg-yellow-900/50";
            }
            if (isInSubset) {
              bgClass = "bg-emerald-600";
              textClass = "text-white";
              borderClass = "border-emerald-400";
            }

            return (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 ${bgClass} ${borderClass} ${textClass} font-bold text-lg transition-all`}
              >
                {val}
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 w-full text-center">
          <div className="text-xs text-slate-400 mb-1">Subset Sementara</div>
          <div className="text-orange-300 font-mono text-lg">
            {currentSubset.length > 0
              ? `{ ${currentSubset.join(", ")} }`
              : "{ }"}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Sum: {currentSubset.reduce((a, b) => a + b, 0)} /{" "}
            {currentVisual.variables.target}
          </div>
        </div>
      </div>
    );
  };

  const renderHamiltonian = () => {
    const graph = currentVisual.graph;
    if (!graph) return null;

    const path = currentVisual.path || [];

    return (
      <div className="flex justify-center max-h-[400px] w-full">
        <svg
          width="600"
          height="400"
          className="bg-slate-900 rounded-lg border border-slate-700"
        >
          {/* Edges */}
          {graph.edges.map(([u, v], idx) => {
            const n1 = graph.nodes[u];
            const n2 = graph.nodes[v];
            const inPath =
              path.includes(u) &&
              path.includes(v) &&
              (path.indexOf(u) === path.indexOf(v) - 1 ||
                path.indexOf(v) === path.indexOf(u) - 1);

            return (
              <line
                key={idx}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={inPath ? "#10b981" : "#475569"}
                strokeWidth={inPath ? 4 : 2}
              />
            );
          })}

          {/* Nodes */}
          {graph.nodes.map((n, idx) => {
            const isVisited =
              currentVisual.visited && currentVisual.visited[n.id];
            const isInPath = path.includes(n.id);
            const isLast = path.length > 0 && path[path.length - 1] === n.id;

            let fill = "#1e293b";
            let stroke = "#475569";

            if (isInPath) {
              fill = "#059669";
              stroke = "#10b981";
            }
            if (isLast) {
              fill = "#fbbf24";
              stroke = "#f59e0b";
            }

            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={20}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="3"
                />
                <text
                  x={n.x}
                  y={n.y}
                  dy=".3em"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="bold"
                >
                  {n.label}
                </text>
                {isLast && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={24}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    className="animate-ping opacity-75"
                  />
                )}
              </g>
            );
          })}
        </svg>
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
                <Undo2 size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo Backtracking
                </h1>
                <p className="text-xs text-slate-400">
                  Solusi Rekursif & Pencarian
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={handleAlgorithmChange}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <option value="nqueens">N-Queens</option>
                <option value="sudoku">Sudoku Solver</option>
                <option value="maze">Maze Generator</option>
                <option value="subset">Subset Sum</option>
                <option value="hamiltonian">Hamiltonian Path</option>
              </select>

              {/* Algorithm Settings */}
              {algorithm === "nqueens" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    N:
                  </span>
                  <input
                    type="number"
                    min="4"
                    max="8"
                    value={queensN}
                    onChange={(e) => setQueensN(parseInt(e.target.value))}
                    className="w-12 bg-slate-900 border border-slate-600 text-xs rounded p-1 text-center outline-none focus:border-orange-500"
                  />
                </div>
              )}

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
                <Info size={20} className="text-white" />
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
                      Kegunaan:
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
                  <Crown size={16} className="text-orange-400" />
                  Visualisasi Backtracking
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[400px] overflow-auto">
                {algorithm === "nqueens" && renderNQueens()}
                {algorithm === "sudoku" && renderSudoku()}
                {algorithm === "maze" && renderMaze()}
                {algorithm === "subset" && renderSubset()}
                {algorithm === "hamiltonian" && renderHamiltonian()}
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

export default BacktrackingAlgorithm;
