import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Code,
  Hash,
  Variable,
  Layers,
  MessageSquare,
  SkipForward,
  StepBack,
  StepForward,
  Activity,
} from "lucide-react";

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  bubble: `PROCEDURE BubbleSort(arr: List of Integer, n: Integer)
  DECLARE i, j, temp: Integer
  DECLARE swapped: Boolean

  FOR i FROM 0 TO n-2 DO
    swapped <- FALSE
    FOR j FROM 0 TO n-i-2 DO
      IF arr[j] > arr[j+1] THEN
        temp <- arr[j]
        arr[j] <- arr[j+1]
        arr[j+1] <- temp
        swapped <- TRUE
      END IF
    END FOR
    IF NOT swapped THEN BREAK END IF
  END FOR
END PROCEDURE`,

  selection: `PROCEDURE SelectionSort(arr: List of Integer, n: Integer)
  DECLARE i, j, minIdx, temp: Integer

  FOR i FROM 0 TO n-2 DO
    minIdx <- i
    FOR j FROM i+1 TO n-1 DO
      IF arr[j] < arr[minIdx] THEN
        minIdx <- j
      END IF
    END FOR
    
    IF minIdx != i THEN
      temp <- arr[i]
      arr[i] <- arr[minIdx]
      arr[minIdx] <- temp
    END IF
  END FOR
END PROCEDURE`,

  insertion: `PROCEDURE InsertionSort(arr: List of Integer, n: Integer)
  DECLARE i, j, key: Integer

  FOR i FROM 1 TO n-1 DO
    key <- arr[i]
    j <- i - 1
    
    WHILE j >= 0 AND arr[j] > key DO
      arr[j+1] <- arr[j]
      j <- j - 1
    END WHILE
    
    arr[j+1] <- key
  END FOR
END PROCEDURE`,

  quick: `PROCEDURE QuickSort(arr, low, high)
  IF low < high THEN
    pi <- Partition(arr, low, high)
    QuickSort(arr, low, pi - 1)
    QuickSort(arr, pi + 1, high)
  END IF
END PROCEDURE

FUNCTION Partition(arr, low, high)
  pivot <- arr[high]
  i <- low - 1
  FOR j FROM low TO high - 1 DO
    IF arr[j] < pivot THEN
      i <- i + 1
      Swap(arr[i], arr[j])
    END IF
  END FOR
  Swap(arr[i + 1], arr[high])
  RETURN i + 1
END FUNCTION`,

  merge: `PROCEDURE MergeSort(arr, left, right)
  IF left < right THEN
    mid <- (left + right) / 2
    MergeSort(arr, left, mid)
    MergeSort(arr, mid + 1, right)
    Merge(arr, left, mid, right)
  END IF
END PROCEDURE

PROCEDURE Merge(arr, left, mid, right)
  Copy data to temp L[], R[]
  i <- 0, j <- 0, k <- left
  WHILE i < n1 AND j < n2 DO
    IF L[i] <= R[j] THEN arr[k] <- L[i]
    ELSE arr[k] <- R[j]
    k++
  END WHILE
  Copy remaining elements
END PROCEDURE`,

  heap: `PROCEDURE HeapSort(arr, n)
  BuildMaxHeap(arr, n)
  FOR i FROM n-1 DOWNTO 1 DO
    Swap(arr[0], arr[i])
    Heapify(arr, i, 0)
  END FOR
END PROCEDURE

PROCEDURE Heapify(arr, n, i)
  largest <- i
  l <- 2*i + 1, r <- 2*i + 2
  IF l < n AND arr[l] > arr[largest] THEN largest <- l
  IF r < n AND arr[r] > arr[largest] THEN largest <- r
  IF largest != i THEN
    Swap(arr[i], arr[largest])
    Heapify(arr, n, largest)
  END IF
END PROCEDURE`,
};

