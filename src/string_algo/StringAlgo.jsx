import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Type, Code, MessageSquare, SkipForward, StepBack, StepForward, Activity, Search } from 'lucide-react'

// ==========================================
// 1. CONSTANTS: PSEUDOCODE TEXTS (INDONESIAN)
// ==========================================

const PSEUDOCODE = {
  kmp: `// Build LPS (Longest Prefix Suffix) array
FUNCTION ComputeLPS(pattern: String, m: Integer)
  DECLARE lps: Array[m]
  lps[0] <- 0
  len <- 0
  i <- 1
  
  WHILE i < m DO
    IF pattern[i] == pattern[len] THEN
      len <- len + 1
      lps[i] <- len
      i <- i + 1
    ELSE
      IF len != 0 THEN
        len <- lps[len - 1]
      ELSE
        lps[i] <- 0
        i <- i + 1
      END IF
    END IF
  END WHILE
  
  RETURN lps
END FUNCTION

// KMP Search
FUNCTION KMPSearch(text: String, pattern: String)
  n <- length(text)
  m <- length(pattern)
  lps <- ComputeLPS(pattern, m)
  
  i <- 0  // index for text
  j <- 0  // index for pattern
  
  WHILE i < n DO
    IF pattern[j] == text[i] THEN
      i <- i + 1
      j <- j + 1
    END IF
    
    IF j == m THEN
      PRINT "Pattern found at index " + (i - j)
      j <- lps[j - 1]
    ELSE IF i < n AND pattern[j] != text[i] THEN
      IF j != 0 THEN
        j <- lps[j - 1]
      ELSE
        i <- i + 1
      END IF
    END IF
  END WHILE
END FUNCTION`,

  rabinKarp: `FUNCTION RabinKarpSearch(text: String, pattern: String, d: Integer, q: Integer)
  m <- length(pattern)
  n <- length(text)
  p <- 0  // hash of pattern
  t <- 0  // hash of text window
  h <- 1  // d^(m-1) mod q
  
  // Calculate h = d^(m-1) mod q
  FOR i FROM 1 TO m-1 DO
    h <- (h * d) mod q
  END FOR
  
  // Calculate initial hash values
  FOR i FROM 0 TO m-1 DO
    p <- (d * p + pattern[i]) mod q
    t <- (d * t + text[i]) mod q
  END FOR
  
  // Slide pattern over text
  FOR i FROM 0 TO n-m DO
    IF p == t THEN
      // Check character by character
      match <- TRUE
      FOR j FROM 0 TO m-1 DO
        IF text[i+j] != pattern[j] THEN
          match <- FALSE
          BREAK
        END IF
      END FOR
      
      IF match THEN
        PRINT "Pattern found at index " + i
      END IF
    END IF
    
    // Calculate hash for next window
    IF i < n-m THEN
      t <- (d * (t - text[i] * h) + text[i+m]) mod q
      IF t < 0 THEN
        t <- t + q
      END IF
    END IF
  END FOR
END FUNCTION`,

  boyerMoore: `// Bad Character Heuristic
FUNCTION BadCharHeuristic(pattern: String, m: Integer)
  DECLARE badChar: Array[256]
  
  FOR i FROM 0 TO 255 DO
    badChar[i] <- -1
  END FOR
  
  FOR i FROM 0 TO m-1 DO
    badChar[pattern[i]] <- i
  END FOR
  
  RETURN badChar
END FUNCTION

// Boyer-Moore Search
FUNCTION BoyerMooreSearch(text: String, pattern: String)
  m <- length(pattern)
  n <- length(text)
  badChar <- BadCharHeuristic(pattern, m)
  
  s <- 0  // shift of pattern
  
  WHILE s <= n-m DO
    j <- m-1
    
    // Keep reducing j while characters match
    WHILE j >= 0 AND pattern[j] == text[s+j] DO
      j <- j - 1
    END WHILE
    
    IF j < 0 THEN
      PRINT "Pattern found at index " + s
      
      // Shift pattern
      IF s+m < n THEN
        s <- s + (m - badChar[text[s+m]])
      ELSE
        s <- s + 1
      END IF
    ELSE
      // Shift pattern based on bad character
      s <- s + MAX(1, j - badChar[text[s+j]])
    END IF
  END WHILE
END FUNCTION`,

  lcsString: `FUNCTION LongestCommonSubstring(X: String, Y: String)
  m <- length(X)
  n <- length(Y)
  DECLARE dp: Matrix[m+1][n+1]
  maxLength <- 0
  endIndex <- 0
  
  // Initialize base cases
  FOR i FROM 0 TO m DO
    dp[i][0] <- 0
  END FOR
  FOR j FROM 0 TO n DO
    dp[0][j] <- 0
  END FOR
  
  // Fill DP table
  FOR i FROM 1 TO m DO
    FOR j FROM 1 TO n DO
      IF X[i-1] == Y[j-1] THEN
        dp[i][j] <- dp[i-1][j-1] + 1
        
        IF dp[i][j] > maxLength THEN
          maxLength <- dp[i][j]
          endIndex <- i
        END IF
      ELSE
        dp[i][j] <- 0
      END IF
    END FOR
  END FOR
  
  // Extract LCS
  lcs <- X.substring(endIndex - maxLength, endIndex)
  
  RETURN lcs, maxLength
END FUNCTION`,
}

