import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Compass, Code, Variable, MessageSquare, SkipBack, SkipForward, StepBack, StepForward, Square, Triangle, Circle } from 'lucide-react'

const GeometricAlgorithm = () => {
  // --- STATE ---
  const [speed, setSpeed] = useState(5)
  const [algorithm, setAlgorithm] = useState('convexhull')

  // Timeline Engine
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const algorithmDescriptions = {
    convexhull: {
      title: 'Convex Hull - Graham Scan',
      description: 'Temukan poligon cembung terkecil yang mencakup semua titik. Urutkan titik berdasarkan sudut polar dari pivot (titik terendah), lalu scan untuk membangun hull dengan memeriksa belokan (kiri/kanan). Hapus titik yang membuat cekung.',
      complexity: 'O(n log n) - sorting mendominasi',
      useCase: 'Deteksi tabrakan, pengenalan pola, pemrosesan citra, analisis geografis',
    },
    intersection: {
      title: 'Interseksi Segmen Garis',
      description: 'Tentukan apakah 2 segmen garis berpotongan. Gunakan tes orientasi (CCW/CW/Collinear) dan periksa apakah titik berada pada sisi yang berlawanan. Tangani kasus tepi: kolinear dan tumpang tindih.',
      complexity: 'O(1) - waktu konstan per pasangan',
      useCase: 'Deteksi tabrakan, grafika, sistem CAD, perutean peta',
    },
    closestpair: {
      title: 'Pasangan Titik Terdekat',
      description: 'Temukan 2 titik dengan jarak minimum. Divide-and-conquer: urutkan berdasarkan x, bagi, rekursi kiri/kanan, lalu periksa strip di tengah. Lebih efisien daripada brute force O(n²).',
      complexity: 'O(n log n)',
      useCase: 'Klastering, kontrol lalu lintas udara, struktur protein, basis data spasial',
    },
    pointinpoly: {
      title: 'Tes Titik dalam Poligon',
      description: 'Tentukan apakah titik P berada di dalam poligon. Ray casting: tarik sinar dari P ke tak hingga, hitung berapa kali sinar memotong tepi poligon. Jumlah ganjil = di dalam, genap = di luar.',
      complexity: 'O(n) - n = jumlah simpul poligon',
      useCase: 'Deteksi klik, sistem GIS, fisika game, aplikasi peta',
    },
  }

  const algoCode = {
    convexhull: `function convexHull(points) {
  // Find pivot (lowest y, then leftmost)
  let pivot = points.reduce((min, p) => 
    p.y < min.y || (p.y === min.y && p.x < min.x) ? p : min
  );
  
  // Sort by polar angle
  points.sort((a, b) => {
    let angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x);
    let angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x);
    return angleA - angleB;
  });
  
  let hull = [points[0], points[1]];
  
  for (let i = 2; i < points.length; i++) {
    while (hull.length >= 2 && 
           ccw(hull[hull.length-2], hull[hull.length-1], points[i]) <= 0) {
      hull.pop(); // Remove concave point
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
    return true; // Intersect
  }
  
  // Check collinear cases
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
  points.sort((a, b) => a.x - b.x);
  
  function closest(px, py, left, right) {
    if (right - left <= 3) {
      return bruteForce(px.slice(left, right + 1));
    }
    
    let mid = Math.floor((left + right) / 2);
    let midPoint = px[mid];
    
    let dl = closest(px, py, left, mid);
    let dr = closest(px, py, mid + 1, right);
    
    let d = Math.min(dl, dr);
    
    // Check strip
    let strip = py.filter(p => 
      Math.abs(p.x - midPoint.x) < d
    );
    
    return Math.min(d, stripClosest(strip, d));
  }
  
  return closest(points, points, 0, points.length - 1);
}`,
    pointinpoly: `function pointInPolygon(point, polygon) {
  let count = 0;
  let n = polygon.length;
  
  for (let i = 0; i < n; i++) {
    let p1 = polygon[i];
    let p2 = polygon[(i + 1) % n];
    
    // Ray casting: horizontal ray to right
    if ((p1.y > point.y) !== (p2.y > point.y)) {
      let xIntersect = (p2.x - p1.x) * 
                       (point.y - p1.y) / 
                       (p2.y - p1.y) + p1.x;
      
      if (point.x < xIntersect) {
        count++;
      }
    }
  }
  
  return count % 2 === 1; // Odd = inside
}`,
  }

  // --- ENGINE: SNAPSHOT ---
  const snapshot = (points, hull, active, status, desc, vars = {}, extra = {}) => ({
    points: points ? JSON.parse(JSON.stringify(points)) : [],
    hull: hull ? [...hull] : [],
    activeIndex: active,
    status: status,
    stepDescription: desc,
    variables: { ...vars },
    ...extra,
  })

  const generateSteps = (algoType) => {
    const stepsArr = []

    if (algoType === 'convexhull') {
      // Generate random points
      const points = []
      for (let i = 0; i < 10; i++) {
        points.push({
          x: 50 + Math.random() * 400,
          y: 50 + Math.random() * 250,
          id: i,
        })
      }

      stepsArr.push(snapshot(points, [], -1, 'start', `Convex Hull: ${points.length} titik. Temukan poligon cembung terkecil.`, { n: points.length }))

      // Find pivot (lowest y, leftmost x)
      let pivot = points[0]
      for (let p of points) {
        if (p.y > pivot.y || (p.y === pivot.y && p.x < pivot.x)) {
          pivot = p
        }
      }

      stepsArr.push(snapshot(points, [], points.indexOf(pivot), 'pivot', `Titik pivot: (${Math.floor(pivot.x)}, ${Math.floor(pivot.y)}) - titik terendah/paling kiri.`, { pivotX: Math.floor(pivot.x), pivotY: Math.floor(pivot.y) }, { pivot }))

      // Sort by polar angle
      const sorted = [...points]
      sorted.sort((a, b) => {
        const angleA = Math.atan2(a.y - pivot.y, a.x - pivot.x)
        const angleB = Math.atan2(b.y - pivot.y, b.x - pivot.x)
        return angleA - angleB
      })

      stepsArr.push(snapshot(sorted, [], -1, 'sorted', `Urutkan titik berdasarkan sudut polar dari pivot. Mulai dengan sudut terendah (paling kanan).`, {}, { pivot }))

      // Graham scan
      const hull = [sorted[0], sorted[1]]

      stepsArr.push(snapshot(sorted, hull, -1, 'init_hull', `Inisialisasi hull dengan 2 titik pertama.`, { hullSize: hull.length }, { pivot }))

      const ccw = (p1, p2, p3) => {
        return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x)
      }

      for (let i = 2; i < sorted.length; i++) {
        const current = sorted[i]

        stepsArr.push(snapshot(sorted, [...hull], i, 'checking', `Periksa titik ${i}: (${Math.floor(current.x)}, ${Math.floor(current.y)})`, { i, checking: i }, { pivot }))

        while (hull.length >= 2) {
          const turn = ccw(hull[hull.length - 2], hull[hull.length - 1], current)

          if (turn > 0) {
            // Left turn - convex, keep point
            stepsArr.push(snapshot(sorted, [...hull], i, 'left_turn', `✓ Belokan Kiri (CCW). Sudut cembung. Simpan ${hull[hull.length - 1].id}.`, { i, turn: 'left' }, { pivot }))
            break
          } else {
            // Right turn or collinear - concave, remove
            const removed = hull.pop()
            stepsArr.push(snapshot(sorted, [...hull], i, 'right_turn', `✗ Belokan Kanan (CW) atau kolinear. Hapus titik ${removed.id} (cekung).`, { i, turn: 'right', removed: removed.id }, { pivot }))
          }
        }

        hull.push(current)
        stepsArr.push(snapshot(sorted, [...hull], i, 'added', `Tambahkan titik ${i} ke hull. Ukuran hull = ${hull.length}`, { i, hullSize: hull.length }, { pivot }))
      }

      stepsArr.push(snapshot(sorted, [...hull], -1, 'complete', `✓ Convex Hull selesai! ${hull.length} simpul membentuk poligon cembung terkecil.`, { hullSize: hull.length }, { pivot }))
    } else if (algoType === 'intersection') {
      // Two line segments
      const seg1 = {
        p1: { x: 100, y: 100 },
        p2: { x: 300, y: 200 },
      }
      const seg2 = {
        p1: { x: 100, y: 200 },
        p2: { x: 300, y: 100 },
      }

      stepsArr.push(snapshot([], [], -1, 'start', `Periksa apakah dua segmen garis berpotongan.`, {}, { segments: [seg1, seg2] }))

      const direction = (p1, p2, p3) => {
        return (p3.x - p1.x) * (p2.y - p1.y) - (p2.x - p1.x) * (p3.y - p1.y)
      }

      const d1 = direction(seg2.p1, seg2.p2, seg1.p1)
      const d2 = direction(seg2.p1, seg2.p2, seg1.p2)
      const d3 = direction(seg1.p1, seg1.p2, seg2.p1)
      const d4 = direction(seg1.p1, seg1.p2, seg2.p2)

      stepsArr.push(snapshot([], [], -1, 'orientation', `Tes orientasi: d1=${d1.toFixed(1)}, d2=${d2.toFixed(1)}, d3=${d3.toFixed(1)}, d4=${d4.toFixed(1)}`, { d1: d1.toFixed(1), d2: d2.toFixed(1), d3: d3.toFixed(1), d4: d4.toFixed(1) }, { segments: [seg1, seg2] }))

      if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
        stepsArr.push(snapshot([], [], -1, 'intersect', `✓ Segmen BERPOTONGAN! Titik berada pada sisi yang berlawanan.`, { result: 'INTERSECT' }, { segments: [seg1, seg2], intersect: true }))
      } else {
        stepsArr.push(snapshot([], [], -1, 'no_intersect', `✗ Segmen TIDAK berpotongan.`, { result: 'NO INTERSECT' }, { segments: [seg1, seg2], intersect: false }))
      }
    } else if (algoType === 'closestpair') {
      const points = []
      for (let i = 0; i < 8; i++) {
        points.push({
          x: 80 + Math.random() * 340,
          y: 80 + Math.random() * 200,
          id: i,
        })
      }

      stepsArr.push(snapshot(points, [], -1, 'start', `Temukan pasangan titik terdekat di antara ${points.length} titik.`, { n: points.length }))

      // Brute force for visualization
      let minDist = Infinity
      let pair = [null, null]

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dist = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2))

          stepsArr.push(snapshot(points, [], -1, 'checking', `Periksa jarak antara titik ${i} dan ${j}: ${dist.toFixed(1)}`, { i, j, dist: dist.toFixed(1) }, { checkingPair: [i, j], currentMin: minDist.toFixed(1) }))

          if (dist < minDist) {
            minDist = dist
            pair = [i, j]

            stepsArr.push(snapshot(points, [], -1, 'new_min', `✓ Minimum baru! Jarak = ${dist.toFixed(1)}`, { minDist: dist.toFixed(1) }, { closestPair: [i, j] }))
          }
        }
      }

      stepsArr.push(snapshot(points, [], -1, 'complete', `✓ Pasangan terdekat: titik ${pair[0]} dan ${pair[1]} dengan jarak ${minDist.toFixed(1)}`, { pair: `${pair[0]},${pair[1]}`, dist: minDist.toFixed(1) }, { closestPair: pair }))
    } else if (algoType === 'pointinpoly') {
      const polygon = [
        { x: 150, y: 100 },
        { x: 300, y: 100 },
        { x: 350, y: 200 },
        { x: 250, y: 250 },
        { x: 150, y: 200 },
      ]

      const testPoint = { x: 220, y: 180 }

      stepsArr.push(snapshot([], [], -1, 'start', `Tes apakah titik (${testPoint.x}, ${testPoint.y}) berada di dalam poligon dengan ${polygon.length} simpul.`, {}, { polygon, testPoint }))

      let count = 0
      const n = polygon.length

      for (let i = 0; i < n; i++) {
        const p1 = polygon[i]
        const p2 = polygon[(i + 1) % n]

        stepsArr.push(snapshot([], [], i, 'edge', `Periksa tepi ${i}: (${Math.floor(p1.x)},${Math.floor(p1.y)}) → (${Math.floor(p2.x)},${Math.floor(p2.y)})`, { edge: i }, { polygon, testPoint, currentEdge: i }))

        if (p1.y > testPoint.y !== p2.y > testPoint.y) {
          const xIntersect = ((p2.x - p1.x) * (testPoint.y - p1.y)) / (p2.y - p1.y) + p1.x

          if (testPoint.x < xIntersect) {
            count++
            stepsArr.push(snapshot([], [], i, 'intersect', `✓ Sinar memotong tepi ${i} di x=${Math.floor(xIntersect)}. Jumlah = ${count}`, { edge: i, count, xIntersect: Math.floor(xIntersect) }, { polygon, testPoint, currentEdge: i }))
          } else {
            stepsArr.push(snapshot([], [], i, 'no_intersect', `✗ Sinar tidak memotong tepi ${i}.`, { edge: i, count }, { polygon, testPoint, currentEdge: i }))
          }
        }
      }

      const inside = count % 2 === 1
      stepsArr.push(snapshot([], [], -1, 'complete', `${inside ? '✓ DI DALAM' : '✗ DI LUAR'} poligon. Interseksi sinar: ${count} (${count % 2 === 1 ? 'ganjil' : 'genap'})`, { count, result: inside ? 'DI DALAM' : 'DI LUAR' }, { polygon, testPoint, inside }))
    }

    return stepsArr
  }

  // --- CONTROL ---
  useEffect(() => {
    resetAndGenerate()
  }, [algorithm])

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
    points: [],
    hull: [],
    activeIndex: -1,
    status: 'start',
    stepDescription: 'Memuat...',
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
    const width = 500
    const height = 350

    if (algorithm === 'convexhull') {
      const points = currentVisual.points || []
      const hull = currentVisual.hull || []
      const pivot = currentVisual.pivot

      return (
        <svg
          width={width}
          height={height}
          className='border-2 border-violet-700 bg-slate-950'>
          {/* Hull polygon */}
          {hull.length >= 3 && (
            <polygon
              points={hull.map((p) => `${p.x},${p.y}`).join(' ')}
              fill='rgba(139, 92, 246, 0.2)'
              stroke='#a78bfa'
              strokeWidth='2'
            />
          )}

          {/* Hull edges */}
          {hull.length >= 2 &&
            hull.map((p, i) => {
              const next = hull[(i + 1) % hull.length]
              return (
                <line
                  key={`hull-${i}`}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke='#a78bfa'
                  strokeWidth='2'
                />
              )
            })}

          {/* Points */}
          {points.map((p, i) => {
            const isHull = hull.some((h) => h.id === p.id)
            const isPivot = pivot && p.id === pivot.id
            const isActive = i === currentVisual.activeIndex

            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isActive ? 8 : 6}
                fill={isPivot ? '#fbbf24' : isActive ? '#facc15' : isHull ? '#a78bfa' : '#64748b'}
                stroke={isActive || isPivot ? '#fff' : 'none'}
                strokeWidth='2'
              />
            )
          })}
        </svg>
      )
    } else if (algorithm === 'intersection') {
      const segments = currentVisual.segments || []
      const intersect = currentVisual.intersect

      if (segments.length < 2) return null

      return (
        <svg
          width={width}
          height={height}
          className='border-2 border-violet-700 bg-slate-950'>
          {/* Segment 1 */}
          <line
            x1={segments[0].p1.x}
            y1={segments[0].p1.y}
            x2={segments[0].p2.x}
            y2={segments[0].p2.y}
            stroke='#a78bfa'
            strokeWidth='3'
          />
          {/* Segment 2 */}
          <line
            x1={segments[1].p1.x}
            y1={segments[1].p1.y}
            x2={segments[1].p2.x}
            y2={segments[1].p2.y}
            stroke='#c084fc'
            strokeWidth='3'
          />

          {/* Endpoints */}
          {segments.map((seg, i) => (
            <g key={i}>
              <circle
                cx={seg.p1.x}
                cy={seg.p1.y}
                r='6'
                fill='#fbbf24'
              />
              <circle
                cx={seg.p2.x}
                cy={seg.p2.y}
                r='6'
                fill='#fbbf24'
              />
            </g>
          ))}

          {/* Intersection indicator */}
          {intersect !== undefined && (
            <text
              x={250}
              y={30}
              fontSize='20'
              fill={intersect ? '#10b981' : '#ef4444'}
              textAnchor='middle'
              fontWeight='bold'>
              {intersect ? '✓ BERPOTONGAN' : '✗ TIDAK BERPOTONGAN'}
            </text>
          )}
        </svg>
      )
    } else if (algorithm === 'closestpair') {
      const points = currentVisual.points || []
      const closestPair = currentVisual.closestPair || []
      const checkingPair = currentVisual.checkingPair || []

      return (
        <svg
          width={width}
          height={height}
          className='border-2 border-violet-700 bg-slate-950'>
          {/* Line for closest pair */}
          {closestPair.length === 2 && (
            <line
              x1={points[closestPair[0]].x}
              y1={points[closestPair[0]].y}
              x2={points[closestPair[1]].x}
              y2={points[closestPair[1]].y}
              stroke='#10b981'
              strokeWidth='3'
              strokeDasharray='5,5'
            />
          )}

          {/* Line for currently checking pair */}
          {checkingPair.length === 2 && (
            <line
              x1={points[checkingPair[0]].x}
              y1={points[checkingPair[0]].y}
              x2={points[checkingPair[1]].x}
              y2={points[checkingPair[1]].y}
              stroke='#facc15'
              strokeWidth='2'
            />
          )}

          {/* Points */}
          {points.map((p, i) => {
            const isClosest = closestPair.includes(i)
            const isChecking = checkingPair.includes(i)

            return (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={isClosest ? 8 : isChecking ? 7 : 5}
                fill={isClosest ? '#10b981' : isChecking ? '#facc15' : '#a78bfa'}
                stroke={isClosest || isChecking ? '#fff' : 'none'}
                strokeWidth='2'
              />
            )
          })}
        </svg>
      )
    } else if (algorithm === 'pointinpoly') {
      const polygon = currentVisual.polygon || []
      const testPoint = currentVisual.testPoint
      const inside = currentVisual.inside
      const currentEdge = currentVisual.currentEdge

      return (
        <svg
          width={width}
          height={height}
          className='border-2 border-violet-700 bg-slate-950'>
          {/* Polygon */}
          {polygon.length >= 3 && (
            <polygon
              points={polygon.map((p) => `${p.x},${p.y}`).join(' ')}
              fill='rgba(139, 92, 246, 0.2)'
              stroke='#a78bfa'
              strokeWidth='2'
            />
          )}

          {/* Current edge highlighted */}
          {currentEdge !== undefined && polygon.length > 0 && (
            <line
              x1={polygon[currentEdge].x}
              y1={polygon[currentEdge].y}
              x2={polygon[(currentEdge + 1) % polygon.length].x}
              y2={polygon[(currentEdge + 1) % polygon.length].y}
              stroke='#facc15'
              strokeWidth='4'
            />
          )}

          {/* Ray from test point */}
          {testPoint && (
            <>
              <line
                x1={testPoint.x}
                y1={testPoint.y}
                x2={width}
                y2={testPoint.y}
                stroke='#fbbf24'
                strokeWidth='1'
                strokeDasharray='5,5'
              />
              <circle
                cx={testPoint.x}
                cy={testPoint.y}
                r='8'
                fill={inside === true ? '#10b981' : inside === false ? '#ef4444' : '#fbbf24'}
                stroke='#fff'
                strokeWidth='2'
              />
            </>
          )}

          {/* Polygon vertices */}
          {polygon.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r='4'
              fill='#a78bfa'
            />
          ))}
        </svg>
      )
    }

    return null
  }

  const getStatusColor = () => {
    const status = currentVisual.status
    if (status === 'complete' || status === 'intersect') return 'text-violet-400'
    if (status === 'pivot' || status === 'new_min') return 'text-yellow-400'
    if (status === 'left_turn' || status === 'added') return 'text-emerald-400'
    if (status === 'right_turn') return 'text-red-400'
    return 'text-slate-400'
  }

  return (
    <div className='h-full overflow-auto bg-slate-900'>
      <div className='min-h-full text-white font-sans p-4 flex flex-col items-center'>
        <header className='w-full max-w-6xl mb-6 flex flex-col gap-4 border-b border-slate-700 pb-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/20'>
                <Compass
                  size={24}
                  className='text-white'
                />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-300 pb-1'>Algoritma Geometri</h1>
                <p className='text-xs text-slate-400'>Geometri Komputasi & Analisis Spasial</p>
              </div>
            </div>
            <div className='flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center'>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className='bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-violet-500 outline-none'>
                <option value='convexhull'>Convex Hull</option>
                <option value='intersection'>Interseksi Garis</option>
                <option value='closestpair'>Pasangan Terdekat</option>
                <option value='pointinpoly'>Titik dalam Poligon</option>
              </select>
              <div className='flex items-center gap-2'>
                <span className='text-xs text-slate-400'>Kecepatan:</span>
                <input
                  type='range'
                  min='1'
                  max='10'
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className='w-20 h-2 bg-slate-700 rounded-lg accent-violet-500'
                />
                <span className='text-xs text-violet-300 w-6 text-center font-mono'>{speed}</span>
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
          <div className='bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-700/50 rounded-xl p-4 shadow-lg'>
            <div className='flex items-start gap-3'>
              <div className='p-2 bg-violet-600 rounded-lg shadow-lg shadow-violet-500/20 mt-1'>
                <Triangle
                  size={20}
                  className='text-white'
                />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold text-violet-200 mb-2'>{algorithmDescriptions[algorithm].title}</h3>
                <p className='text-sm text-slate-300 mb-2 leading-relaxed'>{algorithmDescriptions[algorithm].description}</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs'>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kompleksitas:</span>
                    <span className='text-violet-300 ml-2 font-mono'>{algorithmDescriptions[algorithm].complexity}</span>
                  </div>
                  <div className='bg-slate-800/60 rounded-lg p-2 border border-slate-700'>
                    <span className='text-slate-400 font-semibold'>Kegunaan:</span>
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
              <div className='bg-slate-800/80 p-3 border-b border-slate-700 flex justify-between items-center text-violet-100 text-sm font-mono'>
                <div className='flex items-center gap-2'>
                  <Circle
                    size={16}
                    className='text-violet-400'
                  />
                  2D Geometric Visualization
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>{currentVisual.status.toUpperCase().replace('_', ' ')}</div>
              </div>
              <div className='relative w-full p-6 bg-[#0f1117] flex items-center justify-center min-h-[350px]'>{renderVisualization()}</div>
            </div>

            {/* PLAYER CONTROLS */}
            <div className='w-full bg-slate-800/80 p-2 rounded-xl border border-slate-600 flex justify-center items-center gap-4 shadow-lg mt-4'>
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
                  title='Langkah Mundur'>
                  <StepBack size={20} />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-3 rounded-full shadow-lg transform transition-all active:scale-95 ${isPlaying ? 'bg-amber-500' : 'bg-violet-600'} text-white`}>
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
                  title='Langkah Maju'>
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
                  <span>Progres</span>
                  <span>
                    {currentStep} / {steps.length - 1}
                  </span>
                </div>
                <div className='w-full bg-slate-700 h-1.5 rounded-full overflow-hidden'>
                  <div
                    className='bg-violet-500 h-full transition-all duration-100'
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
                    className='text-violet-400'
                  />{' '}
                  Variables
                </div>
                <div className='p-3 grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/50'>
                  {Object.entries(currentVisual.variables).map(([key, val]) => (
                    <div
                      key={key}
                      className='flex flex-col bg-slate-700/50 rounded p-1.5 items-center border border-slate-600'>
                      <span className='text-[10px] text-violet-300 font-mono font-bold uppercase'>{key}</span>
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
                  className='text-violet-400'
                />{' '}
                Algorithm
              </div>
              <div className='flex-1 overflow-auto py-2 scrollbar-thin scrollbar-thumb-slate-700'>{renderCodeBlock(algoCode[algorithm])}</div>
            </div>
            <div className='bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden'>
              <div className='p-3 border-b border-slate-700 flex items-center gap-2 bg-violet-900/20 text-violet-100 text-sm font-semibold'>
                <MessageSquare
                  size={16}
                  className='text-violet-400'
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

export default GeometricAlgorithm
