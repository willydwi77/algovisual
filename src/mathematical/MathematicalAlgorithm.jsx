import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Calculator,
  Code,
  Variable,
  MessageSquare,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Square,
  Hash,
  Clock,
  Info,
  Percent,
} from "lucide-react";

/**
 * MathematicalAlgorithm Component
 * Visualizes various number theory and mathematical algorithms with step-by-step execution,
 * code highlighting, and variable tracking.
 */
const MathematicalAlgorithm = () => {
  // ==========================================
  // 1. CONSTANTS & DEFINITIONS
  // ==========================================

  const STEP_DELAY = 500; // ms per step

  /**
   * Variable definitions for the variable badge display.
   * Maps variable names to Indonesian descriptions.
   */
  const variableDefinitions = {
    common: {},
    sieve: {
      n: "Batas Atas",
      p: "Bilangan Prima Saat Ini",
      marked: "Bilangan Ditandai",
      primes: "Prima Ditemukan",
      factor: "Faktor Pengali",
      nextMarket: "Tanda Berikutnya",
      primesCount: "Jumlah Prima",
    },
    gcd: {
      a: "Bilangan A",
      b: "Bilangan B",
      q: "Hasil Bagi",
      r: "Sisa Bagi",
      gcd: "FPB",
      oldA: "A Lama",
      oldB: "B Lama",
      newA: "A Baru",
      newB: "B Baru",
    },
    fastexp: {
      base: "Basis",
      exp: "Eksponen",
      result: "Hasil",
      bit: "Bit Biner",
      currentBase: "Base Kuadrat",
      bitPos: "Posisi Bit",
      nextExp: "Eksponen Berikutnya",
      binary: "Biner",
    },
    fibmat: {
      n: "Ke-n",
      resultMatrix: "Matriks Hasil",
      baseMatrix: "Matriks Basis",
      fib: "Nilai Fibonacci",
    },
    modular: {
      a: "Bilangan",
      m: "Modulo",
      r0: "Sisa Awal",
      r1: "Sisa Baru",
      x0: "Koefisien",
      x1: "Koefisien Baru",
      inverse: "Invers Modular",
      verify: "Verifikasi",
      gcd: "FPB",
      q: "Quotient",
      r2: "Sisa Baru",
      x2: "Koef Baru",
    },
  };

  /**
   * Algorithm details including title, description, complexity, use case, and pseudocode.
   */
  const algorithmDescriptions = {
    sieve: {
      title: "Sieve of Eratosthenes - Prime Numbers",
      description:
        "Algoritma kuno untuk menemukan semua bilangan prima hingga batas tertentu. Menandai kelipatan dari setiap bilangan prima mulai dari 2. Bilangan yang tidak ditandai adalah prima.",
      complexity: "Time: O(n log log n)",
      useCase: "Kriptografi, faktorisasi prima, teori bilangan.",
      pseudocode: `isPrime = [true, ..., true]
isPrime[0] = isPrime[1] = false
for p = 2 to sqrt(n):
  if isPrime[p]:
    for i = p*p to n step p:
      isPrime[i] = false`,
    },
    gcd: {
      title: "Euclidean Algorithm - GCD",
      description:
        "Mencari Faktor Persekutuan Terbesar (FPB) dari dua bilangan. Berdasarkan sifat: GCD(a,b) = GCD(b, a mod b). Dilakukan secara rekursif atau iteratif sampai sisa bagi = 0.",
      complexity: "Time: O(log min(a, b))",
      useCase: "Penyederhanaan pecahan, kriptografi (RSA), aritmatika modular.",
      pseudocode: `function gcd(a, b):
  while b ≠ 0:
    t = b
    b = a mod b
    a = t
  return a`,
    },
    fastexp: {
      title: "Fast Exponentiation - Binary Method",
      description:
        "Menghitung a^n dengan eksponensiasi biner yang efisien. Mengubah pangkat ke biner, mengkuadratkan basis berulang kali, dan mengalikan jika bit = 1.",
      complexity: "Time: O(log n)",
      useCase: "Kriptografi (RSA, Diffie-Hellman), perhitungan bilangan besar.",
      pseudocode: `res = 1
while exp > 0:
  if exp % 2 == 1:
    res = res * base
  base = base * base
  exp = floor(exp / 2)
return res`,
    },
    fibmat: {
      title: "Fibonacci - Matrix Exponentiation",
      description:
        "Menghitung Fibonacci ke-n dengan eksponensiasi matriks. Menggunakan properti matriks Q = [[1,1],[1,0]]. Q^n memberikan [F(n+1), F(n)].",
      complexity: "Time: O(log n)",
      useCase: "Pemrograman kompetitif, perhitungan Fibonacci lanjutan.",
      pseudocode: `Matriks base = [[1, 1], [1, 0]]
Matriks res = [[1, 0], [0, 1]] (Identitas)
while n > 0:
  if n % 2 == 1:
    res = multiply(res, base)
  base = multiply(base, base)
  n = floor(n / 2)
return res[0][1]`,
    },
    modular: {
      title: "Modular Multiplicative Inverse",
      description:
        "Mencari invers modular a^(-1) mod m menggunakan Extended Euclidean Algorithm. Mencari x sehingga (a * x) mod m = 1.",
      complexity: "Time: O(log m)",
      useCase: "Kriptografi, dekripsi RSA, menyelesaikan kongruensi linear.",
      pseudocode: `function modInverse(a, m):
  (g, x, y) = extendedGCD(a, m)
  if g ≠ 1:
    return "Tidak ada invers"
  else:
    return (x % m + m) % m`,
    },
  };

  /**
   * Code strings for each algorithm to be displayed and highlighted.
   * Comments removed for cleaner implementation view.
   */
  const algoCode = {
    sieve: `function sieveOfEratosthenes(n) {
  let isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  
  let primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}`,
    gcd: `function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function gcdRecursive(a, b) {
  if (b === 0) return a;
  return gcdRecursive(b, a % b);
}`,
    fastexp: `function fastPower(base, exp) {
  let result = 1;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = result * base;
    }
    base = base * base;
    exp = Math.floor(exp / 2);
  }
  
  return result;
}

function modPower(base, exp, mod) {
  let result = 1;
  base = base % mod;
  
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
}`,
    fibmat: `function fibMatrix(n) {
  let result = [[1, 0], [0, 1]];
  let base = [[1, 1], [1, 0]];
  
  while (n > 0) {
    if (n % 2 === 1) {
      result = matMul(result, base);
    }
    base = matMul(base, base);
    n = Math.floor(n / 2);
  }
  
  return result[0][1];
}

function matMul(A, B) {
  return [
    [A[0][0]*B[0][0] + A[0][1]*B[1][0],
     A[0][0]*B[0][1] + A[0][1]*B[1][1]],
    [A[1][0]*B[0][0] + A[1][1]*B[1][0],
     A[1][0]*B[0][1] + A[1][1]*B[1][1]]
  ];
}`,
    modular: `function modInverse(a, m) {
  let [x, y] = extGCD(a, m);
  
  return ((x % m) + m) % m;
}

function extGCD(a, b) {
  if (b === 0) return [1, 0];
  
  let [x1, y1] = extGCD(b, a % b);
  
  let x = y1;
  let y = x1 - Math.floor(a / b) * y1;
  
  return [x, y];
}`,
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  const [algorithm, setAlgorithm] = useState("sieve");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // Input states
  const [sieveN, setSieveN] = useState(30);
  const [gcdA, setGcdA] = useState(48);
  const [gcdB, setGcdB] = useState(18);
  const [fastBase, setFastBase] = useState(2);
  const [fastExp, setFastExp] = useState(13);
  const [fibN, setFibN] = useState(10);
  const [modA, setModA] = useState(3);
  const [modM, setModM] = useState(11);

  // ==========================================
  // 3. LOGIC & HELPERS
  // ==========================================

  /**
   * Helper to get variable description.
   */
  const getVarDesc = (name) => {
    if (
      variableDefinitions[algorithm] &&
      variableDefinitions[algorithm][name]
    ) {
      return variableDefinitions[algorithm][name];
    }
    return variableDefinitions.common[name] || "";
  };

  /**
   * Snapshot generator.
   */
  const snapshot = (
    grid,
    active,
    status,
    desc,
    vars = {},
    extra = {},
    activeLine = -1
  ) => ({
    grid: grid ? [...grid] : null,
    activeIndex: active,
    status: status,
    stepDescription: desc,
    variables: { ...vars },
    activeCodeLine: activeLine,
    ...extra,
  });

  /**
   * Step generator logic.
   */
  const generateSteps = (algoType) => {
    const stepsArr = [];

    if (algoType === "sieve") {
      const n = sieveN;
      const isPrime = new Array(n + 1).fill(true);
      isPrime[0] = false;
      isPrime[1] = false;

      stepsArr.push(
        snapshot(
          [...isPrime],
          -1,
          "start",
          `Sieve of Eratosthenes untuk n=${n}. Inisialisasi semua sebagai prima, kecuali 0 dan 1.`,
          { n, primes: 0 },
          {},
          2
        )
      );

      for (let p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
          stepsArr.push(
            snapshot(
              [...isPrime],
              p,
              "prime",
              `${p} adalah prima. Tandai semua kelipatan ${p} mulai dari ${
                p * p
              }.`,
              { p, nextMarket: p * p },
              {},
              5
            )
          );

          for (let i = p * p; i <= n; i += p) {
            isPrime[i] = false;
            stepsArr.push(
              snapshot(
                [...isPrime],
                i,
                "marking",
                `Tandai ${i} sebagai bukan prima (${i} = ${p} × ${Math.floor(
                  i / p
                )}).`,
                { p, marked: i, factor: p },
                {},
                7
              )
            );
          }

          stepsArr.push(
            snapshot(
              [...isPrime],
              p,
              "marked",
              `Semua kelipatan ${p} telah ditandai.`,
              { p },
              {},
              9
            )
          );
        }
      }

      const primes = [];
      for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i);
      }

      stepsArr.push(
        snapshot(
          [...isPrime],
          -1,
          "complete",
          `Sieve selesai! Ditemukan ${primes.length} bilangan prima.`,
          { primesCount: primes.length },
          { primes },
          14
        )
      );
    } else if (algoType === "gcd") {
      let a = gcdA;
      let b = gcdB;

      stepsArr.push(
        snapshot(
          null,
          -1,
          "start",
          `Cari FPB(${gcdA}, ${gcdB}) menggunakan Algoritma Euclidean.`,
          { a, b },
          {},
          2
        )
      );

      while (b !== 0) {
        const quotient = Math.floor(a / b);
        const remainder = a % b;

        stepsArr.push(
          snapshot(
            null,
            -1,
            "dividing",
            `${a} = ${b} × ${quotient} + ${remainder}`,
            { a, b, q: quotient, r: remainder },
            {},
            3
          )
        );

        stepsArr.push(
          snapshot(
            null,
            -1,
            "update",
            `Update: a = ${b}, b = ${remainder}`,
            { oldA: a, oldB: b, newA: b, newB: remainder },
            {},
            4
          )
        );

        a = b;
        b = remainder;
      }

      stepsArr.push(
        snapshot(
          null,
          -1,
          "found",
          `✓ FPB ditemukan! FPB(${gcdA}, ${gcdB}) = ${a}`,
          { gcd: a },
          {},
          7
        )
      );
    } else if (algoType === "fastexp") {
      let base = fastBase;
      let exp = fastExp;
      let result = 1;

      stepsArr.push(
        snapshot(
          null,
          -1,
          "start",
          `Hitung ${base}^${exp} menggunakan Fast Exponentiation.`,
          { base, exp, result },
          {},
          2
        )
      );

      let exp_orig = exp;
      let exp_binary = exp.toString(2);

      stepsArr.push(
        snapshot(
          null,
          -1,
          "binary",
          `Eksponen ${exp} dalam biner: ${exp_binary}. Proses dari kanan ke kiri.`,
          { exp, binary: exp_binary },
          {},
          4
        )
      );

      let currentBase = base;
      let bitPos = 0;

      while (exp > 0) {
        const bit = exp % 2;

        if (bit === 1) {
          result = result * currentBase;
          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "multiply",
              `Bit ke-${bitPos} adalah 1: Kalikan hasil dengan base saat ini.`,
              { bit, bitPos, currentBase, result },
              {},
              6
            )
          );
        } else {
          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "skip",
              `Bit ke-${bitPos} adalah 0: Lewati perkalian.`,
              { bit, bitPos, currentBase, result },
              {},
              4
            )
          );
        }

        currentBase = currentBase * currentBase;
        exp = Math.floor(exp / 2);
        bitPos++;

        if (exp > 0) {
          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "square",
              `Kuadratkan base untuk iterasi berikutnya: ${currentBase}`,
              { currentBase, nextExp: exp },
              {},
              8
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          null,
          -1,
          "complete",
          `✓ ${base}^${exp_orig} = ${result}`,
          { base, exp: exp_orig, result },
          {},
          11
        )
      );
    } else if (algoType === "fibmat") {
      const n = fibN;

      // Matrix representation
      let result = [
        [1, 0],
        [0, 1],
      ]; // Identity
      let base = [
        [1, 1],
        [1, 0],
      ]; // Base
      let exp = n;

      stepsArr.push(
        snapshot(
          null,
          -1,
          "start",
          `Hitung Fibonacci(${n}) dengan matriks eksponensial.`,
          { n },
          { resultMatrix: result, baseMatrix: base },
          {},
          2
        )
      );

      let bitPos = 0;

      while (exp > 0) {
        if (exp % 2 === 1) {
          // Matrix multiplication
          const newResult = [
            [
              result[0][0] * base[0][0] + result[0][1] * base[1][0],
              result[0][0] * base[0][1] + result[0][1] * base[1][1],
            ],
            [
              result[1][0] * base[0][0] + result[1][1] * base[1][0],
              result[1][0] * base[0][1] + result[1][1] * base[1][1],
            ],
          ];
          result = newResult;

          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "multiply",
              `Kalikan matriks hasil dengan matriks base.`,
              { bit: 1, bitPos },
              { resultMatrix: result, baseMatrix: base },
              {},
              6
            )
          );
        } else {
          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "skip",
              `Bit = 0: Lewati perkalian.`,
              { bit: 0, bitPos },
              { resultMatrix: result, baseMatrix: base },
              {},
              5
            )
          );
        }

        // Square base matrix
        const newBase = [
          [
            base[0][0] * base[0][0] + base[0][1] * base[1][0],
            base[0][0] * base[0][1] + base[0][1] * base[1][1],
          ],
          [
            base[1][0] * base[0][0] + base[1][1] * base[1][0],
            base[1][0] * base[0][1] + base[1][1] * base[1][1],
          ],
        ];
        base = newBase;

        exp = Math.floor(exp / 2);
        bitPos++;

        if (exp > 0) {
          stepsArr.push(
            snapshot(
              null,
              bitPos,
              "square",
              `Kuadratkan matriks base.`,
              { bitPos },
              { resultMatrix: result, baseMatrix: base },
              {},
              8
            )
          );
        }
      }

      const fibValue = result[0][1];
      stepsArr.push(
        snapshot(
          null,
          -1,
          "complete",
          `✓ Fibonacci(${n}) = ${fibValue}.`,
          { n, fib: fibValue },
          { resultMatrix: result },
          {},
          11
        )
      );
    } else if (algoType === "modular") {
      const a = modA;
      const m = modM;

      stepsArr.push(
        snapshot(
          null,
          -1,
          "start",
          `Cari invers modular dari ${a} mod ${m}.`,
          { a, m },
          {},
          2
        )
      );

      // Extended Euclidean Algorithm
      let r0 = m,
        r1 = a;
      let x0 = 0,
        x1 = 1;

      stepsArr.push(
        snapshot(
          null,
          -1,
          "ext_gcd_start",
          `Gunakan Extended Euclidean Algorithm. Init: r0=${r0}, r1=${r1}, x0=${x0}, x1=${x1}`,
          { r0, r1, x0, x1 },
          {},
          5
        )
      );

      let iter = 0;
      while (r1 !== 0) {
        const q = Math.floor(r0 / r1);
        const r2 = r0 - q * r1;
        const x2 = x0 - q * x1;

        stepsArr.push(
          snapshot(
            null,
            iter,
            "ext_gcd_step",
            `Iterasi ${iter}: q=${q}, r2=${r2}, x2=${x2}`,
            { iter, q, r0, r1, r2, x0, x1, x2 },
            {},
            9
          )
        );

        r0 = r1;
        r1 = r2;
        x0 = x1;
        x1 = x2;
        iter++;
      }

      stepsArr.push(
        snapshot(
          null,
          -1,
          "ext_gcd_done",
          `Extended GCD selesai. FPB(${a}, ${m}) = ${r0}, koefisien x = ${x0}`,
          { gcd: r0, x: x0 },
          {},
          12
        )
      );

      if (r0 !== 1) {
        stepsArr.push(
          snapshot(
            null,
            -1,
            "no_inverse",
            `✗ Tidak ada invers modular! FPB(${a}, ${m}) ≠ 1.`,
            { gcd: r0 },
            {},
            6
          )
        );
      } else {
        let inv = ((x0 % m) + m) % m;
        stepsArr.push(
          snapshot(
            null,
            -1,
            "found",
            `✓ Invers Modular: ${a}^(-1) mod ${m} = ${inv}. Verifikasi: (${a} × ${inv}) mod ${m} = ${
              (a * inv) % m
            }`,
            { a, m, inverse: inv, verify: (a * inv) % m },
            {},
            4
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
  }, [algorithm, sieveN, gcdA, gcdB, fastBase, fastExp, fibN, modA, modM]);

  const resetAndGenerate = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
    const generatedSteps = generateSteps(algorithm);
    setSteps(generatedSteps);
  };

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      const baseTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - baseTime;
        setElapsedTime(newElapsed);

        // Sync step
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

  const currentVisual = steps[currentStep] || {
    grid: null,
    activeIndex: -1,
    status: "start",
    stepDescription: "Memuat...",
    variables: {},
    activeCodeLine: -1,
  };

  // ==========================================
  // 5. RENDER HELPER COMPONENTS
  // ==========================================

  const getStatusColor = () => {
    const status = currentVisual.status;
    if (status === "prime" || status === "found") return "text-emerald-400";
    if (status === "marking" || status === "no_inverse") return "text-red-400";
    if (status === "complete") return "text-cyan-300";
    return "text-slate-400";
  };

  const getStatusText = () => {
    return (currentVisual.status || "READY").toUpperCase().replace("_", " ");
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

  /**
   * Execution Log Component (Stack)
   */
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

  const VisualizationCanvas = () => {
    if (algorithm === "sieve") {
      const grid = currentVisual.grid;
      if (!grid) return null;
      return (
        <div className="flex flex-wrap gap-1 justify-center max-w-4xl">
          {grid.map((isPrime, num) => {
            if (num === 0) return null;
            const isActive = currentVisual.activeIndex === num;
            let bgClass = isPrime ? "bg-slate-800" : "bg-slate-700/40";
            let borderClass = isPrime ? "border-slate-600" : "border-slate-700";
            let textClass = isPrime
              ? "text-orange-300 font-bold"
              : "text-slate-600 line-through";

            if (isActive && currentVisual.status === "prime") {
              bgClass = "bg-emerald-500";
              borderClass = "border-emerald-300";
              textClass = "text-black font-bold";
            } else if (isActive && currentVisual.status === "marking") {
              bgClass = "bg-red-500";
              borderClass = "border-red-300";
              textClass = "text-white line-through font-bold";
            }

            return (
              <div
                key={num}
                className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${bgClass} ${borderClass} ${textClass} text-xs rounded shadow-sm`}
              >
                {num}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 text-center w-full">
        <div className="max-w-2xl w-full">
          <div className="text-4xl font-mono text-orange-400 mb-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-inner">
            {algorithm === "gcd" &&
              currentVisual.variables.a &&
              currentVisual.variables.b &&
              `FPB(${gcdA}, ${gcdB})`}
            {algorithm === "fastexp" &&
              currentVisual.variables.base &&
              `${currentVisual.variables.base}^${
                currentVisual.variables.exp !== undefined
                  ? currentVisual.variables.exp
                  : 13
              }`}
            {algorithm === "fibmat" &&
              currentVisual.variables.n &&
              `Fibonacci(${currentVisual.variables.n})`}
            {algorithm === "modular" &&
              currentVisual.variables.a &&
              `${currentVisual.variables.a}^(-1) mod ${currentVisual.variables.m}`}
          </div>

          {algorithm === "fibmat" && currentVisual.resultMatrix && (
            <div className="flex gap-8 justify-center mt-6">
              <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                <div className="text-xs text-orange-400 mb-2 font-bold uppercase">
                  Matriks Hasil
                </div>
                <div className="bg-slate-900 border-2 border-orange-600/50 p-4 rounded-lg shadow-lg">
                  {currentVisual.resultMatrix.map((row, i) => (
                    <div key={i} className="flex gap-2 mb-2 last:mb-0">
                      {row.map((val, j) => (
                        <div
                          key={j}
                          className="w-16 h-10 flex items-center justify-center bg-orange-900/20 border border-orange-700/50 text-orange-200 text-sm font-mono rounded"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {currentVisual.baseMatrix && (
                <div className="flex flex-col items-center p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                  <div className="text-xs text-orange-400 mb-2 font-bold uppercase">
                    Matriks Basis
                  </div>
                  <div className="bg-slate-900 border-2 border-orange-600/50 p-4 rounded-lg shadow-lg">
                    {currentVisual.baseMatrix.map((row, i) => (
                      <div key={i} className="flex gap-2 mb-2 last:mb-0">
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className="w-16 h-10 flex items-center justify-center bg-orange-900/20 border border-orange-700/50 text-orange-200 text-sm font-mono rounded"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                <Calculator size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo Math
                </h1>
                <p className="text-xs text-slate-400">
                  Teori Bilangan & Komputasi
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <option value="sieve">Sieve of Eratosthenes</option>
                <option value="gcd">GCD - Euclidean</option>
                <option value="fastexp">Fast Exponentiation</option>
                <option value="fibmat">Fibonacci Matrix</option>
                <option value="modular">Modular Inverse</option>
              </select>

              {/* INPUT CONTROLS */}
              {algorithm === "sieve" && (
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>N</span>
                    <span className="text-orange-400 font-mono">{sieveN}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={sieveN}
                    onChange={(e) => setSieveN(Number(e.target.value))}
                    className="w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                  />
                </div>
              )}
              {algorithm === "gcd" && (
                <>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>A</span>
                      <span className="text-orange-400 font-mono">{gcdA}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={gcdA}
                      onChange={(e) => setGcdA(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>B</span>
                      <span className="text-orange-400 font-mono">{gcdB}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={gcdB}
                      onChange={(e) => setGcdB(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                </>
              )}
              {algorithm === "fastexp" && (
                <>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>Base</span>
                      <span className="text-orange-400 font-mono">
                        {fastBase}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={fastBase}
                      onChange={(e) => setFastBase(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>Exp</span>
                      <span className="text-orange-400 font-mono">
                        {fastExp}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={fastExp}
                      onChange={(e) => setFastExp(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                </>
              )}
              {algorithm === "fibmat" && (
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>N</span>
                    <span className="text-orange-400 font-mono">{fibN}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={fibN}
                    onChange={(e) => setFibN(Number(e.target.value))}
                    className="w-24 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                  />
                </div>
              )}
              {algorithm === "modular" && (
                <>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>A</span>
                      <span className="text-orange-400 font-mono">{modA}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={modA}
                      onChange={(e) => setModA(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                      <span>M</span>
                      <span className="text-orange-400 font-mono">{modM}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="20"
                      value={modM}
                      onChange={(e) => setModM(Number(e.target.value))}
                      className="w-20 h-2 bg-slate-700 rounded-lg accent-orange-500 cursor-pointer"
                    />
                  </div>
                </>
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
                  <Hash size={16} className="text-orange-400" />
                  Visualisasi Angka
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="relative w-full p-6 bg-[#0f1117] flex items-center justify-center h-full min-h-[400px] overflow-auto">
                <VisualizationCanvas />
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

export default MathematicalAlgorithm;
