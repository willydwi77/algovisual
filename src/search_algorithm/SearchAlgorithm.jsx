import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BarChart3, Code, Terminal, Variable, Layers, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Search, Target, Hash } from 'lucide-react'

const SearchAlgorithm = () => {
  // --- STATE MANAGEMENT ---
  const [arraySize, setArraySize] = useState(15)
  const [algorithm, setAlgorithm] = useState('linear') // linear | binary | hashing
  const [targetValue, setTargetValue] = useState(0)

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)
  const [array, setArray] = useState([])

  // Time tracking
  const [elapsedTime, setElapsedTime] = useState(0)
  const STEP_DELAY = 500 // ms per step

  // Definisi Variabel
  const variableDefinitions = {
    common: { n: 'Total Data', target: 'Angka Dicari' },
    linear: { i: 'Indeks Saat Ini', found: 'Status Ketemu' },
    binary: { low: 'Batas Kiri', high: 'Batas Kanan', mid: 'Indeks Tengah', found: 'Status Ketemu' },
    hashing: { hashSize: 'Ukuran Hash', hashKey: 'Kunci Hash', index: 'Indeks Hash', probes: 'Percobaan', found: 'Status Ketemu' },
  }

  const getVarDesc = (name) => {
    if (variableDefinitions[algorithm] && variableDefinitions[algorithm][name]) {
      return variableDefinitions[algorithm][name]
    }
    return variableDefinitions.common[name] || ''
  }

  const algoCode = {
    linear: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Ditemukan
    }
  }
  return -1; // Tidak ditemukan
}`,
    binary: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    
    if (arr[mid] === target) return mid;
    
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
    hashing: `function hashSearch(arr, target, hashSize) {
  let hashKey = target % hashSize;
  let index = hashKey;
  let probes = 0;
  
  while (arr[index] !== null) {
    if (arr[index] === target) {
      return index; // Ditemukan
    }
    probes++;
    index = (hashKey + probes) % hashSize;
    
    if (probes >= hashSize) break;
  }
  return -1; // Tidak ditemukan
}`,
  }

  // Deskripsi Algoritma
  const algorithmDescriptions = {
    linear: {
      title: 'Linear Search (Pencarian Berurutan)',
      description: 'Memeriksa setiap elemen array satu per satu dari awal hingga akhir atau sampai elemen ditemukan. Algoritma ini sederhana namun bisa lambat untuk dataset besar.',
      complexity: 'O(n) - Waktu linear',
      useCase: 'Dataset kecil, array tidak terurut',
      pseudocode: `For each element i in array:
  If arr[i] == target:
    Return i
Return -1`,
    },
    binary: {
      title: 'Binary Search (Pencarian Biner)',
      description: 'Membagi array menjadi dua bagian berulang kali dengan membandingkan elemen tengah. Jika target lebih kecil, cari di sebelah kiri, jika lebih besar cari di kanan.',
      complexity: 'O(log n) - Logaritmik',
      useCase: 'Dataset besar terurut, pencarian cepat',
      pseudocode: `low = 0, high = n-1
While low <= high:
  mid = (low + high) // 2
  If arr[mid] == target: Return mid
  If arr[mid] < target: low = mid + 1
  Else: high = mid - 1
Return -1`,
    },
    hashing: {
      title: 'Hash Search (Pencarian dengan Hash Table)',
      description: 'Menggunakan fungsi hash untuk memetakan nilai ke indeks spesifik dalam tabel. Collision ditangani dengan linear probing.',
      complexity: 'O(1) Avg, O(n) Worst',
      useCase: 'Lookup cepat, dictionary, caching',
      pseudocode: `index = target % size
While table[index] is not Empty:
  If table[index] == target: Return index
  index = (index + 1) % size
