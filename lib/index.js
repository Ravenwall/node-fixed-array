(function () {
  // A fixed-length storage mechanism for a value (ideally a number)
  // with some statistics methods. Expires oldest values to
  // Input is not type checked, but non-numeric input will be considered NULL
  // WRT the statistical methods.
  function FixedValueHistory(max_length, initial) {
    this.sum = 0;
    this.max_length = max_length;
    this.array = [];
    this.push(initial || []);
  }
  FixedValueHistory.prototype.push = function (vals) {
    this.array = this.array.concat(vals);
    var expired = this.array.splice(0, this.array.length - this.max_length);
    var expired_sum = FixedValueHistory.sum(expired);
    this.sum -= expired_sum;
    var new_sum = FixedValueHistory.sum(vals);
    this.sum += new_sum;
  }
  FixedValueHistory.prototype.mean = function () {
    if (this.array.length === 0) return NaN;
    return this.sum / this.array.length;
  }
  FixedValueHistory.prototype.max = function () {
    if (this.array.length === 0) return NaN;
    return Math.max.apply(null, this.array);
  }
  FixedValueHistory.prototype.min = function () {
    if (this.array.length === 0) return NaN;
    return Math.min.apply(null, this.array);
  }
  FixedValueHistory.prototype.length = function () {
    return this.array.length;
  }
  FixedValueHistory.prototype.values = function () {
    return this.array.slice(0);
  }

  // Static methods.
  FixedValueHistory.sum = function (vals) {
    var sum = 0;
    [].concat(vals).forEach(function (n) {
      if (FixedValueHistory.isNumber(n)) {
        sum += n;
      }
    });
    return sum;
  }
  FixedValueHistory.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function newFixedValueHistory(max_length, initial) {
    return new FixedValueHistory(max_length, initial);
  }

  if (typeof module !== "undefined" && typeof require !== "undefined") {
    exports.FixedValueHistory = FixedValueHistory;
    exports.newFixedValueHistory = newFixedValueHistory;
  }
  else {
    window["FixedValueHistory"] = FixedValueHistory;
    window["newFixedValueHistory"] = newFixedValueHistory;
  }
})();
