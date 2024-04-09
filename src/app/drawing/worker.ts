function longCalculation() {
    let result = 0
    for (let i = 0; i < 1000000000; i++) {
      result += Math.sqrt(i)
    }
    return result
  }
  
  self.onmessage = function(event) {
    if (event.data === 'start') {
      const result = longCalculation()
      self.postMessage(result)
    }
  }