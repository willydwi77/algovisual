import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Code, Compass, MessageSquare, SkipForward, StepBack, StepForward, Activity, RefreshCw, MousePointer } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  grahamScan: `FUNCTION GrahamScan(points: List<Point>)
  p0 <- point with lowest Y (and lowest X)
  Sort remaining points by polar angle with p0
  
  stack <- empty stack
  stack.push(p0)
  stack.push(points[1])
  stack.push(points[2])
  
  FOR i FROM 3 TO points.length - 1 DO
    WHILE stack.size >= 2 AND 
      Orientation(NextToTop(stack), Top(stack), points[i]) != CounterClockwise DO
      stack.pop()
    END WHILE
    stack.push(points[i])
  END FOR
  
  RETURN stack
END FUNCTION`,

  jarvisMarch: `FUNCTION JarvisMarch(points: List<Point>)
  hull <- empty list
  l <- leftmost point in points
  p <- l
  
  DO
    hull.add(p)
    q <- points[0]
    
    FOR EACH r IN points DO
      IF r != p AND Orientation(p, q, r) == CounterClockwise THEN
        q <- r
      END IF
    END FOR
    
    p <- q
  WHILE p != l
  
  RETURN hull
END FUNCTION`,

  bentleyOttmann: `FUNCTION BentleyOttmann(segments: List<Segment>)
  eventQueue <- sorted x-coordinates of endpoints
  sweepLine <- sorted active segments by y
  intersections <- empty list
  
  WHILE eventQueue is not empty DO
    p <- eventQueue.pop()
    handleEvent(p, sweepLine, intersections)
  END WHILE
  
  RETURN intersections
END FUNCTION`,

  closestPair: `FUNCTION ClosestPair(points: List<Point>)
  Sort points by X
  RETURN RecClosestPair(points)
  
  FUNCTION RecClosestPair(Px)
    IF |Px| <= 3 THEN 
      RETURN BruteForce(Px)
    
    mid <- |Px| / 2
    dL <- RecClosestPair(Px[0...mid])
    dR <- RecClosestPair(Px[mid...end])
    d <- min(dL, dR)
    
    strip <- points within d of mid line
    Sort strip by Y
    check strip for closer pairs
    
    RETURN min(d, stripMin)
END FUNCTION`,

  fortunesAlgorithm: `FUNCTION FortunesAlgorithm(sites: List<Point>)
  eventQueue <- sites sorted by Y
  beachLine <- BST of parabolic arcs
  
  WHILE eventQueue is not empty DO
    event <- eventQueue.pop()
    IF event is SiteEvent THEN
      InsertArc(beachLine, event)
    ELSE (CircleEvent) THEN
      RemoveArc(beachLine, event)
      AddEdge(VoronoiDiagram)
    END IF
  END WHILE
  
  RETURN VoronoiDiagram
END FUNCTION`,

  earClipping: `FUNCTION EarClipping(polygon: List<Point>)
  triangles <- empty list
  vertices <- copy of polygon
  
  WHILE vertices.length > 3 DO
    FOR EACH vertex i IN vertices DO
      IF IsEar(i, vertices) THEN
        triangles.add(Triangle(prev(i), i, next(i)))
        vertices.remove(i)
        BREAK // Restart search
      END IF
    END FOR
  END WHILE
  
  triangles.add(Triangle(vertices))
  RETURN triangles
END FUNCTION`,
}

