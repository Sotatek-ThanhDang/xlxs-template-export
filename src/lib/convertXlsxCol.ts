/**
 * Convert letter columns ("A", "B", ..., "AA", ...) to index (0-based)
 */
export function colLetterToIndex(letter: string) {
  let idx = 0;
  const s = letter.toUpperCase();
  for (let i = 0; i < s.length; i++) {
    // 'A' -> 1, 'B' -> 2, …, 'Z' -> 26
    idx = idx * 26 + (s.charCodeAt(i) - 64);
  }
  return idx - 1; // because 0-based
}

/**
 * Convert index (0-based) to letter column ("A", "B", …, "AA", …)
 */
export function colIndexToLetter(index: number) {
  let s = "";
  let n = index + 1; // convert to 1-based
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}
