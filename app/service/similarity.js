'use strict'

const sim = require('string-similarity-algorithm')

const Service = require('egg').Service

function preprocessing(x) {
  // todo
  return x.trim()
}

class SimilarityService extends Service {
  /**
   *
   * @param {String} string1
   * @param {String} string2
   * @param {String} type = 'lcs' | 'levenshtein' | 'simhash'
   */
  async calc(x, y, type = 'simhash') {
    x = preprocessing(x)
    y = preprocessing(y)
    if (x.length === 0 || y.length === 0) {
      return 0
    }

    let result = 0
    let p = sim.default(x, y, type)

    if (type === 'simhash') {
      result = p.score
    } else {
      result = p
    }

    result = (result * 100).toFixed(2)

    if (result < 0) {
      result = 0
    }
    return result
  }
}

module.exports = SimilarityService
