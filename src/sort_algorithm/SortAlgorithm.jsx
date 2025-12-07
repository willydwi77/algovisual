import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BarChart3, Code, Hash, Variable, Layers, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Search } from 'lucide-react'

const SortAlgorithm = () => {
  // --- STATE MANAGEMENT ---
  const [arraySize, setArraySize] = useState(10)
  const [algorithm, setAlgorithm] = useState('bubble')

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Time tracking
  // Time tracking
  const [elapsedTime, setElapsedTime] = useState(0)
  const STEP_DELAY = 300 // ms per step

  const variableDefinitions = {
    common: { n: 'Total Data' },
    bubble: { i: 'Loop Luar (Pass)', j: 'Posisi Sekarang', temp: 'Simpan Sementara' },
    selection: { i: 'Posisi Target', j: 'Pencari Minimum', minIdx: 'Indeks Terkecil', temp: 'Simpan Sementara' },
    insertion: { i: 'Batas Terurut', j: 'Pencari Posisi', key: 'Nilai Disisipkan' },
    quick: { low: 'Batas Kiri', high: 'Batas Kanan', pivot: 'Nilai Patokan', i: 'Batas Partisi', j: 'Scanner', temp: 'Simpan Sementara' },
    merge: { left: 'Indeks Kiri', right: 'Indeks Kanan', mid: 'Titik Tengah', i: 'Pointer Kiri', j: 'Pointer Kanan', k: 'Pointer Merge' },
    heap: { n: 'Ukuran Heap', i: 'Indeks Sekarang', largest: 'Indeks Terbesar', left: 'Child Kiri', right: 'Child Kanan', temp: 'Simpan Sementara' },
  }

  const getVarDesc = (name) => {
    if (variableDefinitions[algorithm] && variableDefinitions[algorithm][name]) {
      return variableDefinitions[algorithm][name]
    }
    return variableDefinitions.common[name] || ''
  }

  const algoCode = {
    bubble: `function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}`,
    selection: `function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }
  }
}`,
    insertion: `function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
}`,
    quick: `function quickSort(arr, low, high) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = (low - 1);
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      swap(arr, i, j);
    }
  }
  swap(arr, i + 1, high);
  return i + 1;
}`,
    merge: `function mergeSort(arr, left, right) {
  if (left < right) {
    let mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}

function merge(arr, left, mid, right) {
  let L = arr.slice(left, mid + 1);
  let R = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;
  while (i < L.length && j < R.length) {
    if (L[i] <= R[j]) {
      arr[k] = L[i]; i++;
    } else {
      arr[k] = R[j]; j++;
    }
    k++;
  }
  while (i < L.length) { 
    arr[k] = L[i]; i++; k++; 
  }
  while (j < R.length) { 
    arr[k] = R[j]; j++; k++; 
  }
}`,
    heap: `function heapSort(arr) {
  let n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  for (let i = n - 1; i > 0; i--) {
    swap(arr, 0, i);
    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;
  if (left < n && arr[left] > arr[largest])
    largest = left;
  if (right < n && arr[right] > arr[largest])
    largest = right;
  if (largest !== i) {
    swap(arr, i, largest);
    heapify(arr, n, largest);
  }
}`,
  }

  // Deskripsi Algoritma
  const algorithmDescriptions = {
    bubble: {
      title: 'Bubble Sort (Pengurutan Gelembung)',
      description: "Membandingkan pasangan elemen adjacent (bersebelahan) dan menukarnya jika tidak berurutan. Elemen terbesar akan 'menggelembung' ke akhir array pada setiap pass. Simpel namun tidak efisien untuk dataset besar.",
      complexity: 'O(n²) worst/average case, O(n) best case (sudah terurut)',
      useCase: 'Pembelajaran algoritma, dataset sangat kecil, data hampir terurut',
      pseudocode: `For i from 0 to n-1:
  For j from 0 to n-i-1:
    If arr[j] > arr[j+1]:
      Swap(arr[j], arr[j+1])`,
    },
    selection: {
      title: 'Selection Sort (Pengurutan Seleksi)',
      description: 'Pada setiap iterasi, mencari elemen terkecil dari bagian yang belum terurut dan menukarnya dengan elemen pertama dari bagian tersebut. Membangun array terurut dari kiri ke kanan.',
      complexity: 'O(n²) untuk semua kasus (worst, average, best)',
      useCase: 'Dataset kecil, minimalisir jumlah swap, memory terbatas',
      pseudocode: `For i from 0 to n-1:
  minIdx = i
  For j from i+1 to n:
    If arr[j] < arr[minIdx]: minIdx = j
  If minIdx != i:
    Swap(arr[i], arr[minIdx])`,
    },
    insertion: {
      title: 'Insertion Sort (Pengurutan Penyisipan)',
      description: 'Membangun array terurut satu elemen pada satu waktu dengan mengambil elemen dan menyisipkannya ke posisi yang tepat di bagian array yang sudah terurut. Seperti mengurutkan kartu di tangan.',
      complexity: 'O(n²) worst/average case, O(n) best case (hampir terurut)',
      useCase: 'Data hampir terurut, online sorting (data datang bertahap), dataset kecil',
      pseudocode: `For i from 1 to n:
  key = arr[i]
  j = i - 1
  While j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,
    },
    quick: {
      title: 'Quick Sort (Pengurutan Cepat)',
      description: 'Algoritma divide-and-conquer yang memilih pivot dan mempartisi array sehingga elemen kecil di kiri pivot dan besar di kanan. Rekursif mengurutkan sub-array. Sangat efisien untuk dataset besar.',
      complexity: 'O(n log n) average case, O(n²) worst case (pivot buruk)',
      useCase: 'General purpose sorting, dataset besar, performa tinggi',
      pseudocode: `QuickSort(arr, low, high):
  If low < high:
    pi = Partition(arr, low, high)
    QuickSort(arr, low, pi-1)
    QuickSort(arr, pi+1, high)

Partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  For j from low to high-1:
    If arr[j] < pivot:
      i++, Swap(arr[i], arr[j])
  Swap(arr[i+1], arr[high])
  Return i+1`,
    },
    merge: {
      title: 'Merge Sort (Pengurutan Gabung)',
      description: 'Algoritma divide-and-conquer yang membagi array menjadi dua bagian hingga tersisa satu elemen, lalu menggabungkan (merge) bagian-bagian tersebut secara terurut. Stabil dan konsisten.',
      complexity: 'O(n log n) untuk semua kasus, Space: O(n)',
      useCase: 'Stable sort diperlukan, linked lists, external sorting, data besar',
      pseudocode: `MergeSort(arr, left, right):
  If left < right:
    mid = (left + right) / 2
    MergeSort(arr, left, mid)
    MergeSort(arr, mid+1, right)
    Merge(arr, left, mid, right)

Merge(arr, left, mid, right):
  L = arr[left..mid], R = arr[mid+1..right]
  i = 0, j = 0, k = left
  While i < |L| and j < |R|:
    If L[i] <= R[j]: arr[k] = L[i], i++
    Else: arr[k] = R[j], j++
    k++
  Copy remaining L and R to arr`,
    },
    heap: {
      title: 'Heap Sort (Pengurutan Heap)',
      description: 'Membangun max heap dari array, kemudian berulang kali mengekstrak elemen terbesar (root) dan meletakkannya di akhir array. Menggunakan struktur data binary heap. In-place sorting.',
      complexity: 'O(n log n) untuk semua kasus, Space: O(1)',
      useCase: 'Guaranteed O(n log n), priority queue, space constraint',
      pseudocode: `HeapSort(arr):
  BuildMaxHeap(arr)
  For i from n-1 to 1:
    Swap(arr[0], arr[i])
    Heapify(arr, i, 0)

Heapify(arr, n, i):
  largest = i, l = 2*i+1, r = 2*i+2
  If l < n and arr[l] > arr[largest]: largest = l
  If r < n and arr[r] > arr[largest]: largest = r
  If largest != i:
    Swap(arr[i], arr[largest])
    Heapify(arr, n, largest)`,
    },
  }

  // --- ENGINE: GENERATOR LANGKAH ---
  const snapshot = (arr, active, swap, sorted, line, desc, vars) => {
    return {
      array: [...arr],
      activeIndices: [...active],
      swapIndices: [...swap],
      sortedIndices: [...sorted],
      activeLine: line,
      stepDescription: desc,
      variables: { ...vars },
    }
  }

  const generateSteps = (initialArray, algoType) => {
    const stepsArr = []
    let arr = [...initialArray]
    let n = arr.length
    let vars = { n }

    stepsArr.push(snapshot(arr, [], [], [], -1, 'Mulai Algoritma Sorting - Inisialisasi variabel dan struktur data', vars))

    if (algoType === 'bubble') {
      for (let i = 0; i < n; i++) {
        vars = { ...vars, i }
        for (let j = 0; j < n - i - 1; j++) {
          vars = { ...vars, j }
          stepsArr.push(snapshot(arr, [j, j + 1], [], [], 5, `Pass ${i + 1}, Posisi ${j}: Bandingkan ${arr[j]} dan ${arr[j + 1]}. Apakah perlu ditukar?`, vars))

          if (arr[j] > arr[j + 1]) {
            let temp = arr[j]
            vars = { ...vars, temp }
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
            stepsArr.push(snapshot(arr, [], [j, j + 1], [], 7, `${arr[j + 1]} > ${arr[j]}: SWAP! Elemen ${arr[j + 1]} dan ${arr[j]} bertukar posisi ke array[${j}] dan array[${j + 1}].`, vars))
          } else {
            stepsArr.push(snapshot(arr, [], [], [], 5, `${arr[j]} ≤ ${arr[j + 1]}: Sudah urut, tidak perlu swap. Lanjut ke perbandingan berikutnya.`, vars))
          }
        }
        let currentSorted = []
        for (let k = 0; k <= i; k++) currentSorted.push(n - 1 - k)
        stepsArr.push(snapshot(arr, [], [], currentSorted, 3, `Pass ${i + 1} selesai! Elemen terbesar ${arr[n - 1 - i]} sudah 'menggelembung' ke posisi ${n - 1 - i}.`, vars))
      }
    } else if (algoType === 'selection') {
      for (let i = 0; i < n; i++) {
        let minIdx = i
        vars = { ...vars, i, minIdx }
        stepsArr.push(snapshot(arr, [i], [], [], 3, `Iterasi ${i + 1}: Cari elemen terkecil dari indeks ${i} hingga ${n - 1}.`, vars))

        for (let j = i + 1; j < n; j++) {
          vars = { ...vars, j }
          stepsArr.push(snapshot(arr, [minIdx, j], [], [], 6, `Bandingkan arr[${j}] = ${arr[j]} dengan minimum saat ini arr[${minIdx}] = ${arr[minIdx]}.`, vars))
          if (arr[j] < arr[minIdx]) {
            minIdx = j
            vars = { ...vars, minIdx }
            stepsArr.push(snapshot(arr, [minIdx], [], [], 7, `Update! ${arr[j]} lebih kecil. Minimum baru di indeks ${j} dengan nilai ${arr[j]}.`, vars))
          }
        }
        if (minIdx !== i) {
          let temp = arr[i]
          vars = { ...vars, temp }
          arr[i] = arr[minIdx]
          arr[minIdx] = temp
          stepsArr.push(snapshot(arr, [], [i, minIdx], [], 12, `Swap! Tukar nilai minimum ${arr[i]} (dari indeks ${minIdx}) dengan arr[${i}] = ${arr[minIdx]}.`, vars))
        } else {
          stepsArr.push(snapshot(arr, [], [], [], 10, `Tidak perlu swap. Elemen di indeks ${i} sudah merupakan minimum (${arr[i]}).`, vars))
        }

        let currentSorted = []
        for (let k = 0; k <= i; k++) currentSorted.push(k)
        stepsArr.push(snapshot(arr, [], [], currentSorted, 3, `Iterasi ${i + 1} selesai. Indeks 0-${i} sudah terurut.`, vars))
      }
    } else if (algoType === 'insertion') {
      let currentSorted = [0]
      stepsArr.push(snapshot(arr, [0], [], currentSorted, 3, `Elemen pertama arr[0] = ${arr[0]} sudah terurut secara trivial.`, vars))

      for (let i = 1; i < n; i++) {
        let key = arr[i]
        let j = i - 1
        vars = { ...vars, i, key, j }
        stepsArr.push(snapshot(arr, [i], [], currentSorted, 4, `Iterasi ${i}: Ambil key = ${key} dari indeks ${i}. Cari posisi yang tepat untuk disisipkan.`, vars))

        while (j >= 0 && arr[j] > key) {
          vars = { ...vars, j }
          stepsArr.push(snapshot(arr, [j, j + 1], [], currentSorted, 6, `arr[${j}] = ${arr[j]} > key (${key}). Geser ${arr[j]} ke kanan menjadi arr[${j + 1}].`, vars))
          arr[j + 1] = arr[j]
          stepsArr.push(snapshot(arr, [], [j, j + 1], currentSorted, 7, `Menggeser elemen ${arr[j + 1]} satu posisi ke kanan...`, vars))
          j = j - 1
        }
        arr[j + 1] = key
        currentSorted = []
        for (let k = 0; k <= i; k++) currentSorted.push(k)
        stepsArr.push(snapshot(arr, [j + 1], [], currentSorted, 10, `Sisipkan key = ${key} di posisi yang  tepat: indeks ${j + 1}. Bagian 0-${i} sekarang terurut.`, vars))
      }
    } else if (algoType === 'quick') {
      const partition = (arr, low, high) => {
        let pivot = arr[high]
        let i = low - 1
        vars = { ...vars, pivot, low, high, i }
        stepsArr.push(snapshot(arr, [high], [], [], 10, `Partisi range [${low}..${high}]: Pilih pivot = arr[${high}] = ${pivot}. Elemen akan diatur: < pivot di kiri, > pivot di kanan.`, vars))

        for (let j = low; j < high; j++) {
          vars = { ...vars, j }
          stepsArr.push(snapshot(arr, [j, high], [], [], 12, `Bandingkan arr[${j}] = ${arr[j]} dengan pivot (${pivot}).`, vars))
          if (arr[j] < pivot) {
            i++
            vars = { ...vars, i }
            let temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            vars = { ...vars, temp }
            stepsArr.push(snapshot(arr, [], [i, j], [], 15, `${arr[i]} < ${pivot}: Swap arr[${i}] dan arr[${j}]. Pindahkan elemen kecil ke partisi kiri.`, vars))
          } else {
            stepsArr.push(snapshot(arr, [j], [], [], 12, `${arr[j]} ≥ ${pivot}: Tidak swap. Biarkan di partisi kanan.`, vars))
          }
        }
        let temp = arr[i + 1]
        arr[i + 1] = arr[high]
        arr[high] = temp
        stepsArr.push(snapshot(arr, [], [i + 1, high], [], 18, `Partisi selesai! Tempatkan pivot ${arr[i + 1]} di posisi finalnya (indeks ${i + 1}). Pivot sekarang di tempat yang benar.`, vars))
        return i + 1
      }

      const quickSortRec = (arr, low, high) => {
        if (low < high) {
          stepsArr.push(snapshot(arr, [], [], [], 2, `QuickSort range [${low}..${high}] dengan ${high - low + 1} elemen.`, { ...vars, low, high }))
          let pi = partition(arr, low, high)
          quickSortRec(arr, low, pi - 1)
          quickSortRec(arr, pi + 1, high)
        }
      }
      quickSortRec(arr, 0, n - 1)
    } else if (algoType === 'merge') {
      const merge = (arr, left, mid, right) => {
        let L = arr.slice(left, mid + 1)
        let R = arr.slice(mid + 1, right + 1)
        let i = 0,
          j = 0,
          k = left

        vars = { ...vars, left, mid, right, i, j, k }
        stepsArr.push(
          snapshot(
            arr,
            Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
            [],
            [],
            10,
            `Merge dua subarray terurut: [${left}..${mid}] (${L.join(',')}) dan [${mid + 1}..${right}] (${R.join(',')}) menjadi satu array terurut.`,
            vars
          )
        )

        while (i < L.length && j < R.length) {
          vars = { ...vars, i, j, k }
          stepsArr.push(snapshot(arr, [k], [], [], 13, `Bandingkan L[${i}] = ${L[i]} dengan R[${j}] = ${R[j]}. Ambil yang lebih kecil untuk arr[${k}].`, vars))

          if (L[i] <= R[j]) {
            arr[k] = L[i]
            stepsArr.push(snapshot(arr, [], [k], [], 15, `${L[i]} ≤ ${R[j]}: Ambil ${L[i]} dari subarray kiri, simpan di arr[${k}].`, vars))
            i++
          } else {
            arr[k] = R[j]
            stepsArr.push(snapshot(arr, [], [k], [], 17, `${R[j]} < ${L[i]}: Ambil ${R[j]} dari subarray kanan, simpan di arr[${k}].`, vars))
            j++
          }
          k++
          vars = { ...vars, i, j, k }
        }

        while (i < L.length) {
          arr[k] = L[i]
          stepsArr.push(snapshot(arr, [], [k], [], 22, `Salin sisa elemen dari subarray kiri: ${L[i]} → arr[${k}].`, { ...vars, i, k }))
          i++
          k++
        }
        while (j < R.length) {
          arr[k] = R[j]
          stepsArr.push(snapshot(arr, [], [k], [], 25, `Salin sisa elemen dari subarray kanan: ${R[j]} → arr[${k}].`, { ...vars, j, k }))
          j++
          k++
        }
        stepsArr.push(snapshot(arr, [], [], [], 6, `Merge selesai untuk range [${left}..${right}]. Subarray ini sekarang terurut.`, vars))
      }

      const mergeSortRec = (arr, left, right) => {
        if (left < right) {
          let mid = Math.floor((left + right) / 2)
          vars = { ...vars, left, mid, right }
          stepsArr.push(
            snapshot(
              arr,
              Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
              [],
              [],
              2,
              `Divide: Bagi array [${left}..${right}] menjadi dua: [${left}..${mid}] dan [${mid + 1}..${right}]. Rekursi untuk masing-masing.`,
              vars
            )
          )

          mergeSortRec(arr, left, mid)
          mergeSortRec(arr, mid + 1, right)
          merge(arr, left, mid, right)
        }
      }
      mergeSortRec(arr, 0, n - 1)
    } else if (algoType === 'heap') {
      const heapify = (arr, n, i) => {
        let largest = i
        let left = 2 * i + 1
        let right = 2 * i + 2

        vars = { ...vars, n, i, largest, left, right }
        stepsArr.push(snapshot(arr, [i], [], [], 13, `Heapify node ${i} (nilai: ${arr[i]}). Cek apakah max heap property terpenuhi: parent ≥ children.`, vars))

        if (left < n && arr[left] > arr[largest]) {
          largest = left
          vars = { ...vars, largest }
          stepsArr.push(snapshot(arr, [i, left], [], [], 17, `Child kiri arr[${left}] = ${arr[left]} > parent arr[${i}] = ${arr[i]}. Update largest = ${left}.`, vars))
        }
        if (right < n && arr[right] > arr[largest]) {
          largest = right
          vars = { ...vars, largest }
          stepsArr.push(snapshot(arr, [i, right], [], [], 19, `Child kanan arr[${right}] = ${arr[right]} > current largest arr[${largest}]. Update largest = ${right}.`, vars))
        }

        if (largest !== i) {
          let temp = arr[i]
          arr[i] = arr[largest]
          arr[largest] = temp
          vars = { ...vars, temp }
          stepsArr.push(snapshot(arr, [], [i, largest], [], 21, `Heap property dilanggar! Swap arr[${i}] = ${arr[largest]} dengan arr[${largest}] = ${arr[i]} untuk restore max heap.`, vars))
          heapify(arr, n, largest)
        }
      }

      // Build heap
      stepsArr.push(snapshot(arr, [], [], [], -1, `Fase 1 (Build Heap): Bangun max heap dari array. Mulai dari node tidak-daun terakhir ke root.`, vars))
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        vars = { ...vars, i }
        stepsArr.push(snapshot(arr, [i], [], [], 4, `Build heap: Heapify subtree dengan root di index ${i}.`, vars))
        heapify(arr, n, i)
      }

      stepsArr.push(snapshot(arr, [], [], [], -1, `Max heap terbentuk! Elemen terbesar ${arr[0]} berada di root (indeks 0).`, vars))

      // Extract elements
      stepsArr.push(snapshot(arr, [], [], [], -1, `Fase 2 (Sorting): Ekstrak elemen terbesar dari heap satu per satu dan rebuild heap.`, vars))
      for (let i = n - 1; i > 0; i--) {
        vars = { ...vars, i }
        let temp = arr[0]
        arr[0] = arr[i]
        arr[i] = temp
        vars = { ...vars, temp }
        stepsArr.push(snapshot(arr, [], [0, i], [i], 7, `Ekstrak max (root) ${arr[i]}: Swap arr[0] dengan arr[${i}], lalu mark arr[${i}] sebagai terurut. Sisa heap: ${i} elemen.`, vars))
        heapify(arr, i, 0)
      }
    }

    let allIndices = []
    for (let i = 0; i < n; i++) allIndices.push(i)
    stepsArr.push(snapshot(arr, [], [], allIndices, -1, `Sorting selesai! Array sekarang terurut secara ascending: ${arr.join(', ')}`, vars))
    return stepsArr
  }

  // --- CONTROL LOGIC ---
  useEffect(() => {
    resetAndGenerate()
  }, [arraySize, algorithm])

  const resetAndGenerate = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setElapsedTime(0)
    const newArray = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 5)
    }
    const generatedSteps = generateSteps(newArray, algorithm)
    setSteps(generatedSteps)
  }

  // --- PLAYER CONTROLS ---
  useEffect(() => {
    if (isPlaying) {
      const baseTime = Date.now() - elapsedTime
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const newElapsed = now - baseTime
        setElapsedTime(newElapsed)

        // Sync step with time
        const targetStep = Math.floor(newElapsed / STEP_DELAY)
        if (targetStep >= steps.length - 1) {
          setCurrentStep(steps.length - 1)
          setIsPlaying(false)
        } else {
          setCurrentStep(targetStep)
        }
      }, 30) // Update timer every 30ms for smooth realtime effect
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps.length]) // Removed startTime dependency

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setElapsedTime(0)
  }
  const handlePrev = () => {
    setIsPlaying(false)
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      setElapsedTime(prev * STEP_DELAY)
    }
  }
  const handleNext = () => {
    setIsPlaying(false)
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      setElapsedTime(next * STEP_DELAY)
    }
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
    swapIndices: [],
    sortedIndices: [],
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
          className={`flex px-2 py-0.5 ${isActive ? 'bg-indigo-900/60 border-l-4 border-indigo-400' : 'border-l-4 border-transparent'}`}>
          <span className='w-8 text-slate-600 text-right mr-3 text-xs leading-5'>{index + 1}</span>
          <span className={`font-mono text-xs whitespace-pre ${isActive ? 'text-indigo-200 font-bold' : 'text-slate-300'}`}>{line}</span>
        </div>
      )
    })
  }

  const getStatusColor = () => {
    if (currentVisual.swapIndices.length > 0) return 'text-red-400'
    if (currentVisual.activeIndices.length > 0) return 'text-yellow-400'
    if (currentVisual.sortedIndices.length === currentVisual.array.length) return 'text-emerald-400'
    return 'text-slate-400'
  }

  const renderArrayVisualization = () => {
    return (
      <div className='relative flex-1 flex items-end justify-center gap-[2px] p-4 bg-slate-900/50'>
        {currentVisual.array.map((value, idx) => {
          let colorClass = 'bg-slate-500'
          if (currentVisual.sortedIndices.includes(idx)) colorClass = 'bg-emerald-500'
          else if (currentVisual.swapIndices.includes(idx)) colorClass = 'bg-red-500'
          else if (currentVisual.activeIndices.includes(idx)) colorClass = 'bg-yellow-400'

          return (
            <div
              key={idx}
              style={{ height: `${(value / 105) * 100}%`, width: `${100 / arraySize}%` }}
              className={`rounded-t ${colorClass} transition-colors duration-75`}></div>
          )
        })}
      </div>
    )
  }

  const VarBadge = ({ name, value }) => (
    <div className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
      <span className='text-[10px] text-indigo-300 font-mono font-bold uppercase'>{name}</span>
      <span className='text-sm text-white font-bold'>{value}</span>
      <span className='text-[8px] text-slate-400 text-center'>{getVarDesc(name)}</span>
    </div>
  )

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          {/* Title & Top Config */}
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20'>
                <BarChart3
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300 pb-2 mb-1'>Algo Sort</h1>
                <p className='text-xs text-slate-400'>Metode dalam mengurutkan data</p>
              </div>
            </div>
            <div className='flex gap-4 items-center bg-slate-800 p-2 rounded-xl border border-slate-700'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-indigo-500 outline-none'>
                <optgroup label='Simple Sorts'>
                  <option value='bubble'>Bubble Sort</option>
                  <option value='selection'>Selection Sort</option>
                  <option value='insertion'>Insertion Sort</option>
                </optgroup>
                <optgroup label='Efficient Sorts'>
                  <option value='quick'>Quick Sort</option>
                  <option value='merge'>Merge Sort</option>
                  <option value='heap'>Heap Sort</option>
                </optgroup>
              </select>

              {/* Data Slider */}
              <div className='flex flex-col gap-1 min-w-[100px]'>
                <div className='flex justify-between text-[10px] text-slate-400 font-bold uppercase'>
                  <span>Data</span>
                  <span className='text-indigo-400 font-mono'>{arraySize}</span>
                </div>
                <input
                  type='range'
                  min='5'
                  max='50'
                  step='1'
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className='w-24 h-2 bg-slate-700 rounded-lg accent-indigo-500 cursor-pointer'
                />
              </div>
              <button
                onClick={resetAndGenerate}
                className='p-2 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors'
                title='Acak Ulang'>
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* ALGORITHM DESCRIPTION */}
        <section className='w-full max-w-6xl mb-4'>
          <div className='bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 border border-indigo-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20 mt-1'>
                <Search
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-indigo-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kompleksitas:</span>
                    <span className='text-indigo-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
                  </div>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Use Case:</span>
                    <span className='text-slate-300 ml-2'>{algorithmDescriptions[algorithm].useCase}</span>
                  </div>
                </div>
                {algorithmDescriptions[algorithm].pseudocode && (
                  <div className='mt-3 bg-slate-950/50 rounded-lg p-3 border border-slate-700/50 font-mono text-xs text-slate-400 whitespace-pre overflow-x-auto'>
                    <div className='text-indigo-400 font-bold mb-1'>Pseudocode:</div>
                    {algorithmDescriptions[algorithm].pseudocode}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN VISUALIZATION */}
        <main className='w-full max-w-6xl flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* LEFT: VISUAL (2/3) */}
          <section className='lg:col-span-2 flex flex-col gap-4'>
            {/* Bar Chart */}
            <div className='flex flex-col bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-h-[300px]'>
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center'>
                <div className='flex items-center gap-2 text-indigo-100 text-sm font-semibold'>
                  <Hash
                    size={16}
                    className='text-indigo-400'
                  />{' '}
                  Visualisasi Grafik
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>{currentVisual.swapIndices.length > 0 ? 'SWAP' : currentVisual.activeIndices.length > 0 ? 'COMPARING' : currentVisual.sortedIndices.length === currentVisual.array.length ? 'SORTED' : 'PROCESSING'}</div>
              </div>
              {renderArrayVisualization()}
            </div>

            {/* Array Box */}
            <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl'>
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex items-center gap-2 text-indigo-100 text-sm font-semibold'>
                <Layers
                  size={16}
                  className='text-indigo-400'
                />{' '}
                Array Data
              </div>
              <div className='p-6 overflow-x-auto flex justify-center bg-[#151925]'>
                <div className='flex gap-1'>
                  {currentVisual.array.map((value, idx) => {
                    let borderColor = 'border-slate-600',
                      bgColor = 'bg-slate-800',
                      textColor = 'text-slate-300'
                    if (currentVisual.sortedIndices.includes(idx)) {
                      borderColor = 'border-emerald-500'
                      bgColor = 'bg-emerald-900/30'
                      textColor = 'text-emerald-400'
                    } else if (currentVisual.swapIndices.includes(idx)) {
                      borderColor = 'border-red-500'
                      bgColor = 'bg-red-900/30'
                      textColor = 'text-red-400'
                    } else if (currentVisual.activeIndices.includes(idx)) {
                      borderColor = 'border-yellow-400'
                      bgColor = 'bg-yellow-900/30'
                      textColor = 'text-yellow-400'
                    }

                    return (
                      <div
                        key={idx}
                        className='flex flex-col items-center gap-1 group'>
                        <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded font-mono font-bold text-sm md:text-base transition-all duration-75 ${borderColor} ${bgColor} ${textColor}`}>{value}</div>
                        <span className='text-[10px] text-slate-500 font-mono'>{idx}</span>
                      </div>
                    )
                  })}
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
                  onClick={() => {
                    setCurrentStep(0)
                    setElapsedTime(0)
                    setIsPlaying(false)
                  }}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg'
                  title='Awal'>
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className='p-2 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg disabled:opacity-30'
                  title='Step Back'>
                  <StepBack size={20} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
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
                  onClick={handleNext}
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
                  <span>Langkah</span>
                  <span>
                    {currentStep} / {steps.length - 1}
                  </span>
                </div>
                <div className='w-full bg-slate-700 h-1.5 rounded-full overflow-hidden'>
                  <div
                    className='bg-indigo-500 h-full transition-all duration-100'
                    style={{ width: `${(currentStep / (steps.length - 1 || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Variables */}
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-slate-800 text-slate-200 text-sm font-semibold'>
                <Variable
                  size={16}
                  className='text-indigo-400'
                />
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
                {Object.entries(currentVisual.variables).map(([key, val]) => (
                  <VarBadge
                    key={key}
                    name={key}
                    value={val}
                  />
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
                  className='text-indigo-400'
                />{' '}
                Kode Algoritma
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>

            {/* Explanation */}
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-indigo-900/20 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-indigo-400'
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

export default SortAlgorithm
