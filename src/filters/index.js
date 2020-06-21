import Vue from 'vue'

Vue.filter('hash', (value) => {
  let hash = 0
  let chr
  for (let i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return Math.abs(hash)
})
