import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Compass,
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
  Search,
} from "lucide-react";

/**
 * GeometricAlgorithm Component
 * Visualizes various computational geometry algorithms with step-by-step execution,
 * code highlighting, and variable tracking.
 */
const GeometricAlgorithm = () => {
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
    convexhull: {
      n: "Jumlah Titik",
      pivot: "Titik Pivot Interaksi",
      pivotX: "Pivot X",
      pivotY: "Pivot Y",
      hullSize: "Ukuran Hull",
      i: "Indeks Titik",
      turn: "Arah Belokan",
      removed: "Titik Dihapus",
    },
    intersection: {
      d1: "Arah P3-P4-P1",
      d2: "Arah P3-P4-P2",
      d3: "Arah P1-P2-P3",
      d4: "Arah P1-P2-P4",
      result: "Status Interseksi",
    },
    closestpair: {
      n: "Jumlah Titik",
      dist: "Jarak Saat Ini",
      minDist: "Jarak Minimum",
      pair: "Pasangan Terbaik",
      i: "Indeks A",
      j: "Indeks B",
    },
    pointinpoly: {
      count: "Jumlah Potongan",
      result: "Status Titik",
      edge: "Sisi Poligon",
      xIntersect: "Titik Potong X",
    },
  };

  /**
   * Algorithm details including title, description, complexity, use case, and pseudocode.
   */
  const algorithmDescriptions = {
    convexhull: {
      title: "Convex Hull - Graham Scan",
      description:
        "Temukan poligon cembung terkecil yang mencakup semua titik. Urutkan titik berdasarkan sudut polar dari pivot (titik terendah), lalu scan untuk membangun hull dengan memeriksa belokan (kiri/kanan). Hapus titik yang membuat cekung.",
      complexity: "Time: O(n log n)",
      useCase:
        "Deteksi tabrakan, pengenalan pola, pemrosesan citra, analisis geografis.",
      pseudocode: `function GrahamScan(points):
  pivot = findLowestY(points)
  sort points by polar angle with pivot
  hull = [points[0], points[1]]
  for i = 2 to n:
    while size(hull) >= 2 and orientation(next_to_top, top, points[i]) != CounterClockwise:
      pop(hull)
    push(hull, points[i])
  return hull`,
    },
    intersection: {
      title: "Interseksi Segmen Garis",
      description:
        "Tentukan apakah 2 segmen garis berpotongan. Gunakan tes orientasi (CCW/CW/Collinear) dan periksa apakah titik berada pada sisi yang berlawanan. Tangani kasus tepi: kolinear dan tumpang tindih.",
      complexity: "Time: O(1)",
      useCase: "Deteksi tabrakan, grafika, sistem CAD, perutean peta.",
      pseudocode: `function intersect(p1, q1, p2, q2):
  o1 = orientation(p1, q1, p2)
  o2 = orientation(p1, q1, q2)
  o3 = orientation(p2, q2, p1)
  o4 = orientation(p2, q2, q1)
  if (o1 != o2 and o3 != o4): return true
  if (o1=0 and onSegment(p1, p2, q1)): return true
  ... (handle other collinear cases)
  return false`,
    },
    closestpair: {
      title: "Pasangan Titik Terdekat",
      description:
        "Temukan 2 titik dengan jarak minimum. Visualisasi ini menggunakan pendekatan Brute Force untuk demonstrasi langkah demi langkah yang jelas. Untuk efisiensi tinggi, algoritma Divide and Conquer lebih disukai.",
      complexity: "Time: O(n²) [Brute Force Step]",
      useCase:
        "Klastering, kontrol lalu lintas udara, struktur protein, basis data spasial.",
      pseudocode: `minDist = infinity
pair = null
for i = 0 to n-1:
  for j = i+1 to n:
    dist = distance(points[i], points[j])
    if dist < minDist:
      minDist = dist
      pair = (points[i], points[j])
return pair`,
    },
    pointinpoly: {
      title: "Tes Titik dalam Poligon",
      description:
        "Tentukan apakah titik P berada di dalam poligon. Ray casting: tarik sinar dari P ke tak hingga, hitung berapa kali sinar memotong tepi poligon. Jumlah ganjil = di dalam, genap = di luar.",
      complexity: "Time: O(n)",
      useCase: "Deteksi klik, sistem GIS, fisika game, aplikasi peta.",
      pseudocode: `count = 0
for i = 0 to n-1:
  p1 = polygon[i]
  p2 = polygon[(i+1)%n]
  if (p1.y > P.y) != (p2.y > P.y):
    calculate x_intersect
    if P.x < x_intersect:
      count++
return (count % 2 == 1)`,
    },
  };

  /**
   * Code strings for each algorithm to be displayed and highlighted.
   */
  const algoCode = {
    convexhull: `function convexHull(points) {
  let pivot = points.reduce((min, p) => 
    p.y < min.y || (p.y === min.y && p.x < min.x) ? p : min
  );
  
  points.sort((a, b) => {
    let angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
    let angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
    return angleA - angleB;
  });
  
  let hull = [points[0], points[1]];
  
  for (let i = 2; i < points.length; i++) {
    while (hull.length >= 2 && 
           ccw(hull[hull.length-2], hull[hull.length-1], points[i]) <= 0) {
      hull.pop();
    }
    hull.push(points[i]);
  }
  
  return hull;
}`,
    intersection: `function segmentsIntersect(p1, p2, p3, p4) {
  let d1 = direction(p3, p4, p1);
  let d2 = direction(p3, p4, p2);
  let d3 = direction(p1, p2, p3);
  let d4 = direction(p1, p2, p4);
  
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }
  
  if (d1 === 0 && onSegment(p3, p1, p4)) return true;
  if (d2 === 0 && onSegment(p3, p2, p4)) return true;
  if (d3 === 0 && onSegment(p1, p3, p2)) return true;
  if (d4 === 0 && onSegment(p1, p4, p2)) return true;
  
  return false;
}

function direction(p1, p2, p3) {
  return (p3.x - p1.x) * (p2.y - p1.y) - 
         (p2.x - p1.x) * (p3.y - p1.y);
}`,
    closestpair: `function closestPair(points) {
  let minDist = Infinity;
  let pair = null;

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      let d = dist(points[i], points[j]);
      if (d < minDist) {
        minDist = d;
        pair = [points[i], points[j]];
      }
    }
  }
  return pair;
}`,
    pointinpoly: `function pointInPolygon(point, polygon) {
  let count = 0;
  let n = polygon.length;
  
  for (let i = 0; i < n; i++) {
    let p1 = polygon[i];
    let p2 = polygon[(i + 1) % n];
    
    if ((p1.y > point.y) !== (p2.y > point.y)) {
      let xIntersect = (p2.x - p1.x) * 
                       (point.y - p1.y) / 
                       (p2.y - p1.y) + p1.x;
      
      if (point.x < xIntersect) {
        count++;
      }
    }
  }
  
  return count % 2 === 1;
}`,
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  const [algorithm, setAlgorithm] = useState("convexhull");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // ==========================================
  // 3. LOGIC & HELPERS
  // ==========================================

  /**
   * Helper to retrieve the variable description based on the current algorithm.
   * @param {string} name - The variable name.
   * @returns {string} The description of the variable.
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
   * Generates a snapshot object representing the state at a specific step.
   */
  const snapshot = (
    points,
    hull,
    active,
    status,
    desc,
    vars = {},
    extra = {}
  ) => ({
    points: points ? JSON.parse(JSON.stringify(points)) : [],
    hull: hull ? [...hull] : [],
    activeIndex: active,
    status: status,
    stepDescription: desc,
    variables: { ...vars },
    ...extra,
  });

  /**
   * Generates the sequence of steps for the selected algorithm.
   * @param {string} algoType - The algorithm identifier.
   * @returns {Array} An array of snapshot objects.
   */
  const generateSteps = (algoType) => {
    const stepsArr = [];

    if (algoType === "convexhull") {
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push({
          x: 50 + Math.random() * 400,
          y: 50 + Math.random() * 250,
          id: i,
        });
      }

      stepsArr.push(
        snapshot(
          points,
          [],
          -1,
          "start",
          `Convex Hull: ${points.length} titik. Temukan poligon cembung terkecil.`,
          { n: points.length },
          { activeCodeLine: 1 }
        )
      );

      let pivot = points[0];
      for (let p of points) {
        if (p.y > pivot.y || (p.y === pivot.y && p.x < pivot.x)) {
          pivot = p;
        }
      }

      stepsArr.push(
        snapshot(
          points,
          [],
          points.indexOf(pivot),
          "pivot",
          `Titik pivot: (${Math.floor(pivot.x)}, ${Math.floor(
            pivot.y
          )}) - titik terendah/paling kiri.`,
          { pivotX: Math.floor(pivot.x), pivotY: Math.floor(pivot.y) },
          { pivot, activeCodeLine: 2 }
        )
      );

      const sorted = [...points];
      sorted.sort((a, b) => {
        const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
        const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
        return angleA - angleB;
      });

      stepsArr.push(
        snapshot(
          sorted,
          [],
          -1,
          "sorted",
          `Urutkan titik berdasarkan sudut polar dari pivot. Mulai dengan sudut terendah (paling kanan).`,
          {},
          { pivot, activeCodeLine: 6 }
        )
      );

      const hull = [sorted[0], sorted[1]];

      stepsArr.push(
        snapshot(
          sorted,
          hull,
          -1,
          "init_hull",
          `Inisialisasi hull dengan 2 titik pertama.`,
          { hullSize: hull.length },
          { pivot, activeCodeLine: 12 }
        )
      );

      const ccw = (p1, p2, p3) => {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
      };

      for (let i = 2; i < sorted.length; i++) {
        const current = sorted[i];

        stepsArr.push(
          snapshot(
            sorted,
            [...hull],
            i,
            "checking",
            `Periksa titik ${i}: (${Math.floor(current.x)}, ${Math.floor(
              current.y
            )})`,
            { i, checking: i },
            { pivot, activeCodeLine: 14 }
          )
        );

        while (hull.length >= 2) {
          const turn = ccw(
            hull[hull.length - 2],
            hull[hull.length - 1],
            current
          );

          if (turn > 0) {
            stepsArr.push(
              snapshot(
                sorted,
                [...hull],
                i,
                "left_turn",
                `✓ Belokan Kiri (CCW). Sudut cembung. Simpan ${
                  hull[hull.length - 1].id
                }.`,
                { i, turn: "left" },
                { pivot, activeCodeLine: 15 }
              )
            );
            break;
          } else {
            const removed = hull.pop();
            stepsArr.push(
              snapshot(
                sorted,
                [...hull],
                i,
                "right_turn",
                `✗ Belokan Kanan (CW) atau kolinear. Hapus titik ${removed.id} (cekung).`,
                { i, turn: "right", removed: removed.id },
                { pivot, activeCodeLine: 17 }
              )
            );
          }
        }

        hull.push(current);
        stepsArr.push(
          snapshot(
            sorted,
            [...hull],
            i,
            "added",
            `Tambahkan titik ${i} ke hull. Ukuran hull = ${hull.length}`,
            { i, hullSize: hull.length },
            { pivot, activeCodeLine: 19 }
          )
        );
      }

      stepsArr.push(
        snapshot(
          sorted,
          [...hull],
          -1,
          "complete",
          `✓ Convex Hull selesai! ${hull.length} simpul membentuk poligon cembung terkecil.`,
          { hullSize: hull.length },
          { pivot, activeCodeLine: 22 }
        )
      );
    } else if (algoType === "intersection") {
      const seg1 = {
        p1: { x: 100, y: 100 },
        p2: { x: 300, y: 200 },
      };
      const seg2 = {
        p1: { x: 100, y: 200 },
        p2: { x: 300, y: 100 },
      };

      stepsArr.push(
        snapshot(
          [],
          [],
          -1,
          "start",
          `Periksa apakah dua segmen garis berpotongan.`,
          {},
          { segments: [seg1, seg2], activeCodeLine: 1 }
        )
      );

      const direction = (p1, p2, p3) => {
        return (p3.x - p1.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p3.y - p1.y);
      };

      const d1 = direction(seg2.p1, seg2.p2, seg1.p1);
      const d2 = direction(seg2.p1, seg2.p2, seg1.p2);
      const d3 = direction(seg1.p1, seg1.p2, seg2.p1);
      const d4 = direction(seg1.p1, seg1.p2, seg2.p2);

      stepsArr.push(
        snapshot(
          [],
          [],
          -1,
          "orientation",
          `Tes orientasi: d1=${d1.toFixed(1)}, d2=${d2.toFixed(
            1
          )}, d3=${d3.toFixed(1)}, d4=${d4.toFixed(1)}`,
          {
            d1: d1.toFixed(1),
            d2: d2.toFixed(1),
            d3: d3.toFixed(1),
            d4: d4.toFixed(1),
          },
          { segments: [seg1, seg2], activeCodeLine: 2 }
        )
      );

      if (
        ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
        ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
      ) {
        stepsArr.push(
          snapshot(
            [],
            [],
            -1,
            "intersect",
            `✓ Segmen BERPOTONGAN! Titik berada pada sisi yang berlawanan.`,
            { result: "INTERSECT" },
            { segments: [seg1, seg2], intersect: true, activeCodeLine: 9 }
          )
        );
      } else {
        stepsArr.push(
          snapshot(
            [],
            [],
            -1,
            "no_intersect",
            `✗ Segmen TIDAK berpotongan.`,
            { result: "NO INTERSECT" },
            { segments: [seg1, seg2], intersect: false, activeCodeLine: 17 }
          )
        );
      }
    } else if (algoType === "closestpair") {
      const points = [];
      for (let i = 0; i < 8; i++) {
        points.push({
          x: 80 + Math.random() * 340,
          y: 80 + Math.random() * 200,
          id: i,
        });
      }

      stepsArr.push(
        snapshot(
          points,
          [],
          -1,
          "start",
          `Temukan pasangan titik terdekat di antara ${points.length} titik.`,
          { n: points.length },
          { activeCodeLine: 2 }
        )
      );

      let minDist = Infinity;
      let pair = [null, null];

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.sqrt(
            Math.pow(points[i].x - points[j].x, 2) +
              Math.pow(points[i].y - points[j].y, 2)
          );

          stepsArr.push(
            snapshot(
              points,
              [],
              -1,
              "checking",
              `Periksa jarak antara titik ${i} dan ${j}: ${dist.toFixed(1)}`,
              { i, j, dist: dist.toFixed(1) },
              {
                checkingPair: [i, j],
                currentMin: minDist.toFixed(1),
                activeCodeLine: 7,
              }
            )
          );

          if (dist < minDist) {
            minDist = dist;
            pair = [i, j];

            stepsArr.push(
              snapshot(
                points,
                [],
                -1,
                "new_min",
                `✓ Minimum baru! Jarak = ${dist.toFixed(1)}`,
                { minDist: dist.toFixed(1) },
                { closestPair: [i, j], activeCodeLine: 9 }
              )
            );
          }
        }
      }

      stepsArr.push(
        snapshot(
          points,
          [],
          -1,
          "complete",
          `✓ Pasangan terdekat: titik ${pair[0]} dan ${
            pair[1]
          } dengan jarak ${minDist.toFixed(1)}`,
          { pair: `${pair[0]},${pair[1]}`, dist: minDist.toFixed(1) },
          { closestPair: pair, activeCodeLine: 14 }
        )
      );
    } else if (algoType === "pointinpoly") {
      const polygon = [
        { x: 150, y: 100 },
        { x: 300, y: 100 },
        { x: 350, y: 200 },
        { x: 250, y: 250 },
        { x: 150, y: 200 },
      ];

      const testPoint = { x: 220, y: 180 };

      stepsArr.push(
        snapshot(
          [],
          [],
          -1,
          "start",
          `Tes apakah titik (${testPoint.x}, ${testPoint.y}) berada di dalam poligon dengan ${polygon.length} simpul.`,
          {},
          { polygon, testPoint, activeCodeLine: 2 }
        )
      );

      let count = 0;
      const n = polygon.length;

      for (let i = 0; i < n; i++) {
        const p1 = polygon[i];
        const p2 = polygon[(i + 1) % n];

        stepsArr.push(
          snapshot(
            [],
            [],
            i,
            "edge",
            `Periksa tepi ${i}: (${Math.floor(p1.x)},${Math.floor(
              p1.y
            )}) → (${Math.floor(p2.x)},${Math.floor(p2.y)})`,
            { edge: i },
            { polygon, testPoint, currentEdge: i, activeCodeLine: 5 }
          )
        );

        if (p1.y > testPoint.y !== p2.y > testPoint.y) {
          const xIntersect =
            ((p2.x - p1.x) * (testPoint.y - p1.y)) / (p2.y - p1.y) + p1.x;

          if (testPoint.x < xIntersect) {
            count++;
            stepsArr.push(
              snapshot(
                [],
                [],
                i,
                "intersect",
                `✓ Sinar memotong tepi ${i} di x=${Math.floor(
                  xIntersect
                )}. Jumlah = ${count}`,
                { edge: i, count, xIntersect: Math.floor(xIntersect) },
                { polygon, testPoint, currentEdge: i, activeCodeLine: 15 }
              )
            );
          } else {
            stepsArr.push(
              snapshot(
                [],
                [],
                i,
                "no_intersect",
                `✗ Sinar tidak memotong tepi ${i}.`,
                { edge: i, count },
                { polygon, testPoint, currentEdge: i, activeCodeLine: 9 }
              )
            );
          }
        }
      }

      // Fix: Define 'inside' variable based on odd count
      const inside = count % 2 !== 0;

      stepsArr.push(
        snapshot(
          [],
          [],
          -1,
          "complete",
          `${
            inside ? "✓ DI DALAM" : "✗ DI LUAR"
          } poligon. Interseksi sinar: ${count} (${
            count % 2 === 1 ? "ganjil" : "genap"
          })`,
          { count, result: inside ? "DI DALAM" : "DI LUAR" },
          { polygon, testPoint, inside, activeCodeLine: 20 }
        )
      );
    }

    return stepsArr;
  };

  // ==========================================
  // 4. EFFECTS & HANDLERS
  // ==========================================

  // Reset and regenerate steps when algorithm changes
  useEffect(() => {
    resetAndGenerate();
  }, [algorithm]);

  // Timer and playback logic
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

  const resetAndGenerate = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
    const generatedSteps = generateSteps(algorithm);
    setSteps(generatedSteps);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
    setSteps([]); // Clear steps to prevent race condition
    setCurrentStep(0);
  };

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
    points: [],
    hull: [],
    activeIndex: -1,
    status: "start",
    stepDescription: "Memuat...",
    variables: {},
    activeCodeLine: -1,
  };

  // ==========================================
  // 5. RENDER HELPER COMPONENTS
  // ==========================================

  /**
   * Returns the color class for the status text based on the current step status.
   */
  const getStatusColor = () => {
    const status = currentVisual.status;
    if (
      status === "complete" ||
      status === "intersect" ||
      status.includes("in")
    )
      return "text-amber-400";
    if (status === "pivot" || status === "new_min") return "text-yellow-400";
    if (status === "left_turn" || status === "added") return "text-cyan-400";
    if (status === "right_turn") return "text-red-400";
    return "text-slate-400";
  };

  /**
   * Renders the corresponding color status text.
   */
  const getStatusText = () => {
    return (currentVisual.status || "READY").toUpperCase().replace("_", " ");
  };

  /**
   * Renders the variable badge for variable tracking.
   */
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

  /**
   * Renders the algorithm code block with highlighting.
   */
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

  /**
   * Renders the geometric visualization (SVG) based on the current algorithm.
   */
  const VisualizationCanvas = () => {
    const width = 500;
    const height = 350;
    let content = null;

    if (algorithm === "convexhull") {
      const points = currentVisual.points || [];
      const hull = currentVisual.hull || [];
      const pivot = currentVisual.pivot;
      content = (
        <>
          {/* Hull polygon */}
          {hull.length >= 3 && (
            <polygon
              points={hull.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="rgba(234, 88, 12, 0.2)"
              stroke="#fb923c"
              strokeWidth="2"
            />
          )}
          {/* Hull edges */}
          {hull.length >= 2 &&
            hull.map((p, i) => {
              const next = hull[(i + 1) % hull.length];
              return (
                <line
                  key={`hull-${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#fb923c"
                  strokeWidth="2"
                />
              );
            })}
          {/* Points */}
          {points.map((p, i) => {
            const isHull = hull.some((h) => h.id === p.id);
            const isPivot = pivot && p.id === pivot.id;
            const isActive = i === currentVisual.activeIndex;
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isActive ? 8 : 6}
                fill={
                  isPivot
                    ? "#fbbf24"
                    : isActive
                    ? "#facc15"
                    : isHull
                    ? "#fb923c"
                    : "#64748b"
                }
                stroke={isActive || isPivot ? "#fff" : "none"}
                strokeWidth="2"
              />
            );
          })}
        </>
      );
    } else if (algorithm === "intersection") {
      const segments = currentVisual.segments || [];
      const intersect = currentVisual.intersect;
      if (segments.length >= 2) {
        content = (
          <>
            <line
              x1={segments[0].p1.x}
              y1={segments[0].p1.y}
              x2={segments[0].p2.x}
              y2={segments[0].p2.y}
              stroke="#fb923c"
              strokeWidth="3"
            />
            <line
              x1={segments[1].p1.x}
              y1={segments[1].p1.y}
              x2={segments[1].p2.x}
              y2={segments[1].p2.y}
              stroke="#fed7aa"
              strokeWidth="3"
            />
            {segments.map((seg, i) => (
              <g key={i}>
                <circle cx={seg.p1.x} cy={seg.p1.y} r="6" fill="#fbbf24" />
                <circle cx={seg.p2.x} cy={seg.p2.y} r="6" fill="#fbbf24" />
              </g>
            ))}
            {intersect !== undefined && (
              <text
                x={250}
                y={30}
                fontSize="20"
                fill={intersect ? "#10b981" : "#ef4444"}
                textAnchor="middle"
                fontWeight="bold"
              >
                {intersect ? "✓ BERPOTONGAN" : "✗ TIDAK BERPOTONGAN"}
              </text>
            )}
          </>
        );
      }
    } else if (algorithm === "closestpair") {
      const points = currentVisual.points || [];
      const closestPair = currentVisual.closestPair || [];
      const checkingPair = currentVisual.checkingPair || [];
      content = (
        <>
          {closestPair.length === 2 && (
            <line
              x1={points[closestPair[0]].x}
              y1={points[closestPair[0]].y}
              x2={points[closestPair[1]].x}
              y2={points[closestPair[1]].y}
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="5,5"
            />
          )}
          {checkingPair.length === 2 && (
            <line
              x1={points[checkingPair[0]].x}
              y1={points[checkingPair[0]].y}
              x2={points[checkingPair[1]].x}
              y2={points[checkingPair[1]].y}
              stroke="#facc15"
              strokeWidth="2"
            />
          )}
          {points.map((p, i) => {
            const isClosest = closestPair.includes(i);
            const isChecking = checkingPair.includes(i);
            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isClosest ? 8 : isChecking ? 7 : 5}
                fill={
                  isClosest ? "#10b981" : isChecking ? "#facc15" : "#fb923c"
                }
                stroke={isClosest || isChecking ? "#fff" : "none"}
                strokeWidth="2"
              />
            );
          })}
        </>
      );
    } else if (algorithm === "pointinpoly") {
      const polygon = currentVisual.polygon || [];
      const testPoint = currentVisual.testPoint;
      const inside = currentVisual.inside;
      const currentEdge = currentVisual.currentEdge;
      content = (
        <>
          {polygon.length >= 3 && (
            <polygon
              points={polygon.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="rgba(234, 88, 12, 0.2)"
              stroke="#fb923c"
              strokeWidth="2"
            />
          )}
          {currentEdge !== undefined && polygon.length > 0 && (
            <line
              x1={polygon[currentEdge].x}
              y1={polygon[currentEdge].y}
              x2={polygon[(currentEdge + 1) % polygon.length].x}
              y2={polygon[(currentEdge + 1) % polygon.length].y}
              stroke="#facc15"
              strokeWidth="4"
            />
          )}
          {testPoint && (
            <>
              <line
                x1={testPoint.x}
                y1={testPoint.y}
                x2={width}
                y2={testPoint.y}
                stroke="#fbbf24"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <circle
                cx={testPoint.x}
                cy={testPoint.y}
                r="8"
                fill={
                  inside === true
                    ? "#10b981"
                    : inside === false
                    ? "#ef4444"
                    : "#fbbf24"
                }
                stroke="#fff"
                strokeWidth="2"
              />
            </>
          )}
          {polygon.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fb923c" />
          ))}
        </>
      );
    }

    return (
      <svg
        width={width}
        height={height}
        className="border-2 border-orange-700 bg-slate-950"
      >
        {content}
      </svg>
    );
  };

  /**
   * Renders the execution log history (stack/list).
   * Shows descriptions of execution steps up to the current step.
   * Auto-scrolls to the bottom.
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
                <Compass size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo Geometri
                </h1>
                <p className="text-xs text-slate-400">
                  Geometri Komputasi & Analisis Spasial
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={handleAlgorithmChange}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <option value="convexhull">Convex Hull</option>
                <option value="intersection">Interseksi Garis</option>
                <option value="closestpair">Pasangan Terdekat</option>
                <option value="pointinpoly">Titik dalam Poligon</option>
              </select>

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
          <div className="bg-gradient-to-r from-orange-900/30 to-orange-900/30 border border-orange-700/50 rounded-xl p-4 shadow-lg">
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
                  Visualisasi 2D Geometri
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[400px] overflow-auto">
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

export default GeometricAlgorithm;
