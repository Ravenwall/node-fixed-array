module.exports = FixedValueHistory

// A fixed-length storage mechanism for a value (ideally a number)
// with some statistics methods. Expires oldest values to
// Input is not type checked, but non-numeric input will be considered NULL
// WRT the statistical methods.
function FixedValueHistory(maxLength, initial) {
  if (!(this instanceof FixedValueHistory))
    return new FixedValueHistory(maxLength, initial)
  if (!isNumber(maxLength) || maxLength == 0) {
    throw new Error("maxLength must be a positive number.")
  }
  this.maxLength = Math.floor(+maxLength)
  if (initial != null) {
    this.push(initial)
  }
}
FixedValueHistory.prototype.sum = 0
FixedValueHistory.prototype.maxLength = undefined
FixedValueHistory.prototype.array = []

FixedValueHistory.prototype.push = function (vals) {
  this.array = this.array.concat(vals)
  var expired = this.array.splice(0, this.array.length - this.maxLength)
  var expired_sum = FixedValueHistory.sum(expired)
  this.sum -= expired_sum
  var new_sum = FixedValueHistory.sum(vals)
  this.sum += new_sum
}
FixedValueHistory.prototype.mean = function () {
  if (this.array.length === 0) return NaN
  return this.sum / this.array.length
}
FixedValueHistory.prototype.variance = function () {
  if (this.array.length === 0) return NaN
  var mean = this.mean()
  return this.array.reduce(function(prevVal,currVal) {
      var diff
      if(isNumber(currVal)) {
          diff = currVal - mean
      } else {
          diff = mean
      }
      return prevVal + diff*diff
  }, 0) / this.array.length
}
FixedValueHistory.prototype.max = function () {
  if (this.array.length === 0) return NaN
  return Math.max.apply(null, this.array)
}
FixedValueHistory.prototype.min = function () {
  if (this.array.length === 0) return NaN
  return Math.min.apply(null, this.array)
}
FixedValueHistory.prototype.length = function () {
  return this.array.length
}
FixedValueHistory.prototype.values = function () {
  return this.array.slice(0)
}

// Static methods.
FixedValueHistory.sum = function (vals) {
  var sum = 0
  ;[].concat(vals).forEach(function (n) {
    if (isNumber(n)) {
      sum += n
    }
  })
  return sum
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