const ALGO_CPLUSPLUS = {
  grahamScan: `struct Point { int x, y; };

int cross_product(Point a, Point b, Point c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

vector<Point> graham_scan(vector<Point>& points) {
    int n = points.size();
    if (n < 3) return {};

    swap(points[0], *min_element(points.begin(), points.end(), 
        [](Point a, Point b) { return make_pair(a.y, a.x) < make_pair(b.y, b.x); }));

    Point p0 = points[0];
    sort(points.begin() + 1, points.end(), [p0](Point a, Point b) {
        return cross_product(p0, a, b) > 0;
    });

    vector<Point> hull;
    hull.push_back(points[0]);
    hull.push_back(points[1]);
    hull.push_back(points[2]);

    for (int i = 3; i < n; i++) {
        while (hull.size() >= 2 && 
               cross_product(hull[hull.size()-2], hull.back(), points[i]) <= 0) {
            hull.pop_back();
        }
        hull.push_back(points[i]);
    }
    return hull;
}`,

  jarvisMarch: `struct Point { int x, y; };

int cross_product(Point a, Point b, Point c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

vector<Point> jarvis_march(vector<Point>& points) {
    int n = points.size();
    if (n < 3) return {};

    vector<Point> hull;
    int l = 0;
    for (int i = 1; i < n; i++)
        if (points[i].x < points[l].x) l = i;

    int p = l, q;
    do {
        hull.push_back(points[p]);
        q = (p + 1) % n;
        for (int i = 0; i < n; i++) {
            if (cross_product(points[p], points[i], points[q]) > 0)
                q = i;
        }
        p = q;
    } while (p != l);

    return hull;
}`,

  bentleyOttmann: `// Simplified Structure
struct Segment { Point p1, p2; };
struct Event { int x, type, segIdx; };

// Note: Full implementation usually requires a BST (e.g. set in C++)
// for the sweep line status and a priority queue for events.

vector<Point> bentley_ottmann(vector<Segment>& segments) {
    priority_queue<Event> pq; 
    // Initialize PQ with endpoints
    
    set<Segment> sweepLine;
    vector<Point> intersections;

    while (!pq.empty()) {
        Event e = pq.top(); pq.pop();
        if (e.type == LEFT) {
            sweepLine.insert(segments[e.segIdx]);
            // Check intersection with neighbors in sweepLine
        } else if (e.type == RIGHT) {
            sweepLine.erase(segments[e.segIdx]);
            // Check intersection of new neighbors
        } else {
            // Intersection event
            intersections.push_back({e.x, e.y});
        }
    }
    return intersections;
}`,

  closestPair: `double dist(Point p1, Point p2) {
    return sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
}

double bruteForce(vector<Point>& P, int n) {
    double min_dist = FLT_MAX;
    for (int i = 0; i < n; ++i)
        for (int j = i + 1; j < n; ++j)
            min_dist = min(min_dist, dist(P[i], P[j]));
    return min_dist;
}

double stripClosest(vector<Point>& strip, double d) {
    double min_dist = d;
    sort(strip.begin(), strip.end(), compareY);
    
    for (int i = 0; i < strip.size(); ++i)
        for (int j = i + 1; j < strip.size() && (strip[j].y - strip[i].y) < min_dist; ++j)
            min_dist = min(min_dist, dist(strip[i], strip[j]));
            
    return min_dist;
}

double closestUtil(vector<Point>& P, int n) {
    if (n <= 3) return bruteForce(P, n);

    int mid = n / 2;
    Point midPoint = P[mid];

    double dl = closestUtil(P, mid);
    double dr = closestUtil(P + mid, n - mid);
    double d = min(dl, dr);

    vector<Point> strip;
    for (int i = 0; i < n; i++)
        if (abs(P[i].x - midPoint.x) < d)
            strip.push_back(P[i]);

    return min(d, stripClosest(strip, d));
}`,

  fortunesAlgorithm: `// Conceptual Implementation
// Fortune's Algorithm uses a beach line (parabolic arcs)
// and an event queue (site events and circle events).

VoronoiDiagram fortunes_algo(vector<Point>& sites) {
    priority_queue<Event> pq;
    // Add all site events to pq
    
    BeachLine bl;
    VoronoiDiagram vd;
    
    while (!pq.empty()) {
        Event e = pq.top(); pq.pop();
        
        if (e.type == SITE_EVENT) {
            handleSiteEvent(e, bl);
        } else {
            handleCircleEvent(e, bl, vd);
        }
    }
    
    // Finish edges
    return vd;
}`,

  earClipping: `bool isEar(vector<Point>& poly, int u, int v, int w) {
    // Check if triangle uvw contains any other point
    // and is convex
    // ...
}

vector<Triangle> earClipping(vector<Point>& polygon) {
    vector<Triangle> triangles;
    vector<int> indexList; // remaining vertices
    
    while (indexList.size() > 3) {
        for (int i = 0; i < indexList.size(); i++) {
            int u = indexList[(i - 1 + n) % n];
            int v = indexList[i];
            int w = indexList[(i + 1) % n];
            
            if (isEar(polygon, u, v, w)) {
                triangles.push_back({u, v, w});
                indexList.erase(indexList.begin() + i);
                break;
            }
        }
    }
    triangles.push_back({indexList[0], indexList[1], indexList[2]});
    return triangles;
}`,
}

