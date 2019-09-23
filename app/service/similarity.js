'use strict'

const Service = require('egg').Service

// 最长公共子串 Longest Common Substring
function LCS(x, y) {
  let result = ''
  const M = x.length
  const N = y.length
  let max = 0
  let mx = 0
  let opt = Array(M + 1)
    .fill(0)
    .map(x => Array(N + 1).fill(0))
  //   console.log(opt, 'opt')

  let i = 1
  let j = 1
  for (i = 1; i <= M; i++) {
    for (j = 1; j <= N; j++) {
      if (x[i - 1] == y[j - 1]) {
        opt[i][j] = opt[i - 1][j - 1] + 1
        if (opt[i][j] > max) {
          max = opt[i][j]
          mx = i
        }
      } else {
        opt[i][j] = 0
      }
    }
  }
  //   console.log(opt, 'opt0')
  while (max > 0) {
    result = x[mx - 1] + result
    max--
    mx--
  }
  //   console.log(opt, result, 'opt0')
  return result
}

function loadIgnorables() {
  let ignorableChars = null
  if (ignorableChars === null || ignorableChars === '') {
    ignorableChars = 'ـ' // \\u0640
  }
  const ignorables = ignorableChars.split(',')
  return ignorables
}

class SimilarityService extends Service {
  async similarity(x, y) {
    if (x.length === 0 || y.length === 0) {
      return 0
    }
    let ignorables = loadIgnorables()

    let result = 0
    x = x.trim()
    y = y.trim()
    let regx = /(\-|\+)?\d+(\.\d+)|\s+|([~!@#$%^&*()/\|,.<>?"'();:_+-=\[\]{}，。？‘’“”！·￥……——·])/g
    x = x.replace(regx, '')
    y = y.replace(regx, '')
    // console.log(x, y, 'replace')

    for (let i = 0; i < ignorables.length; i++) {
      x = x.replace(ignorables[i], '')
      y = y.replace(ignorables[i], '')
    }
    const longest = Math.max(x.length, y.length)
    // console.log(longest, 'longest')
    if (longest == 0) {
      return 0
    }
    let b = ''
    let a = ''
    if (x.length == longest) {
      a = x
      b = y
    } else {
      a = y
      b = x
    }
    let count = -1

    let lcs = LCS(a, b)
    // console.log(lcs, 'lcs')

    while (!(lcs.trim() === '') && lcs.length > (longest * 2) / 100) {
      count++
      let idx = a.indexOf(lcs)
      a = a.substring(0, idx) + a.substring(idx + lcs.length)
      idx = b.indexOf(lcs)
      b = b.substring(0, idx) + b.substring(idx + lcs.length)
      lcs = LCS(a, b)
    }
    console.log(longest, a.length, count)

    result = (100 * (longest - a.length)) / longest - count * 2
    if (result < 0) {
      result = 0
    }
    return result
  }  
}

module.exports = SimilarityService
