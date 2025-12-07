import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  BrainCircuit,
  Code,
  Variable,
  MessageSquare,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Square,
  Hash,
  Search,
  Layers,
  Clock,
} from "lucide-react";

/**
 * DynamicProgramming Component
 * Visualizes Fibonacci, Knapsack, LCS, Coin Change, and Matrix Chain Multiplication
 * using a symmetrical layout, execution log, and step-by-step visualization.
 */
const DynamicProgramming = () => {
  // ==========================================
  // 1. CONSTANTS & DEFINITIONS
  // ==========================================

  const STEP_DELAY = 500; // ms per step

  /**
   * Variable descriptions for the variable badge display.
   */
  const variableDefinitions = {
    common: { n: "Total Input", i: "Indeks Utama", j: "Indeks Sekunder" },
    fibonacci: { n: "Input N", dp: "Tabel Memo", i: "Indeks Saat Ini" },
    knapsack: {
      W: "Kapasitas",
      w: "Bobot Saat Ini",
      i: "Item Ke-",
      val: "Nilai",
      weight: "Bobot",
    },
    lcs: {
      m: "Panjang Str1",
      n: "Panjang Str2",
      i: "Indeks Str1",
      j: "Indeks Str2",
      charX: "Karakter 1",
      charY: "Karakter 2",
    },
    coin: {
      amount: "Target Nilai",
      coins: "Daftar Koin",
      i: "Nilai Target",
      coin: "Koin Aktif",
    },
    matrix: {
      dims: "Dimensi",
      i: "Awal Chain",
      j: "Akhir Chain",
      k: "Titik Potong",
      cost: "Biaya",
    },
  };

  /**
   * Detailed algorithm descriptions including complexity and pseudocode.
   */
  const algorithmDescriptions = {
    fibonacci: {
      title: "Fibonacci dengan Dynamic Programming",
      description:
        "Menghitung bilangan Fibonacci menggunakan metode (bottom-up). Teknik ini menghindari rekursi berulang yang tidak efisien dengan menyimpan hasil perhitungan sebelumnya dalam tabel memori.",
      complexity: "Time: O(n), Space: O(n)",
      useCase:
        "Pengenalan DP, optimasi urutan bilangan, masalah pertumbuhan populasi.",
      pseudocode: `Struktur data:
  dp[0] = 0
  dp[1] = 1

For i from 2 to n:
  dp[i] = dp[i-1] + dp[i-2]

Return dp[n]`,
    },
    knapsack: {
      title: "0/1 Knapsack Problem",
      description:
        "Menentukan kombinasi barang dengan nilai tertinggi yang dapat dimuat dalam kapasitas tertentu. Menggunakan tabel 2D untuk menyimpan nilai maksimum pada setiap kapasitas dan subset barang.",
      complexity: "Time: O(n × W), Space: O(n × W)",
      useCase:
        "Optimasi anggaran, alokasi sumber daya, pemilihan portofolio investasi.",
      pseudocode: `For i from 1 to n:
  For w from 1 to W:
    If wt[i-1] <= w:
      dp[i][w] = max(
        val[i-1] + dp[i-1][w-wt[i-1]],
        dp[i-1][w]
      )
    Else:
      dp[i][w] = dp[i-1][w]`,
    },
    lcs: {
      title: "Longest Common Subsequence (LCS)",
      description:
        "Mencari urutan karakter terpanjang yang muncul pada kedua string dalam urutan yang sama (tidak harus bersebelahan). Sangat berguna dalam perbandingan teks dan bioinformatika.",
      complexity: "Time: O(m × n), Space: O(m × n)",
      useCase: "Diff tools (git diff), deteksi plagiarisme, analisis DNA.",
      pseudocode: `For i from 1 to m:
  For j from 1 to n:
    If X[i-1] == Y[j-1]:
      dp[i][j] = dp[i-1][j-1] + 1
    Else:
      dp[i][j] = max(dp[i-1][j], dp[i][j-1])`,
    },
    coin: {
      title: "Coin Change - Counting Ways",
      description:
        "Menghitung berapa banyak cara untuk menghasilkan nilai uang tertentu dari denominasi koin yang tersedia. Contoh klasik tipe unbounded knapsack.",
      complexity: "Time: O(n × amount), Space: O(amount)",
      useCase: "Sistem pembayaran, kombinatorik, distribusi logistik.",
      pseudocode: `dp[0] = 1

For each coin in coins:
  For i from coin to amount:
    dp[i] += dp[i - coin]`,
    },
    matrix: {
      title: "Matrix Chain Multiplication",
      description:
        "Menentukan urutan perkalian matriks yang paling efisien (meminimalkan operasi skalar).",
      complexity: "Time: O(n³), Space: O(n²)",
      useCase: "Optimasi rendering grafis, riset operasi, desain compiler.",
      pseudocode: `For len from 2 to n:
  For i from 0 to n-len:
    j = i + len - 1
    dp[i][j] = Infinity
    For k from i to j-1:
      cost = dp[i][k] + dp[k+1][j] 
             + dims[i]*dims[k+1]*dims[j+1]
      dp[i][j] = min(dp[i][j], cost)`,
    },
  };

  /**
   * Code snippets for display and highlighting.
   */
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
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  const [algorithm, setAlgorithm] = useState("fibonacci");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // Algorithm-specific inputs
  const [fibN, setFibN] = useState(8);
  const [knapsackItems, setKnapsackItems] = useState([
    { weight: 2, value: 3 },
    { weight: 3, value: 4 },
    { weight: 4, value: 5 },
    { weight: 5, value: 8 },
  ]);
  const [knapsackCapacity, setKnapsackCapacity] = useState(8);
  const [lcsStr1, setLcsStr1] = useState("ABCDGH");
  const [lcsStr2, setLcsStr2] = useState("AEDFHR");
  const [coinDenoms, setCoinDenoms] = useState([1, 2, 5]);
  const [coinAmount, setCoinAmount] = useState(5);
  const [matrixDims, setMatrixDims] = useState([10, 20, 30, 40, 30]);

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
    table,
    activeCell,
    dependencies,
    formula,
    desc,
    vars,
    solution = null,
    activeLine = -1
  ) => ({
    dpTable: JSON.parse(JSON.stringify(table)),
    activeCell: activeCell,
    dependencies: dependencies ? [...dependencies] : [],
    currentFormula: formula,
    stepDescription: desc,
    variables: { ...vars },
    solution: solution,
    activeCodeLine: activeLine,
  });

  const currentVisual = steps[currentStep] || {
    dpTable: [],
    activeCell: null,
    dependencies: [],
    currentFormula: "",
    stepDescription: "Memuat...",
    variables: {},
    solution: null,
    activeCodeLine: -1,
  };

  const generateSteps = (algoType) => {
    const stepsArr = [];

    if (algoType === "fibonacci") {
      const n = fibN;
      let dp = new Array(n + 1).fill(null);
      dp[0] = 0;
      dp[1] = 1;

      stepsArr.push(
        snapshot(
          [dp],
          null,
          [],
          "",
          "Inisialisasi: Base case dp[0]=0, dp[1]=1",
          { n },
          null,
          2
        )
      );

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
            { i, "dp[i-1]": dp[i - 1], "dp[i-2]": dp[i - 2] },
            null,
            6
          )
        );

        dp[i] = dp[i - 1] + dp[i - 2];

        stepsArr.push(
          snapshot(
            [dp],
            [0, i],
            [],
            `dp[${i}] = ${dp[i]}`,
            `dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${
              dp[i]
            }. Nilai tersimpan.`,
            { i, result: dp[i] },
            null,
            6
          )
        );
      }

      stepsArr.push(
        snapshot(
          [dp],
          null,
          [],
          "",
          `✓ Selesai! Fibonacci(${n}) = ${dp[n]}.`,
          { n, result: dp[n] },
          dp[n],
          9
        )
      );
    } else if (algoType === "knapsack") {
      const items = knapsackItems;
      const W = knapsackCapacity;
      const n = items.length;
      let dp = Array(n + 1)
        .fill(0)
        .map(() => Array(W + 1).fill(0));

      stepsArr.push(
        snapshot(
          dp,
          null,
          [],
          "",
          "Inisialisasi tabel DP. dp[i][w] = nilai maksimal dengan i item & kapasitas w",
          { n, W },
          null,
          2
        )
      );

      for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= W; w++) {
          const item = items[i - 1];
          if (item.weight <= w) {
            const include = item.value + dp[i - 1][w - item.weight];
            const exclude = dp[i - 1][w];

            stepsArr.push(
              snapshot(
                dp,
                [i, w],
                [
                  [i - 1, w],
                  [i - 1, w - item.weight],
                ],
                `dp[${i}][${w}] = max(${exclude}, ${item.value} + dp[${
                  i - 1
                }][${w - item.weight}])`,
                `Item ${i} (w:${item.weight}, v:${item.value}) bisa diambil. Bandingkan!`,
                {
                  i,
                  w,
                  weight: item.weight,
                  value: item.value,
                  include,
                  exclude,
                },
                null,
                7
              )
            );

            dp[i][w] = Math.max(include, exclude);

            stepsArr.push(
              snapshot(
                dp,
                [i, w],
                [],
                `dp[${i}][${w}] = ${dp[i][w]}`,
                `Pilih yang lebih baik: ${dp[i][w]}.`,
                { result: dp[i][w] },
                null,
                7
              )
            );
          } else {
            stepsArr.push(
              snapshot(
                dp,
                [i, w],
                [[i - 1, w]],
                `dp[${i}][${w}] = dp[${i - 1}][${w}]`,
                `Item ${i} terlalu berat. Skip.`,
                { i, w, weight: item.weight },
                null,
                12
              )
            );
            dp[i][w] = dp[i - 1][w];
          }
        }
      }

      stepsArr.push(
        snapshot(
          dp,
          [n, W],
          [],
          "",
          `✓ Selesai! Nilai maksimal = ${dp[n][W]}.`,
          { maxValue: dp[n][W] },
          dp[n][W],
          16
        )
      );
    } else if (algoType === "lcs") {
      const X = lcsStr1;
      const Y = lcsStr2;
      const m = X.length;
      const n = Y.length;
      let dp = Array(m + 1)
        .fill(0)
        .map(() => Array(n + 1).fill(0));

      stepsArr.push(
        snapshot(
          dp,
          null,
          [],
          "",
          `Mencari LCS dari "${X}" dan "${Y}".`,
          { m, n },
          null,
          2
        )
      );

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (X[i - 1] === Y[j - 1]) {
            stepsArr.push(
              snapshot(
                dp,
                [i, j],
                [[i - 1, j - 1]],
                `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1`,
                `Karakter match! X[${i - 1}]='${X[i - 1]}' = Y[${j - 1}]='${
                  Y[j - 1]
                }'.`,
                { i, j, charX: X[i - 1], charY: Y[j - 1] },
                null,
                7
              )
            );
            dp[i][j] = dp[i - 1][j - 1] + 1;
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
                `Tidak match. Ambil max dari atas atau kiri.`,
                {
                  i,
                  j,
                  charX: X[i - 1],
                  charY: Y[j - 1],
                  top: dp[i - 1][j],
                  left: dp[i][j - 1],
                },
                null,
                10
              )
            );
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }

          stepsArr.push(
            snapshot(
              dp,
              [i, j],
              [],
              `dp[${i}][${j}] = ${dp[i][j]}`,
              `LCS saat ini ${dp[i][j]}.`,
              { result: dp[i][j] },
              null,
              7
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          dp,
          [m, n],
          [],
          "",
          `✓ Selesai! Panjang LCS = ${dp[m][n]}.`,
          { lcsLength: dp[m][n] },
          dp[m][n],
          16
        )
      );
    } else if (algoType === "coin") {
      const coins = coinDenoms;
      const amount = coinAmount;
      let dp = new Array(amount + 1).fill(0);
      dp[0] = 1;

      stepsArr.push(
        snapshot(
          [dp],
          null,
          [],
          "",
          `Hitung cara membuat amount ${amount} dengan koin ${coins.join(
            ", "
          )}.`,
          { amount, coins: coins.join(",") },
          null,
          2
        )
      );
      stepsArr.push(
        snapshot(
          [dp],
          [0, 0],
          [],
          "dp[0] = 1",
          "Base case: 1 cara untuk 0 (tidak ambil koin).",
          { "dp[0]": 1 },
          null,
          3
        )
      );

      for (let coinIdx = 0; coinIdx < coins.length; coinIdx++) {
        const coin = coins[coinIdx];
        stepsArr.push(
          snapshot(
            [dp],
            null,
            [],
            "",
            `Proses koin ${coin}.`,
            { coin, coinIdx: coinIdx + 1 },
            null,
            5
          )
        );

        for (let i = coin; i <= amount; i++) {
          const oldVal = dp[i];
          stepsArr.push(
            snapshot(
              [dp],
              [0, i],
              [[0, i - coin]],
              `dp[${i}] += dp[${i - coin}]`,
              `Untuk nilai ${i}, tambahkan cara dari dp[${i - coin}].`,
              { i, coin, "dp[i-coin]": dp[i - coin], oldValue: oldVal },
              null,
              7
            )
          );

          dp[i] += dp[i - coin];

          stepsArr.push(
            snapshot(
              [dp],
              [0, i],
              [],
              `dp[${i}] = ${dp[i]}`,
              `Total cara untuk ${i} sekarang ${dp[i]}.`,
              { result: dp[i] },
              null,
              7
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          [dp],
          [0, amount],
          [],
          "",
          `✓ Selesai! Ada ${dp[amount]} cara.`,
          { totalWays: dp[amount] },
          dp[amount],
          11
        )
      );
    } else if (algoType === "matrix") {
      const dims = matrixDims;
      const n = dims.length - 1;
      let dp = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0));

      stepsArr.push(
        snapshot(
          dp,
          null,
          [],
          "",
          `Matrix dimensions: ${dims.join(
            " × "
          )}. Cari urutan perkalian optimal.`,
          { n, dims: dims.join("×") },
          null,
          3
        )
      );

      for (let len = 2; len <= n; len++) {
        stepsArr.push(
          snapshot(dp, null, [], "", `Chain length ${len}.`, { len }, null, 6)
        );

        for (let i = 0; i < n - len + 1; i++) {
          const j = i + len - 1;
          dp[i][j] = Infinity;

          stepsArr.push(
            snapshot(
              dp,
              [i, j],
              [],
              `dp[${i}][${j}]`,
              `Cari split optimal untuk M${i}..M${j}.`,
              { i, j, startDim: dims[i], endDim: dims[j + 1] },
              null,
              9
            )
          );

          for (let k = i; k < j; k++) {
            const cost =
              (dp[i][k] || 0) +
              (dp[k + 1][j] || 0) +
              dims[i] * dims[k + 1] * dims[j + 1];

            stepsArr.push(
              snapshot(
                dp,
                [i, j],
                [
                  [i, k],
                  [k + 1, j],
                ],
                `cost = ${cost}`,
                `Split di k=${k}: Cost = ${cost}.`,
                {
                  k,
                  cost,
                  left: dp[i][k] || 0,
                  right: dp[k + 1][j] || 0,
                  mult: dims[i] * dims[k + 1] * dims[j + 1],
                },
                null,
                13
              )
            );

            if (cost < dp[i][j]) {
              dp[i][j] = cost;
              stepsArr.push(
                snapshot(
                  dp,
                  [i, j],
                  [],
                  `dp[${i}][${j}] = ${cost}`,
                  `Update! Split di k=${k} lebih baik.`,
                  { bestK: k, result: cost },
                  null,
                  13
                )
              );
            }
          }

          stepsArr.push(
            snapshot(
              dp,
              [i, j],
              [],
              `dp[${i}][${j}] = ${dp[i][j]}`,
              `Optimal untuk M${i}..M${j} = ${dp[i][j]}.`,
              { result: dp[i][j] },
              null,
              13
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          dp,
          [0, n - 1],
          [],
          "",
          `✓ Selesai! Minimum operasi = ${dp[0][n - 1]}.`,
          { minOps: dp[0][n - 1] },
          dp[0][n - 1],
          17
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
  }, [
    algorithm,
    fibN,
    knapsackItems,
    knapsackCapacity,
    lcsStr1,
    lcsStr2,
    coinDenoms,
    coinAmount,
    matrixDims,
  ]);

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
    if (currentStep >= steps.length - 1) return "text-emerald-400";
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

  const renderDPTable = () => {
    const table = currentVisual.dpTable;
    if (!table || table.length === 0)
      return <div className="text-slate-500 text-sm">No data</div>;

    const is1D = table.length === 1;

    if (is1D) {
      const row = table[0];
      return (
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 justify-center flex-wrap">
            {row.map((val, idx) => {
              const isActive =
                currentVisual.activeCell &&
                currentVisual.activeCell[0] === 0 &&
                currentVisual.activeCell[1] === idx;
              const isDep = currentVisual.dependencies.some(
                ([r, c]) => r === 0 && c === idx
              );
              let bgClass = "bg-slate-800";
              let borderClass = "border-slate-600";
              let textClass = "text-slate-300";

              if (isActive) {
                bgClass = "bg-yellow-500";
                borderClass = "border-yellow-300";
                textClass = "text-black font-bold";
              } else if (isDep) {
                bgClass = "bg-blue-600";
                borderClass = "border-blue-400";
                textClass = "text-white font-bold";
              } else if (val !== null && val !== 0) {
                bgClass = "bg-emerald-900/40";
                borderClass = "border-emerald-600";
                textClass = "text-emerald-300";
              }

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-500 font-mono">
                    i={idx}
                  </span>
                  <div
                    className={`w-12 h-12 flex items-center justify-center border-2 rounded font-mono text-sm transition-all ${bgClass} ${borderClass} ${textClass}`}
                  >
                    {val === null ? "-" : val}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      // 2D Table
      return (
        <div className="overflow-auto max-h-[400px]">
          <table className="border-collapse">
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  <td className="text-[10px] text-slate-500 font-mono px-2 text-right">
                    {i === 0 ? "" : `i=${i}`}
                  </td>
                  {row.map((val, j) => {
                    const isActive =
                      currentVisual.activeCell &&
                      currentVisual.activeCell[0] === i &&
                      currentVisual.activeCell[1] === j;
                    const isDep = currentVisual.dependencies.some(
                      ([r, c]) => r === i && c === j
                    );
                    let bgClass = "bg-slate-800";
                    let borderClass = "border-slate-600";
                    let textClass = "text-slate-300";

                    if (isActive) {
                      bgClass = "bg-yellow-500";
                      borderClass = "border-yellow-300";
                      textClass = "text-black font-bold";
                    } else if (isDep) {
                      bgClass = "bg-blue-600";
                      borderClass = "border-blue-400";
                      textClass = "text-white font-bold";
                    } else if (val !== null && val !== 0) {
                      bgClass = "bg-emerald-900/40";
                      borderClass = "border-emerald-600";
                      textClass = "text-emerald-300";
                    }

                    return (
                      <td key={j} className="p-0">
                        <div
                          className={`w-12 h-12 flex items-center justify-center border-2 m-0.5 rounded font-mono text-xs transition-all ${bgClass} ${borderClass} ${textClass}`}
                        >
                          {val === null ? "-" : val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-[10px] text-slate-500 text-center mt-2 flex justify-center gap-4">
            {table[0] &&
              table[0].map((_, j) => (
                <span key={j} className="w-12 font-mono">
                  j={j}
                </span>
              ))}
          </div>
        </div>
      );
    }
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
                <BrainCircuit size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo Dynamic
                </h1>
                <p className="text-xs text-slate-400">
                  Optimasi dengan Tabel & Memo
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <option value="fibonacci">Fibonacci</option>
                <option value="knapsack">0/1 Knapsack</option>
                <option value="lcs">LCS</option>
                <option value="coin">Coin Change</option>
                <option value="matrix">Matrix Chain</option>
              </select>

              {/* Inputs */}
              {algorithm === "fibonacci" && (
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    N:
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={fibN}
                    onChange={(e) => setFibN(Number(e.target.value))}
                    className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-orange-400 w-6 text-center">
                    {fibN}
                  </span>
                </div>
              )}
              {algorithm === "knapsack" && (
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Cap:
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="1"
                    value={knapsackCapacity}
                    onChange={(e) =>
                      setKnapsackCapacity(Number(e.target.value))
                    }
                    className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-orange-400 w-6 text-center">
                    {knapsackCapacity}
                  </span>
                </div>
              )}
              {algorithm === "coin" && (
                <div className="flex items-center gap-2 px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Amt:
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(Number(e.target.value))}
                    className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-orange-400 w-6 text-center">
                    {coinAmount}
                  </span>
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
                <Search size={20} className="text-white" />
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
                  Visualisasi Tabel DP
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[400px] overflow-auto">
                {renderDPTable()}
              </div>
            </div>

            {/* 2. Controls & Formula */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl p-4 flex flex-col gap-4">
              {/* Formula Box */}
              {currentVisual.currentFormula && (
                <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1 flex items-center gap-2">
                    <Layers size={14} /> Formula Saat Ini
                  </div>
                  <div className="font-mono text-orange-300 text-center text-sm">
                    {currentVisual.currentFormula}
                  </div>
                </div>
              )}

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

export default DynamicProgramming;
