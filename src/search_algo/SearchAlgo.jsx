import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Search, Code, Hash, Variable, Layers, MessageSquare, SkipForward, StepBack, StepForward, Activity, Target } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  linear: `FUNCTION LinearSearch(arr: List of Integer, n: Integer, target: Integer)
  DECLARE i: Integer
  
  FOR i FROM 0 TO n-1 DO
    IF arr[i] = target THEN
      RETURN i
    END IF
  END FOR
  
  RETURN -1  // Not found
END FUNCTION`,

  binary: `FUNCTION BinarySearch(arr: List of Integer, n: Integer, target: Integer)
  DECLARE left, right, mid: Integer
  
  left <- 0
  right <- n - 1
  
  WHILE left <= right DO
    mid <- (left + right) / 2
    
    IF arr[mid] = target THEN
      RETURN mid
    ELSE IF arr[mid] < target THEN
      left <- mid + 1
    ELSE
      right <- mid - 1
    END IF
  END WHILE
  
  RETURN -1  // Not found
END FUNCTION`,

  jump: `FUNCTION JumpSearch(arr: List of Integer, n: Integer, target: Integer)
  DECLARE step, prev, i: Integer
  
  step <- sqrt(n)
  prev <- 0
  
  WHILE arr[min(step, n) - 1] < target DO
    prev <- step
    step <- step + sqrt(n)
    IF prev >= n THEN
      RETURN -1
    END IF
  END WHILE
  
  FOR i FROM prev TO min(step, n) DO
    IF arr[i] = target THEN
      RETURN i
    END IF
  END FOR
  
  RETURN -1  // Not found
END FUNCTION`,

  interpolation: `FUNCTION InterpolationSearch(arr: List of Integer, n: Integer, target: Integer)
  DECLARE low, high, pos: Integer
  
  low <- 0
  high <- n - 1
  
  WHILE low <= high AND target >= arr[low] AND target <= arr[high] DO
    IF low = high THEN
      IF arr[low] = target THEN RETURN low
      RETURN -1
    END IF
    
    pos <- low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low])
    
    IF arr[pos] = target THEN
      RETURN pos
    ELSE IF arr[pos] < target THEN
      low <- pos + 1
    ELSE
      high <- pos - 1
    END IF
  END WHILE
  
  RETURN -1  // Not found
END FUNCTION`,

  exponential: `FUNCTION ExponentialSearch(arr: List of Integer, n: Integer, target: Integer)
  DECLARE i, bound: Integer
  
  IF arr[0] = target THEN
    RETURN 0
  END IF
  
  i <- 1
  WHILE i < n AND arr[i] <= target DO
    i <- i * 2
  END WHILE
  
  // Binary search in range [i/2, min(i, n-1)]
  bound <- min(i, n - 1)
  RETURN BinarySearch(arr, i/2, bound, target)
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  linear: `int linearSearch(vector<int>& arr, int target) {
  int n = arr.size();
  
  for (int i = 0; i < n; i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  
  return -1; // Not found
}`,

  binary: `int binarySearch(vector<int>& arr, int target) {
  int left = 0;
  int right = arr.size() - 1;
  
  while (left <= right) {
    int mid = left + (right - left) / 2;
    
    if (arr[mid] == target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}`,

  jump: `int jumpSearch(vector<int>& arr, int target) {
  int n = arr.size();
  int step = sqrt(n);
  int prev = 0;
  
  while (arr[min(step, n) - 1] < target) {
    prev = step;
    step += sqrt(n);
    if (prev >= n) {
      return -1;
    }
  }
  
  for (int i = prev; i < min(step, n); i++) {
    if (arr[i] == target) {
      return i;
    }
  }
  
  return -1; // Not found
}`,

  interpolation: `int interpolationSearch(vector<int>& arr, int target) {
  int low = 0;
  int high = arr.size() - 1;
  
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    if (low == high) {
      if (arr[low] == target) return low;
      return -1;
    }
    
    int pos = low + ((target - arr[low]) * (high - low)) / (arr[high] - arr[low]);
    
    if (arr[pos] == target) {
      return pos;
    } else if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }
  
  return -1; // Not found
}`,

  exponential: `int binarySearchHelper(vector<int>& arr, int left, int right, int target) {
  while (left <= right) {
    int mid = left + (right - left) / 2;
    if (arr[mid] == target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

int exponentialSearch(vector<int>& arr, int target) {
  int n = arr.size();
  
  if (arr[0] == target) {
    return 0;
  }
  
  int i = 1;
  while (i < n && arr[i] <= target) {
    i *= 2;
  }
  
  return binarySearchHelper(arr, i/2, min(i, n-1), target);
}`,
}

const ALGO_INFO = {
  linear: {
    title: 'LINEAR SEARCH',
    description: 'Algoritma pencarian paling sederhana yang memeriksa setiap elemen dalam array secara berurutan dari awal hingga akhir sampai menemukan elemen yang dicari atau mencapai akhir array.',
    complexity: 'O(n)',
    useCase: 'Array tidak terurut, data kecil',
  },
  binary: {
    title: 'BINARY SEARCH',
    description: 'Algoritma pencarian efisien yang bekerja pada array terurut dengan membagi area pencarian menjadi dua bagian pada setiap iterasi, menghilangkan setengah dari elemen yang tersisa.',
    complexity: 'O(log n)',
    useCase: 'Array terurut, pencarian cepat',
  },
  jump: {
    title: 'JUMP SEARCH',
    description: 'Algoritma pencarian yang melompati sejumlah elemen tetap (√n) alih-alih mencari setiap elemen. Setelah menemukan blok yang tepat, dilakukan pencarian linear di dalam blok tersebut.',
    complexity: 'O(√n)',
    useCase: 'Array terurut, alternatif binary search',
  },
  interpolation: {
    title: 'INTERPOLATION SEARCH',
    description: 'Peningkatan dari binary search untuk data yang didistribusikan secara seragam. Menghitung posisi yang mungkin dari elemen yang dicari menggunakan interpolasi.',
    complexity: 'O(log log n)',
    useCase: 'Data terurut merata, pencarian optimal',
  },
  exponential: {
    title: 'EXPONENTIAL SEARCH',
    description: 'Algoritma pencarian yang menemukan rentang di mana elemen mungkin ada dengan menggandakan indeks secara eksponensial, kemudian melakukan binary search pada rentang tersebut.',
    complexity: 'O(log n)',
    useCase: 'Array terurut tak terbatas, pencarian awal tidak diketahui',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const BigOGraph = ({ algorithm, progress, arraySize }) => {
  const getComplexityType = (algo) => {
    if (algo === 'linear') return 'linear'
    if (algo === 'jump') return 'sqrt'
    if (algo === 'interpolation') return 'loglog'
    return 'logarithmic' // binary, exponential
  }

  const type = getComplexityType(algorithm)
  const label = ALGO_INFO[algorithm].complexity
  const data = arraySize

  const width = 280
  const height = 120
  const padding = 15

  const points = []
  const steps = data || 10

  for (let i = 0; i <= steps; i++) {
    const x = i / steps
    let y

    if (type === 'linear') {
      y = x
    } else if (type === 'sqrt') {
      y = Math.sqrt(x)
    } else if (type === 'loglog') {
      y = x === 0 ? 0 : Math.log2(Math.log2(x * 10 + 2) + 1) / 2
    } else {
      y = x === 0 ? 0 : Math.log2(x * 10 + 1) / 3.5
    }

    if (y > 1) y = 1

    const px = padding + x * (width - 2 * padding)
    const py = height - padding - y * (height - 2 * padding)
    points.push(`${px},${py}`)
  }

  // Current Dot
  const cx = progress
  let cy

  if (type === 'linear') {
    cy = cx
  } else if (type === 'sqrt') {
    cy = Math.sqrt(cx)
  } else if (type === 'loglog') {
    cy = cx === 0 ? 0 : Math.log2(Math.log2(cx * 10 + 2) + 1) / 2
  } else {
    cy = cx === 0 ? 0 : Math.log2(cx * 10 + 1) / 3.5
  }

  if (cy > 1) cy = 1
  const dotX = padding + cx * (width - 2 * padding)
  const dotY = height - padding - cy * (height - 2 * padding)

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-2'>
        <div className='flex items-center gap-2 text-orange-400 font-bold text-xs uppercase'>
          <Activity size={14} /> Kompleksitas Waktu
        </div>
        <div className='px-2 py-0.5 bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded'>{label}</div>
      </div>
      <div className='relative h-[120px] w-full border-l border-b border-slate-600'>
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${width} ${height}`}>
          <polyline
            points={points.join(' ')}
            fill='none'
            stroke='#f97316'
            strokeWidth='2'
            strokeLinecap='round'
          />
          <circle
            cx={dotX}
            cy={dotY}
            r='4'
            fill='white'
            stroke='#f97316'
            strokeWidth='2'
          />
          <circle
            cx={dotX}
            cy={dotY}
            r='8'
            fill='#f97316'
            opacity='0.3'
            className='animate-pulse'
          />
        </svg>
      </div>
      <div className='flex justify-between text-[10px] text-slate-500 mt-1 font-mono'>
        <span>Start</span>
        <span>Operations vs N {data}</span>
        <span>End</span>
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
      const keywords = ['void', 'int', 'bool', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'for', 'while', 'do', 'if', 'else', 'switch', 'case', 'default', 'return', 'break', 'continue', 'goto', 'true', 'false', 'nullptr', 'NULL', 'const', 'static', 'auto', 'this', 'class', 'struct', 'enum', 'typedef', 'public', 'private', 'protected', 'virtual', 'override', 'final', 'cout', 'endl', 'vector', 'string', 'max', 'min']

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

const SearchAlgo = () => {
  const [arraySize, setArraySize] = useState(15)
  const [algorithm, setAlgorithm] = useState('linear')
  const [targetValue, setTargetValue] = useState(50)
  const [currentArray, setCurrentArray] = useState([])

  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // --- ALGORITHM GENERATORS (With Line Numbers) ---

  const snapshot = (arr, active, found, checked, line, desc, target) => ({
    array: [...arr],
    activeIndices: [...active],
    foundIndex: found,
    checkedIndices: [...checked],
    activeLine: line,
    description: desc,
    target: target,
  })

  const generateSteps = (initialArray, algo, target) => {
    let arr = [...initialArray]
    const n = arr.length
    let s = []
    let checked = []

    s.push(snapshot(arr, [], -1, [], 1, `Mulai pencarian untuk nilai ${target}`, target))

    if (algo === 'linear') {
      for (let i = 0; i < n; i++) {
        s.push(snapshot(arr, [i], -1, checked, 4, `Periksa arr[${i}] = ${arr[i]}`, target))

        if (arr[i] === target) {
          s.push(snapshot(arr, [], i, [...checked, i], 5, `Ditemukan! arr[${i}] = ${target}`, target))
          s.push(snapshot(arr, [], i, [...checked, i], 6, `Return indeks ${i}`, target))
          break
        }
        checked.push(i)
      }

      if (checked.length === n && !checked.some((idx) => arr[idx] === target)) {
        s.push(snapshot(arr, [], -1, checked, 10, `Tidak ditemukan, return -1`, target))
      }
    } else if (algo === 'binary') {
      let left = 0
      let right = n - 1

      s.push(snapshot(arr, [], -1, [], 2, `left = 0, right = ${n - 1}`, target))

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        s.push(snapshot(arr, [left, right], -1, checked, 5, `Rentang pencarian: [${left}, ${right}]`, target))

        s.push(snapshot(arr, [mid], -1, checked, 6, `mid = ${mid}, arr[${mid}] = ${arr[mid]}`, target))

        if (arr[mid] === target) {
          s.push(snapshot(arr, [], mid, [...checked, mid], 8, `Ditemukan! arr[${mid}] = ${target}`, target))
          s.push(snapshot(arr, [], mid, [...checked, mid], 9, `Return indeks ${mid}`, target))
          break
        } else if (arr[mid] < target) {
          checked.push(mid)
          s.push(snapshot(arr, [], -1, checked, 11, `arr[${mid}] < ${target}, cari di kanan`, target))
          left = mid + 1
        } else {
          checked.push(mid)
          s.push(snapshot(arr, [], -1, checked, 13, `arr[${mid}] > ${target}, cari di kiri`, target))
          right = mid - 1
        }
      }

      if (left > right) {
        s.push(snapshot(arr, [], -1, checked, 17, `Tidak ditemukan, return -1`, target))
      }
    } else if (algo === 'jump') {
      let step = Math.floor(Math.sqrt(n))
      let prev = 0

      s.push(snapshot(arr, [], -1, [], 3, `Ukuran lompatan = √${n} = ${step}`, target))

      // Jump phase
      while (prev < n && arr[Math.min(step, n) - 1] < target) {
        s.push(snapshot(arr, [Math.min(step, n) - 1], -1, checked, 6, `Periksa arr[${Math.min(step, n) - 1}] = ${arr[Math.min(step, n) - 1]} < ${target}?`, target))

        for (let i = prev; i < Math.min(step, n); i++) {
          checked.push(i)
        }

        prev = step
        step += Math.floor(Math.sqrt(n))

        s.push(snapshot(arr, [], -1, checked, 7, `Lompat ke blok berikutnya: prev = ${prev}`, target))

        if (prev >= n) {
          s.push(snapshot(arr, [], -1, checked, 9, `Melewati batas array, tidak ditemukan`, target))
          break
        }
      }

      // Linear search in block
      if (prev < n) {
        for (let i = prev; i < Math.min(step, n); i++) {
          s.push(snapshot(arr, [i], -1, checked, 14, `Linear search: arr[${i}] = ${arr[i]}`, target))

          if (arr[i] === target) {
            s.push(snapshot(arr, [], i, [...checked, i], 15, `Ditemukan! arr[${i}] = ${target}`, target))
            s.push(snapshot(arr, [], i, [...checked, i], 16, `Return indeks ${i}`, target))
            break
          }
          checked.push(i)
        }
      }

      if (!s.some((step) => step.foundIndex >= 0)) {
        s.push(snapshot(arr, [], -1, checked, 20, `Tidak ditemukan, return -1`, target))
      }
    } else if (algo === 'interpolation') {
      let low = 0
      let high = n - 1

      s.push(snapshot(arr, [], -1, [], 2, `low = 0, high = ${n - 1}`, target))

      while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
          s.push(snapshot(arr, [low], -1, checked, 6, `Hanya satu elemen tersisa: arr[${low}] = ${arr[low]}`, target))

          if (arr[low] === target) {
            s.push(snapshot(arr, [], low, [...checked, low], 7, `Ditemukan! Return ${low}`, target))
          } else {
            s.push(snapshot(arr, [], -1, [...checked, low], 8, `Tidak sama, return -1`, target))
          }
          break
        }

        const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))

        s.push(snapshot(arr, [low, high], -1, checked, 5, `Rentang: [${low}, ${high}]`, target))

        s.push(snapshot(arr, [pos], -1, checked, 11, `Interpolasi: pos = ${pos}, arr[${pos}] = ${arr[pos]}`, target))

        if (arr[pos] === target) {
          s.push(snapshot(arr, [], pos, [...checked, pos], 13, `Ditemukan! arr[${pos}] = ${target}`, target))
          s.push(snapshot(arr, [], pos, [...checked, pos], 14, `Return indeks ${pos}`, target))
          break
        } else if (arr[pos] < target) {
          checked.push(pos)
          s.push(snapshot(arr, [], -1, checked, 16, `arr[${pos}] < ${target}, cari di kanan`, target))
          low = pos + 1
        } else {
          checked.push(pos)
          s.push(snapshot(arr, [], -1, checked, 18, `arr[${pos}] > ${target}, cari di kiri`, target))
          high = pos - 1
        }
      }

      if (low > high || target < arr[low] || target > arr[high]) {
        s.push(snapshot(arr, [], -1, checked, 22, `Tidak ditemukan, return -1`, target))
      }
    } else if (algo === 'exponential') {
      if (arr[0] === target) {
        s.push(snapshot(arr, [0], 0, [0], 13, `arr[0] = ${arr[0]} adalah target!`, target))
        s.push(snapshot(arr, [], 0, [0], 14, `Return indeks 0`, target))
      } else {
        let i = 1
        s.push(snapshot(arr, [], -1, [], 17, `Mulai dari i = 1`, target))

        while (i < n && arr[i] <= target) {
          s.push(snapshot(arr, [i], -1, checked, 18, `Periksa arr[${i}] = ${arr[i]} <= ${target}`, target))

          for (let j = Math.floor(i / 2); j < i; j++) {
            if (!checked.includes(j)) checked.push(j)
          }

          i *= 2
          s.push(snapshot(arr, [], -1, checked, 19, `Gandakan indeks: i = ${i}`, target))
        }

        const bound = Math.min(i, n - 1)
        const start = Math.floor(i / 2)

        s.push(snapshot(arr, [], -1, checked, 22, `Binary search dalam rentang [${start}, ${bound}]`, target))

        // Binary search helper
        let left = start
        let right = bound

        while (left <= right) {
          const mid = Math.floor((left + right) / 2)

          s.push(snapshot(arr, [mid], -1, checked, 2, `Binary: mid = ${mid}, arr[${mid}] = ${arr[mid]}`, target))

          if (arr[mid] === target) {
            s.push(snapshot(arr, [], mid, [...checked, mid], 4, `Ditemukan! arr[${mid}] = ${target}`, target))
            s.push(snapshot(arr, [], mid, [...checked, mid], 4, `Return indeks ${mid}`, target))
            break
          } else if (arr[mid] < target) {
            checked.push(mid)
            left = mid + 1
          } else {
            checked.push(mid)
            right = mid - 1
          }
        }

        if (left > right) {
          s.push(snapshot(arr, [], -1, checked, 8, `Tidak ditemukan, return -1`, target))
        }
      }
    }

    // Final
    const finalFound = s[s.length - 1].foundIndex
    s.push(snapshot(arr, [], finalFound, checked, -1, finalFound >= 0 ? `Pencarian selesai: Ditemukan di indeks ${finalFound}` : 'Pencarian selesai: Tidak ditemukan', target))

    return s
  }

  // --- HELPERS ---

  const regenerateArray = () => {
    // Create sorted array for search algorithms
    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 90) + 10).sort((a, b) => a - b)
    setCurrentArray(newArr)

    // Pick a random target from new array or random to ensure fresh scenario on reset
    const randomTarget = Math.random() > 0.3 ? newArr[Math.floor(Math.random() * newArr.length)] : Math.floor(Math.random() * 100) + 10
    setTargetValue(randomTarget)
  }

  const refreshSteps = () => {
    if (currentArray.length === 0) return

    setIsPlaying(false)
    setCurrentStep(0)

    const generated = generateSteps(currentArray, algorithm, targetValue)
    setSteps(generated)
  }

  // Initial Load & Array Size Change -> Regenerate Array + Target
  useEffect(() => {
    regenerateArray()
  }, [arraySize])

  // Algorithm or Target Change -> Keep Array, Re-run Algorithm
  useEffect(() => {
    refreshSteps()
  }, [currentArray, algorithm, targetValue])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 100)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps])

  const currentVisual = steps[currentStep] || {
    array: [],
    activeIndices: [],
    foundIndex: -1,
    checkedIndices: [],
    activeLine: 0,
    description: 'Loading...',
    target: 0,
  }
  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  // ==========================================
  // 4. RENDER
  // ==========================================
  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Search
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOSEARCH<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Algoritma Searching</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              {Object.entries(ALGO_INFO).map(([key, info]) => (
                <option
                  key={key}
                  value={key}>
                  {info.title}
                </option>
              ))}
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <label className='text-xs text-slate-400 font-bold'>TARGET</label>
            <input
              type='number'
              value={targetValue}
              onChange={(e) => setTargetValue(Number(e.target.value))}
              className='w-16 bg-slate-700 text-orange-500 px-2 py-1 rounded border border-slate-600 text-sm text-center outline-none focus:border-orange-500 transition-colors'
            />
          </div>

          <div className='flex items-center gap-2'>
            <label className='text-xs text-slate-400 font-bold'>SIZE</label>
            <input
              type='number'
              min='5'
              max='50'
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className='w-16 bg-slate-700 text-orange-500 px-2 py-1 rounded border border-slate-600 text-sm text-center outline-none focus:border-orange-500 transition-colors'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={regenerateArray}
            className='p-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors'
            title='Reset'>
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* TOP INFO CARD */}
      <div className='p-6 border-b border-slate-700 bg-[#151925]'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          {/* LEFT COLUMN: INFO */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-2'>{ALGO_INFO[algorithm].title}</h2>
            <p className='text-sm text-slate-400 leading-relaxed max-w-2xl'>{ALGO_INFO[algorithm].description}</p>

            <div className='flex gap-4'>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Activity
                  size={12}
                  className='text-orange-400'
                />
                Time: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
              </div>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Variable
                  size={12}
                  className='text-blue-400'
                />
                Space: <span className='text-slate-200'>O(1)</span>
              </div>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Target
                  size={12}
                  className='text-emerald-400'
                />
                Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
              </div>
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
        {/* LEFT COLUMN: VISUALS (5/12) */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          {/* TARGET VALUE DISPLAY */}
          <div className='bg-gradient-to-br from-orange-900/30 to-red-900/30 border-2 border-orange-500/50 rounded-xl p-4 shadow-2xl'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-500/20 rounded-lg'>
                  <Target
                    size={20}
                    className='text-orange-400'
                  />
                </div>
                <div>
                  <p className='text-[10px] font-bold text-orange-400 uppercase'>Target Pencarian</p>
                  <p className='text-3xl font-black text-white'>{currentVisual.target}</p>
                </div>
              </div>
              {currentVisual.foundIndex >= 0 && (
                <div className='px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 rounded-lg'>
                  <p className='text-[10px] font-bold text-emerald-400 uppercase'>Ditemukan</p>
                  <p className='text-lg font-black text-emerald-300'>Index: {currentVisual.foundIndex}</p>
                </div>
              )}
            </div>
          </div>

          {/* ARRAY STRUCTURE (BOXES) */}
          <div className='bg-slate-900 border border-slate-700 rounded-xl p-3 shrink-0'>
            <h3 className='text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2'>
              <Hash size={14} /> Struktur Data Array (Terurut)
            </h3>
            <div className='flex justify-center flex-wrap gap-1'>
              {currentVisual.array.map((val, idx) => (
                <div
                  key={idx}
                  className={`
                                w-12 h-12 flex flex-col items-center justify-center rounded text-xs font-mono font-bold border-2 transition-colors duration-150
                                ${currentVisual.foundIndex === idx ? 'border-emerald-500 bg-emerald-900/30 text-emerald-400 shadow-lg shadow-emerald-500/30' : currentVisual.activeIndices.includes(idx) ? 'border-yellow-400 bg-yellow-900/20 text-yellow-400' : currentVisual.checkedIndices.includes(idx) ? 'border-slate-600 bg-slate-800/50 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-300'}
                            `}>
                  <span className='text-[9px] text-slate-500 font-normal'>{idx}</span>
                  <span className='text-sm font-bold'>{val}</span>
                </div>
              ))}
            </div>
            <div className='flex gap-3 mt-3 justify-center'>
              <span className='text-[10px] font-bold px-1.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20'>FOUND</span>
              <span className='text-[10px] font-bold px-1.5 py-0.5 rounded border bg-yellow-500/10 text-yellow-400 border-yellow-500/20'>CHECKING</span>
              <span className='text-[10px] font-bold px-1.5 py-0.5 rounded border bg-slate-700/50 text-slate-500 border-slate-600'>CHECKED</span>
            </div>
          </div>

          {/* BIG O GRAPH */}
          <div className='shrink-0'>
            <BigOGraph
              algorithm={algorithm}
              progress={currentStep / (steps.length || 1)}
              arraySize={arraySize}
            />
          </div>

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

            {/* Progress Bar */}
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

        {/* RIGHT COLUMN: INFO & PSEUDOCODE (7/12) */}
        <div className='lg:col-span-7 bg-[#1e1e1e] flex flex-col border-l border-slate-800'>
          {/* CURRENT ACTION INDICATOR */}
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

          {/* C++ CODE PANEL */}
          <div className='p-4 bg-[#252526] flex-1 overflow-hidden'>
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

export default SearchAlgo
