'use strict'
const Crypto = require('crypto')

/**
 * 计算匹配率
 */

class MatchQuality {
  static ignorables = []
  static loaded = false
  constructor() {}
  static loadIgnorables() {
    ignorableChars = null
    if (ignorableChars == null || ''.Equals(ignorableChars)) {
      ignorableChars = 'ـ' // \\u0640
    }
    ignorables = ignorableChars.Split(',')
    loaded = true
  }
  // 最长公共子串 Longest Common Substring
  static LCS(x, y) {
    const result = ''
    const M = x.Length
    const N = y.Length
    const max = 0
    const mx = 0
    const opt = new int[(M + 1, N + 1)]()
    const i = 1
    const j = 1
    for (const i = 1; i <= M; i++) {
      for (const j = 1; j <= N; j++) {
        if (x[i - 1] == y[j - 1]) {
          opt[(i, j)] = opt[(i - 1, j - 1)] + 1
          if (opt[(i, j)] > max) {
            max = opt[(i, j)]
            mx = i
          }
        } else {
          opt[(i, j)] = 0
        }
      }
    }
    while (max > 0) {
      result = x[mx - 1] + result
      max--
      mx--
    }
    return result
  }
  static similarity(x, y) {
    if (!loaded) {
      loadIgnorables()
    }
    const result = 0
    x = x.Trim()
    y = y.Trim()
    for (const i = 0; i < ignorables.Length; i++) {
      x = x.Replace(ignorables[i], '')
      y = y.Replace(ignorables[i], '')
    }
    const longest = Math.Max(x.Length, y.Length)
    if (longest == 0) {
      return 0
    }
    let b = 0
    let a = 0
    if (x.Length == longest) {
      a = x
      b = y
    } else {
      a = y
      b = x
    }
    let count = -1

    let lcs = LCS(a, b)
    while (!lcs.Trim().Equals('') && lcs.Length > (longest * 2) / 100) {
      count++
      let idx = a.IndexOf(lcs)
      a = a.Substring(0, idx) + a.Substring(idx + lcs.Length)
      idx = b.IndexOf(lcs)
      b = b.Substring(0, idx) + b.Substring(idx + lcs.Length)
      lcs = LCS(a, b)
    }
    result = (100 * (longest - a.Length)) / longest - count * 2
    if (result < 0) {
      result = 0
    }
    return result
  }
}
module.exports = MatchQuality