const ALGO_INFO = {
  bubble: {
    title: "BUBBLE SORT",
    description:
      "Algoritma pengurutan sederhana yang berulang kali melangkah melalui daftar, membandingkan elemen yang berdekatan dan menukarnya jika urutannya salah.",
    complexity: "O(n²)",
  },
  selection: {
    title: "SELECTION SORT",
    description:
      "Algoritma pengurutan perbandingan in-place. Ini membagi daftar input menjadi dua bagian: sublist item yang sudah diurutkan dan sublist item yang belum diurutkan.",
    complexity: "O(n²)",
  },
  insertion: {
    title: "INSERTION SORT",
    description:
      "Algoritma pengurutan sederhana yang membangun array yang diurutkan akhir satu item pada satu waktu. Ini jauh kurang efisien pada daftar besar daripada algoritma yang lebih canggih.",
    complexity: "O(n²)",
  },
  quick: {
    title: "QUICK SORT",
    description:
      "Algoritma Divide and Conquer. Ini memilih elemen sebagai pivot dan mempartisi array yang diberikan di sekitar pivot yang dipilih.",
    complexity: "O(n log n)",
  },
  merge: {
    title: "MERGE SORT",
    description:
      "Algoritma Divide and Conquer yang efisien, berbasis perbandingan. Sebagian besar implementasi menghasilkan pengurutan yang stabil.",
    complexity: "O(n log n)",
  },
  heap: {
    title: "HEAP SORT",
    description:
      "Teknik pengurutan berbasis perbandingan berdasarkan struktur data Binary Heap. Mirip dengan selection sort di mana kita pertama-tama menemukan elemen maksimum.",
    complexity: "O(n log n)",
  },
};

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const BigOGraph = ({ algorithm, progress }) => {
  const type = ["bubble", "selection", "insertion"].includes(algorithm)
    ? "quadratic"
    : "log-linear";
  const label = ALGO_INFO[algorithm].complexity;

  const width = 280;
  const height = 120;
  const padding = 15;

  const points = [];
  const steps = 40;

  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    let y =
      type === "quadratic"
        ? x * x
        : x === 0
        ? 0
        : (x * Math.log2(x * 10 + 1)) / 3.5;
    if (y > 1) y = 1;

    const px = padding + x * (width - 2 * padding);
    const py = height - padding - y * (height - 2 * padding);
    points.push(`${px},${py}`);
  }

  // Current Dot
  const cx = progress; // 0..1
  let cy =
    type === "quadratic"
      ? cx * cx
      : cx === 0
      ? 0
      : (cx * Math.log2(cx * 10 + 1)) / 3.5;
  if (cy > 1) cy = 1;
  const dotX = padding + cx * (width - 2 * padding);
  const dotY = height - padding - cy * (height - 2 * padding);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase">
          <Activity size={14} /> Kompleksitas Waktu
        </div>
        <div className="px-2 py-0.5 bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded">
          {label}
        </div>
      </div>
      <div className="relative h-[120px] w-full border-l border-b border-slate-600">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx={dotX}
            cy={dotY}
            r="4"
            fill="white"
            stroke="#f97316"
            strokeWidth="2"
          />
          <circle
            cx={dotX}
            cy={dotY}
            r="8"
            fill="#f97316"
            opacity="0.3"
            className="animate-pulse"
          />
        </svg>
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
        <span>Start</span>
        <span>Operations vs N</span>
        <span>End</span>
      </div>
    </div>
  );
};

