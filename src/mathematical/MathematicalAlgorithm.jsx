import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Calculator, Code, Variable, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Hash, Percent } from 'lucide-react'

const MathematicalAlgorithm = () => {
  // --- STATE ---
  const [speed, setSpeed] = useState(5)
  const [algorithm, setAlgorithm] = useState('sieve')

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Algorithm inputs
  const [sieveN, setSieveN] = useState(30)
  const [gcdA, setGcdA] = useState(48)
  const [gcdB, setGcdB] = useState(18)
  const [fastBase, setFastBase] = useState(2)
  const [fastExp, setFastExp] = useState(13)
  const [fibN, setFibN] = useState(10)
  const [modA, setModA] = useState(3)
  const [modM, setModM] = useState(11)

  const algorithmDescriptions = {
    sieve: {
      title: 'Sieve of Eratosthenes - Prime Numbers',
      description: 'Ancient algorithm untuk find all prime numbers up to n. Mark multiples of each prime starting from 2. Numbers yang tidak di-mark adalah prime. Efisien untuk generate many primes sekaligus.',
      complexity: 'O(n log log n) - hampir linear',
      useCase: 'Cryptography, prime factorization, number theory, competitive programming',
    },
    gcd: {
      title: 'Euclidean Algorithm - GCD',
      description: 'Find Greatest Common Divisor (GCD) dari dua numbers. Based on property: GCD(a,b) = GCD(b, a mod b). Recursive atau iterative sampai remainder = 0.',
      complexity: 'O(log min(a, b))',
      useCase: 'Fraction simplification, cryptography (RSA), modular arithmetic, LCM calculation',
    },
    fastexp: {
      title: 'Fast Exponentiation - Binary Method',
      description: 'Hitung a^n dengan efficient binary exponentiation. Convert exponent ke binary, square base repeatedly, multiply ketika bit = 1. Jauh lebih cepat dari naive multiplication.',
      complexity: 'O(log n) - exponential speedup',
      useCase: 'Cryptography (RSA, Diffie-Hellman), modular exponentiation, large number computation',
    },
    fibmat: {
      title: 'Fibonacci - Matrix Exponentiation',
      description: 'Hitung Fibonacci ke-n dengan matrix exponentiation. Gunakan property [[F(n+1), F(n)], [F(n), F(n-1)]] = [[1,1],[1,0]]^n. Combine dengan fast exponentiation untuk O(log n).',
      complexity: 'O(log n) vs O(n) DP',
      useCase: 'Competitive programming, advanced Fibonacci, demonstrate matrix power',
    },
    modular: {
      title: 'Modular Multiplicative Inverse',
      description: 'Find modular inverse a^(-1) mod m menggunakan Extended Euclidean Algorithm. Property: (a × a^(-1)) mod m = 1. Penting untuk modular division.',
      complexity: 'O(log m)',
      useCase: 'Cryptography, modular arithmetic, solving linear congruences, RSA decryption',
    },
  }

  const algoCode = {
    sieve: `function sieveOfEratosthenes(n) {
  let isPrime = new Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  
  for (let p = 2; p * p <= n; p++) {
    if (isPrime[p]) {
      // Mark multiples of p
      for (let i = p * p; i <= n; i += p) {
        isPrime[i] = false;
      }
    }
  }
  
  // Collect primes
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

// Recursive version
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

// With modulo for large numbers
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
  let result = [[1, 0], [0, 1]]; // Identity
  let base = [[1, 1], [1, 0]];
  
  while (n > 0) {
    if (n % 2 === 1) {
      result = matMul(result, base);
    }
    base = matMul(base, base);
    n = Math.floor(n / 2);
  }
  
  return result[0][1]; // F(n)
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
  
  // Make x positive
  return ((x % m) + m) % m;
}

function extGCD(a, b) {
  if (b === 0) return [1, 0];
  
  let [x1, y1] = extGCD(b, a % b);
  
  let x = y1;
  let y = x1 - Math.floor(a / b) * y1;
  
  return [x, y];
}`,
  }

  // --- ENGINE: SNAPSHOT ---
  const snapshot = (grid, active, status, desc, vars = {}, extra = {}) => ({
    grid: grid ? [...grid] : null,
    activeIndex: active,
    status: status,
    stepDescription: desc,
    variables: { ...vars },
    ...extra,
  })

  const generateSteps = (algoType) => {
    const stepsArr = []

    if (algoType === 'sieve') {
      const n = sieveN
      const isPrime = new Array(n + 1).fill(true)
      isPrime[0] = false
      isPrime[1] = false

      stepsArr.push(snapshot([...isPrime], -1, 'start', `Sieve of Eratosthenes for n=${n}. Initialize all numbers as prime, except 0 and 1.`, { n, primes: 0 }))

      for (let p = 2; p * p <= n; p++) {
        if (isPrime[p]) {
          stepsArr.push(snapshot([...isPrime], p, 'prime', `${p} is prime. Mark all multiples of ${p} starting from ${p * p}.`, { p, nextMarket: p * p }))

          for (let i = p * p; i <= n; i += p) {
            isPrime[i] = false
            stepsArr.push(snapshot([...isPrime], i, 'marking', `Mark ${i} as composite (${i} = ${p} × ${Math.floor(i / p)}).`, { p, marked: i, factor: p }))
          }

          stepsArr.push(snapshot([...isPrime], p, 'marked', `All multiples of ${p} marked. Next prime check.`, { p }))
        }
      }

      const primes = []
      for (let i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push(i)
      }

      stepsArr.push(snapshot([...isPrime], -1, 'complete', `Sieve complete! Found ${primes.length} primes: [${primes.join(', ')}]`, { primesCount: primes.length }, { primes }))
    } else if (algoType === 'gcd') {
      let a = gcdA
      let b = gcdB

      stepsArr.push(snapshot(null, -1, 'start', `Find GCD(${gcdA}, ${gcdB}) using Euclidean Algorithm.`, { a, b }))

      while (b !== 0) {
        const quotient = Math.floor(a / b)
        const remainder = a % b

        stepsArr.push(snapshot(null, -1, 'dividing', `${a} = ${b} × ${quotient} + ${remainder}`, { a, b, q: quotient, r: remainder }))

        stepsArr.push(snapshot(null, -1, 'update', `Update: a = ${b}, b = ${remainder}`, { oldA: a, oldB: b, newA: b, newB: remainder }))

        a = b
        b = remainder
      }

      stepsArr.push(snapshot(null, -1, 'found', `✓ GCD found! GCD(${gcdA}, ${gcdB}) = ${a}`, { gcd: a }))
    } else if (algoType === 'fastexp') {
      let base = fastBase
      let exp = fastExp
      let result = 1
      const steps_calc = []

      stepsArr.push(snapshot(null, -1, 'start', `Calculate ${base}^${exp} using fast exponentiation (binary method).`, { base, exp, result }))

      let exp_orig = exp
      let exp_binary = exp.toString(2)

      stepsArr.push(snapshot(null, -1, 'binary', `Exponent ${exp} in binary: ${exp_binary}. Process from right to left.`, { exp, binary: exp_binary }))

      let currentBase = base
      let bitPos = 0

      while (exp > 0) {
        const bit = exp % 2

        if (bit === 1) {
          result = result * currentBase
          stepsArr.push(snapshot(null, bitPos, 'multiply', `Bit ${bitPos} = 1: result = result × ${currentBase} = ${result}`, { bit, bitPos, currentBase, result }))
        } else {
          stepsArr.push(snapshot(null, bitPos, 'skip', `Bit ${bitPos} = 0: Skip multiplication.`, { bit, bitPos, currentBase, result }))
        }

        currentBase = currentBase * currentBase
        exp = Math.floor(exp / 2)
        bitPos++

        if (exp > 0) {
          stepsArr.push(snapshot(null, bitPos, 'square', `Square base: ${Math.floor(currentBase / (currentBase / Math.sqrt(currentBase)))} → ${currentBase}`, { currentBase, nextExp: exp }))
        }
      }

      stepsArr.push(snapshot(null, -1, 'complete', `✓ ${base}^${exp_orig} = ${result}`, { base, exp: exp_orig, result }))
    } else if (algoType === 'fibmat') {
      const n = fibN

      // Matrix representation
      let result = [
        [1, 0],
        [0, 1],
      ] // Identity matrix
      let base = [
        [1, 1],
        [1, 0],
      ] // Base matrix F
      let exp = n

      stepsArr.push(snapshot(null, -1, 'start', `Calculate Fibonacci(${n}) using matrix exponentiation. F(n) = [[1,1],[1,0]]^n [0,1]`, { n }, { resultMatrix: result, baseMatrix: base }))

      let bitPos = 0

      while (exp > 0) {
        if (exp % 2 === 1) {
          // Matrix multiplication
          const newResult = [
            [result[0][0] * base[0][0] + result[0][1] * base[1][0], result[0][0] * base[0][1] + result[0][1] * base[1][1]],
            [result[1][0] * base[0][0] + result[1][1] * base[1][0], result[1][0] * base[0][1] + result[1][1] * base[1][1]],
          ]
          result = newResult

          stepsArr.push(snapshot(null, bitPos, 'multiply', `Multiply result matrix by base. Result updated.`, { bit: 1, bitPos }, { resultMatrix: result, baseMatrix: base }))
        } else {
          stepsArr.push(snapshot(null, bitPos, 'skip', `Bit = 0: Skip multiplication.`, { bit: 0, bitPos }, { resultMatrix: result, baseMatrix: base }))
        }

        // Square base matrix
        const newBase = [
          [base[0][0] * base[0][0] + base[0][1] * base[1][0], base[0][0] * base[0][1] + base[0][1] * base[1][1]],
          [base[1][0] * base[0][0] + base[1][1] * base[1][0], base[1][0] * base[0][1] + base[1][1] * base[1][1]],
        ]
        base = newBase

        exp = Math.floor(exp / 2)
        bitPos++

        if (exp > 0) {
          stepsArr.push(snapshot(null, bitPos, 'square', `Square base matrix for next iteration.`, { bitPos }, { resultMatrix: result, baseMatrix: base }))
        }
      }

      const fibValue = result[0][1]
      stepsArr.push(snapshot(null, -1, 'complete', `✓ Fibonacci(${n}) = ${fibValue}. Result matrix[0][1] = F(n).`, { n, fib: fibValue }, { resultMatrix: result }))
    } else if (algoType === 'modular') {
      const a = modA
      const m = modM

      stepsArr.push(snapshot(null, -1, 'start', `Find modular inverse of ${a} mod ${m}. Find x such that (${a} × x) mod ${m} = 1.`, { a, m }))

      // Extended Euclidean Algorithm
      const steps_ext = []
      let r0 = m,
        r1 = a
      let x0 = 0,
        x1 = 1

      stepsArr.push(snapshot(null, -1, 'ext_gcd_start', `Use Extended Euclidean Algorithm. Initialize: r0=${r0}, r1=${r1}, x0=${x0}, x1=${x1}`, { r0, r1, x0, x1 }))

      let iter = 0
      while (r1 !== 0) {
        const q = Math.floor(r0 / r1)
        const r2 = r0 - q * r1
        const x2 = x0 - q * x1

        stepsArr.push(snapshot(null, iter, 'ext_gcd_step', `Iteration ${iter}: q=${q}, r2=${r2}, x2=${x2}`, { iter, q, r0, r1, r2, x0, x1, x2 }))

        r0 = r1
        r1 = r2
        x0 = x1
        x1 = x2
        iter++
      }

      stepsArr.push(snapshot(null, -1, 'ext_gcd_done', `Extended GCD complete. GCD(${a}, ${m}) = ${r0}, coefficient x = ${x0}`, { gcd: r0, x: x0 }))

      if (r0 !== 1) {
        stepsArr.push(snapshot(null, -1, 'no_inverse', `✗ No modular inverse exists! GCD(${a}, ${m}) ≠ 1.`, { gcd: r0 }))
      } else {
        let inv = ((x0 % m) + m) % m
        stepsArr.push(snapshot(null, -1, 'found', `✓ Modular inverse: ${a}^(-1) mod ${m} = ${inv}. Verify: (${a} × ${inv}) mod ${m} = ${(a * inv) % m}`, { a, m, inverse: inv, verify: (a * inv) % m }))
      }
    }

    return stepsArr
  }

  // --- CONTROL ---
  useEffect(() => {
    resetAndGenerate()
  }, [algorithm, sieveN, gcdA, gcdB, fastBase, fastExp, fibN, modA, modM])

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
    grid: null,
    activeIndex: -1,
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

  const renderVisualization = () => {
    if (algorithm === 'sieve') {
      const grid = currentVisual.grid
      if (!grid) return null

      return (
        <div className='flex flex-wrap gap-1 justify-center max-w-4xl'>
          {grid.map((isPrime, num) => {
            if (num === 0) return null // Skip 0

            const isActive = currentVisual.activeIndex === num
            let bgClass = isPrime ? 'bg-slate-800' : 'bg-slate-700/40'
            let borderClass = isPrime ? 'border-slate-600' : 'border-slate-700'
            let textClass = isPrime ? 'text-lime-300 font-bold' : 'text-slate-600 line-through'

            if (isActive && currentVisual.status === 'prime') {
              bgClass = 'bg-lime-500'
              borderClass = 'border-lime-300'
              textClass = 'text-black font-bold'
            } else if (isActive && currentVisual.status === 'marking') {
              bgClass = 'bg-red-500'
              borderClass = 'border-red-300'
              textClass = 'text-white line-through font-bold'
            }

            return (
              <div
                key={num}
                className={`w-10 h-10 flex items-center justify-center border-2 transition-all ${bgClass} ${borderClass} ${textClass} text-xs rounded`}>
                {num}
              </div>
            )
          })}
        </div>
      )
    }

    // For other algorithms, show text/formula based visualization
    return (
      <div className='flex items-center justify-center p-8 text-center'>
        <div className='max-w-2xl'>
          <div className='text-4xl font-mono text-lime-300 mb-4'>
            {algorithm === 'gcd' && currentVisual.variables.a && currentVisual.variables.b && `GCD(${gcdA}, ${gcdB})`}
            {algorithm === 'fastexp' && currentVisual.variables.base && `${currentVisual.variables.base}^${currentVisual.variables.exp || 13}`}
            {algorithm === 'fibmat' && currentVisual.variables.n && `Fibonacci(${currentVisual.variables.n})`}
            {algorithm === 'modular' && currentVisual.variables.a && `${currentVisual.variables.a}^(-1) mod ${currentVisual.variables.m}`}
          </div>

          {/* Matrix visualization for fibmat */}
          {algorithm === 'fibmat' && currentVisual.resultMatrix && (
            <div className='flex gap-4 justify-center mt-6'>
              <div>
                <div className='text-xs text-lime-500 mb-1'>Result Matrix:</div>
                <div className='bg-slate-800 border-2 border-lime-600 p-3 rounded'>
                  {currentVisual.resultMatrix.map((row, i) => (
                    <div
                      key={i}
                      className='flex gap-2'>
                      {row.map((val, j) => (
                        <div
                          key={j}
                          className='w-16 h-8 flex items-center justify-center bg-lime-900/30 border border-lime-700 text-lime-200 text-sm font-mono'>
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {currentVisual.baseMatrix && (
                <div>
                  <div className='text-xs text-lime-500 mb-1'>Base Matrix:</div>
                  <div className='bg-slate-800 border-2 border-lime-600 p-3 rounded'>
                    {currentVisual.baseMatrix.map((row, i) => (
                      <div
                        key={i}
                        className='flex gap-2'>
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className='w-16 h-8 flex items-center justify-center bg-lime-900/30 border border-lime-700 text-lime-200 text-sm font-mono'>
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
    )
  }

  const getStatusColor = () => {
    const status = currentVisual.status
    if (status === 'prime' || status === 'found') return 'text-lime-400'
    if (status === 'marking') return 'text-red-400'
    if (status === 'complete') return 'text-emerald-300'
    return 'text-slate-400'
  }

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-lime-600 rounded-lg shadow-lg shadow-lime-500/20'>
                <Calculator
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-yellow-300 pb-2 mb-1'>Mathematical Algorithms</h1>
                <p className='text-xs text-slate-400'>Number Theory & Computation</p>
              </div>
            </div>
            <div className='flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-lime-500 outline-none'>
                <option value='sieve'>Sieve of Eratosthenes</option>
                <option value='gcd'>GCD - Euclidean</option>
                <option value='fastexp'>Fast Exponentiation</option>
                <option value='fibmat'>Fibonacci Matrix</option>
                <option value='modular'>Modular Inverse</option>
              </select>

              {/* INPUTS */}
              {algorithm === 'sieve' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>N</span>
                    <span className='text-lime-300 font-mono'>{sieveN}</span>
                  </div>
                  <input
                    type='range'
                    min='10'
                    max='100'
                    step='10'
                    value={sieveN}
                    onChange={(e) => setSieveN(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                  />
                </div>
              )}

              {algorithm === 'gcd' && (
                <>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>A</span>
                      <span className='text-lime-300 font-mono'>{gcdA}</span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='100'
                      value={gcdA}
                      onChange={(e) => setGcdA(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>B</span>
                      <span className='text-lime-300 font-mono'>{gcdB}</span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='100'
                      value={gcdB}
                      onChange={(e) => setGcdB(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                </>
              )}

              {algorithm === 'fastexp' && (
                <>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>Base</span>
                      <span className='text-lime-300 font-mono'>{fastBase}</span>
                    </div>
                    <input
                      type='range'
                      min='2'
                      max='10'
                      value={fastBase}
                      onChange={(e) => setFastBase(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>Exp</span>
                      <span className='text-lime-300 font-mono'>{fastExp}</span>
                    </div>
                    <input
                      type='range'
                      min='0'
                      max='20'
                      value={fastExp}
                      onChange={(e) => setFastExp(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                </>
              )}

              {algorithm === 'fibmat' && (
                <div className='flex flex-col gap-1 min-w-[100px]'>
                  <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                    <span>N</span>
                    <span className='text-lime-300 font-mono'>{fibN}</span>
                  </div>
                  <input
                    type='range'
                    min='1'
                    max='20'
                    value={fibN}
                    onChange={(e) => setFibN(Number(e.target.value))}
                    className='w-24 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                  />
                </div>
              )}

              {algorithm === 'modular' && (
                <>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>A</span>
                      <span className='text-lime-300 font-mono'>{modA}</span>
                    </div>
                    <input
                      type='range'
                      min='1'
                      max='20'
                      value={modA}
                      onChange={(e) => setModA(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                  <div className='flex flex-col gap-1 min-w-[80px]'>
                    <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                      <span>M</span>
                      <span className='text-lime-300 font-mono'>{modM}</span>
                    </div>
                    <input
                      type='range'
                      min='2'
                      max='20'
                      value={modM}
                      onChange={(e) => setModM(Number(e.target.value))}
                      className='w-20 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
                    />
                  </div>
                </>
              )}

              <div className='flex flex-col gap-1 min-w-[100px]'>
                <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                  <span>Speed</span>
                  <span className='text-lime-300 font-mono'>{speed}</span>
                </div>
                <input
                  type='range'
                  min='1'
                  max='10'
                  step='1'
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className='w-24 h-2 bg-slate-700 rounded-lg accent-lime-500 cursor-pointer'
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
          <div className='bg-gradient-to-r from-lime-900/30 to-yellow-900/30 border border-lime-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-lime-600 rounded-lg shadow-lg shadow-lime-500/20 mt-1'>
                <Hash
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-lime-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kompleksitas:</span>
                    <span className='text-lime-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
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
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center text-lime-100 text-sm font-mono'>
                <div className='flex items-center gap-2'>
                  <Percent
                    size={16}
                    className='text-lime-400'
                  />
                  Mathematical Visualization
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>{currentVisual.status.toUpperCase().replace('_', ' ')}</div>
              </div>
              <div className='relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[300px]'>{renderVisualization()}</div>
            </div>

            {/* PLAYER CONTROLS */}
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
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500' : 'bg-lime-600'} text-white`}>
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
                    className='bg-lime-500 h-full transition-all duration-100'
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
                    className='text-lime-400'
                  />{' '}
                  Variables
                </div>
                <div className='p-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/50'>
                  {Object.entries(currentVisual.variables).map(([key, val]) => (
                    <div
                      key={key}
                      className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
                      <span className='text-[10px] text-lime-300 font-mono font-bold uppercase'>{key}</span>
                      <span className='text-sm text-white font-bold'>{typeof val === 'object' ? JSON.stringify(val) : val}</span>
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
                  className='text-lime-400'
                />{' '}
                Algorithm
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-lime-900/20 text-lime-100 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-lime-400'
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

export default MathematicalAlgorithm
