import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BrainCircuit, Code, Variable, Layers, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Table, Award } from 'lucide-react'

const DynamicProgramming = () => {
  // --- STATE ---
  const [speed, setSpeed] = useState(5)
  const [algorithm, setAlgorithm] = useState('fibonacci')

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Algorithm-specific inputs
  const [fibN, setFibN] = useState(8)
  const [knapsackItems, setKnapsackItems] = useState([
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ])
  const [knapsackCapacity, setKnapsackCapacity] = useState(8)
  const [lcsStr1, setLcsStr1] = useState('ABCDGH')
  const [lcsStr2, setLcsStr2] = useState('AEDFHR')
  const [coinDenoms, setCoinDenoms] = useState([1, 2, 5])
  const [coinAmount, setCoinAmount] = useState(5)
  const [matrixDims, setMatrixDims] = useState([10, 20, 30, 40, 30])

  const algorithmDescriptions = {
    fibonacci: {
      title: 'Fibonacci dengan Dynamic Programming',
      description: 'Menghitung bilangan Fibonacci menggunakan tabulation (bottom-up). Menunjukkan bagaimana DP menghindari rekursi berulang dengan menyimpan hasil sub-problem di tabel.',
      complexity: 'O(n) time, O(n) space',
      useCase: 'Pembelajaran DP dasar, sequence problems, optimization',
    },
    knapsack: {
      title: '0/1 Knapsack Problem',
      description: 'Memilih item dengan bobot dan nilai tertentu untuk memaksimalkan total nilai tanpa melebihi kapasitas. Menggunakan tabel 2D dp[i][w] = nilai maksimal dengan i item pertama dan kapasitas w.',
      complexity: 'O(n × W) - n: items, W: capacity',
      useCase: 'Resource allocation, budget optimization, subset selection',
    },
    lcs: {
      title: 'Longest Common Subsequence (LCS)',
      description: 'Mencari subsequence terpanjang yang ada di kedua string. Membangun tabel 2D untuk melacak panjang LCS dan merekonstruksi jawabannya dengan backtracking.',
      complexity: 'O(m × n) - m, n: panjang string',
      useCase: 'Diff tools, DNA sequence alignment, version control, plagiarism detection',
    },
    coin: {
      title: 'Coin Change - Counting Ways',
      description: 'Menghitung jumlah cara membuat amount tertentu menggunakan koin dengan denominations yang diberikan. DP untuk counting combinations dengan unbounded items.',
      complexity: 'O(n × amount) - n: jumlah koin',
      useCase: 'Making change, counting combinations, resource distribution',
    },
    matrix: {
      title: 'Matrix Chain Multiplication',
      description: 'Mencari urutan perkalian matrix yang meminimalkan jumlah operasi scalar. Menunjukkan DP untuk optimization problem dengan optimal substructure menggunakan tabel 2D.',
      complexity: 'O(n³) time, O(n²) space',
      useCase: 'Compiler optimization, graphics rendering, operations research',
    },
  }

  const algoCode = {
    fibonacci: `function fibonacci(n) {
  let dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`,
    knapsack: `function knapsack(W, wt, val, n) {
  let dp = Array(n+1).fill(0)
    .map(() => Array(W+1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i-1] <= w) {
        dp[i][w] = Math.max(
          val[i-1] + dp[i-1][w-wt[i-1]],
          dp[i-1][w]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][W];
}`,
    lcs: `function lcs(X, Y, m, n) {
  let dp = Array(m+1).fill(0)
    .map(() => Array(n+1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (X[i-1] === Y[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(
          dp[i-1][j], 
          dp[i][j-1]
        );
      }
    }
  }
  return dp[m][n];
}`,
    coin: `function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(0);
  dp[0] = 1;
  
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] += dp[i - coin];
    }
  }
  
  return dp[amount];
}`,
    matrix: `function matrixChain(dims) {
  let n = dims.length - 1;
  let dp = Array(n).fill(0)
    .map(() => Array(n).fill(0));
  
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n-len+1; i++) {
      let j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        let cost = dp[i][k] + dp[k+1][j] 
          + dims[i]*dims[k+1]*dims[j+1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[0][n-1];
}`,
  }

  // --- ENGINE: SNAPSHOT ---
  const snapshot = (table, activeCell, dependencies, formula, desc, vars, solution = null) => ({
    dpTable: JSON.parse(JSON.stringify(table)),
    activeCell: activeCell,
    dependencies: dependencies ? [...dependencies] : [],
    currentFormula: formula,
    stepDescription: desc,
    variables: { ...vars },
    solution: solution,
  })

  const generateSteps = (algoType) => {
    const stepsArr = []

    if (algoType === 'fibonacci') {
      const n = fibN
      let dp = new Array(n + 1).fill(null)
      dp[0] = 0
      dp[1] = 1

      stepsArr.push(snapshot([dp], null, [], '', 'Inisialisasi: Base case dp[0]=0, dp[1]=1', { n }))

      for (let i = 2; i <= n; i++) {
        stepsArr.push(
          snapshot(
            [dp],
            [0, i],
            [
              [0, i - 1],
              [0, i - 2],
            ],
            `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`,
            `Hitung Fibonacci ke-${i}. Gunakan hasil 2 langkah sebelumnya.`,
            { i, 'dp[i-1]': dp[i - 1], 'dp[i-2]': dp[i - 2] }
          )
        )

        dp[i] = dp[i - 1] + dp[i - 2]

        stepsArr.push(snapshot([dp], [0, i], [], `dp[${i}] = ${dp[i]}`, `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. Nilai tersimpan untuk penggunaan selanjutnya.`, { i, result: dp[i] }))
      }

      stepsArr.push(snapshot([dp], null, [], '', `✓ Selesai! Fibonacci(${n}) = ${dp[n]}. Total ${n + 1} sub-problem, setiap dihitung hanya sekali.`, { n, result: dp[n] }, dp[n]))
    } else if (algoType === 'knapsack') {
      const items = knapsackItems
      const W = knapsackCapacity
      const n = items.length
      let dp = Array(n + 1)
        .fill(0)
        .map(() => Array(W + 1).fill(0))

      stepsArr.push(snapshot(dp, null, [], '', 'Inisialisasi tabel DP. dp[i][w] = nilai maksimal dengan i item & kapasitas w', { n, W }))

      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
          const item = items[i - 1]
          if (item.weight <= w) {
            const include = item.value + dp[i - 1][w - item.weight]
            const exclude = dp[i - 1][w]

            stepsArr.push(
              snapshot(
                dp,
                [i, w],
                [
                  [i - 1, w],
                  [i - 1, w - item.weight],
                ],
                `dp[${i}][${w}] = max(${exclude}, ${item.value} + dp[${i - 1}][${w - item.weight}])`,
                `Item ${i} (w:${item.weight}, v:${item.value}) bisa diambil. Bandingkan: tidak ambil (${exclude}) vs ambil (${include}).`,
                { i, w, weight: item.weight, value: item.value, include, exclude }
              )
            )

            dp[i][w] = Math.max(include, exclude)

            stepsArr.push(snapshot(dp, [i, w], [], `dp[${i}][${w}] = ${dp[i][w]}`, `Pilih yang lebih baik: ${dp[i][w]}. ${dp[i][w] === include ? 'Ambil item!' : 'Skip item.'}`, { result: dp[i][w] }))
          } else {
            stepsArr.push(snapshot(dp, [i, w], [[i - 1, w]], `dp[${i}][${w}] = dp[${i - 1}][${w}]`, `Item ${i} terlalu berat (${item.weight} > ${w}). Skip, copy nilai dari atas.`, { i, w, weight: item.weight }))
            dp[i][w] = dp[i - 1][w]
          }
        }
      }

      stepsArr.push(snapshot(dp, [n, W], [], '', `✓ Selesai! Nilai maksimal = ${dp[n][W]} dengan kapasitas ${W}.`, { maxValue: dp[n][W] }, dp[n][W]))
    } else if (algoType === 'lcs') {
      const X = lcsStr1
      const Y = lcsStr2
      const m = X.length
      const n = Y.length
      let dp = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0))

      stepsArr.push(snapshot(dp, null, [], '', `Mencari LCS dari "${X}" dan "${Y}". dp[i][j] = panjang LCS dari X[0..i-1] dan Y[0..j-1]`, { m, n }))

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (X[i - 1] === Y[j - 1]) {
            stepsArr.push(snapshot(dp, [i, j], [[i - 1, j - 1]], `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1`, `Karakter match! X[${i - 1}]='${X[i - 1]}' = Y[${j - 1}]='${Y[j - 1]}'. Tambah 1 dari diagonal.`, { i, j, charX: X[i - 1], charY: Y[j - 1] }))
            dp[i][j] = dp[i - 1][j - 1] + 1
          } else {
            stepsArr.push(
              snapshot(
                dp,
                [i, j],
                [
                  [i - 1, j],
                  [i, j - 1],
                ],
                `dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}])`,
                `Tidak match. X[${i - 1}]='${X[i - 1]}' ≠ Y[${j - 1}]='${Y[j - 1]}'. Ambil max dari atas atau kiri.`,
                { i, j, charX: X[i - 1], charY: Y[j - 1], top: dp[i - 1][j], left: dp[i][j - 1] }
              )
            )
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          }

          stepsArr.push(snapshot(dp, [i, j], [], `dp[${i}][${j}] = ${dp[i][j]}`, `LCS panjang ${dp[i][j]} untuk prefix X[0..${i - 1}] dan Y[0..${j - 1}].`, { result: dp[i][j] }))
        }
      }

      stepsArr.push(snapshot(dp, [m, n], [], '', `✓ Selesai! Panjang LCS = ${dp[m][n]}. LCS dapat ditemukan dengan backtrack dari dp[${m}][${n}].`, { lcsLength: dp[m][n] }, dp[m][n]))
    } else if (algoType === 'coin') {
      const coins = coinDenoms
      const amount = coinAmount
      let dp = new Array(amount + 1).fill(0)
      dp[0] = 1

      stepsArr.push(snapshot([dp], null, [], '', `Hitung cara membuat amount ${amount} dengan koin ${coins.join(', ')}. dp[i] = jumlah cara membuat nilai i.`, { amount, coins: coins.join(',') }))
      stepsArr.push(snapshot([dp], [0, 0], [], 'dp[0] = 1', 'Base case: Ada 1 cara membuat nilai 0 (tidak ambil koin apapun).', { 'dp[0]': 1 }))

      for (let coinIdx = 0; coinIdx < coins.length; coinIdx++) {
        const coin = coins[coinIdx]
        stepsArr.push(snapshot([dp], null, [], '', `Proses koin ${coin}. Update semua dp[i] dimana i >= ${coin}.`, { coin, coinIdx: coinIdx + 1 }))

        for (let i = coin; i <= amount; i++) {
          const oldVal = dp[i]
          stepsArr.push(snapshot([dp], [0, i], [[0, i - coin]], `dp[${i}] += dp[${i - coin}]`, `Untuk nilai ${i}, tambahkan cara dari dp[${i - coin}] (nilai ${i} dikurangi koin ${coin}).`, { i, coin, 'dp[i-coin]': dp[i - coin], oldValue: oldVal }))

          dp[i] += dp[i - coin]

          stepsArr.push(snapshot([dp], [0, i], [], `dp[${i}] = ${dp[i]}`, `dp[${i}] sekarang ${dp[i]} (sebelumnya ${oldVal}). Total cara bertambah!`, { result: dp[i] }))
        }
      }

      stepsArr.push(snapshot([dp], [0, amount], [], '', `✓ Selesai! Ada ${dp[amount]} cara membuat nilai ${amount} dengan koin ${coins.join(', ')}.`, { totalWays: dp[amount] }, dp[amount]))
    } else if (algoType === 'matrix') {
      const dims = matrixDims
      const n = dims.length - 1
      let dp = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0))

      stepsArr.push(snapshot(dp, null, [], '', `Matrix dimensions: ${dims.join(' × ')}. Cari urutan perkalian optimal. dp[i][j] = min operasi untuk matrix i..j.`, { n, dims: dims.join('×') }))

      for (let len = 2; len <= n; len++) {
        stepsArr.push(snapshot(dp, null, [], '', `Chain length ${len}: Hitung semua subchain sepanjang ${len} matrix.`, { len }))

        for (let i = 0; i < n - len + 1; i++) {
          const j = i + len - 1
          dp[i][j] = Infinity

          stepsArr.push(snapshot(dp, [i, j], [], `dp[${i}][${j}]`, `Cari split optimal untuk matrix M${i}..M${j} (dimensi ${dims[i]}×${dims[j + 1]}).`, { i, j, startDim: dims[i], endDim: dims[j + 1] }))

          for (let k = i; k < j; k++) {
            const cost = (dp[i][k] || 0) + (dp[k + 1][j] || 0) + dims[i] * dims[k + 1] * dims[j + 1]

            stepsArr.push(
              snapshot(
                dp,
                [i, j],
                [
                  [i, k],
                  [k + 1, j],
                ],
                `cost = dp[${i}][${k}] + dp[${k + 1}][${j}] + ${dims[i]}×${dims[k + 1]}×${dims[j + 1]}`,
                `Split di k=${k}: (M${i}..M${k}) × (M${k + 1}..M${j}). Cost = ${cost}.`,
                { k, cost, left: dp[i][k] || 0, right: dp[k + 1][j] || 0, mult: dims[i] * dims[k + 1] * dims[j + 1] }
              )
            )

            if (cost < dp[i][j]) {
              dp[i][j] = cost
              stepsArr.push(snapshot(dp, [i, j], [], `dp[${i}][${j}] = ${cost}`, `Update! Split di k=${k} memberikan cost ${cost} (lebih baik).`, { bestK: k, result: cost }))
            }
          }

          stepsArr.push(snapshot(dp, [i, j], [], `dp[${i}][${j}] = ${dp[i][j]}`, `Optimal untuk M${i}..M${j} = ${dp[i][j]} operasi.`, { result: dp[i][j] }))
        }
      }

      stepsArr.push(snapshot(dp, [0, n - 1], [], '', `✓ Selesai! Minimum operasi untuk seluruh chain = ${dp[0][n - 1]}.`, { minOps: dp[0][n - 1] }, dp[0][n - 1]))
    }

    return stepsArr
  }

  // --- CONTROL ---
  useEffect(() => {
    resetAndGenerate()
  }, [algorithm, fibN, knapsackItems, knapsackCapacity, lcsStr1, lcsStr2, coinDenoms, coinAmount, matrixDims])

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
    dpTable: [],
    activeCell: null,
    dependencies: [],
    currentFormula: '',
    stepDescription: 'Loading...',
    variables: {},
    solution: null,
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

  const renderDPTable = () => {
    const table = currentVisual.dpTable
    if (!table || table.length === 0) return <div className='text-slate-500 text-sm'>No data</div>

    const is1D = table.length === 1

    if (is1D) {
      const row = table[0]
      return (
        <div className='flex flex-col gap-2'>
          <div className='flex gap-1 justify-center flex-wrap'>
            {row.map((val, idx) => {
              const isActive = currentVisual.activeCell && currentVisual.activeCell[0] === 0 && currentVisual.activeCell[1] === idx
              const isDep = currentVisual.dependencies.some(([r, c]) => r === 0 && c === idx)
              let bgClass = 'bg-slate-800'
              let borderClass = 'border-slate-600'
              let textClass = 'text-slate-300'

              if (isActive) {
                bgClass = 'bg-yellow-500'
                borderClass = 'border-yellow-300'
                textClass = 'text-black font-bold'
              } else if (isDep) {
                bgClass = 'bg-blue-600'
                borderClass = 'border-blue-400'
                textClass = 'text-white font-bold'
              } else if (val !== null && val !== 0) {
                bgClass = 'bg-emerald-900/40'
                borderClass = 'border-emerald-600'
                textClass = 'text-emerald-300'
              }

              return (
                <div
                  key={idx}
                  className='flex flex-col items-center gap-1'>
                  <span className='text-[10px] text-slate-500 font-mono'>i={idx}</span>
                  <div className={`w-12 h-12 flex items-center justify-center border-2 rounded font-mono text-sm transition-all ${bgClass} ${borderClass} ${textClass}`}>{val === null ? '-' : val}</div>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      // 2D Table
      return (
        <div className='overflow-auto max-h-[400px]'>
          <table className='border-collapse'>
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td className='text-[10px] text-slate-500 font-mono px-2 text-right'>{i === 0 ? '' : `i=${i}`}</td>
                  {row.map((val, j) => {
                    const isActive = currentVisual.activeCell && currentVisual.activeCell[0] === i && currentVisual.activeCell[1] === j
                    const isDep = currentVisual.dependencies.some(([r, c]) => r === i && c === j)
                    let bgClass = 'bg-slate-800'
                    let borderClass = 'border-slate-600'
                    let textClass = 'text-slate-300'

                    if (isActive) {
                      bgClass = 'bg-yellow-500'
                      borderClass = 'border-yellow-300'
                      textClass = 'text-black font-bold'
                    } else if (isDep) {
                      bgClass = 'bg-blue-600'
                      borderClass = 'border-blue-400'
                      textClass = 'text-white font-bold'
                    } else if (val !== null && val !== 0) {
                      bgClass = 'bg-emerald-900/40'
                      borderClass = 'border-emerald-600'
                      textClass = 'text-emerald-300'
                    }

                    return (
                      <td
                        key={j}
                        className='p-0'>
                        <div className={`w-12 h-12 flex items-center justify-center border-2 m-0.5 rounded font-mono text-xs transition-all ${bgClass} ${borderClass} ${textClass}`}>{val === null ? '-' : val}</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='text-[10px] text-slate-500 text-center mt-2 flex justify-center gap-4'>
            {table[0] &&
              table[0].map((_, j) => (
                <span
                  key={j}
                  className='w-12 font-mono'>
                  j={j}
                </span>
              ))}
          </div>
        </div>
      )
    }
  }

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20'>
                <BrainCircuit
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1'>Dynamic Programming</h1>
                <p className='text-xs text-slate-400'>Step-by-Step DP Table Visualization</p>
              </div>
            </div>
            <div className='flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none'>
                <option value='fibonacci'>Fibonacci</option>
                <option value='knapsack'>0/1 Knapsack</option>
                <option value='lcs'>LCS</option>
                <option value='coin'>Coin Change</option>
                <option value='matrix'>Matrix Chain</option>
              </select>
              {algorithm === 'fibonacci' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>N ({fibN})</span>
                  </div>
                  <input
                    type='range'
                    min='5'
                    max='20'
                    step='1'
                    value={fibN}
                    onChange={(e) => setFibN(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer'
                  />
                </div>
              )}
              {algorithm === 'knapsack' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>Cap ({knapsackCapacity})</span>
                  </div>
                  <input
                    type='range'
                    min='5'
                    max='15'
                    step='1'
                    value={knapsackCapacity}
                    onChange={(e) => setKnapsackCapacity(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer'
                  />
                </div>
              )}
              {algorithm === 'coin' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>Amt ({coinAmount})</span>
                  </div>
                  <input
                    type='range'
                    min='5'
                    max='20'
                    step='1'
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer'
                  />
                </div>
              )}
              <div className='flex flex-col gap-1 min-w-[100px]'>
                <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                  <span>Speed</span>
                  <span className='text-orange-300 font-mono'>{speed}</span>
                </div>
                <input
                  type='range'
                  min='1'
                  max='10'
                  step='1'
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className='w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer'
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
          <div className='bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20 mt-1'>
                <Award
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-orange-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kompleksitas:</span>
                    <span className='text-orange-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
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
          {/* DP TABLE VISUALIZATION */}
          <section className='lg:col-span-2 flex flex-col gap-4'>
            <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[350px]'>
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center text-orange-100 text-sm font-mono'>
                <div className='flex items-center gap-2'>
                  <Table
                    size={16}
                    className='text-orange-400'
                  />{' '}
                  DP Table
                </div>
                <div className='flex gap-3 text-xs'>
                  <span className='flex items-center gap-1 text-slate-400'>
                    <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>Active
                  </span>
                  <span className='flex items-center gap-1 text-slate-400'>
                    <div className='w-2 h-2 bg-blue-500 rounded-full'></div>Dependency
                  </span>
                  <span className='flex items-center gap-1 text-slate-400'>
                    <div className='w-2 h-2 bg-emerald-500 rounded-full'></div>Computed
                  </span>
                </div>
              </div>
              <div className='relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[300px]'>{renderDPTable()}</div>
            </div>

            {/* Formula Display */}
            {currentVisual.currentFormula && (
              <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl p-4'>
                <div className='text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-2'>
                  <Layers size={14} /> Recurrence Formula
                </div>
                <div className='bg-slate-950/50 rounded-lg p-3 font-mono text-orange-300 text-center text-sm'>{currentVisual.currentFormula}</div>
              </div>
            )}

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
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500' : 'bg-orange-600'} text-white`}>
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
                    className='bg-orange-500 h-full transition-all duration-100'
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
                    className='text-orange-400'
                  />{' '}
                  Variabel
                </div>
                <div className='p-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/50'>
                  {Object.entries(currentVisual.variables).map(([key, val]) => (
                    <div
                      key={key}
                      className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
                      <span className='text-[10px] text-orange-300 font-mono font-bold uppercase'>{key}</span>
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
                Algoritma
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-orange-900/20 text-orange-100 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-orange-400'
                />{' '}
                Penjelasan
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

export default DynamicProgramming