const CodeViewer = ({ code, activeLine }) => {
  const lines = code.split("\n");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current && activeLine > 0) {
      // Simple scroll into view logic
      const el = scrollRef.current.children[activeLine - 1];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-[#1e1e1e] rounded-lg border border-slate-700 overflow-hidden flex flex-col h-full shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-slate-700">
        <span className="text-xs text-slate-400 font-bold flex items-center gap-2">
          <Code size={14} /> PSEUDOCODE
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">
          IDN
        </span>
      </div>
      {/* Removed overflow-auto to allow container to stretch */}
      <div className="flex-1 p-4 font-mono text-sm leading-6" ref={scrollRef}>
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = activeLine === lineNum;

          // Basic Syntax Highlighting Logic
          const formattedLine = line
            .replace(
              /(PROCEDURE|FUNCTION|DECLARE|FOR|WHILE|IF|THEN|ELSE|END|RETURN|not|AND|OR|TO|DOWNTO|do|break)/gi,
              '<span class="text-purple-400 font-bold">$1</span>'
            )
            .replace(
              /(List of Integer|Integer|Boolean)/g,
              '<span class="text-yellow-300">$1</span>'
            )
            .replace(
              /(\/\/.*)/g,
              '<span class="text-slate-500 italic">$1</span>'
            )
            .replace(
              /(true|false)/gi,
              '<span class="text-red-400 font-bold">$1</span>'
            );

          return (
            <div
              key={idx}
              className={`flex ${
                isActive
                  ? "bg-slate-700/50 -mx-4 px-4 border-l-2 border-orange-500"
                  : ""
              }`}
            >
              <span className="w-8 text-slate-600 text-right mr-4 select-none shrink-0">
                {lineNum}
              </span>
              <span
                className={`whitespace-pre ${
                  isActive ? "text-orange-100" : "text-slate-300"
                }`}
                dangerouslySetInnerHTML={{ __html: formattedLine }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. MAIN LOGIC
// ==========================================

const SortAlgorithm = () => {
  const [arraySize, setArraySize] = useState(10); // Standard slider size
  const [algorithm, setAlgorithm] = useState("bubble");

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  // --- ALGORITHM GENERATORS (With Line Numbers) ---

  const snapshot = (arr, active, swap, sorted, line, desc) => ({
    array: [...arr],
    activeIndices: [...active],
    swapIndices: [...swap],
    sortedIndices: [...sorted],
    activeLine: line,
    description: desc,
  });

  const generateSteps = (initialArray, algo) => {
    let arr = [...initialArray];
    const n = arr.length;
    let s = [];

    // Initial State
    s.push(snapshot(arr, [], [], [], 1, "Mulai Algoritma"));

    if (algo === "bubble") {
      for (let i = 0; i < n - 1; i++) {
        s.push(snapshot(arr, [], [], [], 5, `Loop Luar i=${i}`));
        let swapped = false;
        s.push(snapshot(arr, [], [], [], 6, `swapped = FALSE`));

        for (let j = 0; j < n - i - 1; j++) {
          s.push(
            snapshot(
              arr,
              [j, j + 1],
              [],
              [],
              8,
              `Bandingkan arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]})`
            )
          );
          if (arr[j] > arr[j + 1]) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swapped = true;
            s.push(
              snapshot(
                arr,
                [],
                [j, j + 1],
                [],
                10,
                `Tukar posisi ${j} dan ${j + 1}`
              )
            );
            s.push(snapshot(arr, [], [], [], 12, `Set swapped = TRUE`));
          }
        }

        // Mark sorted at end of pass
        let sorted = [];
        for (let k = 0; k <= i; k++) sorted.push(n - 1 - k);

        s.push(snapshot(arr, [], [], sorted, 15, `Cek Swapped?`));
        if (!swapped) {
          s.push(snapshot(arr, [], [], sorted, 15, `Tidak ada swap, BREAK`));
          break;
        }
      }
    } else if (algo === "selection") {
      for (let i = 0; i < n - 1; i++) {
        s.push(snapshot(arr, [], [], [], 4, `Loop i=${i}`));
        let minIdx = i;
        s.push(snapshot(arr, [i], [], [], 5, `Set minIdx = ${i}`));

        for (let j = i + 1; j < n; j++) {
          s.push(
            snapshot(
              arr,
              [minIdx, j],
              [],
              [],
              7,
              `Cek arr[${j}] < arr[${minIdx}]?`
            )
          );
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            s.push(
              snapshot(
                arr,
                [minIdx],
                [],
                [],
                8,
                `Update minIdx = ${j} (${arr[j]})`
              )
            );
          }
        }

        if (minIdx !== i) {
          s.push(snapshot(arr, [], [], [], 12, `Tukar elemen`));
          let temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          s.push(
            snapshot(
              arr,
              [],
              [i, minIdx],
              [],
              13,
              `Swap arr[${i}] dan arr[${minIdx}]`
            )
          );
        }

        let sorted = Array.from({ length: i + 1 }, (_, k) => k);
        s.push(snapshot(arr, [], [], sorted, 16, `Iterasi selesai`));
      }
    } else if (algo === "insertion") {
      for (let i = 1; i < n; i++) {
        s.push(snapshot(arr, [], [], [], 4, `Loop i=${i}`));
        let key = arr[i];
        let j = i - 1;
        s.push(snapshot(arr, [i], [], [], 5, `Ambil Key = ${key}`));

        // Visualization hack: show comparison before shift
        if (j >= 0)
          s.push(snapshot(arr, [j, i], [], [], 8, `Cek arr[${j}] > key?`));

        while (j >= 0 && arr[j] > key) {
          arr[j + 1] = arr[j];
          s.push(
            snapshot(arr, [], [j, j + 1], [], 9, `Geser ${arr[j]} ke kanan`)
          );
          j = j - 1;
          if (j >= 0)
            s.push(snapshot(arr, [j], [], [], 8, `Cek arr[${j}] > key?`));
        }
        arr[j + 1] = key;
        s.push(
          snapshot(arr, [j + 1], [], [], 13, `Sisipkan key di indeks ${j + 1}`)
        );
      }
    } else if (algo === "quick") {
      // Quick Sort Implementation
      const partition = (low, high) => {
        const pivot = arr[high];
        s.push(
          snapshot(
            arr,
            [high],
            [],
            [],
            8,
            `Pilih pivot = arr[${high}] = ${pivot}`
          )
        );

        let i = low - 1;
        s.push(snapshot(arr, [], [], [], 9, `Set i = ${low - 1}`));

        for (let j = low; j < high; j++) {
          s.push(
            snapshot(
              arr,
              [j, high],
              [],
              [],
              11,
              `Bandingkan arr[${j}] (${arr[j]}) < pivot (${pivot})?`
            )
          );

          if (arr[j] < pivot) {
            i++;
            s.push(snapshot(arr, [i, j], [], [], 12, `i++, sekarang i = ${i}`));

            if (i !== j) {
              [arr[i], arr[j]] = [arr[j], arr[i]];
              s.push(
                snapshot(
                  arr,
                  [],
                  [i, j],
                  [],
                  13,
                  `Tukar arr[${i}] dengan arr[${j}]`
                )
              );
            }
          }
        }

        // Place pivot in correct position
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        s.push(
          snapshot(
            arr,
            [],
            [i + 1, high],
            [],
            16,
            `Tempatkan pivot di posisi ${i + 1}`
          )
        );

        return i + 1;
      };

      const quickSortHelper = (low, high) => {
        if (low < high) {
          s.push(snapshot(arr, [], [], [], 2, `QuickSort(${low}, ${high})`));

          const pi = partition(low, high);
          s.push(
            snapshot(
              arr,
              [pi],
              [],
              [pi],
              3,
              `Partition selesai, pivot di ${pi}`
            )
          );

          quickSortHelper(low, pi - 1);
          quickSortHelper(pi + 1, high);
        }
      };

      quickSortHelper(0, n - 1);
    } else if (algo === "merge") {
      // Merge Sort Implementation
      const merge = (left, mid, right) => {
        const n1 = mid - left + 1;
        const n2 = right - mid;

        const L = arr.slice(left, mid + 1);
        const R = arr.slice(mid + 1, right + 1);

        s.push(snapshot(arr, [], [], [], 10, `Bagi array: L[${n1}], R[${n2}]`));

        let i = 0,
          j = 0,
          k = left;
        s.push(
          snapshot(arr, [], [], [], 12, `Mulai merge dari indeks ${left}`)
        );

        while (i < n1 && j < n2) {
          const leftIdx = left + i;
          const rightIdx = mid + 1 + j;

          s.push(
            snapshot(
              arr,
              [leftIdx, rightIdx],
              [],
              [],
              13,
              `Bandingkan L[${i}]=${L[i]} dengan R[${j}]=${R[j]}`
            )
          );

          if (L[i] <= R[j]) {
            arr[k] = L[i];
            s.push(
              snapshot(arr, [k], [], [], 14, `arr[${k}] = L[${i}] = ${L[i]}`)
            );
            i++;
          } else {
            arr[k] = R[j];
            s.push(
              snapshot(arr, [k], [], [], 15, `arr[${k}] = R[${j}] = ${R[j]}`)
            );
            j++;
          }
          k++;
        }

        while (i < n1) {
          arr[k] = L[i];
          s.push(
            snapshot(arr, [k], [], [], 18, `Salin sisa L[${i}] = ${L[i]}`)
          );
          i++;
          k++;
        }

        while (j < n2) {
          arr[k] = R[j];
          s.push(
            snapshot(arr, [k], [], [], 18, `Salin sisa R[${j}] = ${R[j]}`)
          );
          j++;
          k++;
        }

        // Mark merged section as sorted
        const sorted = [];
        for (let idx = left; idx <= right; idx++) sorted.push(idx);
        s.push(
          snapshot(
            arr,
            [],
            [],
            sorted,
            18,
            `Merge selesai untuk rentang [${left}..${right}]`
          )
        );
      };

      const mergeSortHelper = (left, right) => {
        if (left < right) {
          const mid = Math.floor((left + right) / 2);
          s.push(snapshot(arr, [], [], [], 3, `Bagi array: mid = ${mid}`));

          mergeSortHelper(left, mid);
          mergeSortHelper(mid + 1, right);
          merge(left, mid, right);
        }
      };

      mergeSortHelper(0, n - 1);
    } else if (algo === "heap") {
      // Heap Sort Implementation
      const heapify = (size, i) => {
        let largest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;

        s.push(
          snapshot(
            arr,
            [i],
            [],
            [],
            9,
            `Heapify node ${i}, left=${l}, right=${r}`
          )
        );

        if (l < size && arr[l] > arr[largest]) {
          largest = l;
          s.push(
            snapshot(
              arr,
              [l, largest],
              [],
              [],
              12,
              `arr[${l}] > arr[${i}], largest = ${l}`
            )
          );
        }

        if (r < size && arr[r] > arr[largest]) {
          largest = r;
          s.push(
            snapshot(
              arr,
              [r, largest],
              [],
              [],
              13,
              `arr[${r}] > arr[${largest}], largest = ${r}`
            )
          );
        }

        if (largest !== i) {
          [arr[i], arr[largest]] = [arr[largest], arr[i]];
          s.push(
            snapshot(
              arr,
              [],
              [i, largest],
              [],
              15,
              `Tukar arr[${i}] dengan arr[${largest}]`
            )
          );
          heapify(size, largest);
        }
      };

      // Build max heap
      s.push(snapshot(arr, [], [], [], 2, "Membangun Max Heap"));
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }
      s.push(snapshot(arr, [], [], [], 2, "Max Heap selesai dibangun"));

      // Extract elements from heap
      for (let i = n - 1; i > 0; i--) {
        s.push(
          snapshot(arr, [0, i], [], [], 4, `Tukar root arr[0] dengan arr[${i}]`)
        );
        [arr[0], arr[i]] = [arr[i], arr[0]];
        s.push(
          snapshot(
            arr,
            [],
            [0, i],
            [i],
            4,
            `arr[${i}] = ${arr[i]} sudah di posisi akhir`
          )
        );

        heapify(i, 0);
      }
    } else {
      // Generic fallback
      arr.sort((a, b) => a - b);
      s.push(
        snapshot(
          arr,
          [],
          [],
          Array.from({ length: n }, (_, k) => k),
          1,
          "Algoritma belum diimplementasikan"
        )
      );
    }

    // Final
    s.push(
      snapshot(
        arr,
        [],
        [],
        Array.from({ length: n }, (_, k) => k),
        -1,
        "Pengurutan Selesai"
      )
    );
    return s;
  };

  // --- HELPERS ---
  const reset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    const newArr = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 90) + 10
    );
    const generated = generateSteps(newArr, algorithm);
    setSteps(generated);
  };

  useEffect(() => {
    reset();
  }, [arraySize, algorithm]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, 100);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, steps]);

  const currentVisual = steps[currentStep] || {
    array: [],
    activeIndices: [],
    swapIndices: [],
    sortedIndices: [],
    activeLine: 0,
    description: "Loading...",
  };
  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100);

  // ==========================================
  // 4. RENDER
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30">
      {/* HEADER */}
      <header className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              ALGOSORT<span className="text-orange-500">.ID</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Visualisasi Algoritma Sorting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800">
          <div className="relative">
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              {/* Keep UI functional for others even if basic logic */}
              <option value="quick">Quick Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="heap">Heap Sort</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <SkipForward size={14} className="rotate-90" />
            </div>
          </div>

          <div className="h-8 w-px bg-slate-700"></div>

          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
              <span>Data Size</span>
              <span className="text-orange-400">{arraySize}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="h-1.5 w-full bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      {/* TOP INFO CARD */}
      <div className="p-6 border-b border-slate-700 bg-[#151925]">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-2">
          {ALGO_INFO[algorithm].title}
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
          {ALGO_INFO[algorithm].description}
        </p>

        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Activity size={12} className="text-orange-400" />
            Time:{" "}
            <span className="text-slate-200">
              {ALGO_INFO[algorithm].complexity}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <Variable size={12} className="text-blue-400" />
            Space: <span className="text-slate-200">O(1)</span>
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* LEFT COLUMN: VISUALS (5/12) */}
        <div className="lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4">
          {/* 1. VISUAL BAR CHART (HERO) */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl min-h-[220px] flex flex-col relative shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Layers size={14} /> Visualisasi Grafik
              </h3>
              <div className="flex gap-2">
                {["SORTED", "SWAP", "COMPARE"].map((label, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      label === "SORTED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : label === "SWAP"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 flex items-end justify-center gap-[2px] pb-2">
              {currentVisual.array.map((val, idx) => {
                let color = "bg-slate-600";
                if (currentVisual.sortedIndices.includes(idx))
                  color =
                    "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]";
                else if (currentVisual.swapIndices.includes(idx))
                  color = "bg-red-500";
                else if (currentVisual.activeIndices.includes(idx))
                  color = "bg-yellow-400";

                return (
                  <div
                    key={idx}
                    className={`rounded-t transition-all duration-100 ${color}`}
                    style={{
                      height: `${(val / 100) * 100}%`,
                      width: `${100 / arraySize}%`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* 2. ARRAY STRUCTURE (BOXES) - RESTORED */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Hash size={14} /> Struktur Data Array
            </h3>
            <div className="flex justify-center flex-wrap gap-1">
              {currentVisual.array.map((val, idx) => (
                <div
                  key={idx}
                  className={`
                                w-8 h-8 flex items-center justify-center rounded text-xs font-mono font-bold border-2 transition-colors duration-150
                                ${
                                  currentVisual.sortedIndices.includes(idx)
                                    ? "border-emerald-500 bg-emerald-900/20 text-emerald-400"
                                    : currentVisual.swapIndices.includes(idx)
                                    ? "border-red-500 bg-red-900/20 text-red-400"
                                    : currentVisual.activeIndices.includes(idx)
                                    ? "border-yellow-400 bg-yellow-900/20 text-yellow-400"
                                    : "border-slate-700 bg-slate-800 text-slate-300"
                                }
                            `}
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          {/* 3. BIG O GRAPH */}
          <div className="shrink-0">
            <BigOGraph
              algorithm={algorithm}
              progress={currentStep / (steps.length || 1)}
            />
          </div>

          {/* 4. PLAYBACK CONTROLS */}
          <div className="mt-auto bg-slate-800/50 border border-slate-700/50 rounded-xl p-3">
            <div className="flex items-center justify-between gap-4 mb-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all"
              >
                <StepBack size={16} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold rounded-lg shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
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
                onClick={() =>
                  setCurrentStep(Math.min(steps.length - 1, currentStep + 1))
                }
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-all"
              >
                <StepForward size={16} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-slate-400">
              <span>Langkah {currentStep}</span>
              <span>{percentage}% Selesai</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INFO & PSEUDOCODE (7/12) */}
        <div className="lg:col-span-7 bg-[#1e1e1e] flex flex-col border-l border-slate-800">
          {/* PSEUDOCODE PANEL */}
          <div className="p-4 bg-[#252526]">
            <CodeViewer
              code={PSEUDOCODE[algorithm]}
              activeLine={currentVisual.activeLine}
            />
          </div>

          {/* CURRENT ACTION INDICATOR */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <div className="bg-slate-900 border border-orange-500/50 p-4 rounded-xl shadow-lg border-l-4 border-l-orange-500 flex items-start gap-4">
              <div className="p-2 bg-orange-900/30 rounded-lg shrink-0">
                <MessageSquare size={16} className="text-orange-400" />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-orange-400 uppercase mb-1">
                  Status Eksekusi
                </h4>
                <p className="text-sm font-medium text-white leading-tight">
                  {currentVisual.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SortAlgorithm;
