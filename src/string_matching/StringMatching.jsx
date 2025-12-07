import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Type,
  Code,
  Variable,
  MessageSquare,
  SkipBack,
  SkipForward,
  StepBack,
  StepForward,
  Square,
  Search,
  Hash,
  Clock,
} from "lucide-react";

/**
 * StringMatching Component
 * Visualizes various string matching algorithms (Naive, KMP, Rabin-Karp, Boyer-Moore, Z-Algo)
 * with step-by-step execution, code highlighting, and variable tracking.
 */
const StringMatching = () => {
  // ==========================================
  // 1. CONSTANTS & DEFINITIONS
  // ==========================================

  const STEP_DELAY = 500; // ms per step

  /**
   * Variable definitions for the variable badge display.
   * Maps variable names to Indonesian descriptions.
   */
  const variableDefinitions = {
    common: {
      m: "Panjang Teks",
      n: "Panjang Pola",
      i: "Indeks Teks",
      j: "Indeks Pola",
    },
    naive: {
      i: "Geseran Teks",
      j: "Posisi Cocok",
      matchIndex: "Indeks Ketemu",
    },
    kmp: {
      lps: "Tabel Prefix",
      len: "Panjang Prefix",
      i: "Posisi Teks",
      j: "Posisi Pola",
      lpsValue: "Nilai LPS",
    },
    rabin: {
      pHash: "Hash Pola",
      tHash: "Hash Teks",
      d: "Basis",
      q: "Prima Modulo",
      h: "Faktor Pow",
      oldHash: "Hash Lama",
      newHash: "Hash Baru",
    },
    boyer: {
      badChar: "Tabel BadChar",
      s: "Geseran",
      shift: "Lompatan",
      lastOccur: "Posisi Akhir",
      mismatchChar: "Karakter Salah",
    },
    z: {
      z: "Z-Array",
      concat: "String Gabungan",
      l: "Batas Kiri Z-Box",
      r: "Batas Kanan Z-Box",
      zValue: "Nilai Z",
    },
  };

  /**
   * Algorithm details including title, description, complexity, use case, and pseudocode.
   */
  const algorithmDescriptions = {
    naive: {
      title: "Naive String Matching",
      description:
        "Algoritma pencocokan string sederhana yang menggeser pola satu per satu. Membandingkan setiap karakter pola dengan teks pada setiap posisi geseran.",
      complexity: "Time: O(m × n), Space: O(1)",
      useCase: "Teks pendek, kasus sederhana, debugging.",
      pseudocode: `for i = 0 to m - n:
  j = 0
  while j < n and text[i+j] == pattern[j]:
    j++
  if j == n:
    print "Match found at " + i`,
    },
    kmp: {
      title: "Knuth-Morris-Pratt (KMP)",
      description:
        "Menggunakan informasi dari pencocokan sebelumnya (tabel LPS) untuk menghindari pengecekan ulang karakter yang sudah diketahui cocok.",
      complexity: "Time: O(m + n), Space: O(n)",
      useCase: "Pencarian dalam file besar, streaming data, bioinformatika.",
      pseudocode: `computeLPS(pattern)
i = 0, j = 0
while i < m:
  if pattern[j] == text[i]:
    i++, j++
  if j == n:
    print "Match found", j = lps[j-1]
  else if i < m and pattern[j] != text[i]:
    if j != 0: j = lps[j-1]
    else: i++`,
    },
    rabin: {
      title: "Rabin-Karp Algorithm",
      description:
        "Menggunakan rolling hash untuk membandingkan hash pola dengan hash substring teks. Jika hash cocok, baru dilakukan verifikasi karakter demi karakter.",
      complexity: "Avg Time: O(m + n), Worst: O(mn)",
      useCase: "Deteksi plagiarisme, pencarian milti-pattern.",
      pseudocode: `p = hash(pattern)
t = hash(text[0...n-1])
for i = 0 to m - n:
  if p == t:
    if checkMatch(text[i...i+n], pattern):
      print "Match at " + i
  if i < m - n:
    t = rollingHash(t, text[i], text[i+n])`,
    },
    boyer: {
      title: "Boyer-Moore Algorithm",
      description:
        "Membandingkan karakter dari kanan ke kiri pola. Menggunakan tabel Bad Character untuk melompati banyak karakter sekaligus saat terjadi ketidakcocokan.",
      complexity: "Best: O(m/n), Worst: O(mn)",
      useCase: "Editor teks, perintah grep, sistem pencarian cepat.",
      pseudocode: `badChar = buildBadChar(pattern)
s = 0
while s <= m - n:
  j = n - 1
  while j >= 0 and pattern[j] == text[s+j]:
    j--
  if j < 0:
    print "Match at " + s
    s += ...
  else:
    s += max(1, j - badChar[text[s+j]])`,
    },
    z: {
      title: "Z-Algorithm",
      description:
        "Membangun Z-array di mana Z[i] adalah panjang substring terpanjang mulai dari i yang juga merupakan prefix dari string. Menggabungkan pola dan teks untuk pencarian.",
      complexity: "Time: O(m + n), Space: O(m + n)",
      useCase: "Exact pattern matching, analisis string.",
      pseudocode: `S = pattern + "$" + text
Z = computeZ(S)
for i = 0 to length(S):
  if Z[i] == length(pattern):
    print "Match at " + (i - length(pattern) - 1)`,
    },
  };

  /**
   * Code strings for each algorithm to be displayed and highlighted.
   * Comments removed for cleaner implementation view.
   */
  const algoCode = {
    naive: `function naiveSearch(text, pattern) {
  let m = text.length;
  let n = pattern.length;
  
  for (let i = 0; i <= m - n; i++) {
    let j = 0;
    
    while (j < n && text[i + j] === pattern[j]) {
      j++;
    }

    if (j === n) {
      // Pattern found at index i
    }
  }
}`,
    kmp: `function KMP(text, pattern) {
  let lps = computeLPS(pattern);
  let i = 0, j = 0;
  
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
    }
    
    if (j === pattern.length) {
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
}`,
    rabin: `function rabinKarp(text, pattern) {
  let d = 256, q = 101;
  let h = Math.pow(d, pattern.length - 1) % q;
  let p = 0, t = 0;
  
  for (let i = 0; i < pattern.length; i++) {
    p = (d * p + pattern[i]) % q;
    t = (d * t + text[i]) % q;
  }
  
  for (let i = 0; i <= text.length - pattern.length; i++) {
    if (p === t) {
      if (verify(text, pattern, i)) {
        // Match found
      }
    }
    
    if (i < text.length - pattern.length) {
      t = (d*(t - text[i]*h) + text[i+pattern.length]) % q;
      if (t < 0) t += q;
    }
  }
}`,
    boyer: `function boyerMoore(text, pattern) {
  let badChar = buildBadChar(pattern);
  let s = 0;
  
  while (s <= text.length - pattern.length) {
    let j = pattern.length - 1;
    
    while (j >= 0 && pattern[j] === text[s+j])
      j--;
    
    if (j < 0) {
      s += (s+n < m) ? n - badChar[text[s+n]] : 1;
    } else {
      s += Math.max(1, j - badChar[text[s + j]]);
    }
  }
}`,
    z: `function zAlgorithm(text, pattern) {
  let concat = pattern + "$" + text;
  let z = computeZ(concat);
  
  for (let i = 0; i < concat.length; i++) {
    if (z[i] === pattern.length) {
      // Match found
    }
  }
}

function computeZ(s) {
  let z = new Array(s.length).fill(0);
  let l = 0, r = 0;
  
  for (let i = 1; i < s.length; i++) {
    if (i > r) {
      l = r = i;
      while (r < s.length && s[r-l] === s[r]) r++;
      z[i] = r - l;
      r--;
    } else {
      let k = i - l;
      if (z[k] < r - i + 1) z[i] = z[k];
      else {
        l = i;
        while (r < s.length && s[r-l] === s[r]) r++;
        z[i] = r - l;
        r--;
      }
    }
  }
  return z;
}`,
  };

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  const [algorithm, setAlgorithm] = useState("naive");
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);

  // Algorithm inputs
  const [text, setText] = useState("ABABCABCABABABD");
  const [pattern, setPattern] = useState("ABABD");

  // ==========================================
  // 3. LOGIC & HELPERS
  // ==========================================

  const getVarDesc = (name) => {
    if (
      variableDefinitions[algorithm] &&
      variableDefinitions[algorithm][name]
    ) {
      return variableDefinitions[algorithm][name];
    }
    return variableDefinitions.common[name] || "";
  };

  const snapshot = (
    text,
    pattern,
    textPos,
    patternPos,
    status,
    desc,
    vars = {},
    extra = {},
    activeLine = -1
  ) => ({
    text: text,
    pattern: pattern,
    textPosition: textPos,
    patternPosition: patternPos,
    status: status, // 'comparing', 'match', 'mismatch', 'skip', 'found', 'complete'
    stepDescription: desc,
    variables: { ...vars },
    activeCodeLine: activeLine,
    ...extra,
  });

  // Helper to safely get snapshot with defaults
  const currentVisual = steps[currentStep] || {
    text: "",
    pattern: "",
    textPosition: -1,
    patternPosition: -1,
    status: "start",
    stepDescription: "Memuat...",
    variables: {},
    activeCodeLine: -1,
  };

  const generateSteps = (algoType) => {
    const stepsArr = [];
    const txt = text.toUpperCase();
    const pat = pattern.toUpperCase();
    const m = txt.length;
    const n = pat.length;

    if (n > m || n === 0 || m === 0) {
      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "error",
          "Input tidak valid: panjang pola > panjang teks atau kosong",
          {},
          {},
          1
        )
      );
      return stepsArr;
    }

    if (algoType === "naive") {
      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `Pencarian Naive: Panjang teks=${m}, Panjang pola=${n}. Coba setiap posisi.`,
          { m, n },
          {},
          3
        )
      );

      for (let i = 0; i <= m - n; i++) {
        stepsArr.push(
          snapshot(
            txt,
            pat,
            i,
            0,
            "align",
            `Posisi ${i}: Sejajarkan pola dengan teks[${i}..${i + n - 1}]`,
            { i, window: txt.substring(i, i + n) },
            {},
            5
          )
        );

        let j = 0;
        stepsArr.push(
          snapshot(txt, pat, i, 0, "align", `Inisialisasi j=0`, { i, j }, {}, 6)
        );

        while (j < n) {
          const textChar = txt[i + j];
          const patChar = pat[j];

          stepsArr.push(
            snapshot(
              txt,
              pat,
              i + j,
              j,
              "comparing",
              `Bandingkan teks[${
                i + j
              }]='${textChar}' dengan pola[${j}]='${patChar}'`,
              { i, j, textChar, patChar },
              {},
              8
            )
          );

          if (textChar === patChar) {
            j++;
            if (j < n) {
              stepsArr.push(
                snapshot(
                  txt,
                  pat,
                  i + j - 1,
                  j - 1,
                  "match",
                  `✓ Cocok! Lanjut ke karakter berikutnya.`,
                  { i, j, matched: j },
                  {},
                  9
                )
              );
            }
          } else {
            stepsArr.push(
              snapshot(
                txt,
                pat,
                i + j,
                j,
                "mismatch",
                `✗ Tidak cocok di posisi ${j}. Geser pola ke kanan 1 langkah.`,
                { i, j, mismatch: j },
                {},
                8
              )
            ); // Point to diff line (usually logic check)
            break;
          }
        }

        if (j === n) {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i,
              n - 1,
              "found",
              `✓ COCOK DITEMUKAN di indeks ${i}! Pola ditemukan dalam teks.`,
              { i, matchIndex: i },
              { matches: [i] },
              {},
              13
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "complete",
          "Pencarian Naive selesai. Semua posisi diperiksa.",
          {},
          {},
          14
        )
      );
    } else if (algoType === "kmp") {
      // Compute LPS array
      const lps = new Array(n).fill(0);
      let len = 0;
      let i = 1;

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `KMP: Bangun array LPS (Longest Prefix Suffix) untuk pola "${pat}"`,
          { n },
          { lps: [...lps] },
          2
        )
      );

      while (i < n) {
        if (pat[i] === pat[len]) {
          len++;
          lps[i] = len;
          stepsArr.push(
            snapshot(
              txt,
              pat,
              -1,
              i,
              "lps",
              `LPS[${i}] = ${len}. Pola[${i}]='${pat[i]}' cocok dengan prefix.`,
              { i, len },
              { lps: [...lps] },
              2
            )
          );
          i++;
        } else {
          if (len !== 0) {
            len = lps[len - 1];
          } else {
            lps[i] = 0;
            stepsArr.push(
              snapshot(
                txt,
                pat,
                -1,
                i,
                "lps",
                `LPS[${i}] = 0. Tidak ada prefix yang cocok.`,
                { i },
                { lps: [...lps] },
                2
              )
            );
            i++;
          }
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "lps_done",
          `Array LPS selesai: [${lps.join(", ")}]. Mulai pencocokan pola.`,
          {},
          { lps: [...lps] },
          3
        )
      );

      // KMP search
      i = 0;
      let j = 0;
      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `Mulai pencarian KMP. i=0, j=0`,
          { i, j },
          { lps: [...lps] },
          5
        )
      );

      while (i < m) {
        stepsArr.push(
          snapshot(
            txt,
            pat,
            i,
            j,
            "comparing",
            `Bandingkan teks[${i}]='${txt[i]}' dengan pola[${j}]='${pat[j]}'`,
            { i, j },
            { lps: [...lps] },
            7
          )
        );

        if (txt[i] === pat[j]) {
          i++;
          j++;
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i - 1,
              j - 1,
              "match",
              `✓ Cocok! i=${i}, j=${j}`,
              { i, j },
              { lps: [...lps] },
              8
            )
          );
        }

        if (j === n) {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i - n,
              n - 1,
              "found",
              `✓ COCOK DITEMUKAN di indeks ${i - n}!`,
              { matchIndex: i - n },
              { lps: [...lps], matches: [i - n] },
              {},
              11
            )
          );
          j = lps[j - 1];
        } else if (i < m && txt[i] !== pat[j]) {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i,
              j,
              "mismatch",
              `✗ Tidak cocok. ${
                j !== 0
                  ? `Gunakan LPS untuk lewati: j = LPS[${j - 1}] = ${
                      lps[j - 1]
                    }`
                  : "Geser i maju"
              }`,
              { i, j, lpsValue: j > 0 ? lps[j - 1] : "N/A" },
              { lps: [...lps] },
              13
            )
          );

          if (j !== 0) {
            j = lps[j - 1];
            stepsArr.push(
              snapshot(
                txt,
                pat,
                i,
                j,
                "lps_jump",
                `Lompat j ke ${j} menggunakan LPS`,
                { i, j },
                { lps: [...lps] },
                14
              )
            );
          } else {
            i++;
            stepsArr.push(
              snapshot(
                txt,
                pat,
                i,
                j,
                "shift",
                `Geser i ke ${i}`,
                { i, j },
                { lps: [...lps] },
                15
              )
            );
          }
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "complete",
          "Pencarian KMP selesai.",
          {},
          { lps: [...lps] },
          16
        )
      );
    } else if (algoType === "rabin") {
      const d = 256; // alphabet size
      const q = 101; // prime number for modulo
      let h = 1;

      // Calculate h = d^(n-1) % q
      for (let i = 0; i < n - 1; i++) {
        h = (h * d) % q;
      }

      // Calculate hash of pattern and first window
      let p = 0; // pattern hash
      let t = 0; // text window hash

      for (let i = 0; i < n; i++) {
        p = (d * p + pat.charCodeAt(i)) % q;
        t = (d * t + txt.charCodeAt(i)) % q;
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `Rabin-Karp: Hash pola=${p}, Hash window pertama=${t}. d=${d}, q=${q}`,
          { d, q, h, pHash: p, tHash: t },
          {},
          6
        )
      );

      for (let i = 0; i <= m - n; i++) {
        stepsArr.push(
          snapshot(
            txt,
            pat,
            i,
            0,
            "hash_compare",
            `Posisi ${i}: Hash pola=${p}, Hash window=${t}`,
            { i, pHash: p, tHash: t, window: txt.substring(i, i + n) },
            {},
            12
          )
        );

        if (p === t) {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i,
              0,
              "verifying",
              `Hash cocok! Verifikasi karakter...`,
              { i },
              {},
              13
            )
          );
          let match = true;
          for (let j = 0; j < n; j++) {
            stepsArr.push(
              snapshot(
                txt,
                pat,
                i + j,
                j,
                "verifying",
                `Verifikasi: teks[${i + j}]='${txt[i + j]}' vs pola[${j}]='${
                  pat[j]
                }'`,
                { i, j },
                {},
                13
              )
            );

            if (txt[i + j] !== pat[j]) {
              match = false;
              stepsArr.push(
                snapshot(
                  txt,
                  pat,
                  i + j,
                  j,
                  "spurious",
                  `✗ Spurious hit (tabrakan hash). Bukan kecocokan.`,
                  { i, j },
                  {},
                  13
                )
              );
              break;
            }
          }

          if (match) {
            stepsArr.push(
              snapshot(
                txt,
                pat,
                i,
                n - 1,
                "found",
                `✓ COCOK DITEMUKAN di indeks ${i}!`,
                { matchIndex: i },
                { matches: [i] },
                {},
                14
              )
            );
          }
        } else {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              i,
              0,
              "hash_diff",
              `Hash berbeda (${t} ≠ ${p}). Lewati verifikasi, geser window.`,
              { i, pHash: p, tHash: t },
              {},
              12
            )
          ); // Mismatch hash code line
        }

        // Rolling hash: remove leading char, add trailing char
        if (i < m - n) {
          const oldHash = t;
          t = (d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + n)) % q;
          if (t < 0) t += q;

          stepsArr.push(
            snapshot(
              txt,
              pat,
              i + 1,
              0,
              "rolling_hash",
              `Rolling hash: hapus '${txt[i]}', tambah '${
                txt[i + n]
              }'. Hash baru=${t}`,
              { i, oldHash, newHash: t, removed: txt[i], added: txt[i + n] },
              {},
              19
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "complete",
          "Pencarian Rabin-Karp selesai.",
          {},
          {},
          22
        )
      );
    } else if (algoType === "boyer") {
      // Build bad character table
      const badChar = {};
      for (let i = 0; i < 256; i++) {
        badChar[String.fromCharCode(i)] = -1;
      }
      for (let i = 0; i < n; i++) {
        badChar[pat[i]] = i;
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `Boyer-Moore: Bangun tabel Bad Character. Pindai pola dari kanan ke kiri.`,
          { n },
          { badChar: { ...badChar } },
          2
        )
      );

      let s = 0; // shift
      stepsArr.push(
        snapshot(
          txt,
          pat,
          s,
          -1,
          "start",
          `Inisialisasi s=0`,
          { s },
          { badChar: { ...badChar } },
          5
        )
      );

      while (s <= m - n) {
        stepsArr.push(
          snapshot(
            txt,
            pat,
            s,
            n - 1,
            "align",
            `Sejajarkan pola pada shift ${s}. Mulai bandingkan dari kanan (j=${
              n - 1
            })`,
            { s, window: txt.substring(s, s + n) },
            { badChar: { ...badChar } },
            7
          )
        );

        let j = n - 1;

        while (j >= 0) {
          const textChar = txt[s + j];
          const patChar = pat[j];

          stepsArr.push(
            snapshot(
              txt,
              pat,
              s + j,
              j,
              "comparing",
              `Bandingkan teks[${
                s + j
              }]='${textChar}' dengan pola[${j}]='${patChar}' (kanan ke kiri)`,
              { s, j, textChar, patChar },
              { badChar: { ...badChar } },
              10
            )
          );

          if (textChar !== patChar) {
            break;
          }
          j--;

          if (j >= 0) {
            stepsArr.push(
              snapshot(
                txt,
                pat,
                s + j + 1,
                j + 1,
                "match",
                `✓ Cocok! Geser kiri ke j=${j}`,
                { s, j },
                { badChar: { ...badChar } },
                11
              )
            );
          }
        }

        if (j < 0) {
          stepsArr.push(
            snapshot(
              txt,
              pat,
              s,
              0,
              "found",
              `✓ COCOK DITEMUKAN di indeks ${s}!`,
              { matchIndex: s },
              { badChar: { ...badChar }, matches: [s] },
              {},
              14
            )
          );

          const shift =
            s + n < m
              ? n -
                (badChar[txt[s + n]] !== undefined ? badChar[txt[s + n]] : -1)
              : 1;
          s += shift;
          stepsArr.push(
            snapshot(
              txt,
              pat,
              s,
              0,
              "shift",
              `Geser pola sebanyak ${shift}`,
              { s, shift },
              { badChar: { ...badChar } },
              15
            )
          );
        } else {
          const mismatchChar = txt[s + j];
          const lastOccur =
            badChar[mismatchChar] !== undefined ? badChar[mismatchChar] : -1;
          const shift = Math.max(1, j - lastOccur);

          stepsArr.push(
            snapshot(
              txt,
              pat,
              s + j,
              j,
              "mismatch",
              `✗ Tidak cocok '${mismatchChar}'. Kemunculan terakhir di pola: ${lastOccur}. Geser sebanyak ${shift}`,
              { s, j, mismatchChar, lastOccur, shift },
              { badChar: { ...badChar } },
              16
            )
          );

          s += shift;
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "complete",
          "Pencarian Boyer-Moore selesai.",
          {},
          { badChar: { ...badChar } },
          17
        )
      );
    } else if (algoType === "z") {
      const concat = pat + "$" + txt;
      const len = concat.length;
      const z = new Array(len).fill(0);

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "start",
          `Algoritma Z: Gabungkan pattern$text = "${concat}". Bangun Z-array.`,
          { concat },
          { z: [...z] },
          2
        )
      );

      let l = 0,
        r = 0;

      for (let i = 1; i < len; i++) {
        if (i > r) {
          l = r = i;
          while (r < len && concat[r - l] === concat[r]) {
            r++;
          }
          z[i] = r - l;
          r--;

          stepsArr.push(
            snapshot(
              txt,
              pat,
              -1,
              -1,
              "z_compute",
              `Z[${i}] = ${z[i]}. Substring mulai dari ${i} cocok dengan prefix untuk ${z[i]} karakter.`,
              { i, zValue: z[i], l, r },
              { z: [...z] },
              20
            )
          );
        } else {
          const k = i - l;
          if (z[k] < r - i + 1) {
            z[i] = z[k];
            stepsArr.push(
              snapshot(
                txt,
                pat,
                -1,
                -1,
                "z_copy",
                `Z[${i}] = Z[${k}] = ${z[i]}. Di dalam Z-box, salin nilai.`,
                { i, k, zValue: z[i] },
                { z: [...z] },
                24
              )
            );
          } else {
            l = i;
            while (r < len && concat[r - l] === concat[r]) {
              r++;
            }
            z[i] = r - l;
            r--;
            stepsArr.push(
              snapshot(
                txt,
                pat,
                -1,
                -1,
                "z_extend",
                `Z[${i}] = ${z[i]}. Perluas Z-box.`,
                { i, zValue: z[i], l, r },
                { z: [...z] },
                28
              )
            );
          }
        }

        // Check for match (simple check not explicitly in code block, using z-algo end as proxy or adding manual check)
        if (z[i] === n && i > n) {
          const matchIndex = i - n - 1;
          stepsArr.push(
            snapshot(
              txt,
              pat,
              matchIndex,
              0,
              "found",
              `✓ COCOK DITEMUKAN! Z[${i}] = ${n} (panjang pola) → cocok di indeks teks ${matchIndex}`,
              { i, matchIndex },
              { z: [...z], matches: [matchIndex] },
              {},
              6
            )
          );
        }
      }

      stepsArr.push(
        snapshot(
          txt,
          pat,
          -1,
          -1,
          "complete",
          `Algoritma Z selesai. Z-array: [${z
            .slice(0, Math.min(20, z.length))
            .join(", ")}${z.length > 20 ? "..." : ""}]`,
          {},
          { z: [...z] },
          30
        )
      ); // approx line end
    }

    return stepsArr;
  };

  // ==========================================
  // 4. EFFECTS & HANDLERS
  // ==========================================

  useEffect(() => {
    resetAndGenerate();
  }, [algorithm, text, pattern]);

  const resetAndGenerate = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setElapsedTime(0);
    const generatedSteps = generateSteps(algorithm);
    setSteps(generatedSteps);
  };

  // Timer logic
  useEffect(() => {
    if (isPlaying) {
      const baseTime = Date.now() - elapsedTime;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - baseTime;
        setElapsedTime(newElapsed);

        // Sync step
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

  // ==========================================
  // 5. RENDER HELPER COMPONENTS
  // ==========================================

  const getStatusColor = () => {
    const status = currentVisual.status;
    if (status === "comparing") return "text-yellow-400";
    if (status === "match") return "text-emerald-400";
    if (status === "mismatch" || status === "spurious") return "text-red-400";
    if (status === "found") return "text-cyan-300";
    if (status === "complete") return "text-slate-400";
    return "text-slate-400";
  };

  const getStatusText = () => {
    return (currentVisual.status || "READY").toUpperCase().replace("_", " ");
  };

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
   * Execution Log Component (Stack)
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

  const VisualizationCanvas = () => {
    const txt = currentVisual.text;
    const pat = currentVisual.pattern;
    const textPos = currentVisual.textPosition;
    const patPos = currentVisual.patternPosition;

    if (!txt || !pat)
      return <div className="text-slate-500 italic">Loading...</div>;

    // Calculate alignment offset for pattern
    const alignOffset = textPos - patPos >= 0 ? textPos - patPos : 0;

    return (
      <div className="flex flex-col gap-4 items-center overflow-auto p-4">
        {/* Text display */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1 font-mono w-full text-left">
            Text:
          </div>
          <div className="flex gap-0.5">
            {txt.split("").map((char, idx) => {
              let bgClass = "bg-slate-800";
              let borderClass = "border-slate-600";
              let textClass = "text-slate-300";

              if (idx === textPos) {
                if (currentVisual.status === "comparing") {
                  bgClass = "bg-yellow-400";
                  borderClass = "border-yellow-300";
                  textClass = "text-black font-bold";
                } else if (currentVisual.status === "match") {
                  bgClass = "bg-emerald-500";
                  borderClass = "border-emerald-300";
                  textClass = "text-white font-bold";
                } else if (currentVisual.status === "mismatch") {
                  bgClass = "bg-red-500";
                  borderClass = "border-red-300";
                  textClass = "text-white font-bold";
                } else if (currentVisual.status === "found") {
                  bgClass = "bg-cyan-500";
                  borderClass = "border-cyan-300";
                  textClass = "text-white font-bold";
                }
              } else if (
                currentVisual.status === "found" &&
                currentVisual.matches
              ) {
                // Highlight entire match
                for (let match of currentVisual.matches) {
                  if (idx >= match && idx < match + pat.length) {
                    bgClass = "bg-cyan-600";
                    borderClass = "border-cyan-400";
                    textClass = "text-white font-bold";
                  }
                }
              }

              return (
                <div
                  key={idx}
                  className={`w-8 h-10 flex flex-col items-center justify-center border-2 transition-all ${bgClass} ${borderClass} ${textClass} text-sm`}
                >
                  <div>{char}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5">{idx}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pattern display with alignment */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1 font-mono w-full text-left">
            Pattern:
          </div>
          <div className="flex gap-0.5">
            {/* Empty spacers for alignment */}
            {Array(alignOffset)
              .fill(0)
              .map((_, idx) => (
                <div key={`spacer-${idx}`} className="w-8 h-10"></div>
              ))}
            {/* Pattern characters */}
            {pat.split("").map((char, idx) => {
              let bgClass = "bg-slate-700";
              let borderClass = "border-slate-500";
              let textClass = "text-cyan-200";

              if (idx === patPos) {
                if (currentVisual.status === "comparing") {
                  bgClass = "bg-yellow-400";
                  borderClass = "border-yellow-300";
                  textClass = "text-black font-bold";
                } else if (currentVisual.status === "match") {
                  bgClass = "bg-emerald-500";
                  borderClass = "border-emerald-300";
                  textClass = "text-white font-bold";
                } else if (currentVisual.status === "mismatch") {
                  bgClass = "bg-red-500";
                  borderClass = "border-red-300";
                  textClass = "text-white font-bold";
                }
              }

              return (
                <div
                  key={idx}
                  className={`w-8 h-10 flex flex-col items-center justify-center border-2 transition-all ${bgClass} ${borderClass} ${textClass} text-sm font-mono`}
                >
                  <div>{char}</div>
                  <div className="text-[8px] text-slate-500 mt-0.5">{idx}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HELPERS: LPS / Z-Array */}
        <div className="w-full flex justify-center">
          {algorithm === "kmp" && currentVisual.lps && (
            <div className="mt-2">
              <div className="text-xs text-orange-400 mb-1 font-mono text-center">
                LPS Array:
              </div>
              <div className="flex gap-0.5">
                {currentVisual.lps.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center bg-cyan-900/40 border border-cyan-600 text-cyan-200 text-xs font-mono"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}
          {algorithm === "z" &&
            currentVisual.z &&
            currentVisual.z.length <= 30 && (
              <div className="mt-2 max-w-full overflow-x-auto">
                <div className="text-xs text-orange-400 mb-1 font-mono text-center">
                  Z-Array (first 30):
                </div>
                <div className="flex gap-0.5">
                  {currentVisual.z.slice(0, 30).map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-8 h-8 flex items-center justify-center border text-xs font-mono ${
                        val === pat.length
                          ? "bg-cyan-500 border-cyan-300 text-white font-bold"
                          : "bg-cyan-900/40 border-cyan-600 text-cyan-200"
                      }`}
                    >
                      {val}
                    </div>
                  ))}
                </div>
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
                <Type size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-300 pb-2 mb-1">
                  Algo String
                </h1>
                <p className="text-xs text-slate-400">
                  Pencarian Pola & Analisis Teks
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 items-center bg-slate-800 p-2 rounded-xl border border-slate-700 justify-center">
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="bg-slate-900 border border-slate-600 text-sm rounded-lg p-2 focus:ring-orange-500 outline-none"
              >
                <option value="naive">Naive</option>
                <option value="kmp">KMP</option>
                <option value="rabin">Rabin-Karp</option>
                <option value="boyer">Boyer-Moore</option>
                <option value="z">Algoritma Z</option>
              </select>

              {/* TEXT INPUTS */}
              <div className="flex flex-col gap-1 min-w-[150px]">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Text</span>
                </div>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="bg-slate-900 border border-slate-600 text-xs rounded p-1 text-slate-300 focus:border-orange-500 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-[100px]">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>Pattern</span>
                </div>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="bg-slate-900 border border-slate-600 text-xs rounded p-1 text-slate-300 focus:border-orange-500 outline-none"
                />
              </div>

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
          <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 border border-orange-700/50 rounded-xl p-4 shadow-lg">
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
                  Visualisasi Pencarian
                </div>
                <div className={`text-xs font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="relative w-full p-6 bg-[#0f1117] flex items-center justify-center h-full min-h-[400px] overflow-auto">
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

export default StringMatching;