// ==========================================
// C++ IMPLEMENTATIONS
// ==========================================

const ALGO_CPLUSPLUS = {
  kmp: `void computeLPS(string pattern, int m, vector<int>& lps) {
  int len = 0;
  lps[0] = 0;
  int i = 1;
  
  while (i < m) {
    if (pattern[i] == pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len != 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
}

void KMPSearch(string text, string pattern) {
  int m = pattern.length();
  int n = text.length();
  
  vector<int> lps(m);
  computeLPS(pattern, m, lps);
  
  int i = 0; // index for text
  int j = 0; // index for pattern
  
  while (i < n) {
    if (pattern[j] == text[i]) {
      i++;
      j++;
    }
    
    if (j == m) {
      cout << "Pattern found at index " << i - j << endl;
      j = lps[j - 1];
    } else if (i < n && pattern[j] != text[i]) {
      if (j != 0)
        j = lps[j - 1];
      else
        i++;
    }
  }
}`,

  rabinKarp: `#define d 256

void rabinKarpSearch(string text, string pattern, int q) {
  int m = pattern.length();
  int n = text.length();
  int p = 0; // hash value for pattern
  int t = 0; // hash value for text
  int h = 1;
  
  // Calculate h = d^(m-1) % q
  for (int i = 0; i < m - 1; i++)
    h = (h * d) % q;
  
  // Calculate hash value of pattern and first window
  for (int i = 0; i < m; i++) {
    p = (d * p + pattern[i]) % q;
    t = (d * t + text[i]) % q;
  }
  
  // Slide pattern over text
  for (int i = 0; i <= n - m; i++) {
    if (p == t) {
      // Check characters one by one
      bool match = true;
      for (int j = 0; j < m; j++) {
        if (text[i + j] != pattern[j]) {
          match = false;
          break;
        }
      }
      
      if (match)
        cout << "Pattern found at index " << i << endl;
    }
    
    // Calculate hash for next window
    if (i < n - m) {
      t = (d * (t - text[i] * h) + text[i + m]) % q;
      if (t < 0)
        t = t + q;
    }
  }
}`,

  boyerMoore: `#define NO_OF_CHARS 256

void badCharHeuristic(string pattern, int m, int badChar[NO_OF_CHARS]) {
  for (int i = 0; i < NO_OF_CHARS; i++)
    badChar[i] = -1;
  
  for (int i = 0; i < m; i++)
    badChar[(int)pattern[i]] = i;
}

void boyerMooreSearch(string text, string pattern) {
  int m = pattern.length();
  int n = text.length();
  
  int badChar[NO_OF_CHARS];
  badCharHeuristic(pattern, m, badChar);
  
  int s = 0; // shift of pattern
  
  while (s <= n - m) {
    int j = m - 1;
    
    while (j >= 0 && pattern[j] == text[s + j])
      j--;
    
    if (j < 0) {
      cout << "Pattern found at index " << s << endl;
      
      s += (s + m < n) ? m - badChar[text[s + m]] : 1;
    } else {
      s += max(1, j - badChar[text[s + j]]);
    }
  }
}`,

  lcsString: `string longestCommonSubstring(string X, string Y) {
  int m = X.length();
  int n = Y.length();
  
  vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
  int maxLength = 0;
  int endIndex = 0;
  
  for (int i = 1; i <= m; i++) {
    for (int j = 1; j <= n; j++) {
      if (X[i-1] == Y[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        
        if (dp[i][j] > maxLength) {
          maxLength = dp[i][j];
          endIndex = i;
        }
      } else {
        dp[i][j] = 0;
      }
    }
  }
  
  // Extract LCS
  return X.substr(endIndex - maxLength, maxLength);
}`,
}

