import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Calculator, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Hash } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  euclideanGCD: `FUNCTION GCD(a: Integer, b: Integer)
  WHILE b != 0 DO
    remainder <- a mod b
    a <- b
    b <- remainder
  END WHILE
  
  RETURN a
END FUNCTION

// Recursive version
FUNCTION GCD_Recursive(a: Integer, b: Integer)
  IF b == 0 THEN
    RETURN a
  ELSE
    RETURN GCD_Recursive(b, a mod b)
  END IF
END FUNCTION`,

  extendedEuclidean: `FUNCTION ExtendedGCD(a: Integer, b: Integer)
  IF b == 0 THEN
    RETURN (a, 1, 0)
  END IF
  
  (gcd, x1, y1) <- ExtendedGCD(b, a mod b)
  
  x <- y1
  y <- x1 - (a / b) * y1
  
  RETURN (gcd, x, y)
END FUNCTION

// ax + by = gcd(a,b)`,

  sieveOfEratosthenes: `FUNCTION SieveOfEratosthenes(n: Integer)
  DECLARE isPrime: Array[n+1] of Boolean
  
  FOR i FROM 2 TO n DO
    isPrime[i] <- TRUE
  END FOR
  
  FOR i FROM 2 TO √n DO
    IF isPrime[i] == TRUE THEN
      // Mark multiples as not prime
      FOR j FROM i*i TO n STEP i DO
        isPrime[j] <- FALSE
      END FOR
    END IF
  END FOR
  
  // Collect all primes
  primes <- []
  FOR i FROM 2 TO n DO
    IF isPrime[i] == TRUE THEN
      primes.append(i)
    END IF
  END FOR
  
  RETURN primes
END FUNCTION`,

  modularExponentiation: `FUNCTION ModPow(base: Integer, exp: Integer, mod: Integer)
  result <- 1
  base <- base mod mod
  
  WHILE exp > 0 DO
    IF exp mod 2 == 1 THEN
      result <- (result * base) mod mod
    END IF
    
    exp <- exp / 2
    base <- (base * base) mod mod
  END WHILE
  
  RETURN result
END FUNCTION

// Binary exponentiation approach`,

  chineseRemainderTheorem: `FUNCTION ChineseRemainder(remainders: Array, moduli: Array, k: Integer)
  M <- Product of all moduli
  x <- 0
  
  FOR i FROM 0 TO k-1 DO
    Mi <- M / moduli[i]
    yi <- ModInverse(Mi, moduli[i])
    x <- x + remainders[i] * Mi * yi
  END FOR
  
  RETURN x mod M
END FUNCTION

FUNCTION ModInverse(a: Integer, m: Integer)
  (gcd, x, y) <- ExtendedGCD(a, m)
  IF gcd != 1 THEN
    RETURN "No inverse exists"
  END IF
  RETURN (x mod m + m) mod m
END FUNCTION`,

  eulerTotient: `FUNCTION EulerTotient(n: Integer)
  result <- n
  
  // Check for factor 2
  IF n mod 2 == 0 THEN
    result <- result - result / 2
    WHILE n mod 2 == 0 DO
      n <- n / 2
    END WHILE
  END IF
  
  // Check odd factors
  FOR i FROM 3 TO √n STEP 2 DO
    IF n mod i == 0 THEN
      result <- result - result / i
      WHILE n mod i == 0 DO
        n <- n / i
      END WHILE
    END IF
  END FOR
  
  IF n > 1 THEN
    result <- result - result / n
  END IF
  
  RETURN result
END FUNCTION`,

  millerRabin: `FUNCTION IsPrime_MillerRabin(n: Integer, k: Integer)
  IF n <= 1 THEN RETURN FALSE
  IF n <= 3 THEN RETURN TRUE
  IF n mod 2 == 0 THEN RETURN FALSE
  
  // Write n-1 as 2^r * d
  d <- n - 1
  r <- 0
  WHILE d mod 2 == 0 DO
    d <- d / 2
    r <- r + 1
  END WHILE
  
  // Witness loop (k iterations)
  FOR i FROM 1 TO k DO
    a <- Random(2, n-2)
    x <- ModPow(a, d, n)
    
    IF x == 1 OR x == n-1 THEN
      CONTINUE
    END IF
    
    FOR j FROM 1 TO r-1 DO
      x <- (x * x) mod n
      IF x == n-1 THEN
        CONTINUE outer loop
      END IF
    END FOR
    
    RETURN FALSE  // Composite
  END FOR
  
  RETURN TRUE  // Probably prime
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  euclideanGCD: `int gcd(int a, int b) {
  while (b != 0) {
    int remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

// Recursive version
int gcdRecursive(int a, int b) {
  if (b == 0)
    return a;
  return gcdRecursive(b, a % b);
}`,

  extendedEuclidean: `struct ExtGCDResult {
  int gcd, x, y;
};

ExtGCDResult extendedGCD(int a, int b) {
  if (b == 0) {
    return {a, 1, 0};
  }
  
  ExtGCDResult result = extendedGCD(b, a % b);
  
  int x = result.y;
  int y = result.x - (a / b) * result.y;
  
  return {result.gcd, x, y};
}

// Usage: ax + by = gcd(a,b)`,

  sieveOfEratosthenes: `vector<int> sieveOfEratosthenes(int n) {
  vector<bool> isPrime(n + 1, true);
  isPrime[0] = isPrime[1] = false;
  
  for (int i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (int j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }
  
  vector<int> primes;
  for (int i = 2; i <= n; i++) {
    if (isPrime[i])
      primes.push_back(i);
  }
  
  return primes;
}`,

  modularExponentiation: `long long modPow(long long base, long long exp, long long mod) {
  long long result = 1;
  base %= mod;
  
  while (exp > 0) {
    if (exp % 2 == 1) {
      result = (result * base) % mod;
    }
    exp /= 2;
    base = (base * base) % mod;
  }
  
  return result;
}`,

  chineseRemainderTheorem: `long long modInverse(long long a, long long m) {
  auto [gcd, x, y] = extendedGCD(a, m);
  if (gcd != 1)
    return -1;
  return (x % m + m) % m;
}

long long chineseRemainder(vector<int>& remainders, vector<int>& moduli) {
  long long M = 1;
  for (int m : moduli)
    M *= m;
  
  long long x = 0;
  for (int i = 0; i < remainders.size(); i++) {
    long long Mi = M / moduli[i];
    long long yi = modInverse(Mi, moduli[i]);
    x += remainders[i] * Mi * yi;
  }
  
  return x % M;
}`,

  eulerTotient: `int eulerTotient(int n) {
  int result = n;
  
  // Check for factor 2
  if (n % 2 == 0) {
    result -= result / 2;
    while (n % 2 == 0)
      n /= 2;
  }
  
  // Check odd factors
  for (int i = 3; i * i <= n; i += 2) {
    if (n % i == 0) {
      result -= result / i;
      while (n % i == 0)
        n /= i;
    }
  }
  
  if (n > 1)
    result -= result / n;
  
  return result;
}`,

  millerRabin: `long long modMul(long long a, long long b, long long m) {
  return (__int128)a * b % m;
}

long long modPow(long long base, long long exp, long long mod) {
  long long result = 1;
  while (exp > 0) {
    if (exp & 1)
      result = modMul(result, base, mod);
    base = modMul(base, base, mod);
    exp >>= 1;
  }
  return result;
}

bool millerRabin(long long n, int k = 5) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 == 0) return false;
  
  long long d = n - 1;
  int r = 0;
  while (d % 2 == 0) {
    d /= 2;
    r++;
  }
  
  for (int i = 0; i < k; i++) {
    long long a = 2 + rand() % (n - 3);
    long long x = modPow(a, d, n);
    
    if (x == 1 || x == n - 1)
      continue;
    
    bool composite = true;
    for (int j = 0; j < r - 1; j++) {
      x = modMul(x, x, n);
      if (x == n - 1) {
        composite = false;
        break;
      }
    }
    
    if (composite)
      return false;
  }
  
  return true;
}`,
}

const ALGO_INFO = {
  euclideanGCD: {
    title: 'EUCLIDEAN ALGORITHM (GCD)',
    description: 'Mencari Greatest Common Divisor (GCD) dengan prinsip gcd(a,b) = gcd(b, a mod b).',
    complexity: 'O(log min(a,b))',
    useCase: 'Penyederhanaan pecahan, kriptografi RSA, modular arithmetic',
  },
  extendedEuclidean: {
    title: 'EXTENDED EUCLIDEAN ALGORITHM',
    description: 'Menemukan integer x,y sehingga ax + by = gcd(a,b). Menyelesaikan persamaan Diophantine.',
    complexity: 'O(log min(a,b))',
    useCase: 'Mencari invers modular, kriptografi, linear congruence',
  },
  sieveOfEratosthenes: {
    title: 'SIEVE OF ERATOSTHENES',
    description: 'Menemukan semua bilangan prima hingga n dengan menandai kelipatan bilangan prima.',
    complexity: 'O(n log log n)',
    useCase: 'Generating primes, prime factorization, number theory problems',
  },
  modularExponentiation: {
    title: 'MODULAR EXPONENTIATION (FAST POWER)',
    description: 'Menghitung (a^b) mod m secara efisien menggunakan binary exponentiation.',
    complexity: 'O(log b)',
    useCase: 'Kriptografi, primality testing, hashing',
  },
  chineseRemainderTheorem: {
    title: 'CHINESE REMAINDER THEOREM (CRT)',
    description: 'Menyelesaikan sistem kongruensi x ≡ a_i (mod m_i) dengan modulus koprima.',
    complexity: 'O(k log M) (k = jumlah persamaan)',
    useCase: 'Kriptografi RSA, calendar calculations, error correction',
  },
  eulerTotient: {
    title: "EULER'S TOTIENT FUNCTION",
    description: 'Menghitung φ(n): jumlah bilangan ≤ n yang koprima dengan n.',
    complexity: 'O(√n) naive, O(log n) dengan faktorisasi prima',
    useCase: 'RSA encryption, primitive roots, modulo arithmetic',
  },
  millerRabin: {
    title: 'MILLER-RABIN PRIMALITY TEST',
    description: 'Probabilistic test untuk menentukan apakah bilangan prima (dengan probabilitas tinggi).',
    complexity: 'O(k log³ n) (k = jumlah iterasi)',
    useCase: 'Kriptografi, primality testing untuk bilangan besar',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const SieveGrid = ({ numbers, currentPrime = null, marked = [] }) => {
  if (!numbers || numbers.length === 0) return null

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Hash size={14} /> Sieve Grid
        </h3>
        <div className='flex gap-2'>
          {['PRIME', 'MARKED', 'CHECKING'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'PRIME' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : label === 'MARKED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-10 gap-1'>
        {numbers.map((num, idx) => {
          const isPrime = num.isPrime
          const isMarked = marked.includes(idx)
          const isCurrent = idx === currentPrime

          let bgColor = 'bg-slate-800'
          let textColor = 'text-slate-400'
          let borderColor = 'border-slate-700'

          if (isCurrent) {
            bgColor = 'bg-yellow-500/30'
            textColor = 'text-yellow-200'
            borderColor = 'border-yellow-400 border-2'
          } else if (isMarked) {
            bgColor = 'bg-red-900/30'
            textColor = 'text-red-400 line-through'
            borderColor = 'border-red-700'
          } else if (isPrime) {
            bgColor = 'bg-emerald-900/30'
            textColor = 'text-emerald-300'
            borderColor = 'border-emerald-500'
          }

          return (
            <div
              key={idx}
              className={`${bgColor} border ${borderColor} ${textColor} rounded p-2 text-center text-sm font-mono font-bold transition-all duration-200`}>
              {num.value}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MathVisualization = ({ steps, title = 'Math Steps' }) => {
  if (!steps || steps.length === 0) return null

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Hash size={14} /> {title}
        </h3>
        <div className='flex gap-2'>
          {['CURRENT', 'RESULT', 'OPERATION'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'CURRENT' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : label === 'RESULT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='space-y-2 overflow-auto max-h-[400px]'>
        {steps.map((step, idx) => {
          const isCurrent = step.current
          const isResult = step.isResult

          let bgColor = 'bg-slate-800'
          let borderColor = 'border-slate-700'
          let textColor = 'text-slate-300'

          if (isCurrent) {
            bgColor = 'bg-yellow-500/20'
            borderColor = 'border-yellow-400 border-2'
            textColor = 'text-yellow-200'
          } else if (isResult) {
            bgColor = 'bg-emerald-500/20'
            borderColor = 'border-emerald-500'
            textColor = 'text-emerald-300'
          }

          return (
            <div
              key={idx}
              className={`${bgColor} border ${borderColor} rounded-lg p-3 transition-all duration-300`}>
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <div className={`text-sm font-mono ${textColor} font-bold`}>{step.expression}</div>
                  {step.note && <div className='text-xs text-slate-400 mt-1'>{step.note}</div>}
                </div>
                {step.value !== undefined && <div className={`text-lg font-bold ${textColor} ml-4`}>{step.value}</div>}
              </div>
            </div>
          )
        })}
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
      const types = ['vector', 'string', 'map', 'set', 'queue', 'stack', 'pair', 'array']

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

const MathAlgo = () => {
  const [algorithm, setAlgorithm] = useState('euclideanGCD')
  const [n, setN] = useState(48)
  const [m, setM] = useState(18)
  const [crtRemainders, setCrtRemainders] = useState('2,3,2')
  const [crtModuli, setCrtModuli] = useState('3,5,7')
  const [stepsList, setStepsList] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const snapshot = (steps, line, desc, gridData = null) => ({
    steps: JSON.parse(JSON.stringify(steps)),
    activeLine: line,
    description: desc,
    gridData: gridData ? JSON.parse(JSON.stringify(gridData)) : null,
  })

  const generateSteps = (algo, num1, num2) => {
    let s = []

    if (algo === 'euclideanGCD') {
      let a = num1
      let b = num2
      const steps = []

      steps.push({ expression: `gcd(${a}, ${b})`, note: 'Initial values', current: true })
      s.push(snapshot(steps, 1, `Mulai GCD(${a}, ${b})`))

      while (b !== 0) {
        steps[steps.length - 1].current = false

        const remainder = a % b
        steps.push({ expression: `${a} mod ${b} = ${remainder}`, note: `a=${a}, b=${b}`, current: true })
        s.push(snapshot(steps, 3, `Hitung ${a} mod ${b} = ${remainder}`))

        a = b
        b = remainder
      }

      steps[steps.length - 1].current = false
      steps.push({ expression: `GCD = ${a}`, value: a, isResult: true, current: true })
      s.push(snapshot(steps, 7, `Hasil: GCD = ${a}`))
    } else if (algo === 'sieveOfEratosthenes') {
      const limit = Math.min(num1, 100)
      const isPrime = Array(limit + 1).fill(true)
      isPrime[0] = isPrime[1] = false
      const steps = []

      // Initialize grid data
      let gridData = Array.from({ length: limit + 1 }, (_, i) => ({ value: i, isPrime: i >= 2 }))
      const marked = []

      steps.push({ expression: `Sieve of Eratosthenes untuk n=${limit}`, note: 'Initialize all as prime', current: true })
      s.push(snapshot(steps, 2, `Mulai Sieve sampai ${limit}`, { numbers: gridData, currentPrime: null, marked: [0, 1] }))

      for (let i = 2; i * i <= limit; i++) {
        if (isPrime[i]) {
          steps[steps.length - 1].current = false
          steps.push({ expression: `Prime: ${i}`, note: `Mark multiples of ${i}`, current: true })
          s.push(snapshot(steps, 6, `${i} adalah prima, mark kelipatannya`, { numbers: gridData, currentPrime: i, marked: [...marked] }))

          for (let j = i * i; j <= limit; j += i) {
            isPrime[j] = false
            gridData[j].isPrime = false
            marked.push(j)
          }

          s.push(snapshot(steps, 8, `Marked multiples of ${i}`, { numbers: gridData, currentPrime: i, marked: [...marked] }))
        }
      }

      const primes = []
      for (let i = 2; i <= limit; i++) {
        if (isPrime[i]) primes.push(i)
      }

      steps[steps.length - 1].current = false
      steps.push({ expression: `Primes: [${primes.join(', ')}]`, value: primes.length, isResult: true, current: true })
      s.push(snapshot(steps, 19, `Found ${primes.length} primes`, { numbers: gridData, currentPrime: null, marked }))
    } else if (algo === 'modularExponentiation') {
      let base = num1
      let exp = num2
      const mod = 1000000007
      let result = 1
      const steps = []

      steps.push({ expression: `(${base}^${exp}) mod ${mod}`, note: 'Binary exponentiation', current: true })
      s.push(snapshot(steps, 1, `Mulai ModPow: ${base}^${exp} mod ${mod}`))

      base = base % mod
      steps[steps.length - 1].current = false
      steps.push({ expression: `base = ${base} mod ${mod}`, value: base, current: true })
      s.push(snapshot(steps, 2, `Normalize base: ${base}`))

      while (exp > 0) {
        steps[steps.length - 1].current = false

        if (exp % 2 === 1) {
          result = (result * base) % mod
          steps.push({ expression: `result = (${result / (base % mod || 1)} * ${base}) mod ${mod} = ${result}`, note: 'exp is odd', current: true })
          s.push(snapshot(steps, 7, `Multiply result (exp odd)`))
        }

        exp = Math.floor(exp / 2)
        const oldBase = base
        base = (base * base) % mod

        steps[steps.length - 1].current = false
        steps.push({ expression: `exp = ${exp}, base = (${oldBase}²) mod ${mod} = ${base}`, current: true })
        s.push(snapshot(steps, 10, `Square base, halve exp`))

        if (exp === 0) break
      }

      steps[steps.length - 1].current = false
      steps.push({ expression: `Result = ${result}`, value: result, isResult: true, current: true })
      s.push(snapshot(steps, 13, `Final result: ${result}`))
    } else if (algo === 'eulerTotient') {
      let phi = num1
      let temp = num1
      const steps = []

      steps.push({ expression: `φ(${num1})`, note: "Euler's Totient Function", current: true })
      s.push(snapshot(steps, 1, `Hitung φ(${num1})`))

      // Factor 2
      if (temp % 2 === 0) {
        phi -= phi / 2
        steps[steps.length - 1].current = false
        steps.push({ expression: `Factor 2: φ = ${num1} - ${num1 / 2} = ${phi}`, current: true })
        s.push(snapshot(steps, 6, `Remove factor 2`))

        while (temp % 2 === 0) temp /= 2
      }

      // Odd factors
      for (let i = 3; i * i <= temp; i += 2) {
        if (temp % i === 0) {
          phi -= phi / i
          steps[steps.length - 1].current = false
          steps.push({ expression: `Factor ${i}: φ = ${phi + phi / i} - ${phi / i} = ${phi}`, current: true })
          s.push(snapshot(steps, 14, `Remove factor ${i}`))

          while (temp % i === 0) temp /= i
        }
      }

      if (temp > 1) {
        phi -= phi / temp
        steps[steps.length - 1].current = false
        steps.push({ expression: `Factor ${temp}: φ = ${phi}`, current: true })
        s.push(snapshot(steps, 21, `Remove last factor ${temp}`))
      }

      steps[steps.length - 1].current = false
      steps.push({ expression: `φ(${num1}) = ${phi}`, value: phi, isResult: true, current: true })
      s.push(snapshot(steps, 23, `Result: ${phi} numbers coprime to ${num1}`))
    } else if (algo === 'extendedEuclidean') {
      // Extended Euclidean Algorithm
      const steps = []
      let a = num1
      let b = num2

      steps.push({ expression: `Extended GCD(${a}, ${b})`, note: 'Find gcd, x, y such that ax + by = gcd', current: true })
      s.push(snapshot(steps, 5, `Mulai Extended Euclidean untuk ${a}, ${b}`))

      const extgcd = (a, b, depth = 0) => {
        if (b === 0) {
          steps[steps.length - 1].current = false
          steps.push({ expression: `Base case: gcd=${a}, x=1, y=0`, note: `Depth ${depth}`, current: true })
          s.push(snapshot(steps, 7, `Base case reached`))
          return { gcd: a, x: 1, y: 0 }
        }

        steps[steps.length - 1].current = false
        steps.push({ expression: `Recurse: ExtGCD(${b}, ${a % b})`, note: `Depth ${depth}`, current: true })
        s.push(snapshot(steps, 10, `Recursion: ${a} mod ${b} = ${a % b}`))

        const result = extgcd(b, a % b, depth + 1)

        const x = result.y
        const y = result.x - Math.floor(a / b) * result.y

        steps[steps.length - 1].current = false
        steps.push({ expression: `x=${x}, y=${y}`, note: `Back from depth ${depth}`, current: true })
        s.push(snapshot(steps, 13, `Compute x=${x}, y=${y}`))

        return { gcd: result.gcd, x, y }
      }

      const result = extgcd(a, b, 0)

      steps[steps.length - 1].current = false
      steps.push({ expression: `GCD=${result.gcd}, x=${result.x}, y=${result.y}`, note: `${a}*${result.x} + ${b}*${result.y} = ${result.gcd}`, isResult: true, current: true })
      s.push(snapshot(steps, 15, `Result: ${a}*(${result.x}) + ${b}*(${result.y}) = ${result.gcd}`))
    } else if (algo === 'millerRabin') {
      const steps = []
      const num = num1

      steps.push({ expression: `Miller-Rabin Test untuk n=${num}`, note: 'Probabilistic primality test', current: true })
      s.push(snapshot(steps, 16, `Test primality of ${num}`))

      if (num <= 1) {
        steps[steps.length - 1].current = false
        steps.push({ expression: `${num} ≤ 1: COMPOSITE`, isResult: true, current: true })
        s.push(snapshot(steps, 17, `${num} is not prime`))
      } else if (num <= 3) {
        steps[steps.length - 1].current = false
        steps.push({ expression: `${num} ≤ 3: PRIME`, isResult: true, current: true })
        s.push(snapshot(steps, 18, `${num} is prime`))
      } else if (num % 2 === 0) {
        steps[steps.length - 1].current = false
        steps.push({ expression: `${num} is even: COMPOSITE`, isResult: true, current: true })
        s.push(snapshot(steps, 19, `${num} is divisible by 2`))
      } else {
        let d = num - 1
        let r = 0
        while (d % 2 === 0) {
          d /= 2
          r++
        }

        steps[steps.length - 1].current = false
        steps.push({ expression: `${num - 1} = 2^${r} * ${d}`, note: `r=${r}, d=${d}`, current: true })
        s.push(snapshot(steps, 23, `Write n-1 as 2^r * d`))

        // Just show one iteration for visualization
        const a = 2 + Math.floor(Math.random() * (num - 4))
        steps[steps.length - 1].current = false
        steps.push({ expression: `Test with witness a=${a}`, note: 'Random witness', current: true })
        s.push(snapshot(steps, 29, `Choose random witness ${a}`))

        steps[steps.length - 1].current = false
        steps.push({ expression: `Compute x = ${a}^${d} mod ${num}`, note: 'ModPow computation', current: true })
        s.push(snapshot(steps, 30, `Perform modular exponentiation`))

        steps[steps.length - 1].current = false
        steps.push({ expression: `Probably PRIME`, note: `With high probability`, isResult: true, current: true })
        s.push(snapshot(steps, 48, `${num} passes Miller-Rabin test`))
      }
    } else if (algo === 'chineseRemainderTheorem') {
      // Chinese Remainder Theorem - Use dynamic data
      const remainders =
        num1 instanceof Array
          ? num1
          : num1
              .toString()
              .split(',')
              .map((x) => parseInt(x.trim()))
      const moduli =
        num2 instanceof Array
          ? num2
          : num2
              .toString()
              .split(',')
              .map((x) => parseInt(x.trim()))
      const k = Math.min(remainders.length, moduli.length)
      const steps = []

      steps.push({ expression: `Chinese Remainder Theorem`, note: `Solve ${k} congruence equations`, current: true })
      s.push(snapshot(steps, 8, `CRT: Sistem ${k} kongruensi`))

      // Display equations
      let equations = remainders.map((r, i) => `x ≡ ${r} (mod ${moduli[i]})`).join(', ')
      steps[steps.length - 1].current = false
      steps.push({ expression: equations, note: 'System of congruences', current: true })
      s.push(snapshot(steps, 14, `Persamaan: ${equations}`))

      // Calculate M (product of all moduli)
      let M = 1
      for (let i = 0; i < k; i++) {
        M *= moduli[i]
      }

      steps[steps.length - 1].current = false
      steps.push({ expression: `M = ${moduli.join(' × ')} = ${M}`, note: 'Product of all moduli', current: true })
      s.push(snapshot(steps, 11, `Hitung M = ${M}`))

      // For each equation, calculate Mi, yi, and partial sum
      let x = 0
      for (let i = 0; i < k; i++) {
        const Mi = M / moduli[i]
        steps[steps.length - 1].current = false
        steps.push({ expression: `M${i} = M / ${moduli[i]} = ${Mi}`, note: `For equation ${i + 1}`, current: true })
        s.push(snapshot(steps, 15, `M${i} = ${Mi}`))

        // Simple modular inverse using Extended Euclidean (simplified for visualization)
        const modInverse = (a, m) => {
          for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x
          }
          return 1
        }

        const yi = modInverse(Mi, moduli[i])
        steps[steps.length - 1].current = false
        steps.push({ expression: `y${i} = ModInverse(${Mi}, ${moduli[i]}) = ${yi}`, note: `${Mi}*${yi} ≡ 1 (mod ${moduli[i]})`, current: true })
        s.push(snapshot(steps, 16, `Cari modular inverse y${i} = ${yi}`))

        const contribution = remainders[i] * Mi * yi
        x += contribution

        steps[steps.length - 1].current = false
        steps.push({ expression: `Add: ${remainders[i]} × ${Mi} × ${yi} = ${contribution}`, note: `Contribution from equation ${i + 1}`, current: true })
        s.push(snapshot(steps, 17, `Tambahkan kontribusi: ${contribution}`))
      }

      // Final result
      x = x % M
      steps[steps.length - 1].current = false
      steps.push({ expression: `x ≡ ${x} (mod ${M})`, value: x, isResult: true, current: true })
      s.push(snapshot(steps, 20, `Hasil akhir: x = ${x}`))

      // Verification
      steps[steps.length - 1].current = false
      const verifications = remainders.map((r, i) => `${x} mod ${moduli[i]} = ${x % moduli[i]} ≡ ${r}`).join(', ')
      steps.push({ expression: `Verify: ${verifications}`, note: '✓ All equations satisfied', current: true })
      s.push(snapshot(steps, 20, `Verifikasi semua persamaan`))
    } else {
      const steps = [{ expression: `${ALGO_INFO[algo].title}`, note: 'Visualisasi dalam pengembangan', current: true }]
      s.push(snapshot(steps, 1, 'Algorithm visualization coming soon'))
    }

    return s
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    let param1 = n
    let param2 = m

    // Parse CRT parameters if needed
    if (algorithm === 'chineseRemainderTheorem') {
      param1 = crtRemainders
        .split(',')
        .map((x) => parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      param2 = crtModuli
        .split(',')
        .map((x) => parseInt(x.trim()))
        .filter((x) => !isNaN(x))
    }

    const generated = generateSteps(algorithm, param1, param2)
    setStepsList(generated)
  }

  useEffect(() => {
    reset()
  }, [algorithm, n, m, crtRemainders, crtModuli])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < stepsList.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 800)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, stepsList])

  const currentVisual = stepsList[currentStep] || {
    steps: [],
    activeLine: 0,
    description: 'Loading...',
    gridData: null,
  }

  const percentage = Math.floor((currentStep / (stepsList.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Calculator
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOMATH<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Mathematical Algorithm</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='euclideanGCD'>Euclidean GCD</option>
              <option value='extendedEuclidean'>Extended Euclidean</option>
              <option value='sieveOfEratosthenes'>Sieve of Eratosthenes</option>
              <option value='modularExponentiation'>Modular Exponentiation</option>
              <option value='chineseRemainderTheorem'>Chinese Remainder</option>
              <option value='eulerTotient'>Euler Totient</option>
              <option value='millerRabin'>Miller-Rabin</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>

          {['euclideanGCD', 'modularExponentiation', 'extendedEuclidean'].includes(algorithm) && (
            <>
              <label className='text-xs text-slate-400 font-bold'>A</label>
              <input
                type='number'
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                className='w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
              />
              <label className='text-xs text-slate-400 font-bold'>B</label>
              <input
                type='number'
                value={m}
                onChange={(e) => setM(parseInt(e.target.value) || 0)}
                className='w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
              />
            </>
          )}

          {['sieveOfEratosthenes', 'eulerTotient', 'millerRabin'].includes(algorithm) && (
            <>
              <label className='text-xs text-slate-400 font-bold'>N</label>
              <input
                type='number'
                value={n}
                onChange={(e) => setN(parseInt(e.target.value) || 0)}
                className='w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
                min='2'
                max={algorithm === 'sieveOfEratosthenes' ? '100' : '10000'}
              />
            </>
          )}

          {algorithm === 'chineseRemainderTheorem' && (
            <>
              <label className='text-xs text-slate-400 font-bold'>Remainders</label>
              <input
                type='text'
                value={crtRemainders}
                onChange={(e) => setCrtRemainders(e.target.value)}
                placeholder='2,3,2'
                className='w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
              />
              <label className='text-xs text-slate-400 font-bold'>Moduli</label>
              <input
                type='text'
                value={crtModuli}
                onChange={(e) => setCrtModuli(e.target.value)}
                placeholder='3,5,7'
                className='w-24 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
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
              <Calculator
                size={12}
                className='text-blue-400'
              />
              Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
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
          {algorithm === 'sieveOfEratosthenes' && currentVisual.gridData ? (
            <SieveGrid
              numbers={currentVisual.gridData.numbers}
              currentPrime={currentVisual.gridData.currentPrime}
              marked={currentVisual.gridData.marked}
            />
          ) : (
            <MathVisualization
              steps={currentVisual.steps}
              title={ALGO_INFO[algorithm].title}
            />
          )}

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
                onClick={() => setCurrentStep(Math.min(stepsList.length - 1, currentStep + 1))}
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

export default MathAlgo