Return -1`,
    },
  }

  // --- ENGINE: GENERATOR LANGKAH ---
  const snapshot = (arr, active, found, checked, range, line, desc, vars) => {
    return {
      array: [...arr],
      activeIndices: [...active], // Sedang dibandingkan
      foundIndices: [...found], // Ketemu
      checkedIndices: [...checked], // Sudah dicek (abu-abu/merah)
      searchRange: [...range], // Untuk Binary Search (low - high)
      activeLine: line,
      stepDescription: desc,
      variables: { ...vars },
    }
  }

  const generateSteps = (arr, algoType, target) => {
    const stepsArr = []
    const n = arr.length
    let vars = { n, target }

    // Initial
    stepsArr.push(snapshot(arr, [], [], [], [], -1, 'Mulai Pencarian - Inisialisasi variabel dan struktur data', vars))

    if (algoType === 'linear') {
      let found = false
      for (let i = 0; i < n; i++) {
        vars = { ...vars, i }

        // Line 2: check loop
        stepsArr.push(
          snapshot(
            arr,
            [i],
            [],
            Array.from({ length: i }, (_, k) => k),
            [],
            2,
            `Iterasi ${i + 1}: Periksa elemen di indeks ${i} dengan nilai ${arr[i]}. Bandingkan dengan target ${target}.`,
            vars
          )
        )

        // Line 3: if (arr[i] === target)
        if (arr[i] === target) {
          found = true
          vars = { ...vars, found: 'TRUE' }
          // Line 4: return i
          stepsArr.push(
            snapshot(
              arr,
              [],
              [i],
              Array.from({ length: i }, (_, k) => k),
              [],
              4,
              `✓ DITEMUKAN! Nilai ${arr[i]} sama dengan target ${target}. Pencarian selesai di indeks ${i}.`,
              vars
            )
          )
          break
        } else {
          stepsArr.push(
            snapshot(
              arr,
              [],
              [],
              Array.from({ length: i + 1 }, (_, k) => k),
              [],
              3,
              `✗ ${arr[i]} ≠ ${target}. Elemen tidak cocok, lanjut ke elemen berikutnya.`,
              vars
            )
          )
        }
      }
      if (!found) {
        // Line 7: return -1
        stepsArr.push(
          snapshot(
            arr,
            [],
            [],
            Array.from({ length: n }, (_, k) => k),
            [],
            7,
            `Selesai loop - semua ${n} elemen telah diperiksa. Target ${target} tidak ada dalam array.`,
            vars
          )
        )
      }
    } else if (algoType === 'binary') {
      let low = 0
      let high = n - 1
      let found = false
      vars = { ...vars, low, high, mid: '-' }

      // Line 4: while
      stepsArr.push(snapshot(arr, [], [], [], [low, high], 4, `Mulai Binary Search - Set range pencarian dari indeks ${low}  hingga ${high} (${high - low + 1} elemen).`, vars))

      while (low <= high) {
        let mid = Math.floor((low + high) / 2)
        vars = { ...vars, low, high, mid }

        // Line 5: calc mid
        stepsArr.push(snapshot(arr, [mid], [], [], [low, high], 5, `Hitung titik tengah: mid = floor((${low} + ${high}) / 2) = ${mid}. Nilai di mid: ${arr[mid]}`, vars))

        // Line 7: check match
        if (arr[mid] === target) {
          found = true
          vars = { ...vars, found: 'TRUE' }
          stepsArr.push(snapshot(arr, [], [mid], [], [low, high], 7, `✓ DITEMUKAN! ${arr[mid]} === ${target}. Target ditemukan di posisi tengah (indeks ${mid}).`, vars))
          break
        }

        // Line 9: check less
        stepsArr.push(snapshot(arr, [mid], [], [], [low, high], 9, `Bandingkan: ${arr[mid]} vs ${target}. Tentukan arah pencarian selanjutnya.`, vars))

        if (arr[mid] < target) {
          low = mid + 1
          vars = { ...vars, low }
          // Line 10: low = mid + 1
          stepsArr.push(
            snapshot(
              arr,
              [],
              [],
              Array.from({ length: low }, (_, k) => k),
              [low, high],
              10,
              `${arr[mid]} < ${target}: Target lebih besar. Eliminasi setengah kiri. Set low = ${low}.`,
              vars
            )
          )
        } else {
          high = mid - 1
          vars = { ...vars, high }
          // Line 12: high = mid - 1
          let discarded = []
          for (let k = high + 1; k < n; k++) discarded.push(k)
          stepsArr.push(snapshot(arr, [], [], discarded, [low, high], 12, `${arr[mid]} > ${target}: Target lebih kecil. Eliminasi setengah kanan. Set high = ${high}.`, vars))
        }
      }

      if (!found) {
        stepsArr.push(
          snapshot(
            arr,
            [],
            [],
            Array.from({ length: n }, (_, k) => k),
            [low, high],
            15,
            `Range habis: low (${low}) > high (${high}). Target ${target} tidak ada dalam array terurut ini.`,
            vars
          )
        )
      }
    } else if (algoType === 'hashing') {
      // Hash table size (sama dengan array size untuk simplicity)
      const hashSize = n
      let hashTable = new Array(hashSize).fill(null)

      // Insert phase - build hash table
      stepsArr.push(snapshot(arr, [], [], [], [], -1, `Fase 1: Membangun Hash Table dengan ukuran ${hashSize}. Fungsi hash: h(x) = x mod ${hashSize}`, { n, hashSize, target }))

      for (let i = 0; i < n; i++) {
        let value = arr[i]
        let hashKey = value % hashSize
        let index = hashKey
        let probes = 0

        // Linear probing for collision
        while (hashTable[index] !== null) {
          probes++
          index = (hashKey + probes) % hashSize
        }

        hashTable[index] = value
        stepsArr.push(snapshot(hashTable, [index], [], [], [], 2, `Insert ${value}: h(${value}) = ${value} mod ${hashSize} = ${hashKey}${probes > 0 ? `. Collision! Linear probing ${probes}x ke index ${index}` : `, simpan langsung di index ${index}`}`, { hashSize, hashKey, index, probes: probes || '-' }))
      }

      stepsArr.push(snapshot(hashTable, [], [], [], [], -1, 'Fase 2: Hash Table siap! Mulai pencarian target menggunakan fungsi hash yang sama.', { n, hashSize, target }))

      // Search phase
      let hashKey = target % hashSize
      let index = hashKey
      let probes = 0
      let found = false
      vars = { hashSize, target, hashKey, index, probes }

      // Line 3: calculate hash
      stepsArr.push(snapshot(hashTable, [], [], [], [], 3, `Hitung hash key: h(${target}) = ${target} mod ${hashSize} = ${hashKey}. Mulai pencarian dari index ${hashKey}.`, vars))

      // Line 8: start probing
      stepsArr.push(snapshot(hashTable, [index], [], [], [], 8, `Cek hash table[${index}]: ${hashTable[index] !== null ? `berisi ${hashTable[index]}` : 'slot kosong'}`, vars))

      while (hashTable[index] !== null) {
        vars = { ...vars, index, probes }

        // Line 9: check match
        if (hashTable[index] === target) {
          found = true
          vars = { ...vars, found: 'TRUE' }
          stepsArr.push(snapshot(hashTable, [], [index], [], [], 10, `✓ DITEMUKAN! hashTable[${index}] = ${hashTable[index]} === ${target}. Pencarian selesai${probes > 0 ? ` setelah ${probes} kali probing` : ' tanpa collision'}.`, vars))
          break
        }

        // Line 12: collision, continue probing
        stepsArr.push(snapshot(hashTable, [index], [], [index], [], 12, `✗ hashTable[${index}] = ${hashTable[index]} ≠ ${target}. Collision terdeteksi, lakukan linear probing...`, vars))
        probes++
        index = (hashKey + probes) % hashSize
        vars = { ...vars, probes, index }
        stepsArr.push(snapshot(hashTable, [index], [], [], [], 13, `Probing ke-${probes}: index = (${hashKey} + ${probes}) mod ${hashSize} = ${index}. Cek slot berikutnya.`, vars))

        if (probes >= hashSize) {
          break // Checked all slots
        }
      }

      if (!found) {
        // Line 18
        stepsArr.push(
          snapshot(
            hashTable,
            [],
            [],
            hashTable.map((_, i) => i),
            [],
            18,
            `Slot kosong ditemukan atau semua slot sudah dicek. Target ${target} tidak ada dalam hash table.`,
            vars
          )
        )
      }
    }

    return stepsArr
  }

  // --- CONTROL LOGIC ---
  const generateRandomArray = (sorted = false) => {
    const newArray = []
    if (sorted) {
      let current = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < arraySize; i++) {
        newArray.push(current)
        current += Math.floor(Math.random() * 8) + 1
      }
    } else {
      for (let i = 0; i < arraySize; i++) {
        newArray.push(Math.floor(Math.random() * 100) + 1)
      }
    }
    return newArray
  }

  const generateHashArray = () => {
    // Generate unique values for hashing to avoid too many collisions
    const newArray = []
    const used = new Set()
    for (let i = 0; i < arraySize; i++) {
      let val
      do {
        val = Math.floor(Math.random() * 100) + 1
      } while (used.has(val))
      used.add(val)
      newArray.push(val)
    }
    return newArray
  }

  const resetAndGenerate = (keepTarget = false) => {
    setIsPlaying(false)
    setCurrentStep(0)
    setElapsedTime(0)

    // Tentukan jenis array berdasarkan algoritma
    let newArray
    if (algorithm === 'binary') {
      newArray = generateRandomArray(true) // Binary butuh sorted
    } else if (algorithm === 'hashing') {
      newArray = generateHashArray() // Hashing butuh unique values
    } else {
      newArray = generateRandomArray(false) // Linear search - random
    }

    // Pick random target from array to ensure finding (good for demo)
    let target = targetValue
    if (!keepTarget) {
      const randomIndex = Math.floor(Math.random() * newArray.length)
      target = newArray[randomIndex]
      setTargetValue(target)
    }

    setArray(newArray)
    const generatedSteps = generateSteps(newArray, algorithm, target)
    setSteps(generatedSteps)
  }

  // Init
  useEffect(() => {
    resetAndGenerate()
  }, [arraySize, algorithm])

  // Re-generate steps when target changes manually
  useEffect(() => {
    if (array.length > 0) {
      const generatedSteps = generateSteps(array, algorithm, targetValue)
      setSteps(generatedSteps)
      setCurrentStep(0)
      setIsPlaying(false)
      setElapsedTime(0)
    }
  }, [targetValue])

  // Player Loop
  useEffect(() => {
    if (isPlaying) {
      const baseTime = Date.now() - elapsedTime
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const newElapsed = now - baseTime
        setElapsedTime(newElapsed)

        const targetStep = Math.floor(newElapsed / STEP_DELAY)
        if (targetStep >= steps.length - 1) {
          setCurrentStep(steps.length - 1)
          setIsPlaying(false)
        } else {
          setCurrentStep(targetStep)
        }
      }, 30)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps.length])

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setElapsedTime(0)
  }
  const handleBegin = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setElapsedTime(0)
  }
  const handleEnd = () => {
    setIsPlaying(false)
    const last = steps.length - 1
    setCurrentStep(last)
    setElapsedTime(last * STEP_DELAY)
  }

  const currentVisual = steps[currentStep] || {
    array: [],
    activeIndices: [],
    foundIndices: [],
    checkedIndices: [],
    searchRange: [],
    activeLine: -1,
    stepDescription: 'Loading...',
    variables: {},
  }

  const renderCodeBlock = (codeString) => {
    const lines = codeString.trim().split('\n')
    return lines.map((line, index) => {
      const isActive = currentVisual.activeLine === index + 1
      return (
        <div
          key={index}
          className={`flex px-2 py-0.5 ${isActive ? 'bg-purple-900/60 border-l-4 border-purple-400' : 'border-l-4 border-transparent'}`}>
          <span className='w-8 text-slate-600 text-right mr-3 text-xs leading-5'>{index + 1}</span>
          <span className={`font-mono text-xs whitespace-pre ${isActive ? 'text-purple-200 font-bold' : 'text-slate-300'}`}>{line}</span>
        </div>
      )
    })
  }

  const getStatusColor = () => {
    if (currentVisual.foundIndices.length > 0) return 'text-emerald-400'
    if (currentVisual.activeIndices.length > 0) return 'text-yellow-400'
    return 'text-slate-400'
  }

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        {/* HEADER & CONTROLS */}
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          {/* Title & Top Config */}
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20'>
                <Search
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 pb-2 mb-1'>Algo Search</h1>
                <p className='text-xs text-slate-400'>Metode dalam pencarian data</p>
              </div>
            </div>

            <div className='flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-purple-500 outline-none'>
                <option value='linear'>Linear Search</option>
                <option value='binary'>Binary Search</option>
                <option value='hashing'>Hash Search</option>
              </select>

              {/* TARGET INPUT */}
              <div className='flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-600'>
                <Target
                  size={14}
                  className='text-red-400'
                />
                <span className='text-xs text-slate-400 font-bold'>CARI:</span>
                <input
                  type='number'
                  value={targetValue}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className='w-16 bg-transparent text-white font-mono font-bold outline-none text-sm'
                />
              </div>

              <div className='flex flex-col gap-1 min-w-[100px]'>
                <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                  <span>Data</span>
                  <span className='text-purple-300 font-mono'>{arraySize}</span>
                </div>
                <input
                  type='range'
                  min='5'
                  max='30'
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className='w-24 h-2 bg-slate-700 rounded-lg accent-purple-500 cursor-pointer'
                />
              </div>
              <button
                onClick={() => resetAndGenerate(false)}
                className='p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white'
                title='Acak Array & Target'>
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ALGORITHM DESCRIPTION */}
        <section className='w-full max-w-6xl mb-4'>
          <div className='bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-purple-600 rounded-lg shadow-lg shadow-purple-500/20 mt-1'>
                <Search
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-purple-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400  font-semibold'>Kompleksitas:</span>
                    <span className='text-purple-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
                  </div>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Use Case:</span>
                    <span className='text-slate-300 ml-2'>{algorithmDescriptions[algorithm].useCase}</span>
                  </div>
                </div>
                {algorithmDescriptions[algorithm].pseudocode && (
                  <div className='mt-3 bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 font-mono text-xs text-slate-400 whitespace-pre overflow-x-auto'>
                    <div className='text-purple-400 font-bold mb-1'>Pseudocode:</div>
                    {algorithmDescriptions[algorithm].pseudocode}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN VISUALIZATION */}
        <main className='w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* LEFT: VISUALS */}
          <section className='lg:col-span-2 flex flex-col gap-4'>
            {/* Array Box View (Better for Search) */}
            <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[150px] flex flex-col'>
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex items-center justify-between text-purple-100 text-sm font-semibold'>
                <div className='flex items-center gap-2'>
                  <Hash
                    size={16}
                    className='text-purple-400'
                  />{' '}
                  {algorithm === 'hashing' ? 'Hash Table' : 'Visualisasi Array'}
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>{currentVisual.foundIndices.length > 0 ? 'DITEMUKAN' : currentVisual.activeIndices.length > 0 ? 'MENCARI...' : 'READY'}</div>
              </div>

              <div className='p-6 overflow-x-auto flex-1 bg-[#151925]'>
                <div className='flex items-center justify-center min-w-full w-fit min-h-full mx-auto'>
                  <div className='flex gap-1 md:gap-2'>
                    {currentVisual.array.map((value, idx) => {
                      let borderColor = 'border-slate-700',
                        bgColor = 'bg-slate-800',
                        textColor = 'text-slate-500',
                        scale = 'scale-100',
                        opacity = 'opacity-100'

                      // Styling Logic
                      const isChecked = currentVisual.checkedIndices.includes(idx)
                      const isActive = currentVisual.activeIndices.includes(idx)
                      const isFound = currentVisual.foundIndices.includes(idx)
                      const inRange = currentVisual.searchRange.length === 2 ? idx >= currentVisual.searchRange[0] && idx <= currentVisual.searchRange[1] : true

                      if (algorithm === 'binary' && !inRange && !isFound) {
                        opacity = 'opacity-30' // Dim out of range for binary
                      }

                      if (isFound) {
                        borderColor = 'border-emerald-500'
                        bgColor = 'bg-emerald-600'
                        textColor = 'text-white'
                        scale = 'scale-110'
                        opacity = 'opacity-100'
                      } else if (isActive) {
                        borderColor = 'border-yellow-500'
                        bgColor = 'bg-yellow-600'
                        textColor = 'text-white'
                        scale = 'scale-110'
                        opacity = 'opacity-100'
                      } else if (isChecked) {
                        borderColor = 'border-slate-600'
                        bgColor = 'bg-slate-700'
                        textColor = 'text-slate-500'
                      }

                      // For hashing, show null as empty
                      const displayValue = value === null ? '-' : value

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center gap-1 transition-all duration-200 ${scale} ${opacity}`}>
                          <div className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-lg font-mono font-bold text-sm md:text-lg shadow-lg ${borderColor} ${bgColor} ${textColor}`}>{displayValue}</div>
                          <span className='text-[9px] md:text-[10px] text-slate-500 font-mono'>{idx}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
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
                    if (currentStep > 0) {
                      const prev = currentStep - 1
                      setCurrentStep(prev)
                      setElapsedTime(prev * STEP_DELAY)
                    }
                  }}
                  disabled={currentStep === 0}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30'
                  title='Step Back'>
                  <StepBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-600 hover:bg-purple-700'} text-white`}>
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
                    if (currentStep < steps.length - 1) {
                      const next = currentStep + 1
                      setCurrentStep(next)
                      setElapsedTime(next * STEP_DELAY)
                    }
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

              {/* Progress */}
              <div className='hidden md:flex flex-col flex-1 max-w-xs ml-4'>
                <div className='flex justify-between text-[10px] text-slate-400 mb-1'>
                  <span>Progres</span>
                  <span>
                    {currentStep} / {steps.length - 1}
                  </span>
                </div>
                <div className='w-full bg-slate-700 h-1.5 rounded-full overflow-hidden'>
                  <div
                    className='bg-purple-500 h-full transition-all duration-100'
                    style={{ width: `${(currentStep / (steps.length - 1 || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Vars */}
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-slate-800 text-slate-200 text-sm font-semibold'>
                <Variable
                  size={16}
                  className='text-purple-400'
                />{' '}
                Variabel
              </div>
              <div className='p-3 grid grid-cols-2 gap-2 bg-slate-900/50'>
                {/* Time Tracking */}
                <div className='col-span-2 mb-2 p-2 bg-slate-800/50 rounded border border-slate-600'>
                  <div className='flex justify-between items-center'>
                    <span className='text-[10px] text-slate-400 font-semibold uppercase'>Waktu Eksekusi</span>
                    <span className='text-sm text-cyan-400 font-mono font-bold'>{(elapsedTime / 1000).toFixed(2)}s</span>
                  </div>
                </div>
                {Object.entries(currentVisual.variables || {}).map(([key, val]) => (
                  <div
                    key={key}
                    className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
                    <span className='text-[10px] text-purple-300 font-mono font-bold uppercase'>{key}</span>
                    <span className='text-sm text-white font-bold'>{val}</span>
                    <span className='text-[8px] text-slate-400 text-center'>{getVarDesc(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT: INFO (1/3) */}
          <section className='lg:col-span-1 flex flex-col gap-4 h-full'>
            {/* Code */}
            <div className='flex flex-col flex-1 max-h-[40vh] bg-[#1e1e1e] border border-slate-700 rounded-xl overflow-hidden shadow-xl'>
              <div className='bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2 text-slate-200 text-sm font-semibold'>
                <Code
                  size={16}
                  className='text-purple-400'
                />{' '}
                Kode Algoritma
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>

            {/* Status */}
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-purple-900/20 text-purple-100 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-purple-400'
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

export default SearchAlgorithm