const ALGO_INFO = {
  kmp: {
    title: 'KNUTH-MORRIS-PRATT (KMP)',
    description: 'Pattern matching dengan preprocessing pattern untuk menghindari backtracking di text.',
    complexity: 'O(m + n) (m = pattern length, n = text length)',
    useCase: 'Text search, plagiarism detection, bioinformatics',
  },
  rabinKarp: {
    title: 'RABIN-KARP',
    description: 'Pattern matching menggunakan hashing, mencari pattern berdasarkan hash value.',
    complexity: 'O(m + n) rata-rata, O(mn) terburuk',
    useCase: 'Multiple pattern search, document fingerprinting',
  },
  boyerMoore: {
    title: 'BOYER-MOORE',
    description: 'Pattern matching yang membandingkan dari kanan ke kiri dan menggunakan two heuristics: bad character dan good suffix.',
    complexity: 'O(m + n) rata-rata, O(mn) terburuk',
    useCase: 'Text editors (CTRL+F), grep, DNA sequencing',
  },
  lcsString: {
    title: 'LONGEST COMMON SUBSTRING',
    description: 'Mencari substring terpanjang yang muncul di dua string (harus kontigu).',
    complexity: 'O(mn)',
    useCase: 'Document similarity, version control, bioinformatics',
  },
}

// ==========================================
// 2. SUB-COMPONENTS
// ==========================================