const ALGO_INFO = {
  grahamScan: {
    title: 'GRAHAM SCAN',
    description: 'Algoritma untuk mencari Convex Hull (selubung cembung) dengan mengurutkan titik berdasarkan sudut polar dan menggunakan stack.',
    complexity: 'O(n log n)',
    useCase: 'Computer graphics, shape analysis, GIS (Geographic Information Systems)',
  },
  jarvisMarch: {
    title: 'JARVIS MARCH (GIFT WRAPPING)',
    description: 'Algoritma Convex Hull yang intuitif, membungkus titik-titik seperti pita kado. Bersifat output-sensitive.',
    complexity: 'O(nh) (n = total titik, h = titik pada hull)',
    useCase: 'Robotics navigation, boundary detection pada dataset kecil',
  },
  bentleyOttmann: {
    title: 'BENTLEY-OTTMANN (SWEEP LINE)',
    description: 'Mendeteksi semua titik perpotongan antar sekumpulan segmen garis menggunakan garis vertikal imajiner (sweep line) yang bergerak melintasi bidang.',
    complexity: 'O((n + k) log n) (k = jumlah perpotongan)',
    useCase: 'Map overlay, desain sirkuit (VLSI), collision detection',
  },
  closestPair: {
    title: 'CLOSEST PAIR OF POINTS',
    description: 'Mencari sepasang titik dengan jarak terpendek dalam bidang 2D menggunakan pendekatan Divide and Conquer.',
    complexity: 'O(n log n)',
    useCase: 'Air traffic control, clustering analysis, sistem radar',
  },
  fortunesAlgorithm: {
    title: "FORTUNE'S ALGORITHM",
    description: 'Algoritma berbasis sweep line untuk menghasilkan Diagram Voronoi (partisi bidang berdasarkan jarak terdekat ke titik benih).',
    complexity: 'O(n log n)',
    useCase: 'Perencanaan tata kota (zonasi), nearest neighbor search, pathfinding game AI',
  },
  earClipping: {
    title: 'EAR CLIPPING TRIANGULATION',
    description: 'Metode untuk membagi poligon sederhana menjadi sekumpulan segitiga dengan memotong "telinga" (sudut cembung) secara berulang.',
    complexity: 'O(n^2) (implementasi naif), O(n) (teroptimasi)',
    useCase: 'Rendering grafis 3D (mesh generation), pemrosesan geometri',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const GeoCanvas = ({ points, lines = [], highlightPoints = [], sweepLineX = null, activeRegion = null, width = 600, height = 400 }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1 // Support High DPI
    const rect = canvas.getBoundingClientRect()

    // Explicitly check if width/height changed or need setup
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Draw Grid (Subtle)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= w; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, h)
      ctx.stroke()
    }
    for (let i = 0; i <= h; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(w, i)
      ctx.stroke()
    }

    // Draw Lines (Hull, Edges, etc)
    if (lines) {
      lines.forEach((line) => {
        ctx.beginPath()
        ctx.moveTo(line.p1.x, line.p1.y)
        ctx.lineTo(line.p2.x, line.p2.y)
        ctx.strokeStyle = line.color || '#10b981' // emerald-500
        ctx.lineWidth = line.width || 2
        ctx.stroke()
      })
    }

    // Draw Sweep Line
    if (sweepLineX !== null) {
      ctx.beginPath()
      ctx.moveTo(sweepLineX, 0)
      ctx.lineTo(sweepLineX, h)
      ctx.strokeStyle = '#f59e0b' // amber-500
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw Points
    points.forEach((p, idx) => {
      const isHighlighted = highlightPoints.includes(idx)

      ctx.beginPath()
      ctx.arc(p.x, p.y, isHighlighted ? 6 : 4, 0, 2 * Math.PI)

      if (isHighlighted) {
        ctx.fillStyle = '#f59e0b' // amber-500
        ctx.shadowBlur = 10
        ctx.shadowColor = '#f59e0b'
      } else {
        ctx.fillStyle = '#3b82f6' // blue-500
        ctx.shadowBlur = 0
      }

      ctx.fill()
      ctx.strokeStyle = '#1e293b' // slate-800
      ctx.lineWidth = 1
      ctx.stroke()

      // Reset Shadow
      ctx.shadowBlur = 0
    })
  }, [points, lines, highlightPoints, sweepLineX, activeRegion]) // Removed width/height from dependency to rely on CSS size

  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-xl relative w-full h-[400px]'>
      <canvas
        ref={canvasRef}
        className='block w-full h-full'
      />
      <div className='absolute top-2 right-2 flex gap-2'>
        <span className='text-[10px] bg-slate-800/80 text-slate-400 px-2 py-1 rounded border border-slate-700'>Canvas</span>
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
    const tokens = text.split(/(\s+|[(){}\[\];,&<>*=+\-!|])/)

    return tokens.map((token, idx) => {
      if (!token || /^\s+$/.test(token)) return <span key={idx}>{token}</span>

      const keywords = ['void', 'int', 'bool', 'char', 'float', 'double', 'long', 'struct', 'class', 'const', 'return', 'if', 'else', 'while', 'for', 'do', 'switch', 'case', 'break', 'continue', 'true', 'false', 'new', 'delete', 'min', 'max', 'sqrt', 'pow', 'vector', 'pair', 'make_pair', 'sort', 'push_back', 'pop_back', 'insert', 'erase', 'begin', 'end']

      if (keywords.includes(token))
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
            {token}
          </span>
        )
      if (/^\d+$/.test(token))
        return (
          <span
            key={idx}
            className='text-green-400'>
            {token}
          </span>
        )
      if (/^[(){}\[\];,&<>*=+\-!|]+$/.test(token))
        return (
          <span
            key={idx}
            className='text-yellow-400'>
            {token}
          </span>
        )
      if (idx + 1 < tokens.length && tokens[idx + 1] === '(')
        return (
          <span
            key={idx}
            className='text-blue-300'>
            {token}
          </span>
        )

      return <span key={idx}>{token}</span>
    })
  }

  useEffect(() => {
    if (scrollRef.current && activeLine > 0) {
      const container = scrollRef.current
      const el = scrollRef.current.children[activeLine - 1]
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
        className='flex-1 p-4 font-mono text-sm leading-6 overflow-auto custom-scrollbar'
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

const GeoAlgo = () => {
  const [algorithm, setAlgorithm] = useState('grahamScan')
  const [points, setPoints] = useState([])
  const [stepsList, setStepsList] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  // Initialize random points
  useEffect(() => {
    regeneratePoints()
  }, [])

  const regeneratePoints = () => {
    const newPoints = []
    for (let i = 0; i < 15; i++) {
      newPoints.push({
        x: Math.floor(Math.random() * 500) + 50,
        y: Math.floor(Math.random() * 300) + 50,
      })
    }
    setPoints(newPoints)
    setStepsList([])
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const snapshot = (desc, line, vizOverride = {}) => ({
    description: desc,
    activeLine: line,
    vizState: vizOverride,
  })

  // GENERIC SIMULATOR (Placeholder logic for complex specific algos)
  const generateSteps = () => {
    const steps = []

    // Initial State
    steps.push(snapshot('Initial State', 1, { lines: [], highlightPoints: [] }))

    if (algorithm === 'grahamScan') {
      // MOCK IMPLEMENTATION FOR VISUALIZATION PURPOSE
      let p = [...points].sort((a, b) => a.y - b.y)
      steps.push(snapshot('Sort points by Y-coordinate', 11, { highlightPoints: [0] }))

      const hullIdx = [0, 1]
      steps.push(snapshot('Initialize stack with first 2 points', 20, { highlightPoints: [0, 1], lines: [{ p1: p[0], p2: p[1] }] }))

      for (let i = 2; i < Math.min(p.length, 6); i++) {
        hullIdx.push(i)
        steps.push(
          snapshot(`Process point ${i}`, 25, {
            highlightPoints: hullIdx,
            lines: hullIdx
              .slice(0, -1)
              .map((idx, k) => ({ p1: p[hullIdx[k]], p2: p[hullIdx[k + 1]] }))
              .concat([{ p1: p[hullIdx[hullIdx.length - 2]], p2: p[i] }]),
          })
        )
      }

      steps.push(
        snapshot('Convex Hull Completed', 31, {
          highlightPoints: hullIdx,
          lines: hullIdx.map((idx, k) => {
            const next = hullIdx[(k + 1) % hullIdx.length]
            return { p1: p[idx], p2: p[next], color: '#10b981', width: 3 }
          }),
        })
      )
    } else if (algorithm === 'jarvisMarch') {
      steps.push(snapshot('Find leftmost point', 14, { highlightPoints: [0] }))
      steps.push(snapshot('Wrapping points...', 18, { lines: [{ p1: points[0], p2: points[1] }] }))
      steps.push(snapshot('Hull Completed', 27, { lines: [] }))
    } else if (algorithm === 'bentleyOttmann') {
      // Mock Sweep Line Animation
      steps.push(snapshot('Initialize Event Queue & Sweep Line', 9, { sweepLineX: 0 }))

      for (let x = 50; x <= 550; x += 100) {
        steps.push(snapshot(`Process Events at x=${x}`, 15, { sweepLineX: x, highlightPoints: points.filter((p) => Math.abs(p.x - x) < 50).map((_, i) => i) }))
        // Simulate intersection check
        if (x > 200 && x < 400) {
          steps.push(snapshot('Check Intersection (Active Segments)', 20, { sweepLineX: x, highlightPoints: [] }))
        }
      }
      steps.push(snapshot('Sweep Completed. Returns Intersections.', 28, { sweepLineX: 600 }))
    } else if (algorithm === 'closestPair') {
      // Mock Divide & Conquer Visualization
      steps.push(snapshot('Sort points by X coordinate', 25, { highlightPoints: [] }))
      steps.push(
        snapshot('Divide: Split into Left and Right Subsets', 28, {
          lines: [{ p1: { x: 300, y: 0 }, p2: { x: 300, y: 400 }, color: '#3b82f6', width: 1 }],
        })
      )
      steps.push(snapshot('Recursively find min dist in Left', 31, { highlightPoints: [0, 1, 2] }))
      steps.push(snapshot('Recursively find min dist in Right', 32, { highlightPoints: [3, 4, 5] }))
      steps.push(
        snapshot('Create Strip area around mid line', 35, {
          lines: [
            { p1: { x: 250, y: 0 }, p2: { x: 250, y: 400 }, color: '#f59e0b', width: 1 },
            { p1: { x: 350, y: 0 }, p2: { x: 350, y: 400 }, color: '#f59e0b', width: 1 },
          ],
        })
      )
      steps.push(snapshot('Check points within strip for closer pair', 40, { highlightPoints: [2, 3] }))
      steps.push(snapshot('Return minimum distance found', 40, { lines: [{ p1: points[2], p2: points[3], color: '#ef4444', width: 2 }] }))
    } else if (algorithm === 'fortunesAlgorithm') {
      // Mock Fortune's Animation
      steps.push(snapshot('Initialize PQ (sites sorted by Y)', 6, { highlightPoints: [0] }))

      for (let x = 50; x <= 550; x += 100) {
        steps.push(snapshot(`Pop Event at x=${x}`, 12, { sweepLineX: x }))
        steps.push(snapshot('Update Beach Line (Parabolic Arcs)', 15, { sweepLineX: x }))
      }
      steps.push(snapshot('Finish Edges (Voronoi Diagram Constructed)', 23, { sweepLineX: 600 }))
    } else if (algorithm === 'earClipping') {
      const poly = [...points].slice(0, 6) // Use subset for polygon
      if (poly.length < 3) return [] // Safety

      const lines = poly.map((p, i) => ({ p1: p, p2: poly[(i + 1) % poly.length], color: '#3b82f6' }))
      steps.push(snapshot('Initialize Polygon', 7, { lines, highlightPoints: [0, 1, 2, 3, 4, 5] }))

      // Mock clipping
      steps.push(snapshot('Identify Ear (convex vertex)', 17, { lines, highlightPoints: [1] }))
      const newLines = [...lines]
      newLines.push({ p1: poly[0], p2: poly[2], color: '#ef4444' }) // Diagonal
      steps.push(snapshot('Clip Ear (Form Triangle)', 18, { lines: newLines, highlightPoints: [0, 1, 2] }))

      steps.push(snapshot('Continue until polygon triangulated', 11, { lines: newLines }))
    }

    if (steps.length === 0) {
      steps.push(snapshot('Visualization not fully implemented for this algorithm yet.', 1, {}))
    }

    return steps
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generated = generateSteps()
    setStepsList(generated)
  }

  // Timer for Auto-Play
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < stepsList.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 800)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, stepsList.length])

  // Run generation when algorithm or points change
  useEffect(() => {
    reset()
  }, [algorithm, points])

  const currentStepData = stepsList[currentStep] || { description: 'Ready', activeLine: 0, vizState: {} }
  const vizState = currentStepData.vizState || {}
  const percentage = Math.floor((currentStep / (stepsList.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Compass
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOGEO<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi Geometric Algorithm</p>
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

          <button
            onClick={regeneratePoints}
            className='flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-orange-400 transition-colors px-2'>
            <RefreshCw size={14} /> Randomize Points
          </button>
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
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
          {/* LEFT: INFO */}
          <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-200 mb-2'>{ALGO_INFO[algorithm].title}</h2>
            <p className='text-sm text-slate-400 leading-relaxed max-w-2xl'>{ALGO_INFO[algorithm].description}</p>
            <div className='flex gap-4'>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <Activity
                  size={12}
                  className='text-orange-400'
                />
                Complexity: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
              </div>
              <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
                <MousePointer
                  size={12}
                  className='text-blue-400'
                />
                Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: PSEUDOCODE */}
          <div className='bg-slate-900 rounded-lg border border-slate-700 overflow-hidden'>
            <div className='px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center gap-2'>
              <MessageSquare
                size={12}
                className='text-slate-400'
              />
              <span className='text-xs text-slate-400 font-bold'>PSEUDOCODE</span>
            </div>
            <div className='p-4 max-h-64 overflow-auto custom-scrollbar'>
              <pre className='text-xs text-slate-300 font-mono whitespace-pre leading-relaxed'>{PSEUDOCODE[algorithm]}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN BODY */}
      <main className='flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0'>
        {/* LEFT COLUMN: VISUALIZATION */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          <GeoCanvas
            points={points}
            lines={vizState.lines}
            highlightPoints={vizState.highlightPoints}
            sweepLineX={vizState.sweepLineX}
          />

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

        {/* RIGHT COLUMN: STATUS & CODE */}
        <div className='lg:col-span-7 bg-[#1e1e1e] flex flex-col border-l border-slate-800'>
          {/* STATUS BOX */}
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
                <p className='text-sm font-medium text-white leading-tight'>{currentStepData.description}</p>
              </div>
            </div>
          </div>

          {/* CODE VIEWER */}
          <div className='p-4 bg-[#252526] flex-1 overflow-hidden flex flex-col'>
            <CodeViewer
              code={ALGO_CPLUSPLUS[algorithm]}
              activeLine={currentStepData.activeLine}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default GeoAlgo