const PatternMatchingVisualization = ({ text, pattern, currentIndex, patternIndex, matches = [], status = '' }) => {
  return (
    <div className='bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-xl'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xs font-bold text-slate-400 uppercase flex items-center gap-2'>
          <Search size={14} /> Pattern Matching
        </h3>
        <div className='flex gap-2'>
          {['MATCH', 'CHECKING', 'MISMATCH'].map((label, idx) => (
            <span
              key={idx}
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${label === 'MATCH' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : label === 'CHECKING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Text Display */}
      <div className='mb-4'>
        <div className='text-xs text-slate-400 mb-2 font-bold'>TEXT:</div>
        <div className='flex flex-wrap gap-1 font-mono text-sm'>
          {text.split('').map((char, idx) => {
            const isMatch = matches.some((m) => idx >= m && idx < m + pattern.length)
            const isChecking = idx >= currentIndex && idx < currentIndex + pattern.length
            const isActive = idx === currentIndex + patternIndex

            let bgColor = 'bg-slate-800'
            let textColor = 'text-slate-300'
            let borderColor = 'border-slate-700'

            if (isActive) {
              bgColor = 'bg-yellow-500/30'
              textColor = 'text-yellow-200'
              borderColor = 'border-yellow-400 border-2'
            } else if (isMatch) {
              bgColor = 'bg-emerald-500/30'
              textColor = 'text-emerald-300'
              borderColor = 'border-emerald-500'
            } else if (isChecking) {
              bgColor = 'bg-blue-500/20'
              textColor = 'text-blue-300'
              borderColor = 'border-blue-500/50'
            }

            return (
              <div
                key={idx}
                className={`${bgColor} ${textColor} border ${borderColor} px-2 py-1 rounded transition-all duration-200 min-w-[32px] text-center`}>
                {char}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pattern Display */}
      <div>
        <div className='text-xs text-slate-400 mb-2 font-bold'>PATTERN:</div>
        <div className='flex flex-wrap gap-1 font-mono text-sm'>
          {pattern.split('').map((char, idx) => {
            const isActive = idx === patternIndex

            let bgColor = isActive ? 'bg-orange-500/30' : 'bg-slate-700'
            let textColor = isActive ? 'text-orange-200' : 'text-slate-300'
            let borderColor = isActive ? 'border-orange-400 border-2' : 'border-slate-600'

            return (
              <div
                key={idx}
                className={`${bgColor} ${textColor} border ${borderColor} px-2 py-1 rounded transition-all duration-200 min-w-[32px] text-center`}>
                {char}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className='mt-4 p-3 bg-slate-800 rounded-lg border border-slate-700'>
          <div className='text-xs font-bold text-slate-400 mb-1'>Status</div>
          <div className='text-sm text-orange-400 font-mono'>{status}</div>
        </div>
      )}

      {/* Matches Found */}
      {matches.length > 0 && (
        <div className='mt-4 p-3 bg-emerald-900/20 rounded-lg border border-emerald-700/50'>
          <div className='text-xs font-bold text-emerald-400 mb-1'>Pattern Found At:</div>
          <div className='text-sm text-emerald-300 font-mono'>{matches.join(', ')}</div>
        </div>
      )}
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
    const words = text.split(/(\s+)/)

    return words.map((word, idx) => {
      if (/^\s+$/.test(word)) {
        return <span key={idx}>{word}</span>
      }

      const keywords = ['void', 'int', 'bool', 'vector', 'string', 'for', 'while', 'if', 'else', 'return', 'break', 'continue', 'max', 'min', 'cout', 'endl']

      if (keywords.includes(word)) {
        return (
          <span
            key={idx}
            className='text-purple-400 font-bold'>
            {word}
          </span>
        )
      }

      if (/^\d+$/.test(word)) {
        return (
          <span
            key={idx}
            className='text-green-400'>
            {word}
          </span>
        )
      }

      return <span key={idx}>{word}</span>
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

const StringAlgo = () => {
  const [algorithm, setAlgorithm] = useState('kmp')
  const [text, setText] = useState('ABABDABACDABABCABAB')
  const [pattern, setPattern] = useState('ABABCABAB')
  const [steps, setSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef(null)

  const snapshot = (currentIndex, patternIndex, matches, line, desc, status = '') => ({
    currentIndex,
    patternIndex,
    matches: [...matches],
    activeLine: line,
    description: desc,
    status,
  })

  const generateSteps = (algo, txt, pat) => {
    let s = []
    const n = txt.length
    const m = pat.length

    if (algo === 'kmp') {
      // Build LPS array first
      const lps = Array(m).fill(0)
      let len = 0
      let i = 1

      s.push(snapshot(-1, -1, [], 1, 'Mulai KMP: Build LPS array', 'Building LPS'))

      while (i < m) {
        if (pat[i] === pat[len]) {
          len++
          lps[i] = len
          s.push(snapshot(-1, i, [], 9, `LPS[${i}] = ${len} (match)`, `LPS: [${lps.join(', ')}]`))
          i++
        } else {
          if (len !== 0) {
            len = lps[len - 1]
            s.push(snapshot(-1, i, [], 13, `Mismatch, backtrack len to ${len}`, `LPS: [${lps.join(', ')}]`))
          } else {
            lps[i] = 0
            s.push(snapshot(-1, i, [], 15, `LPS[${i}] = 0`, `LPS: [${lps.join(', ')}]`))
            i++
          }
        }
      }

      // KMP Search
      const matches = []
      i = 0
      let j = 0

      s.push(snapshot(0, 0, matches, 25, 'Mulai KMP Search', `LPS: [${lps.join(', ')}]`))

      while (i < n) {
        if (pat[j] === txt[i]) {
          s.push(snapshot(i - j, j, matches, 32, `Match: text[${i}] == pattern[${j}]`, ''))
          i++
          j++
        }

        if (j === m) {
          matches.push(i - j)
          s.push(snapshot(i - j, j, matches, 36, `Pattern found at index ${i - j}!`, ''))
          j = lps[j - 1]
        } else if (i < n && pat[j] !== txt[i]) {
          if (j !== 0) {
            s.push(snapshot(i - j, j, matches, 40, `Mismatch, use LPS[${j - 1}] = ${lps[j - 1]}`, ''))
            j = lps[j - 1]
          } else {
            s.push(snapshot(i, 0, matches, 43, `Mismatch at start, move to next position`, ''))
            i++
          }
        }
      }

      s.push(snapshot(-1, -1, matches, 47, `KMP selesai. Found ${matches.length} matches`, ''))
    } else if (algo === 'rabinKarp') {
      const d = 256
      const q = 101
      const matches = []

      let p = 0
      let t = 0
      let h = 1

      // Calculate h = d^(m-1) % q
      for (let i = 0; i < m - 1; i++) {
        h = (h * d) % q
      }

      // Calculate initial hashes
      for (let i = 0; i < m; i++) {
        p = (d * p + pat.charCodeAt(i)) % q
        t = (d * t + txt.charCodeAt(i)) % q
      }

      s.push(snapshot(0, 0, matches, 1, `Mulai Rabin-Karp, hash pattern = ${p}`, `Hash: ${t}`))

      for (let i = 0; i <= n - m; i++) {
        if (p === t) {
          // Check character by character
          let match = true
          for (let j = 0; j < m; j++) {
            s.push(snapshot(i, j, matches, 18, `Hash match! Verify char[${j}]: ${txt[i + j]} == ${pat[j]}`, `Hash: ${t}`))
            if (txt[i + j] !== pat[j]) {
              match = false
              break
            }
          }

          if (match) {
            matches.push(i)
            s.push(snapshot(i, m - 1, matches, 24, `Pattern found at index ${i}!`, `Hash: ${t}`))
          }
        } else {
          s.push(snapshot(i, 0, matches, 16, `Hash mismatch: ${t} ≠ ${p}`, `Hash: ${t}`))
        }

        // Calculate next hash
        if (i < n - m) {
          t = (d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + m)) % q
          if (t < 0) t = t + q
          s.push(snapshot(i + 1, 0, matches, 30, `Slide window, new hash = ${t}`, `Hash: ${t}`))
        }
      }

      s.push(snapshot(-1, -1, matches, 36, `Rabin-Karp selesai. Found ${matches.length} matches`, ''))
    } else if (algo === 'boyerMoore') {
      // Bad character heuristic
      const badChar = Array(256).fill(-1)
      for (let i = 0; i < m; i++) {
        badChar[pat.charCodeAt(i)] = i
      }

      const matches = []
      let s_shift = 0

      s.push(snapshot(0, m - 1, matches, 1, 'Mulai Boyer-Moore (right to left)', ''))

      while (s_shift <= n - m) {
        let j = m - 1

        // Compare from right to left
        while (j >= 0 && pat[j] === txt[s_shift + j]) {
          s.push(snapshot(s_shift, j, matches, 24, `Match: pattern[${j}] == text[${s_shift + j}]`, ''))
          j--
        }

        if (j < 0) {
          matches.push(s_shift)
          s.push(snapshot(s_shift, 0, matches, 27, `Pattern found at index ${s_shift}!`, ''))
          s_shift += s_shift + m < n ? m - badChar[txt.charCodeAt(s_shift + m)] : 1
        } else {
          s.push(snapshot(s_shift, j, matches, 32, `Mismatch at pattern[${j}], shift pattern`, ''))
          s_shift += Math.max(1, j - badChar[txt.charCodeAt(s_shift + j)])
        }
      }

      s.push(snapshot(-1, -1, matches, 36, `Boyer-Moore selesai. Found ${matches.length} matches`, ''))
    } else if (algo === 'lcsString') {
      // For LCS, we'll use text as X and pattern as Y
      const X = txt
      const Y = pat
      const m_lcs = X.length
      const n_lcs = Y.length

      const dp = Array(m_lcs + 1)
        .fill(null)
        .map(() => Array(n_lcs + 1).fill(0))
      let maxLength = 0
      let endIndex = 0

      s.push(snapshot(0, 0, [], 1, `Mulai LCS: "${X}" vs "${Y}"`, ''))

      for (let i = 1; i <= m_lcs; i++) {
        for (let j = 1; j <= n_lcs; j++) {
          if (X[i - 1] === Y[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1
            s.push(snapshot(i - 1, j - 1, [], 15, `Match: X[${i - 1}]='${X[i - 1]}' == Y[${j - 1}]='${Y[j - 1]}', length=${dp[i][j]}`, `DP[${i}][${j}]=${dp[i][j]}`))

            if (dp[i][j] > maxLength) {
              maxLength = dp[i][j]
              endIndex = i
            }
          } else {
            dp[i][j] = 0
            s.push(snapshot(i - 1, j - 1, [], 22, `Mismatch: reset to 0`, `DP[${i}][${j}]=0`))
          }
        }
      }

      const lcs = X.substring(endIndex - maxLength, endIndex)
      s.push(snapshot(-1, -1, [endIndex - maxLength], 28, `LCS = "${lcs}" (length ${maxLength})`, `Found at index ${endIndex - maxLength}`))
    }

    return s
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    const generated = generateSteps(algorithm, text, pattern)
    setSteps(generated)
  }

  useEffect(() => {
    reset()
  }, [algorithm, text, pattern])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) return prev + 1
          setIsPlaying(false)
          return prev
        })
      }, 600)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [isPlaying, steps])

  const currentVisual = steps[currentStep] || {
    currentIndex: 0,
    patternIndex: 0,
    matches: [],
    activeLine: 0,
    description: 'Loading...',
    status: '',
  }

  const percentage = Math.floor((currentStep / (steps.length - 1 || 1)) * 100)

  return (
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-orange-500/30'>
      {/* HEADER */}
      <header className='px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0 sticky top-0 z-50 shadow-lg'>
        <div className='flex items-center gap-3'>
          <div className='bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-lg shadow-lg shadow-orange-500/20'>
            <Type
              size={20}
              className='text-white'
            />
          </div>
          <div>
            <h1 className='text-xl font-black text-white tracking-tight'>
              ALGOSTRING<span className='text-orange-500'>.ID</span>
            </h1>
            <p className='text-xs text-slate-400 font-medium'>Visualisasi String & Pattern Matching</p>
          </div>
        </div>

        <div className='flex items-center gap-4 bg-slate-900/50 p-1.5 pr-4 rounded-xl border border-slate-800'>
          <div className='relative'>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className='appearance-none bg-slate-800 text-sm font-bold text-slate-200 py-2 pl-4 pr-10 rounded-lg cursor-pointer hover:bg-slate-700 outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700 transition-all'>
              <option value='kmp'>KMP</option>
              <option value='rabinKarp'>Rabin-Karp</option>
              <option value='boyerMoore'>Boyer-Moore</option>
              <option value='lcsString'>LCS String</option>
            </select>
            <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400'>
              <SkipForward
                size={14}
                className='rotate-90'
              />
            </div>
          </div>
          <label className='text-xs text-slate-400 font-bold mb-2 block'>TEXT</label>
          <div className='relative'>
            <input
              type='text'
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
              className='w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
              placeholder='Enter text...'
            />
          </div>
          <label className='text-xs text-slate-400 font-bold mb-2 block'>PATTERN</label>
          <div className='relative'>
            <input
              type='text'
              value={pattern}
              onChange={(e) => setPattern(e.target.value.toUpperCase())}
              className='w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-orange-500/50 outline-none'
              placeholder='Enter pattern...'
            />
          </div>
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
        <h2 className='text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-2'>{ALGO_INFO[algorithm].title}</h2>
        <p className='text-sm text-slate-400 leading-relaxed max-w-2xl'>{ALGO_INFO[algorithm].description}</p>

        <div className='flex gap-4 mt-4'>
          <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <Activity
              size={12}
              className='text-orange-400'
            />
            Complexity: <span className='text-slate-200'>{ALGO_INFO[algorithm].complexity}</span>
          </div>
          <div className='flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700'>
            <Type
              size={12}
              className='text-blue-400'
            />
            Use Case: <span className='text-slate-200'>{ALGO_INFO[algorithm].useCase}</span>
          </div>
        </div>

        {/* PSEUDOCODE */}
        <div className='mt-4 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden'>
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

      {/* MAIN BODY */}
      <main className='flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0'>
        {/* LEFT COLUMN */}
        <div className='lg:col-span-5 bg-[#0f172a] border-r border-slate-800 flex flex-col p-4 gap-4'>
          <PatternMatchingVisualization
            text={text}
            pattern={pattern}
            currentIndex={currentVisual.currentIndex}
            patternIndex={currentVisual.patternIndex}
            matches={currentVisual.matches}
            status={currentVisual.status}
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
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
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
          <div className='p-4 bg-[#252526]'>
            <CodeViewer
              code={ALGO_CPLUSPLUS[algorithm]}
              activeLine={currentVisual.activeLine}
            />
          </div>

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
        </div>
      </main>
    </div>
  )
}

export default StringAlgo
